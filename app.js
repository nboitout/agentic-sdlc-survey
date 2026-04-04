const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = 'agenticSdlcBranchingSurveyV2';

const standardProvisioningOptions = [
  { value: 'personally_chosen', label: 'Personally chosen / informal' },
  { value: 'team_standard', label: 'Team-standard tool' },
  { value: 'client_mandated', label: 'Client-mandated tool' },
  { value: 'enterprise_standard', label: 'Enterprise-standard tool' },
  { value: 'trial_experimental', label: 'Trial / experimental only' },
];

const surveyConfig = {
  survey: {
    id: 'agentic_sdlc_diagnostic_v2',
    title: 'Agentic SDLC Diagnostic',
    description: '11 core + 12 role-specific required questions, plus 1 optional final comment.',
  },
  coreQuestions: [
    { id: 'q1_role', type: 'single_choice', required: true, label: 'What best describes your role?', options: [
      { value: 'developer', label: 'Developer' },
      { value: 'qa_testing_quality', label: 'QA / Testing / Quality' },
      { value: 'project_product_operations', label: 'Project / Product / Operations' },
    ] },
    { id: 'q2_ai_usage', type: 'single_choice', required: true, label: 'How do you currently use AI in your work?', options: [
      { value: 'no_use', label: 'I do not use AI' },
      { value: 'occasional', label: 'I use it occasionally' },
      { value: 'regular', label: 'I use it regularly' },
      { value: 'most_tasks', label: 'I use it in most of my tasks' },
    ] },
    { id: 'q3_general_tools', type: 'multi_select', required: true, label: 'Which general AI tools do you use today?', options: [
      { value: 'chatgpt', label: 'ChatGPT' },
      { value: 'claude', label: 'Claude' },
      { value: 'microsoft_copilot', label: 'Microsoft Copilot' },
      { value: 'gemini', label: 'Gemini' },
      { value: 'perplexity', label: 'Perplexity' },
      { value: 'other_general_ai_tools', label: 'Other general AI tools' },
    ] },
    { id: 'q4_productivity', type: 'single_choice', required: true, label: 'How much does AI improve your productivity?', options: [
      { value: 'no_impact', label: 'No impact' },
      { value: 'slight', label: 'Slight improvement' },
      { value: 'moderate', label: 'Moderate improvement' },
      { value: 'significant', label: 'Significant improvement' },
    ] },
    { id: 'q5_quality', type: 'single_choice', required: true, label: 'How much does AI improve the quality of your work?', options: [
      { value: 'no_impact', label: 'No impact' },
      { value: 'slight', label: 'Slight improvement' },
      { value: 'moderate', label: 'Moderate improvement' },
      { value: 'significant', label: 'Significant improvement' },
    ] },
    { id: 'q6_team_usage', type: 'single_choice', required: true, label: 'How is AI used in your team today?', options: [
      { value: 'individual_only', label: 'Individual use only' },
      { value: 'informal_sharing', label: 'Informal sharing within the team' },
      { value: 'some_team_practices', label: 'Some team practices are defined' },
      { value: 'fully_integrated', label: 'Fully integrated into workflows' },
    ] },
    { id: 'q7_autonomy', type: 'single_choice', required: true, label: 'What is the highest level of AI autonomy you use today?', options: [
      { value: 'suggests_only', label: 'AI suggests only' },
      { value: 'generates_outputs', label: 'AI generates outputs' },
      { value: 'executes_with_supervision', label: 'AI executes tasks with supervision' },
      { value: 'runs_workflows', label: 'AI runs workflows end-to-end' },
    ] },
    { id: 'q8_async', type: 'single_choice', required: true, label: 'Can AI-driven tasks run without your continuous involvement?', options: [
      { value: 'no', label: 'No, I must always stay involved' },
      { value: 'limited_async', label: 'Limited, some asynchronous usage is possible' },
      { value: 'yes_independent', label: 'Yes, some tasks can run independently' },
    ] },
    { id: 'q9_measurement', type: 'single_choice', required: true, label: 'Do you measure the impact of AI usage?', options: [
      { value: 'no_measurement', label: 'No measurement' },
      { value: 'informal_tracking', label: 'Informal tracking' },
      { value: 'defined_metrics', label: 'Defined metrics are in place' },
    ] },
    { id: 'q10_sdlc_usage', type: 'multi_select', required: true, label: 'In which parts of the SDLC do you use AI today?', options: [
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
    ] },
    { id: 'q11_ai_skills', type: 'single_choice', required: true, label: 'How have you developed your skills with AI tools so far?', options: [
      { value: 'no_effort', label: 'I have not invested time in learning AI tools' },
      { value: 'ad_hoc_learning', label: 'I learned informally through trial and error or occasional use' },
      { value: 'self_learning', label: 'I actively learned through tutorials, videos, or documentation' },
      { value: 'structured_learning', label: 'I followed structured training such as courses or internal programs' },
      { value: 'advanced_usage', label: 'I actively experiment, optimize workflows, or build advanced usage such as agents or automation' },
    ] },
  ],
  branches: {
    developer: {
      title: 'Developer Questions',
      questions: [
        { id: 'd1_coding', type: 'single_choice', required: true, label: 'How do you use AI for coding?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'snippets_only', label: 'Snippets only' }, { value: 'functions_modules', label: 'Full functions or modules' }, { value: 'end_to_end_implementation', label: 'End-to-end implementation' },
        ] },
        { id: 'd2_understand_code', type: 'single_choice', required: true, label: 'How often does AI help you understand unfamiliar code?', options: [
          { value: 'never', label: 'Never' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'd3_refactor', type: 'single_choice', required: true, label: 'How does AI support refactoring in your work?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'minor_edits', label: 'Minor edits' }, { value: 'significant_refactoring', label: 'Significant refactoring' }, { value: 'automated_refactoring_workflows', label: 'Automated refactoring workflows' },
        ] },
        { id: 'd4_review_freq', type: 'single_choice', required: true, label: 'How often do you use AI in code review?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematic_pr_review', label: 'Systematic part of PR review' },
        ] },
        { id: 'd5_review_usage', type: 'multi_select', required: true, label: 'What do you use AI for in code review?', options: [
          { value: 'detect_bugs', label: 'Detect bugs' }, { value: 'suggest_improvements', label: 'Suggest improvements' }, { value: 'enforce_standards', label: 'Enforce standards' }, { value: 'summarize_prs', label: 'Summarize PRs' },
        ] },
        { id: 'd6_test_generation', type: 'single_choice', required: true, label: 'How often do you use AI to generate tests?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'd7_debug', type: 'single_choice', required: true, label: 'How often does AI help you debug issues?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'first_reflex', label: 'It is my first reflex' },
        ] },
        { id: 'd8_cicd', type: 'single_choice', required: true, label: 'How does AI help with CI/CD failures?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'suggests_fixes', label: 'It suggests fixes' }, { value: 'frequently_used', label: 'Frequently used for diagnosis or resolution' }, { value: 'automatically_resolves', label: 'Automatically resolves some issues' },
        ] },
        { id: 'd9_agents_usage', type: 'single_choice', required: true, label: 'How are agents used in your development workflow?', options: [
          { value: 'none', label: 'None' }, { value: 'experimental', label: 'Experimental only' }, { value: 'some_workflows', label: 'Used in some workflows' }, { value: 'core_workflow', label: 'Core part of the workflow' },
        ] },
        { id: 'd10_agents_actions', type: 'multi_select', required: true, label: 'What can agents do in your development workflow?', options: [
          { value: 'open_prs', label: 'Open PRs' }, { value: 'fix_bugs', label: 'Fix bugs' }, { value: 'refactor_code', label: 'Refactor code' }, { value: 'update_dependencies', label: 'Update dependencies' }, { value: 'maintain_documentation', label: 'Maintain documentation' },
        ] },
        { id: 'd11_dev_solutions', type: 'multi_select', required: true, label: 'Which developer AI solutions do you currently use?', options: [
          { value: 'github_copilot', label: 'GitHub Copilot' }, { value: 'github_copilot_agent', label: 'GitHub Copilot cloud agent / code review' }, { value: 'claude_code', label: 'Claude Code' }, { value: 'openai_codex', label: 'OpenAI Codex' }, { value: 'cursor', label: 'Cursor' }, { value: 'gemini_code_assist', label: 'Gemini Code Assist' }, { value: 'devin', label: 'Devin' }, { value: 'windsurf', label: 'Windsurf' }, { value: 'jetbrains_ai_assistant', label: 'JetBrains AI Assistant' }, { value: 'tabnine', label: 'Tabnine' }, { value: 'other_developer_ai_tools', label: 'Other developer AI tools' }, { value: 'no_specific_developer_tool', label: 'No specific developer AI tool' },
        ] },
        { id: 'd12_provisioning', type: 'single_choice', required: true, label: 'How are these developer AI tools provided in your environment?', options: standardProvisioningOptions },
      ],
    },
    qa_testing_quality: {
      title: 'QA / Testing / Quality Questions',
      questions: [
        { id: 'qat1_generate_cases', type: 'single_choice', required: true, label: 'How often do you use AI to generate test cases?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'qat2_repair_tests', type: 'single_choice', required: true, label: 'How often does AI help update or repair tests?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'automatically', label: 'Automatically' },
        ] },
        { id: 'qat3_missing_coverage', type: 'single_choice', required: true, label: 'How often does AI help identify missing test coverage?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'qat4_regressions', type: 'single_choice', required: true, label: 'How often does AI help detect regressions?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'qat5_ci_failures', type: 'single_choice', required: true, label: 'How often does AI help diagnose test failures in CI?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'qat6_root_causes', type: 'single_choice', required: true, label: 'How often does AI help identify root causes of defects?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'qat7_release_validation', type: 'single_choice', required: true, label: 'How often does AI support release readiness validation?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'qat8_test_data', type: 'single_choice', required: true, label: 'How often does AI help generate test data?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'qat9_orchestration', type: 'single_choice', required: true, label: 'How much does AI orchestrate testing workflows?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'limited', label: 'Limited orchestration' }, { value: 'frequent', label: 'Frequent orchestration' }, { value: 'fully_automated', label: 'Fully automated workflows' },
        ] },
        { id: 'qat10_agents_actions', type: 'multi_select', required: true, label: 'What can agents do in your QA / testing workflow?', options: [
          { value: 'generate_tests', label: 'Generate tests' }, { value: 'execute_tests', label: 'Execute tests' }, { value: 'diagnose_failures', label: 'Diagnose failures' }, { value: 'suggest_fixes', label: 'Suggest fixes' }, { value: 'validate_releases', label: 'Validate releases' },
        ] },
        { id: 'qat11_qa_solutions', type: 'multi_select', required: true, label: 'Which QA / testing AI solutions do you currently use?', options: [
          { value: 'tricentis_tosca', label: 'Tricentis Tosca / Agentic Test Automation' }, { value: 'testim', label: 'Testim' }, { value: 'mabl', label: 'mabl' }, { value: 'functionize', label: 'Functionize' }, { value: 'cloudbees_smart_tests', label: 'CloudBees Smart Tests' }, { value: 'launchable', label: 'Launchable' }, { value: 'other_qa_ai_tools', label: 'Other QA AI tools' }, { value: 'no_specific_qa_tool', label: 'No specific QA AI tool' },
        ] },
        { id: 'qat12_provisioning', type: 'single_choice', required: true, label: 'How are these QA / testing AI tools provided in your environment?', options: standardProvisioningOptions },
      ],
    },
    project_product_operations: {
      title: 'Project / Product / Operations Questions',
      questions: [
        { id: 'ppo1_requirements', type: 'single_choice', required: true, label: 'How often do you use AI to help with requirements or user stories?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'ppo2_planning', type: 'single_choice', required: true, label: 'How often does AI support planning or task breakdown?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'ppo3_summary', type: 'single_choice', required: true, label: 'How often does AI help summarize team activity?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'ppo4_status_updates', type: 'single_choice', required: true, label: 'How often does AI help generate reports or status updates?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'ppo5_risks', type: 'single_choice', required: true, label: 'How often does AI help identify risks or delays?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'ppo6_prioritize', type: 'single_choice', required: true, label: 'How often does AI help prioritize work or backlog items?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'ppo7_docs', type: 'single_choice', required: true, label: 'How often does AI help maintain project or technical documentation?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'ppo8_incidents', type: 'single_choice', required: true, label: 'How often does AI help analyze incidents or production issues?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'ppo9_logs_metrics', type: 'single_choice', required: true, label: 'How often does AI help interpret logs, metrics, or alerts?', options: [
          { value: 'not_used', label: 'Not used' }, { value: 'occasionally', label: 'Occasionally' }, { value: 'frequently', label: 'Frequently' }, { value: 'systematically', label: 'Systematically' },
        ] },
        { id: 'ppo10_ops_workflow', type: 'multi_select', required: true, label: 'How is AI used in your project / product / operations workflow?', options: [
          { value: 'automate_reporting', label: 'Automate reporting' }, { value: 'suggest_actions', label: 'Suggest actions' }, { value: 'assist_incident_response', label: 'Assist incident response' }, { value: 'improve_workflows', label: 'Improve workflows' },
        ] },
        { id: 'ppo11_project_ops_solutions', type: 'multi_select', required: true, label: 'Which project / product / operations AI solutions do you currently use?', options: [
          { value: 'jira_rovo', label: 'Jira + Rovo' }, { value: 'jira_service_management_ai', label: 'Jira Service Management AI / Rovo' }, { value: 'servicenow_now_assist', label: 'ServiceNow Now Assist' }, { value: 'servicenow_ai_agents', label: 'ServiceNow AI Agents' }, { value: 'asana_ai', label: 'Asana AI' }, { value: 'microsoft_copilot_m365', label: 'Microsoft Copilot for Microsoft 365' }, { value: 'other_project_ops_ai_tools', label: 'Other project / ops AI tools' }, { value: 'no_specific_project_ops_tool', label: 'No specific project / ops AI tool' },
        ] },
        { id: 'ppo12_provisioning', type: 'single_choice', required: true, label: 'How are these project / product / operations AI tools provided in your environment?', options: standardProvisioningOptions },
      ],
    },
  },
  finalOptionalComment: {
    id: 'comment1',
    type: 'free_text',
    required: false,
    label: 'Optional: any other AI tools, internal solutions, blocked tools, or comments you would like to mention?',
    placeholder: 'Share any additional tools or comments here',
  },
};

