const { useEffect, useMemo, useState } = React;

const ENABLE_FINAL_COMMENT = false;
const STORAGE_KEY = 'agenticSdlcBranchingSurveyV1';

const surveyConfig = {
  metadata: {
    id: 'agentic_sdlc_diagnostic_v1',
    title: 'Agentic SDLC Diagnostic',
  },
  coreQuestions: [
    { id: 'q1_role', type: 'single_choice', label: 'What best describes your role?', options: [
      { value: 'developer', label: 'Developer' },
      { value: 'qa_testing_quality', label: 'QA / Testing / Quality' },
      { value: 'project_product_operations', label: 'Project / Product / Operations' },
    ]},
    { id: 'q2_ai_usage', type: 'single_choice', label: 'How do you currently use AI in your work?', options: [
      { value: 'no_use', label: 'I do not use AI' },
      { value: 'occasional', label: 'I use it occasionally' },
      { value: 'regular', label: 'I use it regularly' },
      { value: 'most_tasks', label: 'I use it in most of my tasks' },
    ]},
    { id: 'q3_ai_tools', type: 'multi_select', label: 'Which AI tools do you use today?', options: [
      { value: 'github_copilot', label: 'GitHub Copilot' },
      { value: 'chatgpt', label: 'ChatGPT' },
      { value: 'claude', label: 'Claude' },
      { value: 'cursor_codex', label: 'Cursor / Codex' },
      { value: 'other_ai_tools', label: 'Other AI tools' },
    ]},
    { id: 'q4_productivity', type: 'single_choice', label: 'How much does AI improve your productivity?', options: [
      { value: 'no_impact', label: 'No impact' },
      { value: 'slight', label: 'Slight improvement' },
      { value: 'moderate', label: 'Moderate improvement' },
      { value: 'significant', label: 'Significant improvement' },
    ]},
    { id: 'q5_quality', type: 'single_choice', label: 'How much does AI improve the quality of your work?', options: [
      { value: 'no_impact', label: 'No impact' },
      { value: 'slight', label: 'Slight improvement' },
      { value: 'moderate', label: 'Moderate improvement' },
      { value: 'significant', label: 'Significant improvement' },
    ]},
    { id: 'q6_team_usage', type: 'single_choice', label: 'How is AI used in your team today?', options: [
      { value: 'individual_only', label: 'Individual use only' },
      { value: 'informal_sharing', label: 'Informal sharing within the team' },
      { value: 'some_team_practices', label: 'Some team practices are defined' },
      { value: 'fully_integrated', label: 'Fully integrated into workflows' },
    ]},
    { id: 'q7_autonomy_level', type: 'single_choice', label: 'What is the highest level of AI autonomy you use today?', options: [
      { value: 'suggests_only', label: 'AI suggests only' },
      { value: 'generates_outputs', label: 'AI generates outputs' },
      { value: 'executes_with_supervision', label: 'AI executes tasks with supervision' },
      { value: 'runs_workflows', label: 'AI runs workflows end-to-end' },
    ]},
    { id: 'q8_async', type: 'single_choice', label: 'Can AI-driven tasks run without your continuous involvement?', options: [
      { value: 'no', label: 'No, I must always stay involved' },
      { value: 'limited_async', label: 'Limited, some asynchronous usage is possible' },
      { value: 'yes_independent', label: 'Yes, some tasks can run independently' },
    ]},
    { id: 'q9_measurement', type: 'single_choice', label: 'Do you measure the impact of AI usage?', options: [
      { value: 'no_measurement', label: 'No measurement' },
      { value: 'informal_tracking', label: 'Informal tracking' },
      { value: 'defined_metrics', label: 'Defined metrics are in place' },
    ]},
    { id: 'q10_sdlc_areas', type: 'multi_select', label: 'In which parts of the SDLC do you use AI today?', options: [
      { value: 'requirements_specs', label: 'Requirements / Specs' },
      { value: 'planning_project_management', label: 'Planning / Project Management' },
      { value: 'coding', label: 'Coding' },
      { value: 'code_review', label: 'Code Review' },
      { value: 'testing', label: 'Testing' },
      { value: 'debugging', label: 'Debugging' },
      { value: 'cicd', label: 'CI/CD' },
      { value: 'deployment', label: 'Deployment' },
      { value: 'production_operations', label: 'Production / Operations' },
      { value: 'documentation', label: 'Documentation' },
    ]},
  ],
  branches: {
    developer: {
      title: 'Developer Questions',
      questions: [
        { id: 'd1_coding_usage', type: 'single_choice', label: 'How do you use AI for coding?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'snippets_only', label: 'Snippets only' }, { value: 'functions_modules', label: 'Full functions or modules' }, { value: 'end_to_end_implementation', label: 'End-to-end implementation' },
        ]},
        { id: 'd2_unfamiliar_code', type: 'single_choice', label: 'How often does AI help you understand unfamiliar code?', options: [
          { value: 'never', label: 'Never' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'd3_refactoring', type: 'single_choice', label: 'How does AI support refactoring in your work?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'minor_edits', label: 'Minor edits' }, { value: 'significant_refactoring', label: 'Significant refactoring' }, { value: 'automated_refactoring_workflows', label: 'Automated refactoring workflows' },
        ]},
        { id: 'd4_code_review_frequency', type: 'single_choice', label: 'How often do you use AI in code review?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematic_pr_review', label: 'Systematic part of PR review' },
        ]},
        { id: 'd5_code_review_usage', type: 'multi_select', label: 'What do you use AI for in code review?', options: [
          { value: 'detect_bugs', label: 'Detect bugs' }, { value: 'suggest_improvements', label: 'Suggest improvements' }, { value: 'enforce_standards', label: 'Enforce standards' }, { value: 'summarize_prs', label: 'Summarize PRs' },
        ]},
        { id: 'd6_test_generation', type: 'single_choice', label: 'How often do you use AI to generate tests?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'd7_debugging', type: 'single_choice', label: 'How often does AI help you debug issues?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'first_reflex', label: 'It is my first reflex' },
        ]},
        { id: 'd8_cicd_failures', type: 'single_choice', label: 'How does AI help with CI/CD failures?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'suggests_fixes', label: 'It suggests fixes' }, { value: 'frequently_used', label: 'Frequently used for diagnosis/resolution' }, { value: 'automatically_resolves', label: 'Automatically resolves some issues' },
        ]},
        { id: 'd9_agent_usage', type: 'single_choice', label: 'How are agents used in your development workflow?', options: [
          { value: 'none', label: 'None' }, { value: 'experimental', label: 'Experimental only' }, { value: 'some_workflows', label: 'Used in some workflows' }, { value: 'core_workflow', label: 'Core part of the workflow' },
        ]},
        { id: 'd10_agent_actions', type: 'multi_select', label: 'What can agents do in your development workflow?', options: [
          { value: 'open_prs', label: 'Open PRs' }, { value: 'fix_bugs', label: 'Fix bugs' }, { value: 'refactor_code', label: 'Refactor code' }, { value: 'update_dependencies', label: 'Update dependencies' }, { value: 'maintain_documentation', label: 'Maintain documentation' },
        ]},
      ],
    },
    qa_testing_quality: {
      title: 'QA / Testing / Quality Questions',
      questions: [
        { id: 'qat1_generate_tests', type: 'single_choice', label: 'How often do you use AI to generate test cases?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'qat2_update_tests', type: 'single_choice', label: 'How often does AI help update or repair tests?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'automatically', label: 'Automatically' },
        ]},
        { id: 'qat3_coverage_gaps', type: 'single_choice', label: 'How often does AI help identify missing test coverage?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'qat4_regressions', type: 'single_choice', label: 'How often does AI help detect regressions?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'qat5_ci_failures', type: 'single_choice', label: 'How often does AI help diagnose test failures in CI?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'qat6_root_cause', type: 'single_choice', label: 'How often does AI help identify root causes of defects?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'qat7_release_readiness', type: 'single_choice', label: 'How often does AI support release readiness validation?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'qat8_test_data', type: 'single_choice', label: 'How often does AI help generate test data?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'qat9_orchestration', type: 'single_choice', label: 'How much does AI orchestrate testing workflows?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'limited', label: 'Limited orchestration' }, { value: 'frequent', label: 'Frequent orchestration' }, { value: 'fully_automated', label: 'Fully automated workflows' },
        ]},
        { id: 'qat10_agent_actions', type: 'multi_select', label: 'What can agents do in your QA / testing workflow?', options: [
          { value: 'generate_tests', label: 'Generate tests' }, { value: 'execute_tests', label: 'Execute tests' }, { value: 'diagnose_failures', label: 'Diagnose failures' }, { value: 'suggest_fixes', label: 'Suggest fixes' }, { value: 'validate_releases', label: 'Validate releases' },
        ]},
      ],
    },
    project_product_operations: {
      title: 'Project / Product / Operations Questions',
      questions: [
        { id: 'ppo1_requirements', type: 'single_choice', label: 'How often do you use AI to help with requirements or user stories?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'ppo2_planning', type: 'single_choice', label: 'How often does AI support planning or task breakdown?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'ppo3_team_summary', type: 'single_choice', label: 'How often does AI help summarize team activity?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'ppo4_reporting', type: 'single_choice', label: 'How often does AI help generate reports or status updates?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'ppo5_risks', type: 'single_choice', label: 'How often does AI help identify risks or delays?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'ppo6_prioritization', type: 'single_choice', label: 'How often does AI help prioritize work or backlog items?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'ppo7_documentation', type: 'single_choice', label: 'How often does AI help maintain project or technical documentation?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'ppo8_incidents', type: 'single_choice', label: 'How often does AI help analyze incidents or production issues?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'ppo9_logs_metrics', type: 'single_choice', label: 'How often does AI help interpret logs, metrics, or alerts?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ]},
        { id: 'ppo10_workflow_usage', type: 'multi_select', label: 'How is AI used in your project / product / operations workflow?', options: [
          { value: 'automate_reporting', label: 'Automate reporting' }, { value: 'suggest_actions', label: 'Suggest actions' }, { value: 'assist_incident_response', label: 'Assist incident response' }, { value: 'improve_workflows', label: 'Improve workflows' },
        ]},
      ],
    },
  },
};

