const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = 'agenticSdlcBranchingSurveyV3';
const DRAFT_VERSION = 1;
const DRAFT_TTL_MS = 72 * 60 * 60 * 1000;
const DEFAULT_META = () => ({ surveyDate: new Date().toISOString().slice(0, 10), teamName: '', respondent: '' });

const uiText = {
  en: {
    title: 'Agentic SDLC Diagnostic',
    subtitle: '11 core + 12 role-specific required questions plus 1 optional final comment. Professional, structured, and analytics-ready.',
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
    review: 'Review & Submit',
    ready: 'Ready to submit',
    role: 'Role',
    branch: 'Branch',
    coreQuestions: 'Core questions',
    branchQuestions: 'Branch questions',
    submit: 'Submit',
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
  },
  fr: {
    title: 'Diagnostic SDLC Agentique',
    subtitle: '11 questions cœur + 12 questions spécifiques au rôle (obligatoires) + 1 commentaire final optionnel.',
    language: 'Langue',
    metadata: 'Métadonnées du questionnaire',
    surveyDate: 'Date du questionnaire',
    teamName: 'Nom de l’équipe / groupe',
    respondent: 'Nom du répondant',
    endpoint: 'Endpoint de soumission (optionnel)',
    optional: 'Optionnel',
    progress: 'Progression',
    steps: 'étapes',
    requiredAnswered: 'Obligatoires complétées',
    required: 'Obligatoire',
    optionalTag: 'Optionnel',
    single_choice: 'choix unique',
    multi_select: 'sélection multiple',
    free_text: 'texte libre',
    next: 'Suivant',
    previous: 'Précédent',
    review: 'Revue & Soumission',
    ready: 'Prêt à soumettre',
    role: 'Rôle',
    branch: 'Branche',
    coreQuestions: 'Questions cœur',
    branchQuestions: 'Questions branche',
    submit: 'Soumettre',
    submitting: 'Soumission...',
    successTitle: 'Soumission terminée',
    successBody: 'Merci. Votre réponse au diagnostic a été enregistrée.',
    requiredError: 'Veuillez répondre à cette question obligatoire pour continuer.',
    incompleteError: 'Veuillez compléter toutes les questions obligatoires avant la soumission.',
    noEndpoint: 'Aucun endpoint défini. Aperçu payload :',
    coreSection: 'Questions cœur',
    finalSection: 'Commentaire final optionnel',
    transitionTitle: 'Vous entrez maintenant dans votre section spécifique au rôle',
    transitionBody: 'Les prochaines questions sont adaptées à votre rôle :',
    continue: 'Continuer',
    tooltipHint: 'Cliquez sur ⓘ pour voir l’aide',
    draftPromptTitle: 'Un brouillon de réponse précédent a été trouvé',
    draftPromptBody: 'Voulez-vous reprendre votre réponse précédente ou en démarrer une nouvelle ?',
    resumeDraft: 'Reprendre la réponse précédente',
    startNew: 'Commencer une nouvelle réponse',
  },
  ro: {
    title: 'Diagnostic SDLC Agentic',
    subtitle: '11 întrebări de bază + 12 întrebări specifice rolului + 1 comentariu final opțional.',
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
  },
  pt: {
    title: 'Diagnóstico SDLC Agêntico',
    subtitle: '11 perguntas centrais + 12 perguntas específicas por papel + 1 comentário final opcional.',
    language: 'Idioma',
    metadata: 'Metadados do questionário',
    surveyDate: 'Data do questionário',
    teamName: 'Nome da equipe / grupo',
    respondent: 'Nome do respondente',
    endpoint: 'Endpoint de envio (opcional)',
    optional: 'Opcional',
    progress: 'Progresso',
    steps: 'etapas',
    requiredAnswered: 'Obrigatórias respondidas',
    required: 'Obrigatória',
    optionalTag: 'Opcional',
    single_choice: 'escolha única',
    multi_select: 'seleção múltipla',
    free_text: 'texto livre',
    next: 'Próximo',
    previous: 'Anterior',
    review: 'Revisão e Envio',
    ready: 'Pronto para enviar',
    role: 'Papel',
    branch: 'Trilha',
    coreQuestions: 'Perguntas centrais',
    branchQuestions: 'Perguntas da trilha',
    submit: 'Enviar',
    submitting: 'Enviando...',
    successTitle: 'Envio concluído',
    successBody: 'Obrigado. Sua resposta foi registrada.',
    requiredError: 'Responda esta pergunta obrigatória para continuar.',
    incompleteError: 'Complete todas as perguntas obrigatórias antes de enviar.',
    noEndpoint: 'Nenhum endpoint definido. Prévia do payload:',
    coreSection: 'Perguntas centrais',
    finalSection: 'Comentário final opcional',
    transitionTitle: 'Agora você está entrando na seção específica do seu papel',
    transitionBody: 'As próximas perguntas são adaptadas ao seu papel:',
    continue: 'Continuar',
    tooltipHint: 'Clique no ⓘ para orientação',
    draftPromptTitle: 'Foi encontrado um rascunho de resposta anterior',
    draftPromptBody: 'Você deseja retomar sua resposta anterior ou iniciar uma nova?',
    resumeDraft: 'Retomar resposta anterior',
    startNew: 'Iniciar nova resposta',
  }
};

const L = (en, fr, ro = en, pt = en) => ({ en, fr, ro, pt });
const localize = (v, lang) => (typeof v === 'string' ? v : (v?.[lang] ?? v?.en ?? ''));

