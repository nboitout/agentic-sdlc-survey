import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import sql from 'mssql';

type PrimitiveAnswer = string | number | boolean;
type AnswerValue = PrimitiveAnswer | PrimitiveAnswer[] | null;

interface SurveyPayload {
  clientSubmissionId: string;
  surveyVersion: string;
  clientSubmittedAt?: string;
  language: string;
  role: string;
  branch: string;
  contractModel?: string;
  coreAnswers: Record<string, AnswerValue>;
  branchAnswers?: Record<string, AnswerValue>;
  comment?: string;
  sourceApp?: string;
  sourceEnv?: string;
}

interface QuestionRow {
  question_id: string;
  question_scope: string;
  question_type: string;
  is_required: boolean;
}

interface OptionRow {
  question_id: string;
  option_key: string;
  option_label_en: string | null;
  option_label_fr: string | null;
  option_label_ro: string | null;
  option_label_pt: string | null;
}

interface FlatAnswer {
  questionId: string;
  value: AnswerValue;
}

interface InsertableAnswerFact {
  submissionId: number;
  surveyVersion: string;
  questionId: string;
  questionScope: string;
  questionType: string;
  answerRowNum: number;
  optionKey: string | null;
  answerText: string | null;
  answerNumeric: number | null;
  answerBoolean: boolean | null;
  answerLabelSnapshot: string | null;
}

class PayloadValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PayloadValidationError';
  }
}

class SurveyVersionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SurveyVersionError';
  }
}

const getEnv = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};

const ok = (body: unknown): HttpResponseInit => ({
  status: 200,
  jsonBody: body,
});

const badRequest = (code: string, message: string, extra?: Record<string, unknown>): HttpResponseInit => ({
  status: 400,
  jsonBody: { status: 'validation_error', code, message, ...extra },
});

const parseSurveyPayload = async (request: HttpRequest): Promise<SurveyPayload> => {
  try {
    return (await request.json()) as SurveyPayload;
  } catch (error) {
    throw new PayloadValidationError(`Invalid JSON body: ${(error as Error).message}`);
  }
};

const validateTopLevel = (payload: SurveyPayload): void => {
  const missing: string[] = [];
  if (!payload.clientSubmissionId) missing.push('clientSubmissionId');
  if (!payload.surveyVersion) missing.push('surveyVersion');
  if (!payload.language) missing.push('language');
  if (!payload.role) missing.push('role');
  if (!payload.branch) missing.push('branch');
  if (!payload.coreAnswers || typeof payload.coreAnswers !== 'object') missing.push('coreAnswers');

  if (missing.length > 0) {
    throw new PayloadValidationError(`Missing required field(s): ${missing.join(', ')}`);
  }
};

const enforceSurveyVersion = (payload: SurveyPayload, allowedSurveyVersion: string): void => {
  if (payload.surveyVersion !== allowedSurveyVersion) {
    throw new SurveyVersionError(
      `Unsupported surveyVersion '${payload.surveyVersion}'. Expected '${allowedSurveyVersion}'.`
    );
  }
};

const flattenAnswers = (payload: SurveyPayload): FlatAnswer[] => {
  const flat: FlatAnswer[] = [];
  for (const [questionId, value] of Object.entries(payload.coreAnswers ?? {})) {
    flat.push({ questionId, value });
  }
  for (const [questionId, value] of Object.entries(payload.branchAnswers ?? {})) {
    flat.push({ questionId, value });
  }
  return flat;
};

const loadCatalogs = async (
  tx: sql.Transaction,
  surveyVersion: string
): Promise<{
  questionsById: Map<string, QuestionRow>;
  optionsByQuestionId: Map<string, Map<string, OptionRow>>;
}> => {
  const qResult = await tx
    .request()
    .input('surveyVersion', sql.VarChar(20), surveyVersion)
    .query<QuestionRow>(`
      SELECT survey_version, question_id, question_scope, question_type, is_required
      FROM dbo.dim_question
      WHERE survey_version = @surveyVersion
    `);

  const oResult = await tx
    .request()
    .input('surveyVersion', sql.VarChar(20), surveyVersion)
    .query<OptionRow>(`
      SELECT survey_version, question_id, option_key, display_order,
             option_label_en, option_label_fr, option_label_ro, option_label_pt
      FROM dbo.dim_option
      WHERE survey_version = @surveyVersion
    `);

  const questionsById = new Map<string, QuestionRow>(qResult.recordset.map((q) => [q.question_id, q]));
  const optionsByQuestionId = new Map<string, Map<string, OptionRow>>();

  for (const option of oResult.recordset) {
    if (!optionsByQuestionId.has(option.question_id)) {
      optionsByQuestionId.set(option.question_id, new Map<string, OptionRow>());
    }
    optionsByQuestionId.get(option.question_id)!.set(option.option_key, option);
  }

  return { questionsById, optionsByQuestionId };
};

