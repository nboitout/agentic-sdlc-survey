const questions = [
  { n: 1, section: 'Respondent Context', type: 'single', text: 'What is your primary role?', options: ['Software Engineer', 'Tech Lead / Architect', 'QA / Tester', 'DevOps / SRE', 'Product / Project Manager', 'Production / Run / Support', 'Other'] },
  { n: 2, section: 'Respondent Context', type: 'single', text: 'What is the main type of project you currently work on?', options: ['Greenfield', 'Brownfield (active development)', 'Legacy maintenance', 'Legacy modernization / migration', 'Mixed portfolio'] },
  { n: 3, section: 'Respondent Context', type: 'single', text: 'Does your current scope include legacy migration (for example COBOL or other legacy stack modernization)?', options: ['No', 'Yes, occasionally', 'Yes, as a significant part of my work', 'Yes, it is the core of my current project'] },
  { n: 4, section: 'Respondent Context', type: 'single', text: 'What delivery model best describes your current project?', options: ['Time & Material (T&M)', 'Fixed price / committed delivery', 'Internal product team', 'Managed service / run', 'Mixed model'] },
  { n: 5, section: 'Respondent Context', type: 'single', text: 'What is your current team size?', options: ['1–3', '4–8', '9–15', '16+'] },

  { n: 6, section: 'Tooling and AI Interfaces', type: 'multi', text: 'Which AI tools do you use regularly?', options: ['None', 'GitHub Copilot (autocomplete only)', 'Copilot Chat / IDE chat', 'ChatGPT (external)', 'Claude (external)', 'AI-native IDE (Cursor, Windsurf, etc.)', 'CLI-based coding agents (Claude Code, Codex CLI, etc.)', 'Internal AI tools (company-specific)'] },
  { n: 7, section: 'Tooling and AI Interfaces', type: 'single', text: 'Which tool is your primary AI interface?', options: ['None', 'GitHub Copilot (autocomplete)', 'Copilot Chat / IDE chat', 'ChatGPT / Claude', 'AI-native IDE', 'CLI-based coding agent', 'Internal AI tool'] },
  { n: 8, section: 'Tooling and AI Interfaces', type: 'single', text: 'Where does AI operate in your workflow today?', options: ['Nowhere', 'Only in the editor', 'In chat tools outside the codebase', 'Across IDE + repo + PR workflow', 'Directly in repo / terminal / CI workflows'] },

  { n: 9, section: 'Overall Stage Signal', type: 'single', text: 'Which best describes your current way of working?', options: ['Manual / no AI', 'AI helps me type faster (autocomplete)', 'AI helps me solve problems (chat / prompting)', 'AI executes tasks for me (agents)', 'Workflows continue without me (system-driven)', 'System improves itself over time'] },
  { n: 10, section: 'Overall Stage Signal', type: 'single', text: 'What happens when you stop working at the end of the day?', options: ['Work stops completely', 'Some notes or drafts remain', 'AI-generated outputs are waiting for me', 'Some agents continue tasks', 'The system continues execution and surfaces results later', 'The system improves workflows over time'] },

  { n: 11, section: 'Scope', type: 'single', text: 'What scope of work does AI typically handle for you?', options: ['None', 'Snippets / small code fragments', 'Single file / function', 'Multi-file changes', 'Full feature / repo-level work', 'Cross-system workflows'] },
  { n: 12, section: 'Scope', type: 'single', text: 'Can AI modify your codebase end-to-end in your workflow?', options: ['No', 'Only through manual copy/paste', 'Yes, but I approve every step', 'Yes, within bounded autonomy', 'Yes, autonomously within defined guardrails'] },

  { n: 13, section: 'Parallelism', type: 'single', text: 'How many tasks do you effectively run in parallel?', options: ['One', '1–2 with AI help', 'Several via agents', 'Many via parallel agents', 'Continuous execution beyond my direct session'] },
  { n: 14, section: 'Parallelism', type: 'single', text: 'Do you use multiple agents simultaneously?', options: ['Never', 'Occasionally', 'Frequently (2–3 agents)', 'Systematically (4+ agents)', 'Parallel agent execution is the default way of working'] },

  { n: 15, section: 'Supervision', type: 'single', text: 'How is code review handled in practice?', options: ['Fully manual', 'AI suggests comments', 'AI performs first-pass review, human validates most changes', 'AI pre-reviews most changes, human focuses on critical items', 'Only critical risk paths receive human review'] },
  { n: 16, section: 'Supervision', type: 'single', text: 'How is incident response handled?', options: ['Fully manual investigation', 'AI helps analyze logs or metrics', 'AI suggests fixes', 'AI proposes fixes and drafts PRs', 'AI handles first response before human validation'] },
  { n: 17, section: 'Supervision', type: 'single', text: 'How is quality, compliance, and policy enforcement handled?', options: ['Humans only', 'Humans with AI support', 'AI pre-checks + human validation', 'Automated policies + human oversight', 'Automated guardrails with exception review'] },

  { n: 18, section: 'Feedback Loops and System Behavior', type: 'single', text: 'How do you understand if a released feature is working?', options: ['Manual dashboards and manual interpretation', 'Dashboards plus AI explanation', 'AI aggregates multiple sources for me', 'The system summarizes key signals before I look', 'The system continuously interprets signals and updates priorities'] },
  { n: 19, section: 'Feedback Loops and System Behavior', type: 'single', text: 'How are priorities updated in your team?', options: ['Through meetings only', 'Through meetings supported by AI summaries', 'AI proposes priorities but humans decide', 'Priorities are updated through structured workflows', 'The system continuously adjusts priorities under human oversight'] },

  { n: 20, section: 'Team Friction and Bottlenecks', type: 'single', text: 'What is the main bottleneck in your current delivery model?', options: ['Coding speed', 'Understanding requirements', 'Code review', 'Integration / merging', 'Coordination / alignment', 'Testing / QA', 'Deployment / release', 'Production validation'] }
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