const isAnswered = (question, value) => {
  if (!question.required) return true;
  if (question.type === 'multi_select') return Array.isArray(value) && value.length > 0;
  if (question.type === 'free_text') return true;
  return Boolean(value);
};

function App() {
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [meta, setMeta] = useState({ surveyDate: new Date().toISOString().slice(0, 10), teamName: '', respondent: '' });

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setAnswers(parsed.answers || {});
      setIndex(parsed.index || 0);
      setEndpoint(parsed.endpoint || '');
      setMeta(parsed.meta || { surveyDate: new Date().toISOString().slice(0, 10), teamName: '', respondent: '' });
    } catch (_e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, index, endpoint, meta }));
  }, [answers, index, endpoint, meta]);

  const branchKey = answers.q1_role || null;
  const branchDef = branchKey ? surveyConfig.branches[branchKey] : null;

  const flow = useMemo(() => {
    const core = surveyConfig.coreQuestions.map((q) => ({ ...q, section: 'Core Questions' }));
    if (!branchDef) return core;
    const branch = branchDef.questions.map((q) => ({ ...q, section: branchDef.title, branch: branchKey }));
    return [...core, ...branch, { ...surveyConfig.finalOptionalComment, section: 'Final Optional Comment' }];
  }, [branchDef, branchKey]);

  const currentQuestion = flow[index] || null;
  const progress = flow.length ? Math.round((Math.min(index + 1, flow.length) / flow.length) * 100) : 0;
  const answeredRequiredCount = flow.filter((q) => q.required).filter((q) => isAnswered(q, answers[q.id])).length;
  const requiredCount = flow.filter((q) => q.required).length;

  const setSingle = (id, value) => {
    setAnswers((prev) => {
      const next = { ...prev, [id]: value };
      if (id === 'q1_role') {
        Object.keys(surveyConfig.branches).forEach((branch) => {
          if (branch !== value) surveyConfig.branches[branch].questions.forEach((q) => delete next[q.id]);
        });
        delete next.comment1;
      }
      return next;
    });
  };

  const toggleMulti = (id, value) => {
    setAnswers((prev) => {
      const existing = Array.isArray(prev[id]) ? prev[id] : [];
      return { ...prev, [id]: existing.includes(value) ? existing.filter((x) => x !== value) : [...existing, value] };
    });
  };

  const isCurrentValid = () => {
    if (!currentQuestion) return true;
    return isAnswered(currentQuestion, answers[currentQuestion.id]);
  };

  const next = () => {
    setError('');
    if (!isCurrentValid()) return setError('Please answer this required question to continue.');
    setIndex((i) => Math.min(i + 1, flow.length));
  };

  const prev = () => {
    setError('');
    setIndex((i) => Math.max(0, i - 1));
  };

  const buildPayload = () => {
    const coreAnswers = {};
    surveyConfig.coreQuestions.forEach((q) => {
      coreAnswers[q.id] = answers[q.id] ?? (q.type === 'multi_select' ? [] : null);
    });

    const branchAnswers = {};
    if (branchKey && surveyConfig.branches[branchKey]) {
      surveyConfig.branches[branchKey].questions.forEach((q) => {
        branchAnswers[q.id] = answers[q.id] ?? (q.type === 'multi_select' ? [] : null);
      });
    }

    return {
      role: answers.q1_role || null,
      coreAnswers,
      branch: branchKey,
      branchAnswers,
      comment: answers.comment1 || '',
      metadata: {
        surveyId: surveyConfig.survey.id,
        surveyDate: meta.surveyDate,
        teamName: meta.teamName,
        respondent: meta.respondent,
      },
      submittedAt: new Date().toISOString(),
    };
  };

  const submit = async () => {
    const requiredIncomplete = flow.filter((q) => q.required).some((q) => !isAnswered(q, answers[q.id]));
    if (!branchKey || requiredIncomplete) {
      setError('Please complete all required questions before submitting.');
      return;
    }

    setStatus('submitting');
    setError('');
    const payload = buildPayload();

    try {
      if (endpoint.trim()) {
        const response = await fetch(endpoint.trim(), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
      } else {
        console.info('No endpoint set. Payload preview:', payload);
      }
      localStorage.removeItem(STORAGE_KEY);
      setStatus('success');
    } catch (e) {
      setStatus('idle');
      setError(`Submission failed: ${e.message}`);
    }
  };

  if (status === 'success') {
    return (
      <section className="panel success-panel">
        <h2>Submission complete</h2>
        <p>Thank you. Your diagnostic response has been recorded.</p>
      </section>
    );
  }

  const onReview = index >= flow.length;

  return (
    <div className="survey-shell">
      <section className="panel metadata-panel">
        <h2>Survey Metadata</h2>
        <div className="grid">
          <label>Survey date<input type="date" value={meta.surveyDate} onChange={(e) => setMeta((m) => ({ ...m, surveyDate: e.target.value }))} /></label>
          <label>Team / Group name<input type="text" placeholder="Optional" value={meta.teamName} onChange={(e) => setMeta((m) => ({ ...m, teamName: e.target.value }))} /></label>
          <label>Respondent name<input type="text" placeholder="Optional" value={meta.respondent} onChange={(e) => setMeta((m) => ({ ...m, respondent: e.target.value }))} /></label>
          <label>Submission endpoint (optional)<input type="url" placeholder="https://script.google.com/macros/s/.../exec" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} /></label>
        </div>
      </section>

      <section className="panel progress-panel">
        <div className="progress-head"><strong>Progress</strong><span>{Math.min(index + 1, flow.length)} / {flow.length} steps</span></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <small>Required answered: {answeredRequiredCount}/{requiredCount}</small>
      </section>

      <section className="panel question-panel">
        {!onReview && currentQuestion && (
          <>
            <p className="section-title">{currentQuestion.section}</p>
            <h2>{currentQuestion.label}</h2>
            <p className="q-meta">{currentQuestion.required ? 'Required' : 'Optional'} • {currentQuestion.type.replace('_', ' ')}</p>

            {currentQuestion.type === 'free_text' && (
              <label>
                <textarea
                  className="comment-box"
                  rows={4}
                  placeholder={currentQuestion.placeholder || ''}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [currentQuestion.id]: e.target.value }))}
                />
              </label>
            )}

            {currentQuestion.type !== 'free_text' && (
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
                        onChange={() => currentQuestion.type === 'single_choice' ? setSingle(currentQuestion.id, option.value) : toggleMulti(currentQuestion.id, option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  );
                })}
              </div>
            )}
          </>
        )}

        {onReview && (
          <>
            <p className="section-title">Review & Submit</p>
            <h2>Ready to submit</h2>
            <div className="review-grid">
              <div><strong>Role</strong><div>{answers.q1_role || '-'}</div></div>
              <div><strong>Branch</strong><div>{branchKey || '-'}</div></div>
              <div><strong>Core questions</strong><div>{surveyConfig.coreQuestions.length}</div></div>
              <div><strong>Branch questions</strong><div>{branchDef ? branchDef.questions.length : 0}</div></div>
            </div>
          </>
        )}

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="button" onClick={prev} disabled={index === 0}>Previous</button>
          {!onReview ? (
            <button type="button" onClick={next}>Next</button>
          ) : (
            <button type="button" onClick={submit} disabled={status === 'submitting'}>{status === 'submitting' ? 'Submitting...' : 'Submit'}</button>
          )}
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
