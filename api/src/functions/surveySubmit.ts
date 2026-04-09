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
  question_id: number;
  question_key: string;
}

interface OptionRow {
  option_id: number;
  option_key: string;
  question_id: number;
}

interface FlatAnswer {
  questionKey: string;
  value: AnswerValue;
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
    const body = (await request.json()) as SurveyPayload;
    return body;
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

  if (missing.length) {
    throw new PayloadValidationError(`Missing required field(s): ${missing.join(', ')}`);
  }
};

const enforceSurveyVersion = (payload: SurveyPayload, allowed: string): void => {
  if (payload.surveyVersion !== allowed) {
    throw new SurveyVersionError(`Unsupported surveyVersion '${payload.surveyVersion}'. Expected '${allowed}'.`);
  }
};

const flattenAnswers = (payload: SurveyPayload): FlatAnswer[] => {
  const flat: FlatAnswer[] = [];
  for (const [questionKey, value] of Object.entries(payload.coreAnswers || {})) {
    flat.push({ questionKey, value });
  }
  for (const [questionKey, value] of Object.entries(payload.branchAnswers || {})) {
    flat.push({ questionKey, value });
  }
  return flat;
};

const loadCatalogs = async (tx: sql.Transaction): Promise<{
  questionsByKey: Map<string, QuestionRow>;
  optionsByQuestion: Map<number, Map<string, OptionRow>>;
}> => {
  const qResult = await tx.request().query<QuestionRow>(`
    SELECT question_id, question_key
    FROM dbo.dim_question
    WHERE is_active = 1
  `);

  const oResult = await tx.request().query<OptionRow>(`
    SELECT option_id, option_key, question_id
    FROM dbo.dim_option
    WHERE is_active = 1
  `);

  const questionsByKey = new Map<string, QuestionRow>(
    qResult.recordset.map((q) => [q.question_key, q])
  );

  const optionsByQuestion = new Map<number, Map<string, OptionRow>>();
  for (const option of oResult.recordset) {
    if (!optionsByQuestion.has(option.question_id)) {
      optionsByQuestion.set(option.question_id, new Map<string, OptionRow>());
    }
    optionsByQuestion.get(option.question_id)!.set(option.option_key, option);
  }

  return { questionsByKey, optionsByQuestion };
};

const validateAnswersAgainstCatalog = (
  answers: FlatAnswer[],
  questionsByKey: Map<string, QuestionRow>,
  optionsByQuestion: Map<number, Map<string, OptionRow>>
): void => {
  const errors: string[] = [];

  for (const answer of answers) {
    const question = questionsByKey.get(answer.questionKey);
    if (!question) {
      errors.push(`Unknown question key: ${answer.questionKey}`);
      continue;
    }

    const optionMap = optionsByQuestion.get(question.question_id);
    if (!optionMap || optionMap.size === 0) {
      // Free-text style question; any primitive/string value accepted.
      continue;
    }

    const value = answer.value;
    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (!optionMap.has(String(item))) {
          errors.push(`Invalid option '${item}' for question '${answer.questionKey}'`);
        }
      }
      continue;
    }

    if (!optionMap.has(String(value))) {
      errors.push(`Invalid option '${value}' for question '${answer.questionKey}'`);
    }
  }

  if (errors.length) {
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
  const submittedAt = payload.clientSubmittedAt ? new Date(payload.clientSubmittedAt) : new Date();

  const result = await tx
    .request()
    .input('clientSubmissionId', sql.VarChar(100), payload.clientSubmissionId)
    .input('surveyVersion', sql.VarChar(20), payload.surveyVersion)
    .input('clientSubmittedAt', sql.DateTime2, submittedAt)
    .input('language', sql.VarChar(10), payload.language)
    .input('role', sql.VarChar(100), payload.role)
    .input('branch', sql.VarChar(100), payload.branch)
    .input('contractModel', sql.VarChar(100), payload.contractModel || null)
    .input('sourceApp', sql.VarChar(100), payload.sourceApp || null)
    .input('sourceEnv', sql.VarChar(30), payload.sourceEnv || null)
    .query<{ submission_id: number }>(`
      INSERT INTO dbo.survey_submission
      (
        client_submission_id,
        survey_version,
        client_submitted_at,
        language,
        role,
        branch,
        contract_model,
        source_app,
        source_env,
        created_at
      )
      OUTPUT INSERTED.submission_id
      VALUES
      (
        @clientSubmissionId,
        @surveyVersion,
        @clientSubmittedAt,
        @language,
        @role,
        @branch,
        @contractModel,
        @sourceApp,
        @sourceEnv,
        SYSUTCDATETIME()
      )
    `);

  return result.recordset[0].submission_id;
};

