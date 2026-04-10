const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = 'agenticSdlcBranchingSurveyV3';
const DRAFT_VERSION = 1;
const DRAFT_TTL_MS = 72 * 60 * 60 * 1000;
const DEFAULT_META = () => ({ surveyDate: new Date().toISOString().slice(0, 10), teamName: '', respondent: '' });

const uiText = {
  en: {
    title: 'Agentic SDLC Diagnostic',
    subtitle: '12 core + 12 role-specific required questions plus 1 optional final comment. Professional, structured, and analytics-ready.',
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
  },
  fr: {
    title: 'Diagnostic SDLC Agentique',
    subtitle: '12 questions cœur + 12 questions spécifiques au rôle (obligatoires) + 1 commentaire final optionnel.',
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
    submitResponse: 'Soumettre la réponse',
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
    introHeading: 'Bienvenue',
    introP1: 'Nous lançons cette enquête à l’échelle de l’entreprise afin de mieux comprendre comment l’IA est réellement utilisée au sein de nos équipes dans les pratiques, les workflows et le travail de delivery au quotidien.',
    introGoalLabel: 'Notre objectif est simple :',
    introGoal1: 'identifier ce qui fonctionne',
    introGoal2: 'comprendre notre niveau actuel de maturité',
    introGoal3: 'accélérer, de manière collective, notre utilisation de l’IA',
    introP2: 'Il ne s’agit pas d’une évaluation individuelle. Cette démarche vise à refléter la réalité du terrain : les usages actuels, les difficultés rencontrées et les opportunités.',
    introListLabel: 'Vos réponses nous permettront de :',
    introList1: 'améliorer les outils et le support proposés',
    introList2: 'partager les bonnes pratiques entre équipes',
    introList3: 'prioriser les actions de formation et les investissements',
    introList4: 'faire évoluer notre modèle de delivery',
    introP3: 'Le questionnaire prend seulement quelques minutes à compléter. Les réponses seront analysées de manière agrégée.',
    introThanks: 'Merci pour votre contribution.',
    allRequiredCompleted: 'Toutes les questions obligatoires ont été complétées.',
    doneReadyToSubmit: 'Vous avez terminé — prêt à soumettre vos réponses.',
    questionsAnswered: 'Questions répondues',
    submitHelper: 'La soumission prend quelques secondes.',
    thankYouTitle: 'Merci',
    submittedSuccess: 'Votre réponse a été soumise avec succès.',
    submittedSupport: 'Merci d’avoir pris le temps de compléter ce questionnaire. Votre contribution nous aide à mieux comprendre comment l’IA est utilisée dans l’organisation et où améliorer les outils, le support et les pratiques.',
    submittedAggregated: 'Vos réponses seront analysées de manière agrégée.',
    submitAnother: 'Soumettre une autre réponse',
  },
  ro: {
    title: 'Diagnostic SDLC Agentic',
    subtitle: '12 întrebări de bază + 12 întrebări specifice rolului + 1 comentariu final opțional.',
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
  },
  pt: {
    title: 'Diagnóstico SDLC Agêntico',
    subtitle: '12 perguntas centrais + 12 perguntas específicas por papel + 1 comentário final opcional.',
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
    submitResponse: 'Enviar resposta',
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
    introHeading: 'Bem-vindo',
    introP1: 'Estamos lançando esta pesquisa em toda a empresa para entender melhor como a IA está sendo realmente utilizada em nossas equipes, nas práticas do dia a dia, nos fluxos de trabalho e no trabalho de delivery.',
    introGoalLabel: 'Nosso objetivo é simples:',
    introGoal1: 'identificar o que está funcionando',
    introGoal2: 'entender nosso nível atual de maturidade',
    introGoal3: 'acelerar, de forma coletiva, a maneira como usamos IA',
    introP2: 'Isto não é uma avaliação individual. O objetivo é refletir a realidade do dia a dia: práticas atuais, desafios e oportunidades.',
    introListLabel: 'Suas respostas vão nos ajudar a:',
    introList1: 'melhorar as ferramentas e o suporte disponíveis',
    introList2: 'compartilhar boas práticas entre equipes',
    introList3: 'priorizar ações de capacitação e investimentos',
    introList4: 'evoluir nosso modelo de delivery',
    introP3: 'A pesquisa leva apenas alguns minutos para ser concluída. As respostas serão analisadas de forma agregada.',
    introThanks: 'Obrigado pela sua contribuição.',
    allRequiredCompleted: 'Todas as perguntas obrigatórias foram concluídas.',
    doneReadyToSubmit: 'Você concluiu — pronto para enviar suas respostas.',
    questionsAnswered: 'Perguntas respondidas',
    submitHelper: 'O envio leva alguns segundos.',
    thankYouTitle: 'Obrigado',
    submittedSuccess: 'Sua resposta foi enviada com sucesso.',
    submittedSupport: 'Obrigado por dedicar seu tempo para concluir esta pesquisa. Sua contribuição nos ajudará a entender melhor como a IA é usada na organização e onde podemos melhorar ferramentas, suporte e práticas.',
    submittedAggregated: 'As respostas serão analisadas de forma agregada.',
    submitAnother: 'Enviar outra resposta',
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
const frequencyScale = [
  { value: 'never', label: L('Never', 'Jamais', 'Niciodată', 'Nunca') },
  { value: 'rarely', label: L('Rarely', 'Rarement', 'Rar', 'Raramente') },
  { value: 'sometimes', label: L('Sometimes', 'Parfois', 'Uneori', 'Às vezes') },
  { value: 'often', label: L('Often', 'Souvent', 'Des', 'Frequentemente') },
  { value: 'almost_always', label: L('Almost always', 'Presque toujours', 'Aproape întotdeauna', 'Quase sempre') },
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
    { id: 'q2_ai_usage', type: 'single_choice', required: true, label: L('How often do you use AI in your work?', 'À quelle fréquence utilisez-vous l’IA dans votre travail ?', 'Cât de des folosești IA în activitatea ta?', 'Com que frequência você usa IA no seu trabalho?'), options: [
      { value: 'no_use', label: L('I do not use AI', 'Je n’utilise pas l’IA') },
      { value: 'few_times_per_week', label: L('I use it a few times per week', 'Je l’utilise quelques fois par semaine', 'O folosesc de câteva ori pe săptămână', 'Utilizo algumas vezes por semana') },
      { value: 'every_day', label: L('I use it every day', 'Je l’utilise tous les jours', 'O folosesc în fiecare zi', 'Utilizo todos os dias') },
      { value: 'many_times_per_day', label: L('I use it many times a day', 'Je l’utilise plusieurs fois par jour', 'O folosesc de mai multe ori pe zi', 'Utilizo várias vezes por dia') },
    ] },
    { id: 'q3_general_tools', type: 'multi_select', required: true, label: L('Which general-purpose AI tools do you currently use in your work?', 'Quels outils d’IA généralistes utilisez-vous actuellement dans votre travail ?', 'Ce instrumente de IA cu uz general folosești în prezent în activitatea ta?', 'Quais ferramentas de IA de uso geral você utiliza atualmente no seu trabalho?'), options: [
      { value: 'chatgpt', label: L('ChatGPT', 'ChatGPT') },
      { value: 'claude', label: L('Claude', 'Claude') },
      { value: 'microsoft_copilot', label: L('Microsoft Copilot', 'Microsoft Copilot') },
      { value: 'gemini', label: L('Gemini', 'Gemini') },
      { value: 'perplexity', label: L('Perplexity', 'Perplexity') },
      { value: 'le_chat_mistral', label: L('Le Chat (Mistral)', 'Le Chat (Mistral)', 'Le Chat (Mistral)', 'Le Chat (Mistral)') },
      { value: 'client_internal_ai_tools', label: L('Client-provided internal AI tools', 'Outils d’IA internes fournis par le client', 'Instrumente interne de IA furnizate de client', 'Ferramentas internas de IA fornecidas pelo cliente') },
      { value: 'other_general_ai_tools', label: L('Other general-purpose AI tools', 'Autres outils d’IA généralistes', 'Alte instrumente de IA cu uz general', 'Outras ferramentas de IA de uso geral') },
      { value: 'no_general_ai_tools', label: L('I do not use general-purpose AI tools', 'Je n’utilise pas d’outils d’IA généralistes', 'Nu folosesc instrumente de IA cu uz general', 'Não utilizo ferramentas de IA de uso geral') },
    ] },
    { id: 'q4_productivity', type: 'single_choice', required: true, label: L('How much does AI improve your productivity?', 'Dans quelle mesure l’IA améliore-t-elle votre productivité ?'), options: [
      { value: 'no_impact', label: L('No impact', 'Aucun impact') },
      { value: 'moderate_improvement', label: L('Moderate improvement', 'Amélioration modérée', 'Îmbunătățire moderată', 'Melhoria moderada') },
      { value: 'significant_improvement', label: L('Significant improvement', 'Amélioration significative', 'Îmbunătățire semnificativă', 'Melhoria significativa') },
      { value: 'rely_on_ai_for_workload', label: L('I would struggle to handle my workload without AI', 'J’aurais du mal à gérer ma charge de travail sans l’IA', 'Mi-ar fi greu să îmi gestionez volumul de muncă fără IA', 'Eu teria dificuldade para lidar com minha carga de trabalho sem IA') },
    ] },
    { id: 'q5_quality', type: 'single_choice', required: true, label: L('How much does AI improve the quality of your work output?', 'Dans quelle mesure l’IA améliore-t-elle la qualité de ce que vous produisez ?', 'În ce măsură îți îmbunătățește IA calitatea rezultatelor muncii tale?', 'Em que medida a IA melhora a qualidade do que você produz?'), options: [
      { value: 'no_impact', label: L('No impact', 'Aucun impact') },
      { value: 'moderate_improvement', label: L('Moderate improvement', 'Amélioration modérée', 'Îmbunătățire moderată', 'Melhoria moderada') },
      { value: 'significant_improvement', label: L('Significant improvement', 'Amélioration significative', 'Îmbunătățire semnificativă', 'Melhoria significativa') },
      { value: 'higher_quality_with_ai', label: L('AI helps me produce work I would struggle to reach otherwise', 'L’IA m’aide à produire un niveau de qualité que j’aurais du mal à atteindre autrement', 'IA mă ajută să obțin un nivel de calitate pe care mi-ar fi greu să îl ating altfel', 'A IA me ajuda a produzir um nível de qualidade que eu teria dificuldade de alcançar de outra forma') },
    ] },
    { id: 'q6_team_usage', type: 'single_choice', required: true, label: L('How is AI currently used within your team?', 'Comment l’IA est-elle actuellement utilisée au sein de votre équipe ?', 'Cum este utilizată în prezent IA în cadrul echipei tale?', 'Como a IA é atualmente utilizada dentro da sua equipe?'), options: [
      { value: 'individual_only', label: L('Individual use only', 'Usage individuel uniquement', 'Utilizare individuală doar', 'Uso individual apenas') },
      { value: 'informal_sharing', label: L('Team members share practices informally', 'Les membres de l’équipe partagent leurs pratiques de manière informelle', 'Membrii echipei își împărtășesc practicile în mod informal', 'Os membros da equipe compartilham práticas de forma informal') },
      { value: 'some_team_practices', label: L('Some team practices or guidelines are defined', 'Certaines pratiques ou consignes d’équipe sont définies', 'Există anumite practici sau reguli de echipă definite', 'Algumas práticas ou orientações da equipe estão definidas') },
      { value: 'workflow_integrated', label: L('AI is integrated into team workflows', 'L’IA est intégrée aux workflows de l’équipe', 'IA este integrată în fluxurile de lucru ale echipei', 'A IA está integrada aos fluxos de trabalho da equipe') },
    ] },
    { id: 'q7_autonomy', type: 'single_choice', required: true, label: L('What is the highest level of autonomy you currently use with AI in your work?', 'Quel est le niveau d’autonomie le plus élevé que vous utilisez actuellement avec l’IA dans votre travail ?', 'Care este cel mai ridicat nivel de autonomie pe care îl folosești în prezent cu IA în activitatea ta?', 'Qual é o nível mais alto de autonomia que você utiliza atualmente com IA no seu trabalho?'), options: [
      { value: 'suggests_only', label: L('AI provides suggestions only', 'L’IA fournit uniquement des suggestions', 'IA oferă doar sugestii', 'A IA fornece apenas sugestões') },
      { value: 'generates_outputs', label: L('AI generates content, code, or other outputs', 'L’IA génère du contenu, du code ou d’autres livrables', 'IA generează conținut, cod sau alte rezultate', 'A IA gera conteúdo, código ou outros resultados') },
      { value: 'executes_tasks_with_supervision', label: L('AI executes tasks with human supervision', 'L’IA exécute des tâches avec supervision humaine', 'IA execută sarcini cu supraveghere umană', 'A IA executa tarefas com supervisão humana') },
      { value: 'runs_workflows_end_to_end', label: L('AI runs workflows end-to-end', 'L’IA exécute des workflows de bout en bout', 'IA rulează fluxuri de lucru cap-coadă', 'A IA executa fluxos de trabalho de ponta a ponta') },
    ] },
    { id: 'q8_async', type: 'single_choice', required: true, label: L('Can AI continue working on some tasks without your constant involvement?', 'L’IA peut-elle continuer à travailler sur certaines tâches sans votre implication constante ?', 'Poate IA să continue să lucreze la anumite sarcini fără implicarea ta constantă?', 'A IA consegue continuar trabalhando em algumas tarefas sem o seu envolvimento constante?'), options: [
      { value: 'continuous_involvement_required', label: L('No, I need to stay involved throughout', 'Non, je dois rester impliqué du début à la fin', 'Nu, trebuie să rămân implicat pe tot parcursul', 'Não, preciso permanecer envolvido o tempo todo') },
      { value: 'partial_handoff', label: L('Partly, I can hand off some tasks and come back later', 'Partiellement, je peux lui confier certaines tâches et y revenir plus tard', 'Parțial, pot delega unele sarcini și să revin mai târziu', 'Parcialmente, posso delegar algumas tarefas e voltar depois') },
      { value: 'independent_tasks', label: L('Yes, some tasks can run independently', 'Oui, certaines tâches peuvent s’exécuter de manière autonome', 'Da, unele sarcini pot rula independent', 'Sim, algumas tarefas podem ser executadas de forma independente') },
    ] },
    { id: 'q9_measurement', type: 'single_choice', required: true, label: L('How do you currently measure the impact of AI in your work?', 'Comment mesurez-vous actuellement l’impact de l’IA dans votre travail ?', 'Cum măsori în prezent impactul IA în activitatea ta?', 'Como você mede atualmente o impacto da IA no seu trabalho?'), options: [
      { value: 'no_measurement', label: L('It is not measured', 'Il n’est pas mesuré', 'Nu este măsurat', 'Não é medido') },
      { value: 'informal_tracking', label: L('It is tracked informally', 'Il est suivi de manière informelle', 'Este urmărit informal', 'É acompanhado de forma informal') },
      { value: 'defined_metrics', label: L('It is measured with defined metrics', 'Il est mesuré à l’aide d’indicateurs définis', 'Este măsurat prin indicatori definiți', 'É medido com métricas definidas') },
    ] },
    { id: 'q10_sdlc_usage', type: 'multi_select', required: true, label: L('In which parts of the software delivery lifecycle is AI currently used in your team or immediate work environment?', 'Dans quelles parties du cycle de delivery logiciel l’IA est-elle actuellement utilisée dans votre équipe ou votre environnement de travail immédiat ?', 'În ce părți ale ciclului de livrare software este utilizată în prezent IA în echipa ta sau în mediul tău imediat de lucru?', 'Em quais partes do ciclo de entrega de software a IA é atualmente utilizada em sua equipe ou em seu ambiente de trabalho imediato?'), options: [
      { value: 'requirements_business_analysis', label: L('Requirements / Business Analysis', 'Exigences / Analyse métier', 'Cerințe / Analiză de business', 'Requisitos / Análise de Negócio') },
      { value: 'planning_coordination', label: L('Planning / Coordination', 'Planification / Coordination', 'Planificare / Coordonare', 'Planejamento / Coordenação') },
      { value: 'coding_implementation', label: L('Coding / Implementation', 'Développement / Implémentation', 'Dezvoltare / Implementare', 'Desenvolvimento / Implementação') },
      { value: 'code_review', label: L('Code Review', 'Revue de code') },
      { value: 'testing_validation', label: L('Testing / Validation', 'Tests / Validation', 'Testare / Validare', 'Testes / Validação') },
      { value: 'debugging_troubleshooting', label: L('Debugging / Troubleshooting', 'Débogage / Résolution de problèmes', 'Depanare / Rezolvare probleme', 'Depuração / Resolução de problemas') },
      { value: 'cicd_automation', label: L('CI/CD / Automation', 'CI/CD / Automatisation', 'CI/CD / Automatizare', 'CI/CD / Automação') },
      { value: 'deployment_release', label: L('Deployment / Release', 'Déploiement / Mise en production', 'Deployment / Lansare', 'Implantação / Release') },
      { value: 'production_operations', label: L('Production / Operations', 'Production / Opérations', 'Producție / Operațiuni', 'Produção / Operações') },
      { value: 'documentation_knowledge_sharing', label: L('Documentation / Knowledge Sharing', 'Documentation / Partage de connaissances', 'Documentație / Partajare de cunoștințe', 'Documentação / Compartilhamento de conhecimento') },
    ] },
    { id: 'q11_learning_path', type: 'multi_select', required: true, label: L('How have you learned to use AI tools in your work so far?', 'Comment avez-vous appris à utiliser les outils d’IA dans votre travail jusqu’à présent ?', 'Cum ai învățat până acum să folosești instrumentele IA în activitatea ta?', 'Como você aprendeu até agora a usar ferramentas de IA no seu trabalho?'), options: [
      { value: 'no_learning_effort', label: L('I have not invested time in learning AI tools', 'Je n’ai pas investi de temps pour apprendre à utiliser les outils d’IA', 'Nu am investit timp pentru a învăța să folosesc instrumente IA', 'Não investi tempo em aprender a usar ferramentas de IA') },
      { value: 'personal_projects', label: L('I learned mainly by using AI on personal projects', 'J’ai appris principalement en utilisant l’IA sur des projets personnels', 'Am învățat în principal folosind IA în proiecte personale', 'Aprendi principalmente usando IA em projetos pessoais') },
      { value: 'self_directed_learning', label: L('I learned through tutorials, videos, or documentation', 'J’ai appris via des tutoriels, des vidéos ou de la documentation', 'Am învățat prin tutoriale, videoclipuri sau documentație', 'Aprendi por meio de tutoriais, vídeos ou documentação') },
      { value: 'structured_training', label: L('I followed structured training such as courses or internal programs', 'J’ai suivi une formation structurée, comme des cours ou des programmes internes', 'Am urmat formare structurată, cum ar fi cursuri sau programe interne', 'Participei de treinamentos estruturados, como cursos ou programas internos') },
    ] },
    { id: 'q12_experimentation_level', type: 'single_choice', required: true, label: L('How far do you currently go in experimenting with AI in your work?', 'Jusqu’où allez-vous actuellement dans l’expérimentation de l’IA dans votre travail ?', 'Cât de departe mergi în prezent cu experimentarea IA în activitatea ta?', 'Até que ponto você experimenta IA atualmente no seu trabalho?'), options: [
      { value: 'standard_usage', label: L('I mostly use standard features', 'J’utilise principalement les fonctionnalités standard', 'Folosesc în principal funcțiile standard', 'Uso principalmente recursos padrão') },
      { value: 'occasional_experimentation', label: L('I occasionally try new ways of working with AI', 'J’essaie occasionnellement de nouvelles façons de travailler avec l’IA', 'Încerc ocazional noi moduri de lucru cu IA', 'Experimento ocasionalmente novas formas de trabalhar com IA') },
      { value: 'regular_workflow_refinement', label: L('I regularly test and refine my prompts or workflows', 'Je teste et j’affine régulièrement mes prompts ou mes workflows', 'Testez și îmbunătățesc regulat prompturile sau fluxurile de lucru', 'Testo e refino regularmente meus prompts ou fluxos de trabalho') },
      { value: 'advanced_automation', label: L('I build or use advanced setups such as automation, agents, or reusable workflows', 'Je construis ou j’utilise des usages avancés comme des automatisations, des agents ou des workflows réutilisables', 'Construiesc sau folosesc configurații avansate precum automatizări, agenți sau fluxuri reutilizabile', 'Desenvolvo ou utilizo configurações avançadas, como automações, agentes ou fluxos reutilizáveis') },
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
        { id: 'd11', type: 'multi_select', required: true, label: L('Which AI coding tools or developer assistants do you currently use?', 'Quels outils de codage assisté par l’IA ou assistants de développement utilisez-vous actuellement ?', 'Ce instrumente de codare cu IA sau asistenți pentru dezvoltatori folosești în prezent?', 'Quais ferramentas de codificação com IA ou assistentes para desenvolvedores você utiliza atualmente?'),
          helperText: L(
            'Please select the tools or products you use directly in your development workflow, not the underlying AI models.',
            'Merci de sélectionner les outils ou produits que vous utilisez directement dans votre workflow de développement, et non les modèles d’IA sous-jacents.',
            'Te rugăm să selectezi instrumentele sau produsele pe care le folosești direct în fluxul tău de dezvoltare, nu modelele IA care stau la bază.',
            'Selecione as ferramentas ou produtos que você utiliza diretamente no seu fluxo de desenvolvimento, e não os modelos de IA subjacentes.'
          ),
          options: [
            { value: 'github_copilot_ide', label: L('GitHub Copilot (IDE)', 'GitHub Copilot (IDE)', 'GitHub Copilot (IDE)', 'GitHub Copilot (IDE)') },
            { value: 'github_coding_agent_cloud', label: L('GitHub Coding Agent (Cloud Agent)', 'GitHub Coding Agent (Cloud Agent)', 'GitHub Coding Agent (Cloud Agent)', 'GitHub Coding Agent (Cloud Agent)') },
            { value: 'github_code_review', label: L('GitHub Code Review', 'GitHub Code Review', 'GitHub Code Review', 'GitHub Code Review') },
            { value: 'claude_code', label: L('Claude Code', 'Claude Code', 'Claude Code', 'Claude Code') },
            { value: 'openai_codex', label: L('OpenAI Codex', 'OpenAI Codex', 'OpenAI Codex', 'OpenAI Codex') },
            { value: 'cursor', label: L('Cursor', 'Cursor', 'Cursor', 'Cursor') },
            { value: 'google_antigravity', label: L('Google Antigravity', 'Google Antigravity', 'Google Antigravity', 'Google Antigravity') },
            { value: 'amazon_q_developer', label: L('Amazon Q Developer', 'Amazon Q Developer', 'Amazon Q Developer', 'Amazon Q Developer') },
            { value: 'ibm_watsonx_code_assistant_z', label: L('IBM watsonx Code Assistant for Z', 'IBM watsonx Code Assistant for Z', 'IBM watsonx Code Assistant for Z', 'IBM watsonx Code Assistant for Z') },
            { value: 'replit_ai', label: L('Replit AI', 'Replit AI', 'Replit AI', 'Replit AI') },
            { value: 'v0_vercel', label: L('v0 by Vercel', 'v0 by Vercel', 'v0 by Vercel', 'v0 by Vercel') },
            { value: 'jetbrains_ai_assistant', label: L('JetBrains AI Assistant', 'JetBrains AI Assistant', 'JetBrains AI Assistant', 'JetBrains AI Assistant') },
            { value: 'tabnine', label: L('Tabnine', 'Tabnine', 'Tabnine', 'Tabnine') },
            { value: 'mistral_code', label: L('Mistral Code', 'Mistral Code', 'Mistral Code', 'Mistral Code') },
            { value: 'other_developer_ai_tools', label: L('Other developer AI tools', 'Autres outils IA pour le développement', 'Alte instrumente IA pentru dezvoltare', 'Outras ferramentas IA para desenvolvimento') },
            { value: 'no_coding_agents', label: L('I don’t use coding agents', 'Je n’utilise pas d’agents de codage', 'Nu folosesc agenți de codare', 'Não utilizo agentes de codificação') },
          ] },
        { id: 'd12', type: 'multi_select', required: true, label: L('How are these AI coding tools adopted in your environment?', 'Comment ces outils de codage assisté par l’IA sont-ils adoptés dans votre environnement ?', 'Cum sunt adoptate aceste instrumente de codare cu IA în mediul tău?', 'Como essas ferramentas de codificação com IA são adotadas no seu ambiente?'), options: [
          { value: 'personally_chosen', label: L('Some are chosen individually', 'Certains sont choisis individuellement', 'Unele sunt alese individual', 'Algumas são escolhidas individualmente') },
          { value: 'informal_team_use', label: L('Some are used informally within the team', 'Certains sont utilisés de manière informelle dans l’équipe', 'Unele sunt folosite informal în cadrul echipei', 'Algumas são utilizadas informalmente na equipe') },
          { value: 'team_or_project_standard', label: L('Some are standardized at team or project level', 'Certains sont standardisés au niveau de l’équipe ou du projet', 'Unele sunt standardizate la nivel de echipă sau proiect', 'Algumas são padronizadas no nível da equipe ou do projeto') },
          { value: 'client_mandated', label: L('Some are mandated by the client', 'Certains sont imposés par le client', 'Unele sunt impuse de client', 'Algumas são impostas pelo cliente') },
          { value: 'company_standard', label: L('Some are standardized at company level', 'Certains sont standardisés au niveau de l’entreprise', 'Unele sunt standardizate la nivelul companiei', 'Algumas são padronizadas no nível da empresa') },
          { value: 'trial_experimental', label: L('Some are still in trial or experimental use', 'Certains sont encore en phase de test ou d’expérimentation', 'Unele sunt încă în fază de test sau utilizare experimentală', 'Algumas ainda estão em fase de teste ou uso experimental') },
        ] },
      ],
    },
    qa_testing_quality: {
      title: L('QA Automation / Testing / Release Quality Questions', 'Questions QA Automation / Tests / Qualité de release', 'Întrebări QA Automation / Testare / Calitatea release-ului', 'Perguntas de QA Automation / Testes / Qualidade de release'),
      questions: [
        { id: 'branch2_toolbox', type: 'multi_select', required: true, label: L('Which QA automation and testing tools are part of your current day-to-day toolbox?', 'Quels outils d’automatisation QA et de test font partie de votre boîte à outils au quotidien ?', 'Ce instrumente de automatizare QA și testare fac parte din setul vostru de instrumente folosit zi de zi?', 'Quais ferramentas de automação de QA e testes fazem parte da sua caixa de ferramentas no dia a dia?'),
          helperText: L('Select all that apply', 'Sélectionnez toutes les réponses applicables', 'Selectați toate variantele care se aplică', 'Selecione todas as opções aplicáveis'),
          options: [
            { value: 'playwright', label: L('Playwright', 'Playwright', 'Playwright', 'Playwright') },
            { value: 'cypress', label: L('Cypress', 'Cypress', 'Cypress', 'Cypress') },
            { value: 'selenium_webdriver', label: L('Selenium WebDriver', 'Selenium WebDriver', 'Selenium WebDriver', 'Selenium WebDriver') },
            { value: 'appium', label: L('Appium', 'Appium', 'Appium', 'Appium') },
            { value: 'postman', label: L('Postman', 'Postman', 'Postman', 'Postman') },
            { value: 'rest_assured', label: L('REST Assured', 'REST Assured', 'REST Assured', 'REST Assured') },
            { value: 'soapui', label: L('SoapUI', 'SoapUI', 'SoapUI', 'SoapUI') },
            { value: 'junit', label: L('JUnit', 'JUnit', 'JUnit', 'JUnit') },
            { value: 'testng', label: L('TestNG', 'TestNG', 'TestNG', 'TestNG') },
            { value: 'pytest', label: L('PyTest', 'PyTest', 'PyTest', 'PyTest') },
            { value: 'mocha', label: L('Mocha', 'Mocha', 'Mocha', 'Mocha') },
            { value: 'jest', label: L('Jest', 'Jest', 'Jest', 'Jest') },
            { value: 'cucumber', label: L('Cucumber', 'Cucumber', 'Cucumber', 'Cucumber') },
            { value: 'jenkins', label: L('Jenkins', 'Jenkins', 'Jenkins', 'Jenkins') },
            { value: 'github_actions', label: L('GitHub Actions', 'GitHub Actions', 'GitHub Actions', 'GitHub Actions') },
            { value: 'gitlab_ci', label: L('GitLab CI', 'GitLab CI', 'GitLab CI', 'GitLab CI') },
            { value: 'circleci', label: L('CircleCI', 'CircleCI', 'CircleCI', 'CircleCI') },
            { value: 'docker', label: L('Docker', 'Docker', 'Docker', 'Docker') },
            { value: 'browserstack', label: L('BrowserStack', 'BrowserStack', 'BrowserStack', 'BrowserStack') },
            { value: 'sauce_labs', label: L('Sauce Labs', 'Sauce Labs', 'Sauce Labs', 'Sauce Labs') },
            { value: 'aws_device_farm', label: L('AWS Device Farm', 'AWS Device Farm', 'AWS Device Farm', 'AWS Device Farm') },
            { value: 'applitools', label: L('Applitools', 'Applitools', 'Applitools', 'Applitools') },
            { value: 'percy', label: L('Percy', 'Percy', 'Percy', 'Percy') },
            { value: 'backstopjs', label: L('BackstopJS', 'BackstopJS', 'BackstopJS', 'BackstopJS') },
            { value: 'jmeter', label: L('JMeter', 'JMeter', 'JMeter', 'JMeter') },
            { value: 'k6', label: L('k6', 'k6', 'k6', 'k6') },
            { value: 'gatling', label: L('Gatling', 'Gatling', 'Gatling', 'Gatling') },
            { value: 'tricentis_neoload', label: L('Tricentis NeoLoad', 'Tricentis NeoLoad', 'Tricentis NeoLoad', 'Tricentis NeoLoad') },
            { value: 'katalon', label: L('Katalon', 'Katalon', 'Katalon', 'Katalon') },
            { value: 'testsigma', label: L('Testsigma', 'Testsigma', 'Testsigma', 'Testsigma') },
            { value: 'accelq', label: L('ACCELQ', 'ACCELQ', 'ACCELQ', 'ACCELQ') },
            { value: 'mabl', label: L('mabl', 'mabl', 'mabl', 'mabl') },
            { value: 'tricentis_tosca', label: L('Tricentis Tosca', 'Tricentis Tosca', 'Tricentis Tosca', 'Tricentis Tosca') },
            { value: 'uipath_test_suite_cloud', label: L('UiPath Test Suite / Test Cloud', 'UiPath Test Suite / Test Cloud', 'UiPath Test Suite / Test Cloud', 'UiPath Test Suite / Test Cloud') },
            { value: 'other_qa_automation_testing_tools', label: L('Other QA automation / testing tools', 'Autres outils d’automatisation QA / de test', 'Alte instrumente de automatizare QA / testare', 'Outras ferramentas de automação de QA / testes') },
            { value: 'do_not_work_directly_with_tools', label: L('I do not work directly with these tools', 'Je ne travaille pas directement avec ces outils', 'Nu lucrez direct cu aceste instrumente', 'Não trabalho diretamente com essas ferramentas') },
          ] },
        { id: 'branch2_ai_tools', type: 'multi_select', required: true, label: L('Which AI-enabled tools or platforms do you currently use in your QA automation workflow?', 'Quels outils ou plateformes enrichis par l’IA utilisez-vous actuellement dans votre workflow d’automatisation QA ?', 'Ce instrumente sau platforme cu capabilități AI folosiți în prezent în fluxul vostru de automatizare QA?', 'Quais ferramentas ou plataformas com IA você usa atualmente no seu workflow de automação de QA?'),
          helperText: L('Select all that apply', 'Sélectionnez toutes les réponses applicables', 'Selectați toate variantele care se aplică', 'Selecione todas as opções aplicáveis'),
          options: [
            { value: 'github_copilot', label: L('GitHub Copilot', 'GitHub Copilot', 'GitHub Copilot', 'GitHub Copilot') },
            { value: 'github_copilot_workspace_coding_agent', label: L('GitHub Copilot Workspace / Coding Agent', 'GitHub Copilot Workspace / Coding Agent', 'GitHub Copilot Workspace / Coding Agent', 'GitHub Copilot Workspace / Coding Agent') },
            { value: 'claude_claude_code', label: L('Claude / Claude Code', 'Claude / Claude Code', 'Claude / Claude Code', 'Claude / Claude Code') },
            { value: 'openai_chatgpt_codex', label: L('OpenAI / ChatGPT / Codex', 'OpenAI / ChatGPT / Codex', 'OpenAI / ChatGPT / Codex', 'OpenAI / ChatGPT / Codex') },
            { value: 'cursor', label: L('Cursor', 'Cursor', 'Cursor', 'Cursor') },
            { value: 'katalon_ai_features', label: L('Katalon AI features', 'Fonctionnalités IA de Katalon', 'Funcționalități AI Katalon', 'Recursos de IA do Katalon') },
            { value: 'testsigma_ai_features', label: L('Testsigma AI features', 'Fonctionnalités IA de Testsigma', 'Funcționalități AI Testsigma', 'Recursos de IA do Testsigma') },
            { value: 'accelq_ai_features', label: L('ACCELQ AI features', 'Fonctionnalités IA d’ACCELQ', 'Funcționalități AI ACCELQ', 'Recursos de IA do ACCELQ') },
            { value: 'mabl_ai_features', label: L('mabl AI features', 'Fonctionnalités IA de mabl', 'Funcționalități AI mabl', 'Recursos de IA do mabl') },
            { value: 'tricentis_tosca_ai_capabilities', label: L('Tricentis Tosca AI capabilities', 'Capacités IA de Tricentis Tosca', 'Capabilități AI Tricentis Tosca', 'Capacidades de IA do Tricentis Tosca') },
            { value: 'uipath_ai_autopilot_testing', label: L('UiPath AI / Autopilot for testing', 'UiPath AI / Autopilot for testing', 'UiPath AI / Autopilot for testing', 'UiPath AI / Autopilot for testing') },
            { value: 'applitools_visual_ai', label: L('Applitools Visual AI', 'Applitools Visual AI', 'Applitools Visual AI', 'Applitools Visual AI') },
            { value: 'kaneai_testmu_ai', label: L('KaneAI / TestMu AI', 'KaneAI / TestMu AI', 'KaneAI / TestMu AI', 'KaneAI / TestMu AI') },
            { value: 'browserstack_ai_features', label: L('BrowserStack AI features', 'Fonctionnalités IA de BrowserStack', 'Funcționalități AI BrowserStack', 'Recursos de IA do BrowserStack') },
            { value: 'other_ai_tools_for_qa_automation', label: L('Other AI tools used for QA automation', 'Autres outils IA utilisés pour l’automatisation QA', 'Alte instrumente AI folosite pentru automatizare QA', 'Outras ferramentas de IA usadas em automação de QA') },
            { value: 'do_not_use_ai_tools_in_qa_workflow', label: L('I do not currently use AI tools in my QA workflow', 'Je n’utilise pas actuellement d’outils IA dans mon workflow QA', 'În prezent nu folosesc instrumente AI în fluxul meu QA', 'Atualmente não uso ferramentas de IA no meu workflow de QA') },
          ] },
        { id: 'branch2_ai_usage_modes', type: 'multi_select', required: true, maxSelections: 3, label: L('How are these AI tools most commonly used in your QA automation workflow today?', 'Comment ces outils IA sont-ils le plus souvent utilisés aujourd’hui dans votre workflow d’automatisation QA ?', 'Cum sunt folosite cel mai des aceste instrumente AI astăzi în fluxul vostru de automatizare QA?', 'Como essas ferramentas de IA são mais usadas hoje no seu workflow de automação de QA?'),
          helperText: L('Select up to 3', 'Sélectionnez jusqu’à 3 réponses', 'Selectați maximum 3 variante', 'Selecione até 3 opções'),
          options: [
            { value: 'requirements_to_test_scenarios', label: L('Turn requirements or acceptance criteria into test scenarios', 'Transformer des exigences ou critères d’acceptation en scénarios de test', 'Transformarea cerințelor sau criteriilor de acceptare în scenarii de test', 'Transformar requisitos ou critérios de aceitação em cenários de teste') },
            { value: 'generate_test_code', label: L('Generate test code', 'Générer du code de test', 'Generarea de cod de test', 'Gerar código de teste') },
            { value: 'update_or_maintain_tests', label: L('Update or maintain existing automated tests', 'Mettre à jour ou maintenir des tests automatisés existants', 'Actualizarea sau mentenanța testelor automate existente', 'Atualizar ou manter testes automatizados existentes') },
            { value: 'diagnose_flaky_tests', label: L('Diagnose flaky tests', 'Diagnostiquer des tests instables (flaky)', 'Diagnosticarea testelor instabile (flaky)', 'Diagnosticar testes instáveis (flaky)') },
            { value: 'analyze_cicd_test_failures', label: L('Analyze CI/CD test failures', 'Analyser des échecs de tests dans le CI/CD', 'Analiza eșecurilor de teste din CI/CD', 'Analisar falhas de testes no CI/CD') },
            { value: 'identify_coverage_gaps_or_edge_cases', label: L('Identify missing coverage or edge cases', 'Identifier des manques de couverture ou des cas limites', 'Identificarea lipsurilor de acoperire sau a cazurilor limită', 'Identificar lacunas de cobertura ou casos de borda') },
            { value: 'summarize_test_results_or_quality_reports', label: L('Summarize test results or quality reports', 'Résumer les résultats de test ou les rapports qualité', 'Rezumarea rezultatelor testelor sau a rapoartelor de calitate', 'Resumir resultados de testes ou relatórios de qualidade') },
            { value: 'support_release_readiness_or_quality_gates', label: L('Support release readiness or quality gate decisions', 'Aider à la préparation des releases ou aux décisions de quality gates', 'Sprijin pentru deciziile de release readiness sau quality gates', 'Apoiar decisões de prontidão para release ou quality gates') },
            { value: 'bounded_generate_test_fix_rerun_loops', label: L('Run bounded generate-test-fix-rerun loops', 'Exécuter des boucles bornées générer-tester-corriger-relancer', 'Rularea unor bucle controlate de tip generează-testează-corectează-rulează din nou', 'Executar loops controlados de gerar-testar-corrigir-executar novamente') },
            { value: 'experimentation_only', label: L('Experimentation only, not part of the real workflow', 'Usage expérimental uniquement, pas intégré au workflow réel', 'Doar experimentare, fără integrare în fluxul real de lucru', 'Apenas experimentação, sem fazer parte do workflow real') },
            { value: 'do_not_use_ai_in_qa_automation', label: L('I do not currently use AI in QA automation', 'Je n’utilise pas actuellement l’IA en automatisation QA', 'În prezent nu folosesc AI în automatizarea QA', 'Atualmente não uso IA em automação de QA') },
          ] },
        { id: 'branch2_req_to_tests_frequency', type: 'single_choice', required: true, label: L('When working from requirements, user stories, or acceptance criteria, how often do you use AI to turn them into executable test scenarios or test cases?', 'Lorsque vous partez d’exigences, de user stories ou de critères d’acceptation, à quelle fréquence utilisez-vous l’IA pour les transformer en scénarios de test exécutables ou en cas de test ?', 'Când porniți de la cerințe, user stories sau criterii de acceptare, cât de des folosiți AI pentru a le transforma în scenarii de test executabile sau cazuri de test?', 'Ao trabalhar a partir de requisitos, user stories ou critérios de aceitação, com que frequência você usa IA para transformá-los em cenários de teste executáveis ou casos de teste?'), options: frequencyScale },
        { id: 'branch2_test_generation_frequency', type: 'single_choice', required: true, label: L('When adding or expanding automated coverage, how often do you use AI to generate or draft test code (UI, API, or integration tests)?', 'Lorsque vous ajoutez ou étendez la couverture automatisée, à quelle fréquence utilisez-vous l’IA pour générer ou rédiger du code de test (UI, API ou tests d’intégration) ?', 'Când adăugați sau extindeți acoperirea automată, cât de des folosiți AI pentru a genera sau redacta cod de test (UI, API sau teste de integrare)?', 'Ao adicionar ou ampliar a cobertura automatizada, com que frequência você usa IA para gerar ou rascunhar código de teste (UI, API ou testes de integração)?'), options: frequencyScale },
        { id: 'branch2_test_maintenance_frequency', type: 'single_choice', required: true, label: L('How often do you use AI to maintain existing automated tests (for example: updating selectors, adjusting assertions, adapting to UI/API changes, or refactoring brittle tests)?', 'À quelle fréquence utilisez-vous l’IA pour maintenir des tests automatisés existants (par exemple : mise à jour des sélecteurs, ajustement des assertions, adaptation aux changements UI/API ou refactorisation de tests fragiles) ?', 'Cât de des folosiți AI pentru mentenanța testelor automate existente (de exemplu: actualizarea selectorilor, ajustarea aserțiunilor, adaptarea la schimbări UI/API sau refactorizarea testelor fragile)?', 'Com que frequência você usa IA para manter testes automatizados existentes (por exemplo: atualizar seletores, ajustar assertions, adaptar a mudanças de UI/API ou refatorar testes frágeis)?'), options: frequencyScale },
        { id: 'branch2_flaky_diagnosis_frequency', type: 'single_choice', required: true, label: L('When a test becomes flaky or unstable, how often do you use AI to help diagnose the cause and propose a fix?', 'Lorsqu’un test devient instable (flaky), à quelle fréquence utilisez-vous l’IA pour aider à diagnostiquer la cause et proposer un correctif ?', 'Când un test devine instabil (flaky), cât de des folosiți AI pentru a ajuta la diagnosticarea cauzei și la propunerea unei remedieri?', 'Quando um teste se torna instável (flaky), com que frequência você usa IA para ajudar a diagnosticar a causa e propor uma correção?'), options: frequencyScale },
        { id: 'branch2_coverage_gaps_frequency', type: 'single_choice', required: true, label: L('How often do you use AI to identify missing coverage, edge cases, or risk areas that are not yet covered by your automated test suites?', 'À quelle fréquence utilisez-vous l’IA pour identifier des manques de couverture, des cas limites ou des zones de risque qui ne sont pas encore couvertes par vos suites de tests automatisés ?', 'Cât de des folosiți AI pentru a identifica lipsuri de acoperire, cazuri limită sau zone de risc care nu sunt încă acoperite de suitele voastre de teste automate?', 'Com que frequência você usa IA para identificar lacunas de cobertura, casos de borda ou áreas de risco que ainda não estão cobertas pelas suas suítes de testes automatizados?'), options: frequencyScale },
        { id: 'branch2_agentic_loop_frequency', type: 'single_choice', required: true, label: L('How often do you use AI in an iterative loop for bounded QA tasks (for example: generate or update a test, run it, inspect failures, revise, and rerun until green or escalation)?', 'À quelle fréquence utilisez-vous l’IA dans une boucle itérative pour des tâches QA bornées (par exemple : générer ou mettre à jour un test, l’exécuter, inspecter les échecs, réviser, puis relancer jusqu’au vert ou à l’escalade) ?', 'Cât de des folosiți AI într-o buclă iterativă pentru sarcini QA bine delimitate (de exemplu: generați sau actualizați un test, îl rulați, inspectați eșecurile, revizuiți și rulați din nou până ajunge verde sau este nevoie de escaladare)?', 'Com que frequência você usa IA em um loop iterativo para tarefas de QA bem delimitadas (por exemplo: gerar ou atualizar um teste, executá-lo, inspecionar falhas, revisar e executar novamente até ficar verde ou exigir escalonamento)?'), options: frequencyScale },
        { id: 'branch2_release_readiness_frequency', type: 'single_choice', required: true, label: L('When preparing a release or evaluating quality gates, how often do you use AI to summarize test outcomes, highlight regressions or risks, and support readiness decisions?', 'Lors de la préparation d’une release ou de l’évaluation des quality gates, à quelle fréquence utilisez-vous l’IA pour résumer les résultats de test, mettre en évidence les régressions ou risques, et appuyer les décisions de readiness ?', 'Atunci când pregătiți un release sau evaluați quality gates, cât de des folosiți AI pentru a rezuma rezultatele testelor, a evidenția regresiile sau riscurile și a sprijini deciziile de readiness?', 'Ao preparar uma release ou avaliar quality gates, com que frequência você usa IA para resumir resultados de testes, destacar regressões ou riscos e apoiar decisões de readiness?'), options: frequencyScale },
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
    label: L('Any additional comments or tools to mention? (optional)', 'Des commentaires supplémentaires ou des outils à mentionner ? (optionnel)', 'Comentarii suplimentare sau instrumente de menționat? (opțional)', 'Algum comentário adicional ou ferramenta para mencionar? (opcional)'),
    placeholder: L('Share anything else you think is useful', 'Partagez tout autre élément que vous jugez utile', 'Împărtășește orice alt lucru pe care îl consideri util', 'Compartilhe qualquer outro ponto que você considere útil'),
  },
};

const roQuestionLabels = {
  q1_role: 'Care dintre următoarele descrie cel mai bine rolul tău?',
  q2_ai_usage: 'Cât de des folosești IA în activitatea ta?',
  q3_general_tools: 'Ce instrumente de IA cu uz general folosești în prezent în activitatea ta?',
  q4_productivity: 'În ce măsură îți îmbunătățește IA productivitatea?',
  q5_quality: 'În ce măsură îți îmbunătățește IA calitatea rezultatelor muncii tale?',
  q6_team_usage: 'Cum este utilizată în prezent IA în cadrul echipei tale?',
  q7_autonomy: 'Care este cel mai ridicat nivel de autonomie pe care îl folosești în prezent cu IA în activitatea ta?',
  q8_async: 'Poate IA să continue să lucreze la anumite sarcini fără implicarea ta constantă?',
  q9_measurement: 'Cum măsori în prezent impactul IA în activitatea ta?',
  q10_sdlc_usage: 'În ce părți ale ciclului de livrare software este utilizată în prezent IA în echipa ta sau în mediul tău imediat de lucru?',
  q11_learning_path: 'Cum ai învățat până acum să folosești instrumentele IA în activitatea ta?',
  q12_experimentation_level: 'Cât de departe mergi în prezent cu experimentarea IA în activitatea ta?',
};
const ptQuestionLabels = {
  q1_role: 'Qual das opções descreve melhor o seu papel?',
  q2_ai_usage: 'Com que frequência você usa IA no seu trabalho?',
  q3_general_tools: 'Quais ferramentas de IA de uso geral você utiliza atualmente no seu trabalho?',
  q4_productivity: 'Em que medida a IA melhora sua produtividade?',
  q5_quality: 'Em que medida a IA melhora a qualidade do que você produz?',
  q6_team_usage: 'Como a IA é atualmente utilizada dentro da sua equipe?',
  q7_autonomy: 'Qual é o nível mais alto de autonomia que você utiliza atualmente com IA no seu trabalho?',
  q8_async: 'A IA consegue continuar trabalhando em algumas tarefas sem o seu envolvimento constante?',
  q9_measurement: 'Como você mede atualmente o impacto da IA no seu trabalho?',
  q10_sdlc_usage: 'Em quais partes do ciclo de entrega de software a IA é atualmente utilizada em sua equipe ou em seu ambiente de trabalho imediato?',
  q11_learning_path: 'Como você aprendeu até agora a usar ferramentas de IA no seu trabalho?',
  q12_experimentation_level: 'Até que ponto você experimenta IA atualmente no seu trabalho?',
};
const roOptionLabels = {
  developer: 'Dezvoltator', qa_testing_quality: 'QA / Testare / Calitate', project_product_business_analysis_operations: 'Proiect / Produs / Analiză Business / Operațiuni',
  no_use: 'Nu folosesc IA', occasional: 'Ocazional', regular: 'În mod regulat', most_tasks: 'În majoritatea sarcinilor mele', few_times_per_week: 'O folosesc de câteva ori pe săptămână', every_day: 'O folosesc în fiecare zi', many_times_per_day: 'O folosesc de mai multe ori pe zi',
  le_chat_mistral: 'Le Chat (Mistral)', client_internal_ai_tools: 'Instrumente interne de IA furnizate de client', other_general_ai_tools: 'Alte instrumente de IA cu uz general', no_general_ai_tools: 'Nu folosesc instrumente de IA cu uz general', no_impact: 'Fără impact', slight: 'Impact redus', moderate: 'Impact moderat', significant: 'Impact semnificativ', moderate_improvement: 'Îmbunătățire moderată', significant_improvement: 'Îmbunătățire semnificativă', rely_on_ai_for_workload: 'Mi-ar fi greu să îmi gestionez volumul de muncă fără IA', higher_quality_with_ai: 'IA mă ajută să obțin un nivel de calitate pe care mi-ar fi greu să îl ating altfel',
  individual_only: 'Utilizare individuală doar', informal_sharing: 'Membrii echipei își împărtășesc practicile în mod informal', some_team_practices: 'Există anumite practici sau reguli de echipă definite', workflow_integrated: 'IA este integrată în fluxurile de lucru ale echipei', fully_integrated: 'Complet integrată',
  suggests_only: 'IA oferă doar sugestii', generates_outputs: 'IA generează conținut, cod sau alte rezultate', executes_tasks_with_supervision: 'IA execută sarcini cu supraveghere umană', runs_workflows_end_to_end: 'IA rulează fluxuri de lucru cap-coadă', executes_with_supervision: 'Execută cu supraveghere', runs_workflows: 'Rulează fluxuri complete',
  continuous_involvement_required: 'Nu, trebuie să rămân implicat pe tot parcursul', partial_handoff: 'Parțial, pot delega unele sarcini și să revin mai târziu', independent_tasks: 'Da, unele sarcini pot rula independent', no: 'Nu', limited_async: 'Limitat', yes_independent: 'Da', no_measurement: 'Nu este măsurat', informal_tracking: 'Este urmărit informal', defined_metrics: 'Este măsurat prin indicatori definiți',
  requirements_business_analysis: 'Cerințe / Analiză de business', planning_coordination: 'Planificare / Coordonare', coding_implementation: 'Dezvoltare / Implementare', code_review: 'Revizuire de cod', testing_validation: 'Testare / Validare', debugging_troubleshooting: 'Depanare / Rezolvare probleme', cicd_automation: 'CI/CD / Automatizare', deployment_release: 'Deployment / Lansare', production_operations: 'Producție / Operațiuni', documentation_knowledge_sharing: 'Documentație / Partajare de cunoștințe', requirements_specs: 'Cerințe', planning_project_management: 'Planificare', coding: 'Dezvoltare', testing: 'Testare', debugging: 'Depanare', deployment: 'Implementare', documentation: 'Documentație',
  no_learning_effort: 'Nu am investit timp pentru a învăța să folosesc instrumente IA', personal_projects: 'Am învățat în principal folosind IA în proiecte personale', informal_learning: 'Am învățat în principal informal, prin încercări și erori', self_directed_learning: 'Am învățat prin tutoriale, videoclipuri sau documentație', structured_training: 'Am urmat formare structurată, cum ar fi cursuri sau programe interne', standard_usage: 'Folosesc în principal funcțiile standard', occasional_experimentation: 'Încerc ocazional noi moduri de lucru cu IA', regular_workflow_refinement: 'Testez și îmbunătățesc regulat prompturile sau fluxurile de lucru', advanced_automation: 'Construiesc sau folosesc configurații avansate precum automatizări, agenți sau fluxuri reutilizabile', no_effort: 'Fără efort', ad_hoc_learning: 'Învățare informală', self_learning: 'Auto-învățare', structured_learning: 'Formare structurată', advanced_usage: 'Utilizare avansată'
};
const ptOptionLabels = {
  developer: 'Desenvolvedor', qa_testing_quality: 'QA / Testes / Qualidade', project_product_business_analysis_operations: 'Projeto / Produto / Análise de Negócios / Operações',
  no_use: 'Não utilizo IA', occasional: 'Ocasionalmente', regular: 'Regularmente', most_tasks: 'Na maioria das minhas tarefas', few_times_per_week: 'Utilizo algumas vezes por semana', every_day: 'Utilizo todos os dias', many_times_per_day: 'Utilizo várias vezes por dia',
  le_chat_mistral: 'Le Chat (Mistral)', client_internal_ai_tools: 'Ferramentas internas de IA fornecidas pelo cliente', other_general_ai_tools: 'Outras ferramentas de IA de uso geral', no_general_ai_tools: 'Não utilizo ferramentas de IA de uso geral', no_impact: 'Nenhum impacto', slight: 'Leve melhoria', moderate: 'Melhoria moderada', significant: 'Melhoria significativa', moderate_improvement: 'Melhoria moderada', significant_improvement: 'Melhoria significativa', rely_on_ai_for_workload: 'Eu teria dificuldade para lidar com minha carga de trabalho sem IA', higher_quality_with_ai: 'A IA me ajuda a produzir um nível de qualidade que eu teria dificuldade de alcançar de outra forma',
  individual_only: 'Uso individual apenas', informal_sharing: 'Os membros da equipe compartilham práticas de forma informal', some_team_practices: 'Algumas práticas ou orientações da equipe estão definidas', workflow_integrated: 'A IA está integrada aos fluxos de trabalho da equipe', fully_integrated: 'Totalmente integrada',
  suggests_only: 'A IA fornece apenas sugestões', generates_outputs: 'A IA gera conteúdo, código ou outros resultados', executes_tasks_with_supervision: 'A IA executa tarefas com supervisão humana', runs_workflows_end_to_end: 'A IA executa fluxos de trabalho de ponta a ponta', executes_with_supervision: 'Executa com supervisão', runs_workflows: 'Executa fluxos completos',
  continuous_involvement_required: 'Não, preciso permanecer envolvido o tempo todo', partial_handoff: 'Parcialmente, posso delegar algumas tarefas e voltar depois', independent_tasks: 'Sim, algumas tarefas podem ser executadas de forma independente', no: 'Não', limited_async: 'Limitado', yes_independent: 'Sim', no_measurement: 'Não é medido', informal_tracking: 'É acompanhado de forma informal', defined_metrics: 'É medido com métricas definidas',
  requirements_business_analysis: 'Requisitos / Análise de Negócio', planning_coordination: 'Planejamento / Coordenação', coding_implementation: 'Desenvolvimento / Implementação', code_review: 'Revisão de código', testing_validation: 'Testes / Validação', debugging_troubleshooting: 'Depuração / Resolução de problemas', cicd_automation: 'CI/CD / Automação', deployment_release: 'Implantação / Release', production_operations: 'Produção / Operações', documentation_knowledge_sharing: 'Documentação / Compartilhamento de conhecimento', requirements_specs: 'Requisitos', planning_project_management: 'Planejamento', coding: 'Desenvolvimento', testing: 'Testes', debugging: 'Depuração', deployment: 'Implantação', documentation: 'Documentação',
  no_learning_effort: 'Não investi tempo em aprender a usar ferramentas de IA', personal_projects: 'Aprendi principalmente usando IA em projetos pessoais', informal_learning: 'Aprendi principalmente de forma informal, por tentativa e erro', self_directed_learning: 'Aprendi por meio de tutoriais, vídeos ou documentação', structured_training: 'Participei de treinamentos estruturados, como cursos ou programas internos', standard_usage: 'Uso principalmente recursos padrão', occasional_experimentation: 'Experimento ocasionalmente novas formas de trabalhar com IA', regular_workflow_refinement: 'Testo e refino regularmente meus prompts ou fluxos de trabalho', advanced_automation: 'Desenvolvo ou utilizo configurações avançadas, como automações, agentes ou fluxos reutilizáveis', no_effort: 'Nenhum esforço', ad_hoc_learning: 'Aprendizado informal', self_learning: 'Autoaprendizado', structured_learning: 'Treinamento estruturado', advanced_usage: 'Uso avançado'
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
// Matches both common Apps Script Web App hosts and URL shapes:
// - https://script.google.com/macros/s/.../exec
// - https://script.googleusercontent.com/.../macros/s/.../exec
const isGoogleAppsScriptUrl = (url) => /https:\/\/script\.google(?:usercontent)?\.com\/(?:.*\/)?macros\/s\//.test(url);
const SURVEY_VERSION = '2026-04';
const SOURCE_APP = 'agentic-sdlc-survey';

const getRuntimeConfig = () => {
  const appConfig = (typeof window !== 'undefined' && window.__APP_CONFIG__) || {};
  const metaContent = (name) => (typeof document !== 'undefined'
    ? (document.querySelector(`meta[name=\"${name}\"]`)?.content || '').trim()
    : '');
  const inferredEnv = (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) ? 'dev' : 'prod';
  return {
    azureSurveySubmitUrl: appConfig.azureSurveySubmitUrl || metaContent('azure-survey-submit-url') || '',
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
          <button type="button" className={lang === 'fr' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('fr')}>FR</button>
          <button type="button" className={lang === 'ro' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('ro')}>RO</button>
          <button type="button" className={lang === 'pt' ? 'lang-btn active' : 'lang-btn'} onClick={() => setLang('pt')}>PT</button>
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
