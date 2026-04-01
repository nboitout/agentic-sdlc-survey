const questions = [
  { n: 1, section: 'Respondent Context', type: 'single', text: 'What is your primary role?', options: ['Software Engineer', 'Tech Lead / Architect', 'QA / Tester', 'DevOps / SRE', 'Product / Project Manager', 'Production / Run / Support', 'Other'] },
  { n: 2, section: 'Respondent Context', type: 'single', text: 'What is the main type of project you currently work on?', options: ['Greenfield', 'Brownfield (active development)', 'Legacy maintenance', 'Legacy modernization / migration', 'Mixed portfolio'] },
  { n: 3, section: 'Respondent Context', type: 'single', text: 'Does your current scope include legacy migration (for example COBOL or other legacy stack modernization)?', options: ['No', 'Yes, occasionally', 'Yes, as a significant part of my work', 'Yes, it is the core of my current project'] },
  { n: 4, section: 'Respondent Context', type: 'single', text: 'What delivery model best describes your current project?', options: ['Time & Material (T&M)', 'Fixed price / committed delivery', 'Internal product team', 'Managed service / run', 'Mixed model'] },
  { n: 5, section: 'Respondent Context', type: 'single', text: 'What is your current team size?', options: ['1–3', '4–8', '9–15', '16+'] },
  { n: 6, section: 'Baseline Tooling and AI Usage', type: 'multi', text: 'Which AI tools do you use regularly?', options: ['None', 'GitHub Copilot (autocomplete only)', 'Copilot Chat / IDE chat', 'ChatGPT', 'Claude', 'Cursor / Windsurf / AI-native IDE', 'Internal AI tools', 'CLI-based coding agents (Claude Code, Codex CLI, etc.)'] },
  { n: 7, section: 'Baseline Tooling and AI Usage', type: 'single', text: 'How do you typically use AI in your daily work?', options: ['I do not use AI', 'Inline autocomplete only', 'Occasional questions / copy-paste usage', 'Frequent prompting for coding, debugging, or design', 'Integrated into most of my daily workflow'] },
  { n: 8, section: 'Baseline Tooling and AI Usage', type: 'single', text: 'Where does AI operate in your workflow today?', options: ['Nowhere', 'Only in the editor', 'In chat tools outside the codebase', 'Across IDE + repo + PR workflow', 'Directly in repo / terminal / CI workflows'] },
  { n: 9, section: 'Baseline Tooling and AI Usage', type: 'single', text: 'Which statement best describes your current baseline?', options: ['Mostly manual, little or no AI', 'AI helps me type faster', 'AI helps me think and solve faster', 'AI can execute tasks for me', 'AI is embedded in workflows that continue beyond my direct session'] },
  { n: 10, section: 'Scope of AI Work', type: 'single', text: 'What scope of work does AI typically handle for you?', options: ['Single lines / snippets', 'Functions / local file edits', 'Multi-file changes', 'Full features across the repo', 'Cross-repo or system-level work'] },
  { n: 11, section: 'Scope of AI Work', type: 'single', text: 'Can AI modify the codebase end-to-end in your workflow?', options: ['No', 'Only through manual copy/paste', 'Yes, but I approve every step', 'Yes, with bounded autonomy', 'Yes, autonomously within defined guardrails'] },
  { n: 12, section: 'Scope of AI Work', type: 'multi', text: 'When using AI, what kinds of artifacts can it touch?', options: ['Source code', 'Tests', 'Config files', 'Documentation', 'CI/CD definitions', 'Infrastructure / deployment scripts', 'Database / migration scripts'] },
  { n: 13, section: 'Scope of AI Work', type: 'single', text: 'Who usually initiates coding or implementation tasks?', options: ['Always human', 'Human with AI suggestions', 'Human triggers an agent to execute', 'System or workflow initiates some tasks automatically', 'System initiates many tasks automatically'] },
  { n: 14, section: 'Parallelism', type: 'single', text: 'How many engineering tasks are typically worked on in parallel per person?', options: ['One at a time', '1–2 with AI support', 'Multiple tasks through agent assistance', 'Several tasks through parallel agents', 'Work continues continuously beyond individual sessions'] },
  { n: 15, section: 'Parallelism', type: 'single', text: 'Do you use multiple agents simultaneously?', options: ['Never', 'Occasionally', 'Frequently (2–3 agents)', 'Systematically (4+ agents)', 'Parallel agent execution is part of the normal workflow'] },
  { n: 16, section: 'Parallelism', type: 'single', text: 'What happens when you stop working at the end of the day?', options: ['Work stops completely', 'Notes / drafts remain for tomorrow', 'Some AI-generated drafts / outputs are waiting', 'Some agents continue running tasks', 'The system continues execution and surfaces results later'] },
  { n: 17, section: 'Parallelism', type: 'single', text: 'How often do AI-generated outputs from different people or agents create overlap or conflicts?', options: ['Never', 'Occasionally', 'Frequently', 'Very frequently', 'It is a major coordination issue'] },
  { n: 18, section: 'Supervision, Review, and Guardrails', type: 'single', text: 'How is code review typically performed?', options: ['Fully manual', 'AI may suggest comments', 'AI performs first-pass review, human validates most changes', 'AI pre-reviews most changes, human focuses on critical items', 'Only critical risk paths receive human review'] },
  { n: 19, section: 'Supervision, Review, and Guardrails', type: 'single', text: 'How is incident response handled?', options: ['Fully manual investigation', 'AI helps analyze logs or metrics', 'AI suggests fixes', 'AI proposes fixes and drafts PRs', 'AI handles first response before human validation'] },
  { n: 20, section: 'Supervision, Review, and Guardrails', type: 'single', text: 'How are CI/CD and validation handled?', options: ['Mostly manual triggering and checks', 'Automated pipelines only', 'AI-assisted validation', 'Automated checks with AI support and human oversight', 'Guardrailed automated workflows with human exception handling'] },
  { n: 21, section: 'Supervision, Review, and Guardrails', type: 'single', text: 'Who ensures quality, compliance, and policy adherence?', options: ['Humans only', 'Humans with AI support', 'AI pre-checks + human validation', 'Mixed automated policies + human oversight', 'Automated policy enforcement with exception review'] },
  { n: 22, section: 'Feedback Loops and Product Signals', type: 'single', text: 'How do you analyze the performance of a released feature?', options: ['Manual dashboards and manual interpretation', 'Dashboards plus AI explanations', 'AI aggregates multiple sources for me', 'System summarizes key signals before I look', 'System continuously interprets and updates priorities'] },
  { n: 23, section: 'Feedback Loops and Product Signals', type: 'single', text: 'How is user feedback typically handled?', options: ['Manual reading across tools', 'AI summarizes threads / tickets / issues', 'AI clusters and highlights patterns', 'AI proposes priority updates', 'Feedback is automatically integrated into the work system'] },
  { n: 24, section: 'Feedback Loops and Product Signals', type: 'multi', text: 'Which feedback sources are used in practice?', options: ['GitHub issues / PR comments', 'Slack / Teams / chat threads', 'Support tickets', 'User interviews or calls', 'QA / tester reports', 'Monitoring / logs / metrics', 'Product analytics', 'Social / public feedback (forums, Reddit, etc.)'] },
  { n: 25, section: 'Feedback Loops and Product Signals', type: 'single', text: 'How are priorities updated in your team?', options: ['Through meetings only', 'Through meetings supported by AI summaries', 'AI proposes priorities but humans decide', 'Priorities are updated through structured workflows', 'The system continuously adjusts priorities under human oversight'] },
  { n: 26, section: 'Team Coordination and Delivery Friction', type: 'single', text: 'How is team alignment mainly achieved today?', options: ['Meetings / Slack / manual sync', 'Shared documents + discussions', 'AI summaries help alignment', 'Shared structured workflow system', 'System-level coordination with human oversight'] },
  { n: 27, section: 'Team Coordination and Delivery Friction', type: 'single', text: 'What is the main bottleneck in your current delivery model?', options: ['Coding speed', 'Understanding requirements', 'Code review', 'Integration / merging', 'Coordination / alignment', 'Testing / QA', 'Deployment / release', 'Production validation'] },
  { n: 28, section: 'Team Coordination and Delivery Friction', type: 'single', text: 'Which statement best describes your team today?', options: ['Individuals work mostly manually', 'Individuals are faster thanks to AI', 'Agents accelerate task execution', 'Coordination is becoming the bottleneck', 'Workflows are increasingly system-driven'] },
  { n: 29, section: 'CLI Agents / Claude Code / Codex CLI', type: 'single', text: 'Have you used CLI-based AI agents (Claude Code, Codex CLI, etc.)?', options: ['Never', 'Tried once / experimentation', 'Occasional usage', 'Frequent usage', 'Daily / default usage'] },
  { n: 30, section: 'CLI Agents / Claude Code / Codex CLI', type: 'single', text: 'How do you interact with these CLI-based tools?', options: ['Like a chatbot only', 'Mostly for code generation', 'For multi-step tasks (implement / fix / test)', 'For delegated workflows (build / test / fix / PR)', 'As a normal execution layer in my workflow'] },
  { n: 31, section: 'CLI Agents / Claude Code / Codex CLI', type: 'single', text: 'What level of access do you typically grant to the agent?', options: ['No direct access to the codebase', 'Read-only access', 'Write access with frequent approval', 'Bounded autonomy within rules', 'Autonomous execution within guardrails'] },
  { n: 32, section: 'CLI Agents / Claude Code / Codex CLI', type: 'multi', text: 'What tasks do you let the agent execute?', options: ['Generate code snippets', 'Modify files', 'Run tests', 'Debug issues', 'Query logs / metrics', 'Manage git (commit / PR)', 'Execute full workflows'] },
  { n: 33, section: 'CLI Agents / Claude Code / Codex CLI', type: 'single', text: 'How often does the agent run terminal commands for you?', options: ['Never', 'Occasionally', 'Frequently', 'Very frequently', 'It is the default way I work'] },
  { n: 34, section: 'CLI Agents / Claude Code / Codex CLI', type: 'single', text: 'When using agentic CLI tools, what is your role?', options: ['I still write most of the code myself', 'I review and edit AI output', 'I supervise execution', 'I define intent and validate outcomes', 'I mainly manage constraints, guardrails, and system behavior'] },
  { n: 35, section: 'CLI Agents / Claude Code / Codex CLI', type: 'single', text: 'How many agent-driven tasks do you run in parallel?', options: ['None', 'One at a time', '2–3 in parallel', '4+ in parallel', 'Parallel agent execution is continuous'] },
  { n: 36, section: 'CLI Agents / Claude Code / Codex CLI', type: 'single', text: 'What happens when an agent completes a task?', options: ['I manually copy / integrate the result', 'I review and merge manually', 'It creates a PR automatically', 'It integrates into a broader workflow automatically', 'It feeds a continuous system with validation checkpoints'] },
  { n: 37, section: 'CLI Agents / Claude Code / Codex CLI', type: 'single', text: 'Do you configure agent behavior (rules, context files, skills, reusable workflows)?', options: ['No', 'Basic prompts only', 'Some configuration / instructions', 'Reusable skills / workflows', 'Structured agent operating model with reusable components'] },
  { n: 38, section: 'CLI Agents / Claude Code / Codex CLI', type: 'single', text: 'How reliable are agent outputs in your current workflow?', options: ['Not reliable', 'Partially reliable with heavy corrections', 'Mostly reliable with light validation', 'Reliable enough for bounded autonomy', 'Reliable enough for autonomous execution within guardrails'] },
  { n: 39, section: 'Overall Maturity and Progress Tracking', type: 'single', text: 'How would you describe your current way of working?', options: ['Manual', 'AI-assisted', 'Agent-assisted', 'System-driven', 'Self-improving / continuously evolving'] },
  { n: 40, section: 'Overall Maturity and Progress Tracking', type: 'single', text: 'What would create the biggest improvement over the next month?', options: ['Better use of existing tools', 'More AI training / enablement', 'More agent automation', 'Better team coordination and system integration', 'Better supervision / guardrails / policy automation', 'Better feedback loops and prioritization'] }
];

