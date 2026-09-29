const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = 'agenticSdlcBranchingSurveyV3';
const DRAFT_VERSION = 1;
const DRAFT_TTL_MS = 72 * 60 * 60 * 1000;
const DEFAULT_META = () => ({ surveyDate: new Date().toISOString().slice(0, 10), teamName: '', respondent: '' });

const uiText = {en: {
    title: 'Digiterre / Ascendion | Agentic SDLC Diagnostic',
    subtitle: '13 core + 10 or 12 role-specific required questions plus 1 optional final comment. Professional, structured, and analytics-ready.',
    language: 'Language',
    metadata: 'Survey Metadata',
    surveyDate: 'Survey date',
    teamName: 'Team / Group name',
    respondent: 'Respondent name',
    endpoint: 'Submission endpoint (optional)',
    optional: 'Optional',
    progress: 'Progress',
    steps: 'steps',
    requiredAnswered: 'Required answered',
    required: 'Required',
    optionalTag: 'Optional',
    single_choice: 'single choice',
    multi_select: 'multi select',
    free_text: 'free text',
    next: 'Next',
    previous: 'Previous',
    review: 'Review & submit',
    ready: 'Ready to submit',
    role: 'Role',
    branch: 'Branch',
    coreQuestions: 'Core questions',
    branchQuestions: 'Branch questions',
    submit: 'Submit',
    submitResponse: 'Submit response',
    submitting: 'Submitting...',
    successTitle: 'Submission complete',
    successBody: 'Thank you. Your diagnostic response has been recorded.',
    requiredError: 'Please answer this required question to continue.',
    incompleteError: 'Please complete all required questions before submitting.',
    noEndpoint: 'No endpoint set. Payload preview:',
    coreSection: 'Core Questions',
    finalSection: 'Final Optional Comment',
    transitionTitle: 'Now entering your role-specific section',
    transitionBody: 'These next questions are tailored to your role:',
    continue: 'Continue',
    tooltipHint: 'Click the ⓘ for guidance',
    draftPromptTitle: 'A previous response draft was found',
    draftPromptBody: 'Would you like to resume your previous response or start a new one?',
    resumeDraft: 'Resume previous response',
    startNew: 'Start a new response',
    introHeading: 'Welcome',
    introP1: 'We are launching this company-wide survey to better understand how AI is really used across our teams in day-to-day practices, workflows, and delivery work.',
    introGoalLabel: 'Our objective is simple:',
    introGoal1: 'identify what is working',
    introGoal2: 'understand our current level of maturity',
    introGoal3: 'accelerate, collectively, how we use AI',
    introP2: 'This is not an individual evaluation. The goal is to reflect the reality on the ground: current practices, challenges, and opportunities.',
    introListLabel: 'Your responses will help us:',
    introList1: 'improve available tools and support',
    introList2: 'share best practices across teams',
    introList3: 'prioritize training actions and investments',
    introList4: 'evolve our delivery model',
    introP3: 'The survey takes only a few minutes to complete. Responses will be analyzed in aggregated form.',
    introThanks: 'Thank you for your contribution.',
    allRequiredCompleted: 'All required questions have been completed.',
    doneReadyToSubmit: 'You’re done — ready to submit your responses.',
    questionsAnswered: 'Questions answered',
    submitHelper: 'Submission takes a few seconds.',
    thankYouTitle: 'Thank you',
    submittedSuccess: 'Your response has been submitted successfully.',
    submittedSupport: 'Thank you for taking the time to complete this survey. Your input will help us better understand how AI is used across the organization and where we can improve tools, support, and practices.',
    submittedAggregated: 'Your responses will be analyzed in aggregated form.',
    submitAnother: 'Submit another response',
    advancedCalloutTitle: 'You seem to be among our most advanced AI users',
    advancedCalloutBody: 'Your answers suggest you\'re using AI in ways that go beyond the norm — running autonomous workflows, relying on it daily, and seeing real productivity gains. We\'d love to connect with you, whether to share practices, co-build internal tools, or explore side projects. If you\'re open to it, leave your name and email below.',
    advancedCalloutName: 'Your name',
    advancedCalloutEmail: 'Your email',
  },
ro: {
    title: 'Digiterre / Ascendion | Diagnostic SDLC Agentic',
    subtitle: '13 întrebări de bază + 10 sau 12 întrebări specifice rolului + 1 comentariu final opțional.',
    language: 'Limbă',
    metadata: 'Metadate chestionar',
    surveyDate: 'Data chestionarului',
    teamName: 'Nume echipă / grup',
    respondent: 'Nume respondent',
    endpoint: 'Endpoint trimitere (opțional)',
    optional: 'Opțional',
    progress: 'Progres',
    steps: 'pași',
    requiredAnswered: 'Obligatorii completate',
    required: 'Obligatoriu',
    optionalTag: 'Opțional',
    single_choice: 'alegere unică',
    multi_select: 'selecție multiplă',
    free_text: 'text liber',
    next: 'Următor',
    previous: 'Înapoi',
    review: 'Revizuire & Trimitere',
    ready: 'Gata pentru trimitere',
    role: 'Rol',
    branch: 'Ramură',
    coreQuestions: 'Întrebări de bază',
    branchQuestions: 'Întrebări pe ramură',
    submit: 'Trimite',
    submitResponse: 'Trimite răspunsul',
    submitting: 'Se trimite...',
    successTitle: 'Trimitere finalizată',
    successBody: 'Mulțumim. Răspunsul a fost înregistrat.',
    requiredError: 'Te rugăm să răspunzi la această întrebare obligatorie.',
    incompleteError: 'Te rugăm să completezi toate întrebările obligatorii înainte de trimitere.',
    noEndpoint: 'Nu este setat endpoint. Preview payload:',
    coreSection: 'Întrebări de bază',
    finalSection: 'Comentariu final opțional',
    transitionTitle: 'Acum intri în secțiunea specifică rolului tău',
    transitionBody: 'Următoarele întrebări sunt adaptate rolului tău:',
    continue: 'Continuă',
    tooltipHint: 'Apasă pe ⓘ pentru ghidaj',
    draftPromptTitle: 'A fost găsit un draft de răspuns anterior',
    draftPromptBody: 'Vrei să reiei răspunsul anterior sau să începi unul nou?',
    resumeDraft: 'Reia răspunsul anterior',
    startNew: 'Începe un răspuns nou',
    introHeading: 'Bun venit',
    introP1: 'Lansăm acest chestionar la nivelul întregii companii pentru a înțelege mai bine cum este folosită în mod real inteligența artificială în echipele noastre, în practicile de zi cu zi, în fluxurile de lucru și în activitatea de delivery.',
    introGoalLabel: 'Obiectivul nostru este simplu:',
    introGoal1: 'să identificăm ce funcționează',
    introGoal2: 'să înțelegem nivelul nostru actual de maturitate',
    introGoal3: 'să accelerăm, în mod colectiv, modul în care folosim IA',
    introP2: 'Acesta nu este o evaluare individuală. Scopul este să reflecte realitatea din teren: practicile actuale, dificultățile întâlnite și oportunitățile existente.',
    introListLabel: 'Răspunsurile voastre ne vor ajuta să:',
    introList1: 'îmbunătățim instrumentele și suportul disponibile',
    introList2: 'împărtășim bune practici între echipe',
    introList3: 'prioritizăm acțiunile de formare și investițiile',
    introList4: 'evoluăm modelul nostru de delivery',
    introP3: 'Chestionarul durează doar câteva minute. Răspunsurile vor fi analizate în formă agregată.',
    introThanks: 'Vă mulțumim pentru contribuție.',
    allRequiredCompleted: 'Toate întrebările obligatorii au fost completate.',
    doneReadyToSubmit: 'Ai terminat — ești gata să trimiți răspunsurile.',
    questionsAnswered: 'Întrebări completate',
    submitHelper: 'Trimiterea durează câteva secunde.',
    thankYouTitle: 'Mulțumim',
    submittedSuccess: 'Răspunsul tău a fost trimis cu succes.',
    submittedSupport: 'Îți mulțumim că ți-ai făcut timp să completezi acest chestionar. Contribuția ta ne ajută să înțelegem mai bine cum este utilizată IA în organizație și unde putem îmbunătăți instrumentele, suportul și practicile.',
    submittedAggregated: 'Răspunsurile vor fi analizate în formă agregată.',
    submitAnother: 'Trimite un alt răspuns',
    advancedCalloutTitle: 'Păreți să fiți printre cei mai avansați utilizatori AI din organizație',
    advancedCalloutBody: 'Răspunsurile tale sugerează că folosești IA în moduri care depășesc norma — fluxuri autonome, utilizare zilnică intensă, câștiguri reale de productivitate. Am dori să luăm legătura cu tine, fie pentru a împărtăși practici, a co-construi instrumente interne sau a explora proiecte secundare. Dacă ești deschis, lasă-ți numele și emailul mai jos.',
    advancedCalloutName: 'Numele tău',
    advancedCalloutEmail: 'Emailul tău',
  }};

const L = (en, ro = en) => ({ en, ro });
const localize = (v, lang) => (typeof v === 'string' ? v : (v?.[lang] ?? v?.en ?? ''));