function getBranchFromAnswers(answers) {
  return answers.q1_role || null;
}

function App() {
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [meta, setMeta] = useState({ surveyDate: new Date().toISOString().slice(0, 10), teamName: '', respondent: '' });
  const [finalComment, setFinalComment] = useState('');

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setAnswers(parsed.answers || {});
      setIndex(parsed.index || 0);
      setEndpoint(parsed.endpoint || '');
      setMeta(parsed.meta || { surveyDate: new Date().toISOString().slice(0, 10), teamName: '', respondent: '' });
      setFinalComment(parsed.finalComment || '');
    } catch (_e) {
      // ignore corrupted local state
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index, endpoint, meta, finalComment }));
  }, [answers, index, endpoint, meta, finalComment]);

  const branchKey = getBranchFromAnswers(answers);
  const branchDef = branchKey ? surveyConfig.branches[branchKey] : null;

  const flow = useMemo(() => {
    const core = surveyConfig.coreQuestions.map((q) => ({ ...q, section: 'Core Questions' }));
    if (!branchDef) return core;
    const branch = branchDef.questions.map((q) => ({ ...q, section: branchDef.title, branch: branchKey }));
    return [...core, ...branch];
  }, [branchDef, branchKey]);

  const currentQuestion = flow[index] || null;
  const isReviewStep = index >= flow.length;
  const answeredCount = flow.filter((q) => {
    const v = answers[q.id];
    return Array.isArray(v) ? v.length > 0 : Boolean(v);
  }).length;
  const progress = flow.length ? Math.round((Math.min(index, flow.length) / flow.length) * 100) : 0;

  const setSingle = (id, value) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      if (id === 'q1_role') {
        const selectedBranch = value;
        Object.keys(surveyConfig.branches).forEach((branch) => {
          if (branch !== selectedBranch) {
            surveyConfig.branches[branch].questions.forEach((q) => delete next[q.id]);
          }
        });
      }
      return next;
    });
  };

  const toggleMulti = (id, value) => {
    setAnswers((prev) => {
      const existing = Array.isArray(prev[id]) ? prev[id] : [];
      const has = existing.includes(value);
      return { ...prev, [id]: has ? existing.filter((x) => x !== value) : [...existing, value] };
    });
  };

  const isCurrentValid = () => {
    if (!currentQuestion) return true;
    const value = answers[currentQuestion.id];
    if (currentQuestion.type === 'multi_select') return Array.isArray(value) && value.length > 0;
    return Boolean(value);
  };

  const next = () => {
    setError('');
    if (!isCurrentValid()) {
      setError('Please answer this question to continue.');
      return;
    }
    setIndex((v) => Math.min(v + 1, flow.length));
  };

  const prev = () => {
    setError('');
    setIndex((v) => Math.max(v - 1, 0));
  };

  const buildPayload = () => {
    const coreAnswers = {};
    surveyConfig.coreQuestions.forEach((q) => {
      coreAnswers[q.id] = answers[q.id] ?? (q.type === 'multi_select' ? [] : null);
    });

    const branch = branchKey;
    const branchAnswers = {};
    if (branch && surveyConfig.branches[branch]) {
      surveyConfig.branches[branch].questions.forEach((q) => {
        branchAnswers[q.id] = answers[q.id] ?? (q.type === 'multi_select' ? [] : null);
      });
    }

    const payload = {
      role: answers.q1_role || null,
      coreAnswers,
      branch,
      branchAnswers,
      metadata: {
        surveyId: surveyConfig.metadata.id,
        surveyDate: meta.surveyDate,
        teamName: meta.teamName,
        respondent: meta.respondent,
      },
      submittedAt: new Date().toISOString(),
    };

    if (ENABLE_FINAL_COMMENT) payload.finalComment = finalComment;
    return payload;
  };

  const submit = async () => {
    if (!branchKey || flow.some((q) => {
      const v = answers[q.id];
      return q.type === 'multi_select' ? !(Array.isArray(v) && v.length) : !v;
    })) {
      setError('Please complete all required questions before submitting.');
      return;
    }

    const payload = buildPayload();
    setStatus('submitting');
    setError('');

    try {
      if (endpoint.trim()) {
        const response = await fetch(endpoint.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } else {
        console.info('No endpoint configured. Payload preview:', payload);
      }
      setStatus('success');
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      setStatus('idle');
      setError(`Submission failed: ${e.message}`);
    }
  };

  const resetSurvey = () => {
    setAnswers({});
    setIndex(0);
    setStatus('idle');
    setError('');
    setFinalComment('');
    setMeta({ surveyDate: new Date().toISOString().slice(0, 10), teamName: '', respondent: '' });
    localStorage.removeItem(STORAGE_KEY);
  };

  if (status === 'success') {
    return (
      <section className="panel success-panel">
        <h2>Submission complete</h2>
        <p>Thank you. Your Agentic SDLC diagnostic response has been recorded.</p>
        <button onClick={resetSurvey}>Start New Response</button>
      </section>
    );
  }

  return (
    <div className="survey-shell">
      <section className="panel metadata-panel">
        <h2>Survey Metadata</h2>
        <div className="grid">
          <label>Survey date
            <input type="date" value={meta.surveyDate} onChange={(e) => setMeta((m) => ({ ...m, surveyDate: e.target.value }))} />
          </label>
          <label>Team / Group name
            <input type="text" placeholder="Optional" value={meta.teamName} onChange={(e) => setMeta((m) => ({ ...m, teamName: e.target.value }))} />
          </label>
          <label>Respondent name
            <input type="text" placeholder="Optional" value={meta.respondent} onChange={(e) => setMeta((m) => ({ ...m, respondent: e.target.value }))} />
          </label>
          <label>Submission endpoint (optional)
            <input type="url" placeholder="https://script.google.com/macros/s/.../exec" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="panel progress-panel">
        <div className="progress-head">
          <strong>Progress</strong>
          <span>{Math.min(index + 1, flow.length)} / {flow.length} questions</span>
        </div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <small>Answered: {answeredCount}/{flow.length}</small>
      </section>

      <section className="panel question-panel">
        {!isReviewStep && currentQuestion && (
          <>
            <p className="section-title">{currentQuestion.section}</p>
            <h2>{currentQuestion.label}</h2>
            <p className="q-meta">{currentQuestion.type === 'single_choice' ? 'Single choice' : 'Multi-select'}</p>

            <div className="options">
              {currentQuestion.options.map((option) => {
                const checked = currentQuestion.type === 'single_choice'
                  ? answers[currentQuestion.id] === option.value
                  : Array.isArray(answers[currentQuestion.id]) && answers[currentQuestion.id].includes(option.value);
                return (
                  <label className={`option-card ${checked ? 'active' : ''}`} key={option.value}>
                    <input
                      type={currentQuestion.type === 'single_choice' ? 'radio' : 'checkbox'}
                      name={currentQuestion.id}
                      checked={checked}
                      onChange={() => currentQuestion.type === 'single_choice'
                        ? setSingle(currentQuestion.id, option.value)
                        : toggleMulti(currentQuestion.id, option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>
          </>
        )}

        {isReviewStep && (
          <>
            <p className="section-title">Review & Submit</p>
            <h2>Please review your diagnostic response</h2>
            <div className="review-grid">
              <div><strong>Selected role</strong><div>{answers.q1_role || '-'}</div></div>
              <div><strong>Selected branch</strong><div>{branchKey || '-'}</div></div>
              <div><strong>Core answers</strong><div>{surveyConfig.coreQuestions.length}</div></div>
              <div><strong>Branch answers</strong><div>{branchDef ? branchDef.questions.length : 0}</div></div>
            </div>
            {ENABLE_FINAL_COMMENT && (
              <label>Final optional comment
                <textarea value={finalComment} onChange={(e) => setFinalComment(e.target.value)} rows={4} />
              </label>
            )}
          </>
        )}

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="button" onClick={prev} disabled={index === 0}>Previous</button>
          {!isReviewStep ? (
            <button type="button" onClick={next}>Next</button>
          ) : (
            <button type="button" onClick={submit} disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