const questionHost = document.getElementById('questions');
const statusEl = document.getElementById('status');
const form = document.getElementById('survey-form');
const today = new Date().toISOString().split('T')[0];
document.getElementById('surveyDate').value = today;

function renderQuestions() {
  let currentSection = '';
  for (const q of questions) {
    if (q.section !== currentSection) {
      currentSection = q.section;
      const sectionHeader = document.createElement('h2');
      sectionHeader.textContent = currentSection;
      questionHost.append(sectionHeader);
    }

    const card = document.createElement('article');
    card.className = 'question';

    const title = document.createElement('div');
    title.className = 'question-title';
    title.textContent = `Q${q.n}. ${q.text}`;

    const meta = document.createElement('small');
    meta.textContent = `Type: ${q.type === 'single' ? 'Single choice' : 'Multiple choice'}`;

    card.append(title, meta);

    q.options.forEach((option, idx) => {
      const label = document.createElement('label');
      label.className = 'option';
      const input = document.createElement('input');
      input.type = q.type === 'single' ? 'radio' : 'checkbox';
      input.name = `q${q.n}`;
      input.value = option;
      input.required = q.type === 'single' && idx === 0;
      label.append(input, ` ${option}`);
      card.append(label);
    });

    questionHost.append(card);
  }
}