const getOptionLabelForLanguage = (option: OptionRow, language: string): string | null => {
  const code = language.toLowerCase();
  if (code === 'fr') return option.option_label_fr ?? option.option_label_en;
  if (code === 'ro') return option.option_label_ro ?? option.option_label_en;
  if (code === 'pt') return option.option_label_pt ?? option.option_label_en;
  return option.option_label_en;
};

const validateAnswersAgainstCatalog = (
  answers: FlatAnswer[],
  questionsById: Map<string, QuestionRow>,
  optionsByQuestionId: Map<string, Map<string, OptionRow>>
): void => {
  const errors: string[] = [];

  for (const answer of answers) {
    const question = questionsById.get(answer.questionId);
    if (!question) {
      errors.push(`Unknown question_id: ${answer.questionId}`);
      continue;
    }

    const optionMap = optionsByQuestionId.get(answer.questionId);
    if (!optionMap || optionMap.size === 0 || answer.value === null || answer.value === undefined || answer.value === '') {
      continue;
    }

    if (Array.isArray(answer.value)) {
      for (const item of answer.value) {
        if (!optionMap.has(String(item))) {
          errors.push(`Invalid option_key '${item}' for question_id '${answer.questionId}'`);
        }
      }
      continue;
    }

    if (!optionMap.has(String(answer.value))) {
      errors.push(`Invalid option_key '${answer.value}' for question_id '${answer.questionId}'`);
    }
  }

  if (errors.length > 0) {
    throw new PayloadValidationError(errors.join('; '));
  }
};

const checkDuplicateSubmission = async (tx: sql.Transaction, clientSubmissionId: string): Promise<boolean> => {
  const result = await tx
    .request()
    .input('clientSubmissionId', sql.VarChar(100), clientSubmissionId)
    .query<{ exists_flag: number }>(`
      SELECT TOP 1 1 AS exists_flag
      FROM dbo.survey_submission
      WHERE client_submission_id = @clientSubmissionId
    `);

  return result.recordset.length > 0;
};

const insertSubmission = async (tx: sql.Transaction, payload: SurveyPayload): Promise<number> => {
  const clientSubmittedAtUtc = payload.clientSubmittedAt ? new Date(payload.clientSubmittedAt) : new Date();

  const result = await tx
    .request()
    .input('clientSubmissionId', sql.VarChar(100), payload.clientSubmissionId)
    .input('surveyVersion', sql.VarChar(20), payload.surveyVersion)
    .input('clientSubmittedAtUtc', sql.DateTime2, clientSubmittedAtUtc)
    .input('languageCode', sql.VarChar(10), payload.language)
    .input('roleCode', sql.VarChar(100), payload.role)
    .input('branchCode', sql.VarChar(100), payload.branch)
    .input('contractModelCode', sql.VarChar(100), payload.contractModel || null)
    .input('commentText', sql.NVarChar(sql.MAX), payload.comment || null)
    .input('sourceApp', sql.VarChar(100), payload.sourceApp || null)
    .input('sourceEnv', sql.VarChar(30), payload.sourceEnv || null)
    .query<{ submission_id: number }>(`
      INSERT INTO dbo.survey_submission
      (
        client_submission_id,
        survey_version,
        client_submitted_at_utc,
        received_at_utc,
        language_code,
        role_code,
        branch_code,
        contract_model_code,
        comment_text,
        source_app,
        source_env
      )
      OUTPUT INSERTED.submission_id
      VALUES
      (
        @clientSubmissionId,
        @surveyVersion,
        @clientSubmittedAtUtc,
        SYSUTCDATETIME(),
        @languageCode,
        @roleCode,
        @branchCode,
        @contractModelCode,
        @commentText,
        @sourceApp,
        @sourceEnv
      )
    `);

  return result.recordset[0].submission_id;
};

const insertRawPayload = async (tx: sql.Transaction, submissionId: number, payload: SurveyPayload): Promise<void> => {
  await tx
    .request()
    .input('submissionId', sql.Int, submissionId)
    .input('clientSubmissionId', sql.VarChar(100), payload.clientSubmissionId)
    .input('surveyVersion', sql.VarChar(20), payload.surveyVersion)
    .input('payloadJson', sql.NVarChar(sql.MAX), JSON.stringify(payload))
    .query(`
      INSERT INTO dbo.survey_submission_raw
      (
        submission_id,
        client_submission_id,
        survey_version,
        payload_json
      )
      VALUES
      (
        @submissionId,
        @clientSubmissionId,
        @surveyVersion,
        @payloadJson
      )
    `);
};