const insertRawPayload = async (tx: sql.Transaction, submissionId: number, payload: SurveyPayload): Promise<void> => {
  await tx
    .request()
    .input('submissionId', sql.Int, submissionId)
    .input('rawPayload', sql.NVarChar(sql.MAX), JSON.stringify(payload))
    .query(`
      INSERT INTO dbo.survey_submission_raw
      (
        submission_id,
        payload_json,
        created_at
      )
      VALUES
      (
        @submissionId,
        @rawPayload,
        SYSUTCDATETIME()
      )
    `);
};

const insertAnswerFacts = async (
  tx: sql.Transaction,
  submissionId: number,
  answers: FlatAnswer[],
  questionsByKey: Map<string, QuestionRow>,
  optionsByQuestion: Map<number, Map<string, OptionRow>>
): Promise<number> => {
  let inserted = 0;

  for (const answer of answers) {
    const question = questionsByKey.get(answer.questionKey);
    if (!question || answer.value === undefined || answer.value === null || answer.value === '') continue;

    const optionMap = optionsByQuestion.get(question.question_id);

    if (Array.isArray(answer.value)) {
      for (const item of answer.value) {
        const option = optionMap?.get(String(item));
        await tx
          .request()
          .input('submissionId', sql.Int, submissionId)
          .input('questionId', sql.Int, question.question_id)
          .input('optionId', sql.Int, option?.option_id ?? null)
          .input('answerText', sql.NVarChar(4000), option ? null : String(item))
          .query(`
            INSERT INTO dbo.survey_answer_fact
            (
              submission_id,
              question_id,
              option_id,
              answer_text,
              created_at
            )
            VALUES
            (
              @submissionId,
              @questionId,
              @optionId,
              @answerText,
              SYSUTCDATETIME()
            )
          `);
        inserted += 1;
      }
      continue;
    }

    const option = optionMap?.get(String(answer.value));
    await tx
      .request()
      .input('submissionId', sql.Int, submissionId)
      .input('questionId', sql.Int, question.question_id)
      .input('optionId', sql.Int, option?.option_id ?? null)
      .input('answerText', sql.NVarChar(4000), option ? null : String(answer.value))
      .query(`
        INSERT INTO dbo.survey_answer_fact
        (
          submission_id,
          question_id,
          option_id,
          answer_text,
          created_at
        )
        VALUES
        (
          @submissionId,
          @questionId,
          @optionId,
          @answerText,
          SYSUTCDATETIME()
        )
      `);
    inserted += 1;
  }

  return inserted;
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

    const { questionsByKey, optionsByQuestion } = await loadCatalogs(tx);
    const answers = flattenAnswers(payload);
    if (payload.comment && payload.comment.trim() && questionsByKey.has('comment1')) {
      answers.push({ questionKey: 'comment1', value: payload.comment.trim() });
    }
    validateAnswersAgainstCatalog(answers, questionsByKey, optionsByQuestion);

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
    const answerCount = await insertAnswerFacts(tx, submissionId, answers, questionsByKey, optionsByQuestion);

    await tx.commit();

    return ok({
      status: 'success',
      submissionId,
      clientSubmissionId: payload.clientSubmissionId,
      insertedAnswers: answerCount,
    });
  } catch (error) {
    if (tx) {
      try { await tx.rollback(); } catch { /* noop */ }
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
      try { await pool.close(); } catch { /* noop */ }
    }
  }
}

app.http('surveySubmit', {
  methods: ['POST'],
  route: 'survey/submit',
  authLevel: 'function',
  handler: surveySubmit,
});