const standardProvisioningOptions = [
  { value: 'personally_chosen', label: L('Personally chosen / informal') },
  { value: 'team_standard', label: L('Team-standard tool') },
  { value: 'client_mandated', label: L('Client-mandated tool') },
  { value: 'enterprise_standard', label: L('Enterprise-standard tool') },
  { value: 'trial_experimental', label: L('Trial / experimental only') },
];
const frequencyScale = [
  { value: 'never', label: L('Never', 'Niciodată') },
  { value: 'rarely', label: L('Rarely', 'Rar') },
  { value: 'sometimes', label: L('Sometimes', 'Uneori') },
  { value: 'often', label: L('Often', 'Des') },
  { value: 'almost_always', label: L('Almost always', 'Aproape întotdeauna') },
];

const surveyConfig = {
  coreQuestions: [
    { id: 'q1_role', type: 'single_choice', required: true, label: L('What best describes your primary role in software delivery today?', 'Care dintre următoarele descrie cel mai bine rolul tău principal în livrarea software?'),
      helperText: L('Select the option that represents where you spend most of your time.', 'Alege opțiunea care reflectă majoritatea timpului tău.'),
      microcopy: L('Click the ⓘ for guidance', 'Apasă pe ⓘ pentru ghidaj'),
      tooltipTitle: L('Why are we asking this?', 'De ce punem această întrebare?'),
      tooltipBody: L('Your answer helps tailor the questionnaire to your role so that you only see the most relevant questions. It also helps us compare AI adoption patterns across different functions in the software delivery lifecycle.', 'Răspunsul tău ne ajută să adaptăm chestionarul la rolul tău, astfel încât să vezi doar întrebările cele mai relevante. De asemenea, ne ajută să comparăm modul în care IA este adoptată în diferite funcții din ciclul de livrare software.'),
      options: [
      { value: 'developer', label: L('Engineering / Development', 'Inginerie / Dezvoltare'), description: L('Examples: software engineer, backend/frontend developer, mobile developer, data engineer, DevOps, SRE, platform engineer, cloud / infrastructure, system / network / database, security engineer, application security, DevSecOps', 'Exemple: developer, inginer software, backend/frontend developer, mobile developer, data engineer, DevOps, SRE, platform engineer, cloud / infrastructură, sistem / rețea / baze de date, inginer de securitate, securitate aplicații, DevSecOps') },
      { value: 'qa_testing_quality', label: L('QA / Testing / Quality', 'QA / Testare / Calitate'), description: L('Examples: QA engineer, tester, validation engineer, test automation, quality engineering', 'Exemple: QA engineer, tester, inginer validare, automatizare teste, quality engineering') },
      { value: 'project_product_business_analysis_operations', label: L('Project / Product / Business Analysis / Operations', 'Proiect / Produs / Analiză de business / Operațiuni'), description: L('Examples: project manager, product owner, business analyst\ndata analyst, BI / analytics, operations / support, production monitoring, security governance, risk, compliance, audit', 'Exemple: project manager, product owner, business analyst\ndata analyst, BI / analytics, operațiuni / suport, monitorizare producție, guvernanță de securitate, risc, conformitate, audit') },
    ] },
    { id: 'q2_contract_model', type: 'single_choice', required: true, label: L('What best describes your current engagement model with your client?', 'Care descrie cel mai bine modelul de colaborare actual cu clientul tău?'),
      helperText: L('If unsure, select the option that best reflects how your work is organized or billed.', 'Dacă nu ești sigur, alege opțiunea care reflectă cel mai bine organizarea sau facturarea muncii tale.'),
      options: [
      { value: 'staff_augmentation', label: L('Staff augmentation (you work as part of the client’s team)', 'Staff augmentation (lucrezi în echipa clientului)') },
      { value: 'team_delivery', label: L('Team delivery (Digiterre / Ascendion provides a team to deliver a scope)', 'Livrare în echipă') },
      { value: 'fixed_price', label: L('Fixed-price project', 'Proiect cu preț fix') },
      { value: 'managed_services', label: L('Managed services (run / maintain systems)', 'Servicii gestionate') },
      { value: 'not_sure', label: L('Not sure', 'Nu sunt sigur') },
    ] },
    { id: 'q2_ai_usage', type: 'single_choice', required: true, label: L('How often do you use AI in your work, across any part of your job?', 'Cât de des folosești IA în activitatea ta?'), options: [
      { value: 'no_use', label: L('I do not use AI') },
      { value: 'few_times_per_week', label: L('I use it a few times per week', 'O folosesc de câteva ori pe săptămână') },
      { value: 'every_day', label: L('I use it every day', 'O folosesc în fiecare zi') },
      { value: 'many_times_per_day', label: L('I use it many times a day', 'O folosesc de mai multe ori pe zi') },
    ] },
    { id: 'q3_general_tools', type: 'multi_select', required: true, label: L('Which general-purpose AI tools do you currently use as part of your work?', 'Ce instrumente de IA cu uz general folosești în prezent în activitatea ta?'), options: [
      { value: 'chatgpt', label: L('ChatGPT') },
      { value: 'claude', label: L('Claude') },
      { value: 'microsoft_copilot', label: L('Microsoft Copilot') },
      { value: 'gemini', label: L('Gemini') },
      { value: 'perplexity', label: L('Perplexity') },
      { value: 'le_chat_mistral', label: L('Le Chat (Mistral)', 'Le Chat (Mistral)') },
      { value: 'client_internal_ai_tools', label: L('Client-provided internal AI tools', 'Instrumente interne de IA furnizate de client') },
      { value: 'other_general_ai_tools', label: L('Other general-purpose AI tools', 'Alte instrumente de IA cu uz general') },
      { value: 'no_general_ai_tools', label: L('I do not use general-purpose AI tools', 'Nu folosesc instrumente de IA cu uz general') },
    ] },
    { id: 'q4_productivity', type: 'single_choice', required: true, label: L('How much does AI improve your productivity?'), options: [
      { value: 'no_impact', label: L('No impact') },
      { value: 'moderate_improvement', label: L('Moderate improvement', 'Îmbunătățire moderată') },
      { value: 'significant_improvement', label: L('Significant improvement', 'Îmbunătățire semnificativă') },
      { value: 'rely_on_ai_for_workload', label: L('AI is essential to how I work', 'IA este esențială pentru modul în care lucrez') },
    ] },
    { id: 'q5_quality', type: 'single_choice', required: true, label: L('How much does AI improve the quality of your work output?', 'În ce măsură îți îmbunătățește IA calitatea rezultatelor muncii tale?'), options: [
      { value: 'no_impact', label: L('No impact') },
      { value: 'moderate_improvement', label: L('Moderate improvement', 'Îmbunătățire moderată') },
      { value: 'significant_improvement', label: L('Significant improvement', 'Îmbunătățire semnificativă') },
      { value: 'higher_quality_with_ai', label: L('AI is essential to achieving the quality level I expect', 'IA este esențială pentru a atinge nivelul de calitate pe care îl aştept') },
    ] },
    { id: 'q6_team_usage', type: 'single_choice', required: true, label: L('How is AI currently used within your team?', 'Cum este utilizată în prezent IA în cadrul echipei tale?'), options: [
      { value: 'individual_only', label: L('Individual use only', 'Utilizare individuală doar') },
      { value: 'informal_sharing', label: L('Team members share practices informally', 'Membrii echipei își împărtășesc practicile în mod informal') },
      { value: 'some_team_practices', label: L('Some team practices or guidelines are defined', 'Există anumite practici sau reguli de echipă definite') },
      { value: 'workflow_integrated', label: L('AI is integrated into team workflows', 'IA este integrată în fluxurile de lucru ale echipei') },
    ] },
    { id: 'q7_autonomy', type: 'single_choice', required: true, label: L('What is the highest level of AI autonomy you currently use in your work?', 'Care este cel mai ridicat nivel de autonomie pe care îl folosești în prezent cu IA în activitatea ta?'), options: [
      { value: 'suggests_only', label: L('AI provides suggestions only', 'IA oferă doar sugestii') },
      { value: 'generates_outputs', label: L('AI generates outputs for me to review', 'IA generează rezultate pe care le revizuiesc') },
      { value: 'executes_tasks_with_supervision', label: L('AI executes tasks under human supervision', 'IA execută sarcini sub supraveghere umană') },
      { value: 'runs_workflows_end_to_end', label: L('AI runs workflows end-to-end with minimal human intervention', 'IA rulează fluxuri de lucru cap-coadă cu intervenție umană minimă') },
    ] },
    { id: 'q8_async', type: 'single_choice', required: true, label: L('Can AI continue working on some tasks without your ongoing involvement?', 'Poate IA să continue să lucreze la anumite sarcini fără implicarea ta continuă?'), options: [
      { value: 'continuous_involvement_required', label: L('No, I need to stay involved throughout', 'Nu, trebuie să rămân implicat pe tot parcursul') },
      { value: 'partial_handoff', label: L('Partly, AI can handle parts of a task before needing my input again', 'IA poate gestiona părți dintr-o sarcină înainte de a avea din nou nevoie de intervenția mea') },
      { value: 'independent_tasks', label: L('Yes, for some tasks AI can continue until completion without me', 'Da, pentru unele sarcini IA poate continua până la final fără mine') },
    ] },
    { id: 'q9_measurement', type: 'single_choice', required: true, label: L('How do you currently measure the impact of AI in your work?', 'Cum măsori în prezent impactul IA în activitatea ta?'), options: [
      { value: 'no_measurement', label: L('It is not measured', 'Nu este măsurat') },
      { value: 'informal_tracking', label: L('It is tracked informally', 'Este urmărit informal') },
      { value: 'defined_metrics', label: L('It is measured with defined metrics', 'Este măsurat prin indicatori definiți') },
    ] },
    { id: 'q10_sdlc_usage', type: 'multi_select', required: true, label: L('In which parts of the software delivery lifecycle is AI currently used in your team or immediate work environment?', 'În ce părți ale ciclului de livrare software este utilizată în prezent IA în echipa ta sau în mediul tău imediat de lucru?'), options: [
      { value: 'requirements_business_analysis', label: L('Requirements / Business Analysis', 'Cerințe / Analiză de business') },
      { value: 'planning_coordination', label: L('Planning / Coordination', 'Planificare / Coordonare') },
      { value: 'coding_implementation', label: L('Coding / Implementation', 'Dezvoltare / Implementare') },
      { value: 'code_review', label: L('Code Review') },
      { value: 'testing_validation', label: L('Testing / Validation', 'Testare / Validare') },
      { value: 'debugging_troubleshooting', label: L('Debugging / Troubleshooting', 'Depanare / Rezolvare probleme') },
      { value: 'cicd_automation', label: L('CI/CD / Automation', 'CI/CD / Automatizare') },
      { value: 'deployment_release', label: L('Deployment / Release', 'Deployment / Lansare') },
      { value: 'production_operations', label: L('Production / Operations', 'Producție / Operațiuni') },
      { value: 'documentation_knowledge_sharing', label: L('Documentation / Knowledge Sharing', 'Documentație / Partajare de cunoștințe') },
    ] },
    { id: 'q11_learning_path', type: 'multi_select', required: true, label: L('How have you learned to use AI tools in your work so far?', 'Cum ai învățat până acum să folosești instrumentele IA în activitatea ta?'), options: [
      { value: 'no_learning_effort', label: L('I have not invested time in learning AI tools', 'Nu am investit timp pentru a învăța să folosesc instrumente IA') },
      { value: 'personal_projects', label: L('I learned mainly by using AI on personal projects', 'Am învățat în principal folosind IA în proiecte personale') },
      { value: 'self_directed_learning', label: L('I learned through tutorials, videos, or documentation', 'Am învățat prin tutoriale, videoclipuri sau documentație') },
      { value: 'structured_training', label: L('I followed structured training such as courses or internal programs', 'Am urmat formare structurată, cum ar fi cursuri sau programe interne') },
    ] },
    { id: 'q12_experimentation_level', type: 'single_choice', required: true, label: L('How far do you currently go in experimenting with AI in your work?', 'Cât de departe mergi în prezent cu experimentarea IA în activitatea ta?'), options: [
      { value: 'standard_usage', label: L('I mostly use standard features', 'Folosesc în principal funcțiile standard') },
      { value: 'occasional_experimentation', label: L('I occasionally try new ways of working with AI', 'Încerc ocazional noi moduri de lucru cu IA') },
      { value: 'regular_workflow_refinement', label: L('I regularly test and refine my prompts or workflows', 'Testez și îmbunătățesc regulat prompturile sau fluxurile de lucru') },
      { value: 'advanced_automation', label: L('I build or use advanced setups such as automation, agents, or reusable workflows', 'Construiesc sau folosesc configurații avansate precum automatizări, agenți sau fluxuri reutilizabile') },
    ] },
  ],
  branches: {
    developer: {
      title: L('Developer Questions'),
      questions: [
        { id: 'd1', type: 'single_choice', required: true, label: L('To what extent do you use AI for coding?', 'În ce măsură folosești IA pentru programare?'), options: [
          { value: 'not_used', label: L('Not used') }, { value: 'snippets_only', label: L('Snippets only') }, { value: 'functions_modules', label: L('Full functions or modules') }, { value: 'end_to_end_implementation', label: L('End-to-end implementation') },
        ] },
        { id: 'd2', type: 'single_choice', required: true, label: L('How often does AI help you understand unfamiliar code?'), options: [
          { value: 'never', label: L('Never') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'consistently', label: L('Consistently', 'În mod constant') },
        ] },
        { id: 'd3', type: 'single_choice', required: true, label: L('How does AI support refactoring in your work?'), options: [
          { value: 'not_used', label: L('Not used') }, { value: 'minor_edits', label: L('Minor edits') }, { value: 'significant_refactoring', label: L('Significant refactoring') }, { value: 'automated_refactoring_workflows', label: L('Automated refactoring workflows') },
        ] },
        { id: 'd4', type: 'single_choice', required: true, label: L('How often do you use AI in code review?'), options: [
          { value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematic_pr_review', label: L('Systematic part of PR review') },
        ] },
        { id: 'd5', type: 'multi_select', required: true, label: L('What do you use AI for in code review?'), options: [
          { value: 'detect_bugs', label: L('Detect bugs') }, { value: 'suggest_improvements', label: L('Suggest improvements') }, { value: 'enforce_standards', label: L('Enforce standards') }, { value: 'summarize_prs', label: L('Summarize PRs') },
        ] },
        { id: 'd6', type: 'single_choice', required: true, label: L('How often do you use AI to generate tests?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'd7', type: 'single_choice', required: true, label: L('How often does AI help you debug issues?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'first_reflex', label: L('It is my first reflex') }] },
        { id: 'd8', type: 'single_choice', required: true, label: L('How does AI help with CI/CD failures?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'suggests_fixes', label: L('It suggests fixes') }, { value: 'frequently_used', label: L('Frequently used for diagnosis or resolution') }, { value: 'automatically_resolves', label: L('Automatically resolves some issues') }] },
        { id: 'd9', type: 'single_choice', required: true, label: L('How are AI agents currently used in your development workflow?'), options: [{ value: 'none', label: L('Not used') }, { value: 'experimental', label: L('Experimental use only') }, { value: 'some_workflows', label: L('Used in some workflows') }, { value: 'core_workflow', label: L('A core part of the workflow') }] },
        { id: 'd10', type: 'multi_select', required: true, label: L('Which of the following can agents currently do in your development workflow?', 'Care dintre următoarele pot face în prezent agenții în fluxul tău de dezvoltare?'), options: [{ value: 'open_prs', label: L('Open PRs') }, { value: 'fix_bugs', label: L('Fix bugs') }, { value: 'refactor_code', label: L('Refactor code') }, { value: 'update_dependencies', label: L('Update dependencies') }, { value: 'maintain_documentation', label: L('Maintain documentation') }] },
        { id: 'd11', type: 'multi_select', required: true, label: L('Which AI coding tools or developer assistants do you currently use?', 'Ce instrumente de codare cu IA sau asistenți pentru dezvoltatori folosești în prezent?'),
          helperText: L('Please select the tools or products you use directly in your development workflow, not the underlying AI models.', 'Te rugăm să selectezi instrumentele sau produsele pe care le folosești direct în fluxul tău de dezvoltare, nu modelele IA care stau la bază.'),
          options: [
            { value: 'github_copilot_ide', label: L('GitHub Copilot (IDE)', 'GitHub Copilot (IDE)') },
            { value: 'github_coding_agent_cloud', label: L('GitHub Coding Agent (Cloud Agent)', 'GitHub Coding Agent (Cloud Agent)') },
            { value: 'github_code_review', label: L('GitHub Code Review', 'GitHub Code Review') },
            { value: 'claude_code', label: L('Claude Code', 'Claude Code') },
            { value: 'openai_codex', label: L('OpenAI Codex', 'OpenAI Codex') },
            { value: 'cursor', label: L('Cursor', 'Cursor') },
            { value: 'google_antigravity', label: L('Google Antigravity', 'Google Antigravity') },
            { value: 'amazon_q_developer', label: L('Amazon Q Developer', 'Amazon Q Developer') },
            { value: 'ibm_watsonx_code_assistant_z', label: L('IBM watsonx Code Assistant for Z', 'IBM watsonx Code Assistant for Z') },
            { value: 'replit_ai', label: L('Replit AI', 'Replit AI') },
            { value: 'v0_vercel', label: L('v0 by Vercel', 'v0 by Vercel') },
            { value: 'jetbrains_ai_assistant', label: L('JetBrains AI Assistant', 'JetBrains AI Assistant') },
            { value: 'tabnine', label: L('Tabnine', 'Tabnine') },
            { value: 'mistral_code', label: L('Mistral Code', 'Mistral Code') },
            { value: 'other_developer_ai_tools', label: L('Other developer AI tools', 'Alte instrumente IA pentru dezvoltare') },
            { value: 'no_coding_agents', label: L('I don’t use coding agents', 'Nu folosesc agenți de codare') },
          ] },
        { id: 'd12', type: 'multi_select', required: true, label: L('How are these AI coding tools adopted in your environment?', 'Cum sunt adoptate aceste instrumente de codare cu IA în mediul tău?'), options: [
          { value: 'personally_chosen', label: L('Some are chosen individually', 'Unele sunt alese individual') },
          { value: 'informal_team_use', label: L('Some are used informally within the team', 'Unele sunt folosite informal în cadrul echipei') },
          { value: 'team_or_project_standard', label: L('Some are standardized at team or project level', 'Unele sunt standardizate la nivel de echipă sau proiect') },
          { value: 'client_mandated', label: L('Some are mandated by the client', 'Unele sunt impuse de client') },
          { value: 'company_standard', label: L('Some are standardized at company level', 'Unele sunt standardizate la nivelul companiei') },
          { value: 'trial_experimental', label: L('Some are still in trial or experimental use', 'Unele sunt încă în fază de test sau utilizare experimentală') },
        ] },
      ],
    },
    qa_testing_quality: {
      title: L('QA Automation / Testing / Release Quality Questions', 'Întrebări QA Automation / Testare / Calitatea release-ului'),
      questions: [
        { id: 'branch2_toolbox', type: 'multi_select', required: true, label: L('Which QA automation and testing tools are part of your current day-to-day toolbox?', 'Ce instrumente de automatizare QA și testare fac parte din setul vostru de instrumente folosit zi de zi?'),
          helperText: L('Select all that apply', 'Selectați toate variantele care se aplică'),
          options: [
            { value: 'playwright', label: L('Playwright', 'Playwright') },
            { value: 'cypress', label: L('Cypress', 'Cypress') },
            { value: 'selenium_webdriver', label: L('Selenium WebDriver', 'Selenium WebDriver') },
            { value: 'appium', label: L('Appium', 'Appium') },
            { value: 'postman', label: L('Postman', 'Postman') },
            { value: 'rest_assured', label: L('REST Assured', 'REST Assured') },
            { value: 'soapui', label: L('SoapUI', 'SoapUI') },
            { value: 'junit', label: L('JUnit', 'JUnit') },
            { value: 'testng', label: L('TestNG', 'TestNG') },
            { value: 'pytest', label: L('PyTest', 'PyTest') },
            { value: 'mocha', label: L('Mocha', 'Mocha') },
            { value: 'jest', label: L('Jest', 'Jest') },
            { value: 'cucumber', label: L('Cucumber', 'Cucumber') },
            { value: 'jenkins', label: L('Jenkins', 'Jenkins') },
            { value: 'github_actions', label: L('GitHub Actions', 'GitHub Actions') },
            { value: 'gitlab_ci', label: L('GitLab CI', 'GitLab CI') },
            { value: 'circleci', label: L('CircleCI', 'CircleCI') },
            { value: 'docker', label: L('Docker', 'Docker') },
            { value: 'browserstack', label: L('BrowserStack', 'BrowserStack') },
            { value: 'sauce_labs', label: L('Sauce Labs', 'Sauce Labs') },
            { value: 'aws_device_farm', label: L('AWS Device Farm', 'AWS Device Farm') },
            { value: 'applitools', label: L('Applitools', 'Applitools') },
            { value: 'percy', label: L('Percy', 'Percy') },
            { value: 'backstopjs', label: L('BackstopJS', 'BackstopJS') },
            { value: 'jmeter', label: L('JMeter', 'JMeter') },
            { value: 'k6', label: L('k6', 'k6') },
            { value: 'gatling', label: L('Gatling', 'Gatling') },
            { value: 'tricentis_neoload', label: L('Tricentis NeoLoad', 'Tricentis NeoLoad') },
            { value: 'katalon', label: L('Katalon', 'Katalon') },
            { value: 'testsigma', label: L('Testsigma', 'Testsigma') },
            { value: 'accelq', label: L('ACCELQ', 'ACCELQ') },
            { value: 'mabl', label: L('mabl', 'mabl') },
            { value: 'tricentis_tosca', label: L('Tricentis Tosca', 'Tricentis Tosca') },
            { value: 'uipath_test_suite_cloud', label: L('UiPath Test Suite / Test Cloud', 'UiPath Test Suite / Test Cloud') },
            { value: 'other_qa_automation_testing_tools', label: L('Other QA automation / testing tools', 'Alte instrumente de automatizare QA / testare') },
            { value: 'do_not_work_directly_with_tools', label: L('I do not work directly with these tools', 'Nu lucrez direct cu aceste instrumente') },
          ] },
        { id: 'branch2_ai_tools', type: 'multi_select', required: true, label: L('Which AI-enabled tools or platforms do you currently use in your QA automation workflow?', 'Ce instrumente sau platforme cu capabilități AI folosiți în prezent în fluxul vostru de automatizare QA?'),
          helperText: L('Select all that apply', 'Selectați toate variantele care se aplică'),
          options: [
            { value: 'github_copilot', label: L('GitHub Copilot', 'GitHub Copilot') },
            { value: 'github_copilot_workspace_coding_agent', label: L('GitHub Copilot Workspace / Coding Agent', 'GitHub Copilot Workspace / Coding Agent') },
            { value: 'claude_claude_code', label: L('Claude / Claude Code', 'Claude / Claude Code') },
            { value: 'openai_chatgpt_codex', label: L('OpenAI / ChatGPT / Codex', 'OpenAI / ChatGPT / Codex') },
            { value: 'cursor', label: L('Cursor', 'Cursor') },
            { value: 'katalon_ai_features', label: L('Katalon AI features', 'Funcționalități AI Katalon') },
            { value: 'testsigma_ai_features', label: L('Testsigma AI features', 'Funcționalități AI Testsigma') },
            { value: 'accelq_ai_features', label: L('ACCELQ AI features', 'Funcționalități AI ACCELQ') },
            { value: 'mabl_ai_features', label: L('mabl AI features', 'Funcționalități AI mabl') },
            { value: 'tricentis_tosca_ai_capabilities', label: L('Tricentis Tosca AI capabilities', 'Capabilități AI Tricentis Tosca') },
            { value: 'uipath_ai_autopilot_testing', label: L('UiPath AI / Autopilot for testing', 'UiPath AI / Autopilot for testing') },
            { value: 'applitools_visual_ai', label: L('Applitools Visual AI', 'Applitools Visual AI') },
            { value: 'kaneai_testmu_ai', label: L('KaneAI / TestMu AI', 'KaneAI / TestMu AI') },
            { value: 'browserstack_ai_features', label: L('BrowserStack AI features', 'Funcționalități AI BrowserStack') },
            { value: 'other_ai_tools_for_qa_automation', label: L('Other AI tools used for QA automation', 'Alte instrumente AI folosite pentru automatizare QA') },
            { value: 'do_not_use_ai_tools_in_qa_workflow', label: L('I do not currently use AI tools in my QA workflow', 'În prezent nu folosesc instrumente AI în fluxul meu QA') },
          ] },
        { id: 'branch2_ai_usage_modes', type: 'multi_select', required: true, maxSelections: 3, label: L('How are these AI tools most commonly used in your QA automation workflow today?', 'Cum sunt folosite cel mai des aceste instrumente AI astăzi în fluxul vostru de automatizare QA?'),
          helperText: L('Select up to 3', 'Selectați maximum 3 variante'),
          options: [
            { value: 'requirements_to_test_scenarios', label: L('Turn requirements or acceptance criteria into test scenarios', 'Transformarea cerințelor sau criteriilor de acceptare în scenarii de test') },
            { value: 'generate_test_code', label: L('Generate test code', 'Generarea de cod de test') },
            { value: 'update_or_maintain_tests', label: L('Update or maintain existing automated tests', 'Actualizarea sau mentenanța testelor automate existente') },
            { value: 'diagnose_flaky_tests', label: L('Diagnose flaky tests', 'Diagnosticarea testelor instabile (flaky)') },
            { value: 'analyze_cicd_test_failures', label: L('Analyze CI/CD test failures', 'Analiza eșecurilor de teste din CI/CD') },
            { value: 'identify_coverage_gaps_or_edge_cases', label: L('Identify missing coverage or edge cases', 'Identificarea lipsurilor de acoperire sau a cazurilor limită') },
            { value: 'summarize_test_results_or_quality_reports', label: L('Summarize test results or quality reports', 'Rezumarea rezultatelor testelor sau a rapoartelor de calitate') },
            { value: 'support_release_readiness_or_quality_gates', label: L('Support release readiness or quality gate decisions', 'Sprijin pentru deciziile de release readiness sau quality gates') },
            { value: 'bounded_generate_test_fix_rerun_loops', label: L('Run bounded generate-test-fix-rerun loops', 'Rularea unor bucle controlate de tip generează-testează-corectează-rulează din nou') },
            { value: 'experimentation_only', label: L('Experimentation only, not part of the real workflow', 'Doar experimentare, fără integrare în fluxul real de lucru') },
            { value: 'do_not_use_ai_in_qa_automation', label: L('I do not currently use AI in QA automation', 'În prezent nu folosesc AI în automatizarea QA') },
          ] },
        { id: 'branch2_req_to_tests_frequency', type: 'single_choice', required: true, label: L('When working from requirements, user stories, or acceptance criteria, how often do you use AI to turn them into executable test scenarios or test cases?', 'Când porniți de la cerințe, user stories sau criterii de acceptare, cât de des folosiți AI pentru a le transforma în scenarii de test executabile sau cazuri de test?'), options: frequencyScale },
        { id: 'branch2_test_generation_frequency', type: 'single_choice', required: true, label: L('When adding or expanding automated coverage, how often do you use AI to generate or draft test code (UI, API, or integration tests)?', 'Când adăugați sau extindeți acoperirea automată, cât de des folosiți AI pentru a genera sau redacta cod de test (UI, API sau teste de integrare)?'), options: frequencyScale },
        { id: 'branch2_test_maintenance_frequency', type: 'single_choice', required: true, label: L('How often do you use AI to maintain existing automated tests (for example: updating selectors, adjusting assertions, adapting to UI/API changes, or refactoring brittle tests)?', 'Cât de des folosiți AI pentru mentenanța testelor automate existente (de exemplu: actualizarea selectorilor, ajustarea aserțiunilor, adaptarea la schimbări UI/API sau refactorizarea testelor fragile)?'), options: frequencyScale },
        { id: 'branch2_flaky_diagnosis_frequency', type: 'single_choice', required: true, label: L('When a test becomes flaky or unstable, how often do you use AI to help diagnose the cause and propose a fix?', 'Când un test devine instabil (flaky), cât de des folosiți AI pentru a ajuta la diagnosticarea cauzei și la propunerea unei remedieri?'), options: frequencyScale },
        { id: 'branch2_coverage_gaps_frequency', type: 'single_choice', required: true, label: L('How often do you use AI to identify missing coverage, edge cases, or risk areas that are not yet covered by your automated test suites?', 'Cât de des folosiți AI pentru a identifica lipsuri de acoperire, cazuri limită sau zone de risc care nu sunt încă acoperite de suitele voastre de teste automate?'), options: frequencyScale },
        { id: 'branch2_agentic_loop_frequency', type: 'single_choice', required: true, label: L('How often do you use AI in an iterative loop for bounded QA tasks (for example: generate or update a test, run it, inspect failures, revise, and rerun until green or escalation)?', 'Cât de des folosiți AI într-o buclă iterativă pentru sarcini QA bine delimitate (de exemplu: generați sau actualizați un test, îl rulați, inspectați eșecurile, revizuiți și rulați din nou până ajunge verde sau este nevoie de escaladare)?'), options: frequencyScale },
        { id: 'branch2_release_readiness_frequency', type: 'single_choice', required: true, label: L('When preparing a release or evaluating quality gates, how often do you use AI to summarize test outcomes, highlight regressions or risks, and support readiness decisions?', 'Atunci când pregătiți un release sau evaluați quality gates, cât de des folosiți AI pentru a rezuma rezultatele testelor, a evidenția regresiile sau riscurile și a sprijini deciziile de readiness?'), options: frequencyScale },
      ],
    },
    project_product_business_analysis_operations: {
      title: L('Project / Product / Business Analysis / Operations Questions'),
      questions: [
        { id: 'ppo1', type: 'single_choice', required: true, label: L('How often do you use AI to help with requirements or user stories?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'ppo2', type: 'single_choice', required: true, label: L('How often does AI support planning or task breakdown?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'ppo3', type: 'single_choice', required: true, label: L('How often does AI help summarize team activity?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'ppo4', type: 'single_choice', required: true, label: L('How often does AI help generate reports or status updates?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'ppo5', type: 'single_choice', required: true, label: L('How often does AI help identify risks or delays?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'ppo6', type: 'single_choice', required: true, label: L('How often does AI help prioritize work or backlog items?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'ppo7', type: 'single_choice', required: true, label: L('How often does AI help maintain project or technical documentation?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'ppo8', type: 'single_choice', required: true, label: L('How often does AI help analyze incidents or production issues?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'ppo9', type: 'single_choice', required: true, label: L('How often does AI help interpret logs, metrics, or alerts?'), options: [{ value: 'not_used', label: L('Not used') }, { value: 'occasionally', label: L('Occasionally') }, { value: 'frequently', label: L('Frequently') }, { value: 'systematically', label: L('Systematically') }] },
        { id: 'ppo10', type: 'multi_select', required: true, label: L('How is AI used in your project / product / operations workflow?'), options: [{ value: 'automate_reporting', label: L('Automate reporting') }, { value: 'suggest_actions', label: L('Suggest actions') }, { value: 'assist_incident_response', label: L('Assist incident response') }, { value: 'improve_workflows', label: L('Improve workflows') }] },
        { id: 'ppo11', type: 'multi_select', required: true, label: L('Which project / product / operations AI solutions do you currently use?'), options: [{ value: 'jira_rovo', label: L('Jira + Rovo') }, { value: 'jira_service_management_ai', label: L('Jira Service Management AI / Rovo') }, { value: 'servicenow_now_assist', label: L('ServiceNow Now Assist') }, { value: 'servicenow_ai_agents', label: L('ServiceNow AI Agents') }, { value: 'asana_ai', label: L('Asana AI') }, { value: 'microsoft_copilot_m365', label: L('Microsoft Copilot for Microsoft 365') }, { value: 'other_project_ops_ai_tools', label: L('Other project / ops AI tools') }, { value: 'no_specific_project_ops_tool', label: L('No specific project / ops AI tool') }] },
        { id: 'ppo12', type: 'single_choice', required: true, label: L('How are these project / product / operations AI tools provided in your environment?'), options: standardProvisioningOptions },
      ],
    },
  },
  finalOptionalComment: {
    id: 'comment1',
    type: 'free_text',
    required: false,
    label: L('Any additional comments or tools to mention? (optional)', 'Comentarii suplimentare sau instrumente de menționat? (opțional)'),
    placeholder: L('Share anything else you think is useful', 'Împărtășește orice alt lucru pe care îl consideri util'),
  },
};

const roQuestionLabels = {
  q1_role: 'Care dintre următoarele descrie cel mai bine rolul tău?',
  q2_ai_usage: 'Cât de des folosești IA în activitatea ta?',
  q3_general_tools: 'Ce instrumente IA generale folosești în prezent în activitatea ta?',
  q4_productivity: 'În ce măsură îți îmbunătățește IA productivitatea?',
  q5_quality: 'În ce măsură îți îmbunătățește IA calitatea rezultatelor muncii tale?',
  q6_team_usage: 'Cum este utilizată în prezent IA în cadrul echipei tale?',
  q7_autonomy: 'Care este cel mai ridicat nivel de autonomie pe care îl folosești în prezent cu IA în activitatea ta?',
  q8_async: 'Poate IA să continue să lucreze la anumite sarcini fără implicarea ta continuă?',
  q9_measurement: 'Cum măsori în prezent impactul IA în activitatea ta?',
  q10_sdlc_usage: 'În ce părți ale ciclului de livrare software este utilizată în prezent IA în echipa ta sau în mediul tău imediat de lucru?',
  q11_learning_path: 'Cum ai învățat până acum să folosești instrumentele IA în activitatea ta?',
  q12_experimentation_level: 'Cât de departe mergi în prezent cu experimentarea IA în activitatea ta?',
};

const roOptionLabels = {
  developer: 'Dezvoltator', qa_testing_quality: 'QA / Testare / Calitate', project_product_business_analysis_operations: 'Proiect / Produs / Analiză Business / Operațiuni',
  no_use: 'Nu folosesc IA', occasional: 'Ocazional', regular: 'În mod regulat', most_tasks: 'În majoritatea sarcinilor mele', few_times_per_week: 'O folosesc de câteva ori pe săptămână', every_day: 'O folosesc în fiecare zi', many_times_per_day: 'O folosesc de mai multe ori pe zi',
  le_chat_mistral: 'Le Chat (Mistral)', client_internal_ai_tools: 'Instrumente interne de IA furnizate de client', other_general_ai_tools: 'Alte instrumente de IA cu uz general', no_general_ai_tools: 'Nu folosesc instrumente de IA cu uz general', no_impact: 'Fără impact', slight: 'Impact redus', moderate: 'Impact moderat', significant: 'Impact semnificativ', moderate_improvement: 'Îmbunătățire moderată', significant_improvement: 'Îmbunătățire semnificativă', rely_on_ai_for_workload: 'IA este esențială pentru modul în care lucrez', higher_quality_with_ai: 'IA este esențială pentru a atinge nivelul de calitate pe care îl aştept',
  individual_only: 'Utilizare individuală doar', informal_sharing: 'Membrii echipei își împărtășesc practicile în mod informal', some_team_practices: 'Există anumite practici sau reguli de echipă definite', workflow_integrated: 'IA este integrată în fluxurile de lucru ale echipei', fully_integrated: 'Complet integrată',
  suggests_only: 'IA oferă doar sugestii', generates_outputs: 'IA generează rezultate pe care le revizuiesc', executes_tasks_with_supervision: 'IA execută sarcini sub supraveghere umană', runs_workflows_end_to_end: 'IA rulează fluxuri de lucru cap-coadă cu intervenție umană minimă', executes_with_supervision: 'Execută cu supraveghere', runs_workflows: 'Rulează fluxuri complete',
  continuous_involvement_required: 'Nu, trebuie să rămân implicat pe tot parcursul', partial_handoff: 'Parțial, IA poate gestiona părți dintr-o sarcină înainte de a avea din nou nevoie de intervenția mea', independent_tasks: 'Da, pentru unele sarcini IA poate continua până la final fără mine', no: 'Nu', limited_async: 'Limitat', yes_independent: 'Da', no_measurement: 'Nu este măsurat', informal_tracking: 'Este urmărit informal', defined_metrics: 'Este măsurat prin indicatori definiți',
  requirements_business_analysis: 'Cerințe / Analiză de business', planning_coordination: 'Planificare / Coordonare', coding_implementation: 'Dezvoltare / Implementare', code_review: 'Revizuire de cod', testing_validation: 'Testare / Validare', debugging_troubleshooting: 'Depanare / Rezolvare probleme', cicd_automation: 'CI/CD / Automatizare', deployment_release: 'Deployment / Lansare', production_operations: 'Producție / Operațiuni', documentation_knowledge_sharing: 'Documentație / Partajare de cunoștințe', requirements_specs: 'Cerințe', planning_project_management: 'Planificare', coding: 'Dezvoltare', testing: 'Testare', debugging: 'Depanare', deployment: 'Implementare', documentation: 'Documentație',
  no_learning_effort: 'Nu am investit timp pentru a învăța să folosesc instrumente IA', personal_projects: 'Am învățat în principal folosind IA în proiecte personale', informal_learning: 'Am învățat în principal informal, prin încercări și erori', self_directed_learning: 'Am învățat prin tutoriale, videoclipuri sau documentație', structured_training: 'Am urmat formare structurată, cum ar fi cursuri sau programe interne', standard_usage: 'Folosesc în principal funcțiile standard', occasional_experimentation: 'Încerc ocazional noi moduri de lucru cu IA', regular_workflow_refinement: 'Testez și îmbunătățesc regulat prompturile sau fluxurile de lucru', advanced_automation: 'Construiesc sau folosesc configurații avansate precum automatizări, agenți sau fluxuri reutilizabile', no_effort: 'Fără efort', ad_hoc_learning: 'Învățare informală', self_learning: 'Auto-învățare', structured_learning: 'Formare structurată', advanced_usage: 'Utilizare avansată'
};


function enrichLabels() {
  const all = [...surveyConfig.coreQuestions, ...Object.values(surveyConfig.branches).flatMap((b) => b.questions), surveyConfig.finalOptionalComment];
  all.forEach((q) => {
    q.label = {en: q.label.en,
ro: roQuestionLabels[q.id] || q.label.ro || q.label.en};
    if (q.helperText) q.helperText = {en: q.helperText.en,
ro: q.helperText.ro || q.helperText.en};
    if (q.microcopy) q.microcopy = {en: q.microcopy.en,
ro: q.microcopy.ro || q.microcopy.en};
    if (q.tooltipTitle) q.tooltipTitle = {en: q.tooltipTitle.en,
ro: q.tooltipTitle.ro || q.tooltipTitle.en};
    if (q.tooltipBody) q.tooltipBody = {en: q.tooltipBody.en,
ro: q.tooltipBody.ro || q.tooltipBody.en};
    if (q.placeholder) q.placeholder = {en: q.placeholder.en,
ro: q.placeholder.ro || q.placeholder.en};
    if (q.options) q.options.forEach((o) => {
      o.label = {en: o.label.en,
ro: roOptionLabels[o.value] || o.label.ro || o.label.en};
      if (o.description) o.description = {en: o.description.en,
ro: o.description.ro || o.description.en};
    });
  });
  Object.values(surveyConfig.branches).forEach((b) => {
    b.title = {en: b.title.en,
ro: b.title.ro || b.title.en};
  });
}
enrichLabels();

const isAnswered = (q, v) => !q.required || q.type === 'free_text' || (q.type === 'multi_select' ? Array.isArray(v) && v.length > 0 : Boolean(v));

const isAdvancedUser = (answers) => {
  let signals = 0;
  if (answers.q2_ai_usage === 'many_times_per_day') signals++;
  if (answers.q7_autonomy === 'runs_workflows_end_to_end' || answers.q7_autonomy === 'executes_tasks_with_supervision') signals++;
  if (answers.q4_productivity === 'rely_on_ai_for_workload') signals++;
  return signals >= 2;
};
// Matches both common Apps Script Web App hosts and URL shapes:
// - https://script.google.com/macros/s/.../exec
// - https://script.googleusercontent.com/.../macros/s/.../exec
const isGoogleAppsScriptUrl = (url) => /https:\/\/script\.google(?:usercontent)?\.com\/(?:.*\/)?macros\/s\//.test(url);
const SURVEY_VERSION = '2026-04';
const SOURCE_APP = 'agentic-sdlc-survey';
const PLACEHOLDER_AZURE_KEY_PATTERNS = ['REPLACE_WITH_CURRENT_FUNCTION_KEY', 'REPLACE_WITH_KEY', '<REAL_FUNCTION_KEY>'];

const sanitizeAzureSubmitUrl = (rawUrl) => {
  const url = (rawUrl || '').trim();
  if (!url) return '';
  if (PLACEHOLDER_AZURE_KEY_PATTERNS.some((token) => url.includes(token))) return '';
  return url;
};

const getRuntimeConfig = () => {
  const appConfig = (typeof window !== 'undefined' && window.__APP_CONFIG__) || {};
  const metaContent = (name) => (typeof document !== 'undefined'
    ? (document.querySelector(`meta[name=\"${name}\"]`)?.content || '').trim()
    : '');
  const inferredEnv = (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) ? 'dev' : 'prod';
  const rawAzureSurveySubmitUrl = appConfig.azureSurveySubmitUrl || metaContent('azure-survey-submit-url') || '';
  const azureSurveySubmitUrl = sanitizeAzureSubmitUrl(rawAzureSurveySubmitUrl);
  if (rawAzureSurveySubmitUrl && !azureSurveySubmitUrl) {
    console.warn('[Survey][Azure] Invalid runtime URL (placeholder detected), skipping Azure submission until a real function key is configured.');
  }
  return {
    azureSurveySubmitUrl,
    sourceEnv: appConfig.sourceEnv || metaContent('app-source-env') || inferredEnv,
  };
};

const startupRuntimeConfig = getRuntimeConfig();
console.log('[Survey][Config]', {
  azureSurveySubmitUrl: startupRuntimeConfig.azureSurveySubmitUrl,
  sourceEnv: startupRuntimeConfig.sourceEnv,
});

const generateClientSubmissionId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `sub_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const toSheetSubmissionFields = (payload) => ({
  // Compatibility keys for legacy Apps Script projects (e.g., fixed `getHeaders()` layouts).
  timestamp: payload.submittedAt || new Date().toISOString(),
  societe: payload?.metadata?.teamName || '',
  poste: [payload.role, payload.branch].filter(Boolean).join(' / '),
  nom: payload?.metadata?.respondent || '',
  client_submission_id: payload.clientSubmissionId || '',

  // Survey-native keys for the dedicated Agentic SDLC sheet script.
  payload_json: JSON.stringify(payload),
  role: payload.role || '',
  branch: payload.branch || '',
  contract_model: payload.contractModel || '',
  submitted_at: payload.submittedAt || '',
  survey_date: payload?.metadata?.surveyDate || '',
  team_name: payload?.metadata?.teamName || '',
  respondent: payload?.metadata?.respondent || '',
  comment: payload.comment || '',
  core_answers_json: JSON.stringify(payload.coreAnswers || {}),
  branch_answers_json: JSON.stringify(payload.branchAnswers || {}),
  contact_name: payload.contactName || '',
  contact_email: payload.contactEmail || '',
});

const postToGoogleAppsScript = (url, payload) => new Promise((resolve, reject) => {
  try {
    const fields = toSheetSubmissionFields(payload);
    const targetName = `gas_target_${Date.now()}`;
    const iframe = document.createElement('iframe');
    iframe.name = targetName;
    iframe.style.display = 'none';

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = targetName;
    form.style.display = 'none';

    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value == null ? '' : String(value);
      form.appendChild(input);
    });

    // Primary: form POST (CORS-safe, no preflight)
    document.body.appendChild(iframe);
    document.body.appendChild(form);
    form.submit();

    setTimeout(() => {
      try {
        form.remove();
        iframe.remove();
      } catch {}
      resolve();
    }, 1200);
  } catch (error) {
    reject(error);
  }
});

const buildAzureSurveyPayload = ({ payload, language, sourceEnv, clientSubmissionId }) => ({
  clientSubmissionId,
  surveyVersion: SURVEY_VERSION,
  clientSubmittedAt: payload.submittedAt,
  language,
  role: payload.role,
  branch: payload.branch,
  contractModel: payload.contractModel,
  coreAnswers: payload.coreAnswers,
  branchAnswers: payload.branchAnswers,
  comment: payload.comment || '',
  teamName: payload.metadata?.teamName || null,
  respondent: payload.metadata?.respondent || null,
  contactName: payload.contactName || null,
  contactEmail: payload.contactEmail || null,
  sourceApp: SOURCE_APP,
  sourceEnv,
});

const submitSurveyToAzure = async (azureUrl, azurePayload) => {
  const response = await fetch(azureUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(azurePayload),
  });
  if (!response.ok) throw new Error(`Azure HTTP ${response.status}`);
  return { status: response.status };
};

function App() {
  const [lang, setLang] = useState('en');
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [endpoint, setEndpoint] = useState('');
  const [meta, setMeta] = useState(DEFAULT_META());
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [hasHydrated, setHasHydrated] = useState(false);
  const [resumeCandidate, setResumeCandidate] = useState(null);
  const [needsDraftDecision, setNeedsDraftDecision] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      setHasHydrated(true);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      const savedLang = (parsed.language || parsed.lang) === 'ro' ? 'ro' : 'en';
      setLang(savedLang);
      const lastUpdated = parsed.lastUpdatedAt || parsed.startedAt;
      const draftAge = lastUpdated ? Date.now() - new Date(lastUpdated).getTime() : Number.POSITIVE_INFINITY;
      const isSubmitted = Boolean(parsed.submitted);
      const isFresh = Number.isFinite(draftAge) && draftAge >= 0 && draftAge <= DRAFT_TTL_MS;
      const hasProgress = Boolean(
        parsed?.answers && Object.keys(parsed.answers).length > 0
      ) || (parsed.index || 0) > 0;

      if (isSubmitted || !isFresh || !hasProgress) {
        localStorage.removeItem(STORAGE_KEY);
        setHasHydrated(true);
        return;
      }

      setResumeCandidate(parsed);
      setNeedsDraftDecision(true);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setHasHydrated(true);
  }, []);

  const startNewResponse = () => {
    setAnswers({});
    setIndex(0);
    setStatus('idle');
    setError('');
    setTooltipOpen(false);
    setEndpoint('');
    setMeta(DEFAULT_META());
    setContactName('');
    setContactEmail('');
    setNeedsDraftDecision(false);
    setResumeCandidate(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resumePreviousResponse = () => {
    if (!resumeCandidate) return;
    setLang((resumeCandidate.language || resumeCandidate.lang) === 'ro' ? 'ro' : 'en');
    setAnswers(resumeCandidate.answers || {});
    setIndex(resumeCandidate.currentStep ?? resumeCandidate.index ?? 0);
    setEndpoint(resumeCandidate.endpoint || '');
    setMeta(resumeCandidate.meta || DEFAULT_META());
    setNeedsDraftDecision(false);
    setResumeCandidate(null);
  };

  useEffect(() => {
    if (!hasHydrated || needsDraftDecision || status === 'success') return;
    const nowIso = new Date().toISOString();
    const existing = (() => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      } catch {
        return {};
      }
    })();
    const startedAt = existing.startedAt || nowIso;
    const draft = {
      version: DRAFT_VERSION,
      startedAt,
      lastUpdatedAt: nowIso,
      submitted: false,
      role: answers.q1_role || null,
      branch: answers.q1_role || null,
      language: lang,
      answers,
      currentStep: index,
      endpoint,
      meta,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [lang, answers, index, endpoint, meta, hasHydrated, needsDraftDecision, status]);

  const t = uiText[lang];
  const branchKey = answers.q1_role || null;
  const branchDef = branchKey ? surveyConfig.branches[branchKey] : null;

  const flow = useMemo(() => {
    const core = surveyConfig.coreQuestions.map((q) => ({ ...q, section: t.coreSection, sectionType: 'core' }));
    if (!branchDef) return core;
    const transition = { id: 'branch_transition', type: 'transition', required: false, section: t.transitionTitle, sectionType: 'transition' };
    const branch = branchDef.questions.map((q) => ({ ...q, section: localize(branchDef.title, lang), sectionType: 'branch' }));
    return [...core, transition, ...branch, { ...surveyConfig.finalOptionalComment, section: t.finalSection, sectionType: 'final' }];
  }, [branchDef, lang]);

  const current = flow[index];
  const isFinalStep = current?.id === 'comment1';
  const requiredCount = flow.filter((q) => q.required).length;
  const requiredAnswered = flow.filter((q) => q.required).filter((q) => isAnswered(q, answers[q.id])).length;
  const progress = flow.length ? Math.round((Math.min(index + 1, flow.length) / flow.length) * 100) : 0;

  const setSingle = (id, value) => setAnswers((prev) => {
    const next = { ...prev, [id]: value };
    if (id === 'q1_role') {
      Object.entries(surveyConfig.branches).forEach(([k, b]) => { if (k !== value) b.questions.forEach((q) => delete next[q.id]); });
      delete next.comment1;
    }
    return next;
  });

  const toggleMulti = (id, value) => setAnswers((prev) => {
    const existing = Array.isArray(prev[id]) ? prev[id] : [];
    if (id === 'q3_general_tools' || id === 'q11_learning_path' || id === 'd11' || id === 'branch2_toolbox' || id === 'branch2_ai_tools' || id === 'branch2_ai_usage_modes') {
      const exclusiveValue = id === 'q3_general_tools'
        ? 'no_general_ai_tools'
        : (id === 'q11_learning_path'
          ? 'no_learning_effort'
          : (id === 'd11'
            ? 'no_coding_agents'
            : (id === 'branch2_toolbox'
              ? 'do_not_work_directly_with_tools'
              : (id === 'branch2_ai_tools'
                ? 'do_not_use_ai_tools_in_qa_workflow'
                : 'do_not_use_ai_in_qa_automation'))));
      if (value === exclusiveValue) {
        return { ...prev, [id]: existing.includes(value) ? [] : [exclusiveValue] };
      }
      const withoutNoTools = existing.filter((x) => x !== exclusiveValue);
      const branch2UsageWithCap = id === 'branch2_ai_usage_modes' && !withoutNoTools.includes(value) && withoutNoTools.length >= 3;
      if (branch2UsageWithCap) return prev;
      return { ...prev, [id]: withoutNoTools.includes(value) ? withoutNoTools.filter((x) => x !== value) : [...withoutNoTools, value] };
    }
    if (id === 'branch2_ai_usage_modes' && !existing.includes(value) && existing.length >= 3) return prev;
    return { ...prev, [id]: existing.includes(value) ? existing.filter((x) => x !== value) : [...existing, value] };
  });

  const next = () => {
    setError('');
    setTooltipOpen(false);
    if (current && !isAnswered(current, answers[current.id])) return setError(t.requiredError);
    setIndex((i) => Math.min(i + 1, Math.max(0, flow.length - 1)));
  };

  const submit = async () => {
    if (!branchKey || flow.filter((q) => q.required).some((q) => !isAnswered(q, answers[q.id]))) return setError(t.incompleteError);

    const coreAnswers = {};
    surveyConfig.coreQuestions.forEach((q) => coreAnswers[q.id] = answers[q.id] ?? (q.type === 'multi_select' ? [] : null));
    const branchAnswers = {};
    if (branchDef) branchDef.questions.forEach((q) => branchAnswers[q.id] = answers[q.id] ?? (q.type === 'multi_select' ? [] : null));

    const clientSubmissionId = generateClientSubmissionId();
    const payload = {
      clientSubmissionId,
      role: answers.q1_role || null,
      contractModel: answers.q2_contract_model || null,
      coreAnswers,
      branch: branchKey,
      branchAnswers,
      comment: answers.comment1 || '',
      contactName: contactName.trim() || null,
      contactEmail: contactEmail.trim() || null,
      metadata: { surveyDate: meta.surveyDate, teamName: meta.teamName, respondent: meta.respondent },
      submittedAt: new Date().toISOString(),
    };

    try {
      setStatus('submitting');
      // 1) Existing primary destination (Google Sheet or custom endpoint)
      if (endpoint.trim()) {
        const targetEndpoint = endpoint.trim();
        if (isGoogleAppsScriptUrl(targetEndpoint)) {
          await postToGoogleAppsScript(targetEndpoint, payload);
        } else {
          const r = await fetch(targetEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
        }
      } else {
        console.info(t.noEndpoint, payload);
      }

      // 2) Additional Azure destination (best-effort, never blocks successful primary submission)
      const runtimeConfig = getRuntimeConfig();
      if (runtimeConfig.azureSurveySubmitUrl) {
        const azurePayload = buildAzureSurveyPayload({
          payload,
          language: lang,
          sourceEnv: runtimeConfig.sourceEnv,
          clientSubmissionId,
        });
        try {
          const azureResult = await submitSurveyToAzure(runtimeConfig.azureSurveySubmitUrl, azurePayload);
          console.info('[Survey][Azure] Submission success', {
            clientSubmissionId,
            status: azureResult.status,
          });
        } catch (azureError) {
          console.error('[Survey][Azure] Submission failed', {
            clientSubmissionId,
            error: azureError?.message || String(azureError),
            endpoint: runtimeConfig.azureSurveySubmitUrl,
          });
        }
      } else {
        console.warn('[Survey][Azure] Skipped - no endpoint configured', { clientSubmissionId });
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
        <h2>{t.thankYouTitle}</h2>
        <p className="success-main">{t.submittedSuccess}</p>
        <p>{t.submittedSupport}</p>
        <p className="success-aggregated">{t.submittedAggregated}</p>
        <button type="button" className="secondary-action" onClick={startNewResponse}>{t.submitAnother}</button>
      </section>
    );
  }

  return (
    <div className="survey-shell">
      <section className="panel header-panel">
        <div className="language-toggle">
          <span>{t.language}</span>
          <button type="button" className={lang === 'en' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('en')}>EN</button>
          <button type="button" className={lang === 'ro' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('ro')}>RO</button>
        </div>
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
        <div className="intro-block">
          <h3>{t.introHeading}</h3>
          <p>{t.introP1}</p>
          <p><strong>{t.introGoalLabel}</strong></p>
          <ul className="intro-goals">
            <li>👉 {t.introGoal1}</li>
            <li>👉 {t.introGoal2}</li>
            <li>👉 {t.introGoal3}</li>
          </ul>
          <p>{t.introP2}</p>
          <p><strong>{t.introListLabel}</strong></p>
          <ul className="intro-list">
            <li>{t.introList1}</li>
            <li>{t.introList2}</li>
            <li>{t.introList3}</li>
            <li>{t.introList4}</li>
          </ul>
          <p>{t.introP3}</p>
          <p className="intro-thanks">{t.introThanks}</p>
        </div>
      </section>

      {needsDraftDecision && (
        <section className="panel draft-panel">
          <h2>{t.draftPromptTitle}</h2>
          <p>{t.draftPromptBody}</p>
          <div className="draft-actions">
            <button type="button" onClick={resumePreviousResponse}>{t.resumeDraft}</button>
            <button type="button" className="secondary-action" onClick={startNewResponse}>{t.startNew}</button>
          </div>
        </section>
      )}

      {!needsDraftDecision && (
        <>

      <section className="panel metadata-panel">
        <h2>{t.metadata}</h2>
        <div className="grid">
          <label>{t.surveyDate}<input type="date" value={meta.surveyDate} onChange={(e) => setMeta((m) => ({ ...m, surveyDate: e.target.value }))} /></label>
          <label>{t.teamName}<input type="text" placeholder={t.optional} value={meta.teamName} onChange={(e) => setMeta((m) => ({ ...m, teamName: e.target.value }))} /></label>
          <label>{t.respondent}<input type="text" placeholder={t.optional} value={meta.respondent} onChange={(e) => setMeta((m) => ({ ...m, respondent: e.target.value }))} /></label>
          <label>{t.endpoint}<input type="url" placeholder="https://script.google.com/macros/s/.../exec" value={endpoint} onChange={(e) => setEndpoint(e.target.value)} /></label>
        </div>
      </section>

      <section className="panel progress-panel">
        <div className="progress-head"><strong>{t.progress}</strong><span>{Math.min(index + 1, flow.length)} / {flow.length} {t.steps}</span></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        <small>{t.requiredAnswered}: {requiredAnswered}/{requiredCount}</small>
      </section>

      <section className={`panel question-panel ${current?.sectionType || ''}`}>
        {current && (
          <>
            <p className="section-title">{current.section}</p>
            {current.type === 'transition' ? (
              <div className="transition-box">
                <h2>{t.transitionTitle}</h2>
                <p>{t.transitionBody} <strong>{localize(branchDef?.title || '', lang)}</strong></p>
              </div>
            ) : isFinalStep ? (
              <div className="final-review">
                <h2>{t.review}</h2>
                <p className="final-complete">{t.allRequiredCompleted}</p>
                <p className="final-ready">{t.doneReadyToSubmit}</p>
                <div className="review-grid">
                  <div><strong>{t.role}</strong><div>{answers.q1_role || '-'}</div></div>
                  <div><strong>{t.branch}</strong><div>{branchDef ? localize(branchDef.title, lang) : '-'}</div></div>
                  <div><strong>{t.questionsAnswered}</strong><div>{requiredAnswered}/{requiredCount}</div></div>
                </div>
                <label className="final-comment-label">
                  {localize(current.label, lang)}
                  <textarea className="comment-box" rows={4} placeholder={localize(current.placeholder, lang)} value={answers[current.id] || ''} onChange={(e) => setAnswers((a) => ({ ...a, [current.id]: e.target.value }))} />
                </label>
                {isAdvancedUser(answers) && (
                  <div className="advanced-callout">
                    <p className="advanced-callout-title">⭐ {t.advancedCalloutTitle}</p>
                    <p className="advanced-callout-body">{t.advancedCalloutBody}</p>
                    <div className="advanced-callout-fields">
                      <label className="advanced-callout-label">
                        {t.advancedCalloutName}
                        <input type="text" placeholder={t.optional} value={contactName} onChange={(e) => setContactName(e.target.value)} />
                      </label>
                      <label className="advanced-callout-label">
                        {t.advancedCalloutEmail}
                        <input type="email" placeholder={t.optional} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                      </label>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
            <div className="question-title-row">
              <h2>{localize(current.label, lang)}</h2>
              {current.tooltipTitle && (
                <button
                  type="button"
                  className="info-btn"
                  onMouseEnter={() => setTooltipOpen(true)}
                  onMouseLeave={() => setTooltipOpen(false)}
                  onClick={() => setTooltipOpen((v) => !v)}
                  onBlur={() => setTooltipOpen(false)}
                  aria-label={localize(current.tooltipTitle, lang)}
                >
                  ⓘ
                </button>
              )}
            </div>
            {current.helperText && <p className="helper-text">{localize(current.helperText, lang)}</p>}
            {current.microcopy && <p className="tooltip-hint">{localize(current.microcopy, lang)}</p>}
            {current.tooltipTitle && tooltipOpen && (
              <div className="tooltip-box" role="note">
                <strong>{localize(current.tooltipTitle, lang)}</strong>
                <p>{localize(current.tooltipBody, lang)}</p>
              </div>
            )}
            <p className="q-meta">{current.required ? t.required : t.optionalTag} • {t[current.type]}</p>
            {current.type === 'free_text' ? (
              <textarea className="comment-box" rows={4} placeholder={localize(current.placeholder, lang)} value={answers[current.id] || ''} onChange={(e) => setAnswers((a) => ({ ...a, [current.id]: e.target.value }))} />
            ) : (
              <div className="options">
                {current.options.map((option) => {
                  const checked = current.type === 'single_choice' ? answers[current.id] === option.value : Array.isArray(answers[current.id]) && answers[current.id].includes(option.value);
                  const noGeneralToolsSelected = current.id === 'q3_general_tools' && Array.isArray(answers[current.id]) && answers[current.id].includes('no_general_ai_tools');
                  const noLearningEffortSelected = current.id === 'q11_learning_path' && Array.isArray(answers[current.id]) && answers[current.id].includes('no_learning_effort');
                  const noCodingAgentsSelected = current.id === 'd11' && Array.isArray(answers[current.id]) && answers[current.id].includes('no_coding_agents');
                  const noBranch2ToolboxSelected = current.id === 'branch2_toolbox' && Array.isArray(answers[current.id]) && answers[current.id].includes('do_not_work_directly_with_tools');
                  const noBranch2AiToolsSelected = current.id === 'branch2_ai_tools' && Array.isArray(answers[current.id]) && answers[current.id].includes('do_not_use_ai_tools_in_qa_workflow');
                  const noBranch2AiUsageSelected = current.id === 'branch2_ai_usage_modes' && Array.isArray(answers[current.id]) && answers[current.id].includes('do_not_use_ai_in_qa_automation');
                  const maxSelectedReached = current.id === 'branch2_ai_usage_modes' && Array.isArray(answers[current.id]) && answers[current.id].length >= (current.maxSelections || Infinity);
                  const disabled = (current.id === 'q3_general_tools' && noGeneralToolsSelected && option.value !== 'no_general_ai_tools')
                    || (current.id === 'q11_learning_path' && noLearningEffortSelected && option.value !== 'no_learning_effort')
                    || (current.id === 'd11' && noCodingAgentsSelected && option.value !== 'no_coding_agents')
                    || (current.id === 'branch2_toolbox' && noBranch2ToolboxSelected && option.value !== 'do_not_work_directly_with_tools')
                    || (current.id === 'branch2_ai_tools' && noBranch2AiToolsSelected && option.value !== 'do_not_use_ai_tools_in_qa_workflow')
                    || (current.id === 'branch2_ai_usage_modes' && noBranch2AiUsageSelected && option.value !== 'do_not_use_ai_in_qa_automation')
                    || (current.id === 'branch2_ai_usage_modes' && maxSelectedReached && !checked && option.value !== 'do_not_use_ai_in_qa_automation');
                  return (
                    <label className={`option-card ${checked ? 'active' : ''} ${disabled ? 'disabled' : ''}`} key={option.value}>
                      <input type={current.type === 'single_choice' ? 'radio' : 'checkbox'} name={current.id} checked={checked} disabled={disabled} onChange={() => current.type === 'single_choice' ? setSingle(current.id, option.value) : toggleMulti(current.id, option.value)} />
                      <span>
                        <span className="option-label">{localize(option.label, lang)}</span>
                        {option.description && <small className="option-description">{localize(option.description, lang)}</small>}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
              </>
            )}
          </>
        )}

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>{t.previous}</button>
          {!isFinalStep ? <button type="button" onClick={next}>{current?.type === 'transition' ? t.continue : t.next}</button> : (
            <div className="submit-wrap">
              <button type="button" className="submit-response-btn" onClick={submit} disabled={status === 'submitting'}>{status === 'submitting' ? t.submitting : t.submitResponse}</button>
              <small>{t.submitHelper}</small>
            </div>
          )}
        </div>
      </section>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