const buildAnswerFacts = (
  submissionId: number,
  payload: SurveyPayload,
  answers: FlatAnswer[],
  questionsById: Map<string, QuestionRow>,
  optionsByQuestionId: Map<string, Map<string, OptionRow>>
): InsertableAnswerFact[] => {
  const facts: InsertableAnswerFact[] = [];

  for (const answer of answers) {
    const question = questionsById.get(answer.questionId);
    if (!question || answer.value === undefined || answer.value === null || answer.value === '') continue;

    const optionMap = optionsByQuestionId.get(answer.questionId);
    const values = Array.isArray(answer.value) ? answer.value : [answer.value];

    values.forEach((item, index) => {
      const option = optionMap?.get(String(item));
      const scalar = option ? null : item;

      const answerText = typeof scalar === 'string' ? scalar : scalar === null ? null : null;
      const answerNumeric = typeof scalar === 'number' ? scalar : null;
      const answerBoolean = typeof scalar === 'boolean' ? scalar : null;

      facts.push({
        submissionId,
        surveyVersion: payload.surveyVersion,
        questionId: answer.questionId,
        questionScope: question.question_scope,
        questionType: question.question_type,
        answerRowNum: index + 1,
        optionKey: option ? option.option_key : null,
        answerText,
        answerNumeric,
        answerBoolean,
        answerLabelSnapshot: option ? getOptionLabelForLanguage(option, payload.language) : null,
      });
    });
  }

  return facts;
};

const insertAnswerFacts = async (tx: sql.Transaction, facts: InsertableAnswerFact[]): Promise<number> => {
  for (const fact of facts) {
    await tx
      .request()
      .input('submissionId', sql.Int, fact.submissionId)
      .input('surveyVersion', sql.VarChar(20), fact.surveyVersion)
      .input('questionId', sql.VarChar(200), fact.questionId)
      .input('questionScope', sql.VarChar(50), fact.questionScope)
      .input('questionType', sql.VarChar(50), fact.questionType)
      .input('answerRowNum', sql.Int, fact.answerRowNum)
      .input('optionKey', sql.VarChar(200), fact.optionKey)
      .input('answerText', sql.NVarChar(sql.MAX), fact.answerText)
      .input('answerNumeric', sql.Float, fact.answerNumeric)
      .input('answerBoolean', sql.Bit, fact.answerBoolean)
      .input('answerLabelSnapshot', sql.NVarChar(1000), fact.answerLabelSnapshot)
      .query(`
        INSERT INTO dbo.survey_answer_fact
        (
          submission_id,
          survey_version,
          question_id,
          question_scope,
          question_type,
          answer_row_num,
          option_key,
          answer_text,
          answer_numeric,
          answer_boolean,
          answer_label_snapshot,
          score_value
        )
        VALUES
        (
          @submissionId,
          @surveyVersion,
          @questionId,
          @questionScope,
          @questionType,
          @answerRowNum,
          @optionKey,
          @answerText,
          @answerNumeric,
          @answerBoolean,
          @answerLabelSnapshot,
          NULL
        )
      `);
  }

  return facts.length;
};

export async function surveySubmit(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('surveySubmit invoked');

  if (request.method !== 'POST') {
    return {
      status: 405,
      jsonBody: { status: 'error', message: 'Method not allowed' },
    };
  }

  let pool: sql.ConnectionPool | undefined;
  let tx: sql.Transaction | undefined;

  try {
    const payload = await parseSurveyPayload(request);
    validateTopLevel(payload);
    enforceSurveyVersion(payload, getEnv('ALLOWED_SURVEY_VERSION'));

    pool = await sql.connect(getEnv('SQL_CONNECTION_STRING'));
    tx = new sql.Transaction(pool);
    await tx.begin();

    const { questionsById, optionsByQuestionId } = await loadCatalogs(tx, payload.surveyVersion);
    const answers = flattenAnswers(payload);

    if (payload.comment && payload.comment.trim() && questionsById.has('comment1')) {
      answers.push({ questionId: 'comment1', value: payload.comment.trim() });
    }

    validateAnswersAgainstCatalog(answers, questionsById, optionsByQuestionId);

    const isDuplicate = await checkDuplicateSubmission(tx, payload.clientSubmissionId);
    if (isDuplicate) {
      await tx.rollback();
      return ok({
        status: 'duplicate',
        clientSubmissionId: payload.clientSubmissionId,
      });
    }

    const submissionId = await insertSubmission(tx, payload);
    await insertRawPayload(tx, submissionId, payload);
    const facts = buildAnswerFacts(submissionId, payload, answers, questionsById, optionsByQuestionId);
    const answerCount = await insertAnswerFacts(tx, facts);

    await tx.commit();

    return ok({
      status: 'success',
      submissionId,
      clientSubmissionId: payload.clientSubmissionId,
      insertedAnswers: answerCount,
    });
  } catch (error) {
    if (tx) {
      try {
        await tx.rollback();
      } catch {
        // noop
      }
    }

    if (error instanceof PayloadValidationError) {
      return badRequest('invalid_payload', error.message);
    }

    if (error instanceof SurveyVersionError) {
      return badRequest('invalid_survey_version', error.message, { expected: process.env.ALLOWED_SURVEY_VERSION });
    }

    context.error('surveySubmit failed', error);
    return {
      status: 500,
      jsonBody: {
        status: 'internal_error',
        message: 'Failed to persist survey submission',
      },
    };
  } finally {
    if (pool) {
      try {
        await pool.close();
      } catch {
        // noop
      }
    }
  }
}

app.http('surveySubmit', {
  methods: ['POST'],
  route: 'survey/submit',
  authLevel: 'function',
  handler: surveySubmit,
});