function collectFormData() {
  const payload = {
    surveyDate: form.surveyDate.value,
    teamName: form.teamName.value.trim(),
    respondent: form.respondent.value.trim(),
    submittedAt: new Date().toISOString(),
    answers: {}
  };

  questions.forEach((q) => {
    if (q.type === 'single') {
      payload.answers[`Q${q.n}`] = form[`q${q.n}`].value || '';
    } else {
      payload.answers[`Q${q.n}`] = Array.from(form.querySelectorAll(`input[name="q${q.n}"]:checked`)).map((el) => el.value);
    }
  });
  return payload;
}

function saveDraft() {
  localStorage.setItem('agenticSdlcSurveyDraft', JSON.stringify(collectFormData()));
  statusEl.textContent = 'Draft saved locally.';
}

function loadDraft() {
  const draft = localStorage.getItem('agenticSdlcSurveyDraft');
  if (!draft) return;
  const data = JSON.parse(draft);
  if (data.surveyDate) form.surveyDate.value = data.surveyDate;
  form.teamName.value = data.teamName || '';
  form.respondent.value = data.respondent || '';

  Object.entries(data.answers || {}).forEach(([key, value]) => {
    const n = key.replace('Q', '');
    const name = `q${n}`;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        const match = form.querySelector(`input[name="${name}"][value="${CSS.escape(v)}"]`);
        if (match) match.checked = true;
      });
    } else {
      const match = form.querySelector(`input[name="${name}"][value="${CSS.escape(value)}"]`);
      if (match) match.checked = true;
    }
  });
}

renderQuestions();
loadDraft();

document.getElementById('save-draft').addEventListener('click', saveDraft);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.textContent = 'Submitting...';

  const endpoint = form.endpoint.value.trim();
  const payload = collectFormData();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    localStorage.removeItem('agenticSdlcSurveyDraft');
    statusEl.textContent = 'Submitted successfully.';
  } catch (error) {
    console.error(error);
    statusEl.textContent = 'Submit failed. Save a draft and verify your Apps Script URL + CORS settings.';
  }
});