const standardProvisioningOptions = [
  { value: 'personally_chosen', label: L('Personally chosen / informal', 'Choix personnel / informel') },
  { value: 'team_standard', label: L('Team-standard tool', 'Outil standard de l’équipe') },
  { value: 'client_mandated', label: L('Client-mandated tool', 'Outil imposé par le client') },
  { value: 'enterprise_standard', label: L('Enterprise-standard tool', 'Outil standard entreprise') },
  { value: 'trial_experimental', label: L('Trial / experimental only', 'Essai / expérimental uniquement') },
];

const surveyConfig = {
  coreQuestions: [
    { id: 'q1_role', type: 'single_choice', required: true, label: L('What best describes your primary role in software delivery today?', 'Quel rôle décrit le mieux votre fonction principale dans le delivery logiciel aujourd’hui ?', 'Care dintre următoarele descrie cel mai bine rolul tău principal în livrarea software?', 'Qual das opções descreve melhor o seu papel principal na entrega de software?'),
      helperText: L(
        'Select the option that represents where you spend most of your time.',
        'Choisissez l’option correspondant à la majorité de votre temps.',
        'Alege opțiunea care reflectă majoritatea timpului tău.',
        'Escolha a opção que representa a maior parte do seu tempo.'
      ),
      microcopy: L(
        'Click the ⓘ for guidance',
        'Cliquez sur le ⓘ pour obtenir de l’aide',
        'Apasă pe ⓘ pentru ghidaj',
        'Clique no ⓘ para orientação'
      ),
      tooltipTitle: L(
        'Why are we asking this?',
        'Pourquoi posons-nous cette question ?',
        'De ce punem această întrebare?',
        'Por que estamos fazendo esta pergunta?'
      ),
      tooltipBody: L(
        'Your answer helps tailor the questionnaire to your role so that you only see the most relevant questions. It also helps us compare AI adoption patterns across different functions in the software delivery lifecycle.',
        'Votre réponse permet d’adapter le questionnaire à votre rôle afin de ne vous montrer que les questions les plus pertinentes. Elle permet aussi de comparer les modes d’adoption de l’IA selon les différentes fonctions du cycle de delivery logiciel.',
        'Răspunsul tău ne ajută să adaptăm chestionarul la rolul tău, astfel încât să vezi doar întrebările cele mai relevante. De asemenea, ne ajută să comparăm modul în care IA este adoptată în diferite funcții din ciclul de livrare software.',
        'Sua resposta ajuda a adaptar o questionário ao seu papel, para que você veja apenas as perguntas mais relevantes. Ela também ajuda a comparar os padrões de adoção de IA entre diferentes funções no ciclo de entrega de software.'
      ),
      options: [
      { value: 'developer', label: L('Engineering / Development', 'Ingénierie / Développement', 'Inginerie / Dezvoltare', 'Engenharia / Desenvolvimento'), description: L('Examples: software engineer, backend/frontend developer, mobile developer, data engineer, DevOps, SRE, platform engineer, cloud / infrastructure, system / network / database, security engineer, application security, DevSecOps', 'Exemples : développeur, ingénieur logiciel, développeur backend/frontend, développeur mobile, data engineer, DevOps, SRE, platform engineer, cloud / infrastructure, système / réseau / base de données, ingénieur sécurité, sécurité applicative, DevSecOps', 'Exemple: developer, inginer software, backend/frontend developer, mobile developer, data engineer, DevOps, SRE, platform engineer, cloud / infrastructură, sistem / rețea / baze de date, inginer de securitate, securitate aplicații, DevSecOps', 'Exemplos: engenheiro de software, desenvolvedor backend/frontend, desenvolvedor mobile, data engineer, DevOps, SRE, platform engineer, cloud / infraestrutura, sistemas / redes / banco de dados, engenheiro de segurança, segurança de aplicações, DevSecOps') },
      { value: 'qa_testing_quality', label: L('QA / Testing / Quality', 'QA / Tests / Qualité', 'QA / Testare / Calitate', 'QA / Testes / Qualidade'), description: L('Examples: QA engineer, tester, validation engineer, test automation, quality engineering', 'Exemples : QA, testeur, ingénieur validation, automatisation des tests, quality engineering', 'Exemple: QA engineer, tester, inginer validare, automatizare teste, quality engineering', 'Exemplos: QA engineer, tester, engenheiro de validação, automação de testes, quality engineering') },
      { value: 'project_product_business_analysis_operations', label: L('Project / Product / Business Analysis / Operations', 'Projet / Produit / Analyse métier / Opérations', 'Proiect / Produs / Analiză de business / Operațiuni', 'Projeto / Produto / Análise de Negócio / Operações'), description: L('Examples: project manager, product owner, business analyst\ndata analyst, BI / analytics, operations / support, production monitoring, security governance, risk, compliance, audit', 'Exemples : chef de projet, product owner, business analyst\ndata analyst, BI / analytics, opérations / support, supervision de production, gouvernance sécurité, risque, conformité, audit', 'Exemple: project manager, product owner, business analyst\ndata analyst, BI / analytics, operațiuni / suport, monitorizare producție, guvernanță de securitate, risc, conformitate, audit', 'Exemplos: gerente de projeto, product owner, business analyst\ndata analyst, BI / analytics, operações / suporte, monitoramento de produção, governança de segurança, risco, conformidade, auditoria') },
    ] },
    { id: 'q2_contract_model', type: 'single_choice', required: true, label: L('What best describes your current engagement model with your client?', 'Quel modèle d’intervention décrit le mieux votre mission actuelle chez le client ?', 'Care descrie cel mai bine modelul de colaborare actual cu clientul tău?', 'Qual das opções descreve melhor o seu modelo atual de trabalho com o cliente?'),
      helperText: L(
        'If unsure, select the option that best reflects how your work is organized or billed.',
        'Si vous hésitez, choisissez l’option qui reflète le mieux l’organisation ou la facturation de votre travail.',
        'Dacă nu ești sigur, alege opțiunea care reflectă cel mai bine organizarea sau facturarea muncii tale.',
        'Se você não tiver certeza, escolha a opção que melhor reflete como seu trabalho é organizado ou faturado.'
      ),
      options: [
      { value: 'staff_augmentation', label: L('Staff augmentation (you work as part of the client’s team)', 'Régie / assistance technique (intégré dans l’équipe client)', 'Staff augmentation (lucrezi în echipa clientului)', 'Staff augmentation (você trabalha na equipe do cliente)') },
      { value: 'team_delivery', label: L('Team delivery (your company provides a team to deliver a scope)', 'Équipe dédiée (delivery en équipe)', 'Livrare în echipă', 'Entrega em equipe') },
      { value: 'fixed_price', label: L('Fixed-price project', 'Forfait (projet avec périmètre et engagement de résultat)', 'Proiect cu preț fix', 'Projeto de preço fixo') },
      { value: 'managed_services', label: L('Managed services (run / maintain systems)', 'Services managés (run / maintenance)', 'Servicii gestionate', 'Serviços gerenciados') },
      { value: 'not_sure', label: L('Not sure', 'Je ne sais pas', 'Nu sunt sigur', 'Não sei') },
    ] },
    { id: 'q2_ai_usage', type: 'single_choice', required: true, label: L('How do you currently use AI in your work?', 'Comment utilisez-vous actuellement l’IA dans votre travail ?'), options: [
      { value: 'no_use', label: L('I do not use AI', 'Je n’utilise pas l’IA') },
      { value: 'occasional', label: L('I use it occasionally', 'Occasionnellement') },
      { value: 'regular', label: L('I use it regularly', 'Régulièrement') },
      { value: 'most_tasks', label: L('I use it in most of my tasks', 'Dans la plupart de mes tâches') },
    ] },
    { id: 'q3_general_tools', type: 'multi_select', required: true, label: L('Which general AI tools do you use today?', 'Quels outils d’IA généralistes utilisez-vous aujourd’hui ?'), options: [
      { value: 'chatgpt', label: L('ChatGPT', 'ChatGPT') },
      { value: 'claude', label: L('Claude', 'Claude') },
      { value: 'microsoft_copilot', label: L('Microsoft Copilot', 'Microsoft Copilot') },
      { value: 'gemini', label: L('Gemini', 'Gemini') },
      { value: 'perplexity', label: L('Perplexity', 'Perplexity') },
      { value: 'other_general_ai_tools', label: L('Other general AI tools', 'Autres outils d’IA') },
    ] },
    { id: 'q4_productivity', type: 'single_choice', required: true, label: L('How much does AI improve your productivity?', 'Dans quelle mesure l’IA améliore-t-elle votre productivité ?'), options: [
      { value: 'no_impact', label: L('No impact', 'Aucun impact') },
      { value: 'slight', label: L('Slight improvement', 'Faible amélioration') },
      { value: 'moderate', label: L('Moderate improvement', 'Amélioration modérée') },
      { value: 'significant', label: L('Significant improvement', 'Amélioration significative') },
    ] },
    { id: 'q5_quality', type: 'single_choice', required: true, label: L('How much does AI improve the quality of your work?', 'Dans quelle mesure l’IA améliore-t-elle la qualité de votre travail ?'), options: [
      { value: 'no_impact', label: L('No impact', 'Aucun impact') },
      { value: 'slight', label: L('Slight improvement', 'Faible amélioration') },
      { value: 'moderate', label: L('Moderate improvement', 'Amélioration modérée') },
      { value: 'significant', label: L('Significant improvement', 'Amélioration significative') },
    ] },
    { id: 'q6_team_usage', type: 'single_choice', required: true, label: L('How is AI used in your team today?', 'Comment l’IA est-elle utilisée dans votre équipe aujourd’hui ?'), options: [
      { value: 'individual_only', label: L('Individual use only', 'Usage individuel uniquement') },
      { value: 'informal_sharing', label: L('Informal sharing within the team', 'Partage informel') },
      { value: 'some_team_practices', label: L('Some team practices are defined', 'Quelques pratiques d’équipe') },
      { value: 'fully_integrated', label: L('Fully integrated into workflows', 'Intégrée aux workflows') },
    ] },
    { id: 'q7_autonomy', type: 'single_choice', required: true, label: L('What is the highest level of AI autonomy you use today?', 'Quel est le niveau d’autonomie le plus élevé de l’IA que vous utilisez aujourd’hui ?'), options: [
      { value: 'suggests_only', label: L('AI suggests only', 'Suggestions uniquement') },
      { value: 'generates_outputs', label: L('AI generates outputs', 'Génère des contenus') },
      { value: 'executes_with_supervision', label: L('AI executes tasks with supervision', 'Exécute avec supervision') },
      { value: 'runs_workflows', label: L('AI runs workflows end-to-end', 'Exécute des workflows complets') },
    ] },
    { id: 'q8_async', type: 'single_choice', required: true, label: L('Can AI-driven tasks run without your continuous involvement?', 'Des tâches pilotées par l’IA peuvent-elles s’exécuter sans votre intervention continue ?'), options: [
      { value: 'no', label: L('No, I must always stay involved', 'Non') },
      { value: 'limited_async', label: L('Limited, some asynchronous usage is possible', 'Limité') },
      { value: 'yes_independent', label: L('Yes, some tasks can run independently', 'Oui') },
    ] },
    { id: 'q9_measurement', type: 'single_choice', required: true, label: L('Do you measure the impact of AI usage?', 'Mesurez-vous l’impact de l’usage de l’IA ?'), options: [
      { value: 'no_measurement', label: L('No measurement', 'Aucun suivi') },
      { value: 'informal_tracking', label: L('Informal tracking', 'Suivi informel') },
      { value: 'defined_metrics', label: L('Defined metrics are in place', 'Indicateurs définis') },
    ] },
    { id: 'q10_sdlc_usage', type: 'multi_select', required: true, label: L('In which parts of the SDLC do you use AI today?', 'Dans quelles parties du cycle de développement (SDLC) utilisez-vous l’IA ?'), options: [
      { value: 'requirements_specs', label: L('Requirements / Specs', 'Spécifications') },
      { value: 'planning_project_management', label: L('Planning / Project Management', 'Planification') },
      { value: 'coding', label: L('Coding', 'Développement') },
      { value: 'code_review', label: L('Code Review', 'Revue de code') },
      { value: 'testing', label: L('Testing', 'Tests') },
      { value: 'debugging', label: L('Debugging', 'Débogage') },
      { value: 'cicd', label: L('CI/CD', 'CI/CD') },
      { value: 'deployment', label: L('Deployment', 'Déploiement') },
      { value: 'production_operations', label: L('Production / Operations', 'Production / Exploitation') },
      { value: 'documentation', label: L('Documentation', 'Documentation') },
    ] },
    { id: 'q11_ai_skills', type: 'single_choice', required: true, label: L('How have you developed your skills with AI tools so far?', 'Comment avez-vous développé vos compétences sur les outils d’IA jusqu’à présent ?'), options: [
      { value: 'no_effort', label: L('I have not invested time in learning AI tools', 'Aucun effort') },
      { value: 'ad_hoc_learning', label: L('I learned informally through trial and error or occasional use', 'Apprentissage informel') },
      { value: 'self_learning', label: L('I actively learned through tutorials, videos, or documentation', 'Auto-formation') },
      { value: 'structured_learning', label: L('I followed structured training such as courses or internal programs', 'Formation structurée') },
      { value: 'advanced_usage', label: L('I actively experiment, optimize workflows, or build advanced usage such as agents or automation', 'Usage avancé / expérimentation') },
    ] },
  ],
  branches: {
    developer: {
      title: L('Developer Questions', 'Questions Développeur'),
      questions: [
        { id: 'd1', type: 'single_choice', required: true, label: L('How do you use AI for coding?', 'Comment utilisez-vous l’IA pour le développement ?'), options: [
          { value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'snippets_only', label: L('Snippets only', 'Extraits de code') }, { value: 'functions_modules', label: L('Full functions or modules', 'Fonctions ou modules complets') }, { value: 'end_to_end_implementation', label: L('End-to-end implementation', 'Développement complet') },
        ] },
        { id: 'd2', type: 'single_choice', required: true, label: L('How often does AI help you understand unfamiliar code?', 'À quelle fréquence l’IA vous aide-t-elle à comprendre du code non familier ?'), options: [
          { value: 'never', label: L('Never', 'Jamais') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') },
        ] },
        { id: 'd3', type: 'single_choice', required: true, label: L('How does AI support refactoring in your work?', 'Comment l’IA aide-t-elle au refactoring dans votre travail ?'), options: [
          { value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'minor_edits', label: L('Minor edits', 'Éditions mineures') }, { value: 'significant_refactoring', label: L('Significant refactoring', 'Refactoring significatif') }, { value: 'automated_refactoring_workflows', label: L('Automated refactoring workflows', 'Workflows automatisés de refactoring') },
        ] },
        { id: 'd4', type: 'single_choice', required: true, label: L('How often do you use AI in code review?', 'À quelle fréquence utilisez-vous l’IA en revue de code ?'), options: [
          { value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematic_pr_review', label: L('Systematic part of PR review', 'Partie systématique de la revue PR') },
        ] },
        { id: 'd5', type: 'multi_select', required: true, label: L('What do you use AI for in code review?', 'Pour quoi utilisez-vous l’IA en revue de code ?'), options: [
          { value: 'detect_bugs', label: L('Detect bugs', 'Détecter des bugs') }, { value: 'suggest_improvements', label: L('Suggest improvements', 'Suggérer des améliorations') }, { value: 'enforce_standards', label: L('Enforce standards', 'Appliquer des standards') }, { value: 'summarize_prs', label: L('Summarize PRs', 'Résumer des PR') },
        ] },
        { id: 'd6', type: 'single_choice', required: true, label: L('How often do you use AI to generate tests?', 'À quelle fréquence utilisez-vous l’IA pour générer des tests ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'd7', type: 'single_choice', required: true, label: L('How often does AI help you debug issues?', 'À quelle fréquence l’IA vous aide-t-elle à déboguer des incidents ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'first_reflex', label: L('It is my first reflex', 'C’est mon premier réflexe') }] },
        { id: 'd8', type: 'single_choice', required: true, label: L('How does AI help with CI/CD failures?', 'Comment l’IA aide-t-elle sur les échecs CI/CD ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'suggests_fixes', label: L('It suggests fixes', 'Suggère des correctifs') }, { value: 'frequently_used', label: L('Frequently used for diagnosis or resolution', 'Souvent utilisée pour diagnostic/résolution') }, { value: 'automatically_resolves', label: L('Automatically resolves some issues', 'Résout automatiquement certains incidents') }] },
        { id: 'd9', type: 'single_choice', required: true, label: L('How are agents used in your development workflow?', 'Comment les agents sont-ils utilisés dans votre workflow de développement ?'), options: [{ value: 'none', label: L('None', 'Aucun') }, { value: 'experimental', label: L('Experimental only', 'Expérimental') }, { value: 'some_workflows', label: L('Used in some workflows', 'Utilisés dans certains workflows') }, { value: 'core_workflow', label: L('Core part of the workflow', 'Au cœur du workflow') }] },
        { id: 'd10', type: 'multi_select', required: true, label: L('What can agents do in your development workflow?', 'Que peuvent faire les agents dans votre workflow de développement ?'), options: [{ value: 'open_prs', label: L('Open PRs', 'Ouvrir des PR') }, { value: 'fix_bugs', label: L('Fix bugs', 'Corriger des bugs') }, { value: 'refactor_code', label: L('Refactor code', 'Refactoriser du code') }, { value: 'update_dependencies', label: L('Update dependencies', 'Mettre à jour des dépendances') }, { value: 'maintain_documentation', label: L('Maintain documentation', 'Maintenir la documentation') }] },
        { id: 'd11', type: 'multi_select', required: true, label: L('Which developer AI solutions do you currently use?', 'Quelles solutions d’IA pour le développement utilisez-vous actuellement ?'), options: [{ value: 'github_copilot', label: L('GitHub Copilot', 'GitHub Copilot') }, { value: 'github_copilot_agent', label: L('GitHub Copilot cloud agent / code review', 'GitHub Copilot cloud agent / revue de code') }, { value: 'claude_code', label: L('Claude Code', 'Claude Code') }, { value: 'openai_codex', label: L('OpenAI Codex', 'OpenAI Codex') }, { value: 'cursor', label: L('Cursor', 'Cursor') }, { value: 'gemini_code_assist', label: L('Gemini Code Assist', 'Gemini Code Assist') }, { value: 'devin', label: L('Devin', 'Devin') }, { value: 'windsurf', label: L('Windsurf', 'Windsurf') }, { value: 'jetbrains_ai_assistant', label: L('JetBrains AI Assistant', 'JetBrains AI Assistant') }, { value: 'tabnine', label: L('Tabnine', 'Tabnine') }, { value: 'other_developer_ai_tools', label: L('Other developer AI tools', 'Autres outils de développement IA') }, { value: 'no_specific_developer_tool', label: L('No specific developer AI tool', 'Aucun outil spécifique') }] },
        { id: 'd12', type: 'single_choice', required: true, label: L('How are these developer AI tools provided in your environment?', 'Comment ces outils IA de développement sont-ils fournis dans votre environnement ?'), options: standardProvisioningOptions },
      ],
    },
    qa_testing_quality: {
      title: L('QA / Testing / Quality Questions', 'Questions QA / Tests / Qualité'),
      questions: [
        { id: 'qat1', type: 'single_choice', required: true, label: L('How often do you use AI to generate test cases?', 'À quelle fréquence utilisez-vous l’IA pour générer des cas de test ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'qat2', type: 'single_choice', required: true, label: L('How often does AI help update or repair tests?', 'À quelle fréquence l’IA aide-t-elle à mettre à jour ou réparer des tests ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'automatically', label: L('Automatically', 'Automatiquement') }] },
        { id: 'qat3', type: 'single_choice', required: true, label: L('How often does AI help identify missing test coverage?', 'À quelle fréquence l’IA aide-t-elle à identifier les manques de couverture de tests ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'qat4', type: 'single_choice', required: true, label: L('How often does AI help detect regressions?', 'À quelle fréquence l’IA aide-t-elle à détecter des régressions ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'qat5', type: 'single_choice', required: true, label: L('How often does AI help diagnose test failures in CI?', 'À quelle fréquence l’IA aide-t-elle à diagnostiquer des échecs de tests en CI ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'qat6', type: 'single_choice', required: true, label: L('How often does AI help identify root causes of defects?', 'À quelle fréquence l’IA aide-t-elle à identifier les causes racines des défauts ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'qat7', type: 'single_choice', required: true, label: L('How often does AI support release readiness validation?', 'À quelle fréquence l’IA aide-t-elle la validation de readiness de release ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'qat8', type: 'single_choice', required: true, label: L('How often does AI help generate test data?', 'À quelle fréquence l’IA aide-t-elle à générer des données de test ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'qat9', type: 'single_choice', required: true, label: L('How much does AI orchestrate testing workflows?', 'Dans quelle mesure l’IA orchestre-t-elle les workflows de test ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'limited', label: L('Limited orchestration', 'Orchestration limitée') }, { value: 'frequent', label: L('Frequent orchestration', 'Orchestration fréquente') }, { value: 'fully_automated', label: L('Fully automated workflows', 'Workflows entièrement automatisés') }] },
        { id: 'qat10', type: 'multi_select', required: true, label: L('What can agents do in your QA / testing workflow?', 'Que peuvent faire les agents dans votre workflow QA / tests ?'), options: [{ value: 'generate_tests', label: L('Generate tests', 'Générer des tests') }, { value: 'execute_tests', label: L('Execute tests', 'Exécuter des tests') }, { value: 'diagnose_failures', label: L('Diagnose failures', 'Diagnostiquer des échecs') }, { value: 'suggest_fixes', label: L('Suggest fixes', 'Suggérer des correctifs') }, { value: 'validate_releases', label: L('Validate releases', 'Valider des releases') }] },
        { id: 'qat11', type: 'multi_select', required: true, label: L('Which QA / testing AI solutions do you currently use?', 'Quelles solutions d’IA pour les tests utilisez-vous actuellement ?'), options: [{ value: 'tricentis_tosca', label: L('Tricentis Tosca / Agentic Test Automation', 'Tricentis Tosca / Agentic Test Automation') }, { value: 'testim', label: L('Testim', 'Testim') }, { value: 'mabl', label: L('mabl', 'mabl') }, { value: 'functionize', label: L('Functionize', 'Functionize') }, { value: 'cloudbees_smart_tests', label: L('CloudBees Smart Tests', 'CloudBees Smart Tests') }, { value: 'launchable', label: L('Launchable', 'Launchable') }, { value: 'other_qa_ai_tools', label: L('Other QA AI tools', 'Autres outils QA IA') }, { value: 'no_specific_qa_tool', label: L('No specific QA AI tool', 'Aucun outil QA spécifique') }] },
        { id: 'qat12', type: 'single_choice', required: true, label: L('How are these QA / testing AI tools provided in your environment?', 'Comment ces outils IA de tests sont-ils fournis dans votre environnement ?'), options: standardProvisioningOptions },
      ],
    },
    project_product_business_analysis_operations: {
      title: L('Project / Product / Business Analysis / Operations Questions', 'Questions Projet / Produit / Analyse Business / Opérations'),
      questions: [
        { id: 'ppo1', type: 'single_choice', required: true, label: L('How often do you use AI to help with requirements or user stories?', 'À quelle fréquence utilisez-vous l’IA pour les exigences ou user stories ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'ppo2', type: 'single_choice', required: true, label: L('How often does AI support planning or task breakdown?', 'À quelle fréquence l’IA aide-t-elle à la planification ou au découpage des tâches ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'ppo3', type: 'single_choice', required: true, label: L('How often does AI help summarize team activity?', 'À quelle fréquence l’IA aide-t-elle à résumer l’activité de l’équipe ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'ppo4', type: 'single_choice', required: true, label: L('How often does AI help generate reports or status updates?', 'À quelle fréquence l’IA vous aide-t-elle à générer des rapports ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'ppo5', type: 'single_choice', required: true, label: L('How often does AI help identify risks or delays?', 'À quelle fréquence l’IA aide-t-elle à identifier des risques ou retards ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'ppo6', type: 'single_choice', required: true, label: L('How often does AI help prioritize work or backlog items?', 'À quelle fréquence l’IA aide-t-elle à prioriser le travail ou le backlog ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'ppo7', type: 'single_choice', required: true, label: L('How often does AI help maintain project or technical documentation?', 'À quelle fréquence l’IA aide-t-elle à maintenir la documentation projet ou technique ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'ppo8', type: 'single_choice', required: true, label: L('How often does AI help analyze incidents or production issues?', 'À quelle fréquence l’IA aide-t-elle à analyser des incidents de production ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'ppo9', type: 'single_choice', required: true, label: L('How often does AI help interpret logs, metrics, or alerts?', 'À quelle fréquence l’IA aide-t-elle à interpréter logs, métriques ou alertes ?'), options: [{ value: 'not_used', label: L('Not used', 'Non utilisé') }, { value: 'occasionally', label: L('Occasionally', 'Occasionnellement') }, { value: 'frequently', label: L('Frequently', 'Fréquemment') }, { value: 'systematically', label: L('Systematically', 'Systématiquement') }] },
        { id: 'ppo10', type: 'multi_select', required: true, label: L('How is AI used in your project / product / operations workflow?', 'Comment l’IA est-elle utilisée dans votre workflow projet / produit / opérations ?'), options: [{ value: 'automate_reporting', label: L('Automate reporting', 'Automatiser le reporting') }, { value: 'suggest_actions', label: L('Suggest actions', 'Suggérer des actions') }, { value: 'assist_incident_response', label: L('Assist incident response', 'Assister la réponse aux incidents') }, { value: 'improve_workflows', label: L('Improve workflows', 'Améliorer les workflows') }] },
        { id: 'ppo11', type: 'multi_select', required: true, label: L('Which project / product / operations AI solutions do you currently use?', 'Quels outils d’IA utilisez-vous pour la gestion de projet ou les opérations ?'), options: [{ value: 'jira_rovo', label: L('Jira + Rovo', 'Jira + Rovo') }, { value: 'jira_service_management_ai', label: L('Jira Service Management AI / Rovo', 'Jira Service Management AI / Rovo') }, { value: 'servicenow_now_assist', label: L('ServiceNow Now Assist', 'ServiceNow Now Assist') }, { value: 'servicenow_ai_agents', label: L('ServiceNow AI Agents', 'ServiceNow AI Agents') }, { value: 'asana_ai', label: L('Asana AI', 'Asana AI') }, { value: 'microsoft_copilot_m365', label: L('Microsoft Copilot for Microsoft 365', 'Microsoft Copilot pour Microsoft 365') }, { value: 'other_project_ops_ai_tools', label: L('Other project / ops AI tools', 'Autres outils IA projet / ops') }, { value: 'no_specific_project_ops_tool', label: L('No specific project / ops AI tool', 'Aucun outil projet / ops spécifique') }] },
        { id: 'ppo12', type: 'single_choice', required: true, label: L('How are these project / product / operations AI tools provided in your environment?', 'Comment ces outils IA projet / produit / opérations sont-ils fournis dans votre environnement ?'), options: standardProvisioningOptions },
      ],
    },
  },
  finalOptionalComment: {
    id: 'comment1',
    type: 'free_text',
    required: false,
    label: L('Optional: any other AI tools or comments?', 'Optionnel : autres outils d’IA ou commentaires ?'),
    placeholder: L('Share your thoughts', 'Partagez vos remarques'),
  },
};

const roQuestionLabels = {
  q1_role: 'Care dintre următoarele descrie cel mai bine rolul tău?',
  q2_ai_usage: 'Cum folosești în prezent inteligența artificială în activitatea ta?',
  q3_general_tools: 'Ce instrumente generale de inteligență artificială folosești în prezent?',
  q4_productivity: 'În ce măsură îți îmbunătățește IA productivitatea?',
  q5_quality: 'În ce măsură îți îmbunătățește IA calitatea muncii?',
  q6_team_usage: 'Cum este utilizată IA în echipa ta?',
  q7_autonomy: 'Care este nivelul maxim de autonomie al IA pe care îl folosești?',
  q8_async: 'Pot sarcinile bazate pe IA să ruleze fără implicarea ta continuă?',
  q9_measurement: 'Măsori impactul utilizării IA?',
  q10_sdlc_usage: 'În ce etape ale SDLC folosești IA?',
  q11_ai_skills: 'Cum ți-ai dezvoltat competențele în utilizarea IA?',
};
const ptQuestionLabels = {
  q1_role: 'Qual das opções descreve melhor o seu papel?',
  q2_ai_usage: 'Como você utiliza atualmente a IA no seu trabalho?',
  q3_general_tools: 'Quais ferramentas de IA você utiliza hoje?',
  q4_productivity: 'Em que medida a IA melhora sua produtividade?',
  q5_quality: 'Em que medida a IA melhora a qualidade do seu trabalho?',
  q6_team_usage: 'Como a IA é utilizada na sua equipe?',
  q7_autonomy: 'Qual é o nível máximo de autonomia da IA que você utiliza?',
  q8_async: 'As tarefas com IA podem ser executadas sem sua participação contínua?',
  q9_measurement: 'Você mede o impacto do uso de IA?',
  q10_sdlc_usage: 'Em quais partes do SDLC você utiliza IA?',
  q11_ai_skills: 'Como você desenvolveu suas habilidades em IA até agora?',
};
const roOptionLabels = {
  developer: 'Dezvoltator', qa_testing_quality: 'QA / Testare / Calitate', project_product_business_analysis_operations: 'Proiect / Produs / Analiză Business / Operațiuni',
  no_use: 'Nu folosesc IA', occasional: 'Ocazional', regular: 'În mod regulat', most_tasks: 'În majoritatea sarcinilor mele',
  other_general_ai_tools: 'Alte instrumente IA', no_impact: 'Fără impact', slight: 'Impact redus', moderate: 'Impact moderat', significant: 'Impact semnificativ',
  individual_only: 'Utilizare individuală', informal_sharing: 'Partajare informală', some_team_practices: 'Practici parțiale', fully_integrated: 'Complet integrată',
  suggests_only: 'Doar sugestii', generates_outputs: 'Generează conținut', executes_with_supervision: 'Execută cu supraveghere', runs_workflows: 'Rulează fluxuri complete',
  no: 'Nu', limited_async: 'Limitat', yes_independent: 'Da', no_measurement: 'Nu', informal_tracking: 'Informal', defined_metrics: 'Indicatori definiți',
  requirements_specs: 'Cerințe', planning_project_management: 'Planificare', coding: 'Dezvoltare', code_review: 'Revizuire cod', testing: 'Testare', debugging: 'Depanare', deployment: 'Implementare', production_operations: 'Operațiuni', documentation: 'Documentație',
  no_effort: 'Fără efort', ad_hoc_learning: 'Învățare informală', self_learning: 'Auto-învățare', structured_learning: 'Formare structurată', advanced_usage: 'Utilizare avansată'
};
const ptOptionLabels = {
  developer: 'Desenvolvedor', qa_testing_quality: 'QA / Testes / Qualidade', project_product_business_analysis_operations: 'Projeto / Produto / Análise de Negócios / Operações',
  no_use: 'Não utilizo IA', occasional: 'Ocasionalmente', regular: 'Regularmente', most_tasks: 'Na maioria das minhas tarefas',
  other_general_ai_tools: 'Outras ferramentas', no_impact: 'Nenhum impacto', slight: 'Leve melhoria', moderate: 'Melhoria moderada', significant: 'Melhoria significativa',
  individual_only: 'Uso individual', informal_sharing: 'Compartilhamento informal', some_team_practices: 'Algumas práticas', fully_integrated: 'Totalmente integrada',
  suggests_only: 'Apenas sugestões', generates_outputs: 'Gera conteúdo', executes_with_supervision: 'Executa com supervisão', runs_workflows: 'Executa fluxos completos',
  no: 'Não', limited_async: 'Limitado', yes_independent: 'Sim', no_measurement: 'Não', informal_tracking: 'Informal', defined_metrics: 'Métricas definidas',
  requirements_specs: 'Requisitos', planning_project_management: 'Planejamento', coding: 'Desenvolvimento', code_review: 'Revisão de código', testing: 'Testes', debugging: 'Depuração', deployment: 'Implantação', production_operations: 'Operações', documentation: 'Documentação',
  no_effort: 'Nenhum esforço', ad_hoc_learning: 'Aprendizado informal', self_learning: 'Autoaprendizado', structured_learning: 'Treinamento estruturado', advanced_usage: 'Uso avançado'
};

function enrichLabels() {
  const all = [...surveyConfig.coreQuestions, ...Object.values(surveyConfig.branches).flatMap((b) => b.questions), surveyConfig.finalOptionalComment];
  all.forEach((q) => {
    q.label = { en: q.label.en, fr: q.label.fr, ro: roQuestionLabels[q.id] || q.label.ro || q.label.en, pt: ptQuestionLabels[q.id] || q.label.pt || q.label.en };
    if (q.helperText) q.helperText = { en: q.helperText.en, fr: q.helperText.fr, ro: q.helperText.ro || q.helperText.en, pt: q.helperText.pt || q.helperText.en };
    if (q.microcopy) q.microcopy = { en: q.microcopy.en, fr: q.microcopy.fr, ro: q.microcopy.ro || q.microcopy.en, pt: q.microcopy.pt || q.microcopy.en };
    if (q.tooltipTitle) q.tooltipTitle = { en: q.tooltipTitle.en, fr: q.tooltipTitle.fr, ro: q.tooltipTitle.ro || q.tooltipTitle.en, pt: q.tooltipTitle.pt || q.tooltipTitle.en };
    if (q.tooltipBody) q.tooltipBody = { en: q.tooltipBody.en, fr: q.tooltipBody.fr, ro: q.tooltipBody.ro || q.tooltipBody.en, pt: q.tooltipBody.pt || q.tooltipBody.en };
    if (q.placeholder) q.placeholder = { en: q.placeholder.en, fr: q.placeholder.fr, ro: q.placeholder.ro || q.placeholder.en, pt: q.placeholder.pt || q.placeholder.en };
    if (q.options) q.options.forEach((o) => {
      o.label = { en: o.label.en, fr: o.label.fr, ro: roOptionLabels[o.value] || o.label.ro || o.label.en, pt: ptOptionLabels[o.value] || o.label.pt || o.label.en };
      if (o.description) o.description = { en: o.description.en, fr: o.description.fr, ro: o.description.ro || o.description.en, pt: o.description.pt || o.description.en };
    });
  });
  Object.values(surveyConfig.branches).forEach((b) => {
    b.title = { en: b.title.en, fr: b.title.fr, ro: b.title.ro || b.title.en, pt: b.title.pt || b.title.en };
  });
}
enrichLabels();

const isAnswered = (q, v) => !q.required || q.type === 'free_text' || (q.type === 'multi_select' ? Array.isArray(v) && v.length > 0 : Boolean(v));

function App() {
  const [lang, setLang] = useState('en');
  const [answers, setAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [endpoint, setEndpoint] = useState('');
  const [meta, setMeta] = useState(DEFAULT_META());
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
      const savedLang = parsed.language || parsed.lang || 'en';
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
    setNeedsDraftDecision(false);
    setResumeCandidate(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const resumePreviousResponse = () => {
    if (!resumeCandidate) return;
    setLang(resumeCandidate.language || resumeCandidate.lang || 'en');
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
  const onReview = index >= flow.length;
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
    return { ...prev, [id]: existing.includes(value) ? existing.filter((x) => x !== value) : [...existing, value] };
  });

  const next = () => {
    setError('');
    setTooltipOpen(false);
    if (current && !isAnswered(current, answers[current.id])) return setError(t.requiredError);
    setIndex((i) => Math.min(i + 1, flow.length));
  };

  const submit = async () => {
    if (!branchKey || flow.filter((q) => q.required).some((q) => !isAnswered(q, answers[q.id]))) return setError(t.incompleteError);

    const coreAnswers = {};
    surveyConfig.coreQuestions.forEach((q) => coreAnswers[q.id] = answers[q.id] ?? (q.type === 'multi_select' ? [] : null));
    const branchAnswers = {};
    if (branchDef) branchDef.questions.forEach((q) => branchAnswers[q.id] = answers[q.id] ?? (q.type === 'multi_select' ? [] : null));

    const payload = {
      role: answers.q1_role || null,
      contractModel: answers.q2_contract_model || null,
      coreAnswers,
      branch: branchKey,
      branchAnswers,
      comment: answers.comment1 || '',
      metadata: { surveyDate: meta.surveyDate, teamName: meta.teamName, respondent: meta.respondent },
      submittedAt: new Date().toISOString(),
    };

    try {
      setStatus('submitting');
      if (endpoint.trim()) {
        const r = await fetch(endpoint.trim(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
      } else {
        console.info(t.noEndpoint, payload);
      }
      localStorage.removeItem(STORAGE_KEY);
      setStatus('success');
    } catch (e) {
      setStatus('idle');
      setError(`Submission failed: ${e.message}`);
    }
  };

  if (status === 'success') {
    return <section className="panel success-panel"><h2>{t.successTitle}</h2><p>{t.successBody}</p></section>;
  }

  return (
    <div className="survey-shell">
      <section className="panel header-panel">
        <div className="language-toggle">
          <span>{t.language}</span>
          <button type="button" className={lang === 'en' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('en')}>EN</button>
          <button type="button" className={lang === 'fr' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('fr')}>FR</button>
          <button type="button" className={lang === 'ro' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('ro')}>RO</button>
          <button type="button" className={lang === 'pt' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('pt')}>PT</button>
        </div>
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
        <div className="header-actions">
          <button type="button" className="secondary-action" onClick={startNewResponse}>{t.startNew}</button>
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
        {!onReview && current && (
          <>
            <p className="section-title">{current.section}</p>
            {current.type === 'transition' ? (
              <div className="transition-box">
                <h2>{t.transitionTitle}</h2>
                <p>{t.transitionBody} <strong>{localize(branchDef?.title || '', lang)}</strong></p>
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
                  return (
                    <label className={`option-card ${checked ? 'active' : ''}`} key={option.value}>
                      <input type={current.type === 'single_choice' ? 'radio' : 'checkbox'} name={current.id} checked={checked} onChange={() => current.type === 'single_choice' ? setSingle(current.id, option.value) : toggleMulti(current.id, option.value)} />
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

        {onReview && (
          <>
            <p className="section-title">{t.review}</p>
            <h2>{t.ready}</h2>
            <div className="review-grid">
              <div><strong>{t.role}</strong><div>{answers.q1_role || '-'}</div></div>
              <div><strong>{t.branch}</strong><div>{branchDef ? localize(branchDef.title, lang) : '-'}</div></div>
              <div><strong>{t.coreQuestions}</strong><div>{surveyConfig.coreQuestions.length}</div></div>
              <div><strong>{t.branchQuestions}</strong><div>{branchDef ? branchDef.questions.length : 0}</div></div>
            </div>
          </>
        )}

        {error && <p className="error">{error}</p>}

        <div className="actions">
          <button type="button" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>{t.previous}</button>
          {!onReview ? <button type="button" onClick={next}>{current?.type === 'transition' ? t.continue : t.next}</button> : <button type="button" onClick={submit} disabled={status === 'submitting'}>{status === 'submitting' ? t.submitting : t.submit}</button>}
        </div>
      </section>
        </>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
