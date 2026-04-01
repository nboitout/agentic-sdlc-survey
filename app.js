const i18n = {
  en: {
    subtitle: 'Run monthly to track movement across Stage 1-5 maturity.',
    metaTitle: 'Survey Metadata',
    language: 'Language',
    surveyDate: 'Survey date',
    teamName: 'Team / Group name',
    respondent: 'Respondent name',
    optional: 'Optional',
    endpoint: 'Google Apps Script Web App URL',
    submit: 'Submit Survey',
    saveDraft: 'Save Draft Locally',
    typeSingle: 'Single choice',
    typeMulti: 'Multiple choice',
    draftSaved: 'Draft saved locally.',
    submitting: 'Submitting...',
    success: 'Submitted successfully.',
    failed: 'Submit failed. Save a draft and verify your Apps Script URL + CORS settings.',
    questions: [
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
    ]
  },
  fr: {
    subtitle: 'À exécuter chaque mois pour suivre l’évolution de maturité Stage 1-5.',
    metaTitle: 'Métadonnées du survey', language: 'Langue', surveyDate: 'Date du survey', teamName: 'Nom de l’équipe / groupe', respondent: 'Nom du répondant', optional: 'Optionnel', endpoint: 'URL Google Apps Script Web App', submit: 'Soumettre le survey', saveDraft: 'Sauvegarder le draft localement', typeSingle: 'Choix unique', typeMulti: 'Choix multiples', draftSaved: 'Draft sauvegardé localement.', submitting: 'Soumission en cours...', success: 'Soumission réussie.', failed: 'Échec de la soumission. Sauvegardez un draft et vérifiez votre URL Apps Script + CORS.',
    questions: []
  },
  ro: {
    subtitle: 'Rulați lunar pentru a urmări evoluția maturității pe Stage 1-5.',
    metaTitle: 'Metadate survey', language: 'Limbă', surveyDate: 'Data survey-ului', teamName: 'Nume echipă / grup', respondent: 'Nume respondent', optional: 'Opțional', endpoint: 'URL Google Apps Script Web App', submit: 'Trimite survey', saveDraft: 'Salvează draft local', typeSingle: 'O singură opțiune', typeMulti: 'Opțiuni multiple', draftSaved: 'Draft salvat local.', submitting: 'Se trimite...', success: 'Trimis cu succes.', failed: 'Trimiterea a eșuat. Salvează draftul și verifică URL-ul Apps Script + setările CORS.',
    questions: []
  },
  pt: {
    subtitle: 'Execute mensalmente para acompanhar a evolução de maturidade Stage 1-5.',
    metaTitle: 'Metadados do survey', language: 'Idioma', surveyDate: 'Data do survey', teamName: 'Nome da equipe / grupo', respondent: 'Nome do respondente', optional: 'Opcional', endpoint: 'URL do Google Apps Script Web App', submit: 'Enviar survey', saveDraft: 'Salvar draft local', typeSingle: 'Escolha única', typeMulti: 'Múltipla escolha', draftSaved: 'Draft salvo localmente.', submitting: 'Enviando...', success: 'Enviado com sucesso.', failed: 'Falha no envio. Salve um draft e valide a URL do Apps Script + CORS.',
    questions: []
  }
};


const localizedOptions = {
  fr: {
    1: ['Ingénieur logiciel', 'Tech Lead / Architecte', 'QA / Testeur', 'DevOps / SRE', 'Product / Project Manager', 'Production / Run / Support', 'Autre'],
    2: ['Greenfield', 'Brownfield (développement actif)', 'Maintenance legacy', 'Modernisation / migration legacy', 'Portfolio mixte'],
    3: ['Non', 'Oui, occasionnellement', 'Oui, c’est une part significative de mon activité', 'Oui, c’est le cœur de mon projet actuel'],
    4: ['Time & Material (T&M)', 'Prix fixe / delivery engagé', 'Équipe produit interne', 'Managed service / run', 'Modèle mixte'],
    5: ['1–3', '4–8', '9–15', '16+'],
    6: ['Aucun', 'GitHub Copilot (autocomplete uniquement)', 'Copilot Chat / chat IDE', 'ChatGPT (externe)', 'Claude (externe)', 'IDE IA-native (Cursor, Windsurf, etc.)', 'Agents coding CLI (Claude Code, Codex CLI, etc.)', 'Outils IA internes (spécifiques entreprise)'],
    7: ['Aucun', 'GitHub Copilot (autocomplete)', 'Copilot Chat / chat IDE', 'ChatGPT / Claude', 'IDE IA-native', 'Agent coding CLI', 'Outil IA interne'],
    8: ['Nulle part', 'Uniquement dans l’éditeur', 'Dans des outils chat hors codebase', 'À travers IDE + repo + workflow PR', 'Directement dans repo / terminal / workflows CI'],
    9: ['Manuel / sans IA', 'L’IA m’aide à taper plus vite (autocomplete)', 'L’IA m’aide à résoudre des problèmes (chat / prompting)', 'L’IA exécute des tâches pour moi (agents)', 'Les workflows continuent sans moi (system-driven)', 'Le système s’améliore lui-même dans le temps'],
    10: ['Le travail s’arrête complètement', 'Des notes ou drafts restent', 'Des outputs générés par IA m’attendent', 'Certains agents continuent les tâches', 'Le système continue l’exécution et remonte les résultats plus tard', 'Le système améliore les workflows dans le temps'],
    11: ['Aucun', 'Snippets / petits fragments de code', 'Fichier unique / fonction', 'Changements multi-fichiers', 'Feature complète / travail au niveau repo', 'Workflows cross-system'],
    12: ['Non', 'Seulement via copy/paste manuel', 'Oui, mais j’approuve chaque étape', 'Oui, avec autonomie bornée', 'Oui, en autonomie sous guardrails définis'],
    13: ['Une', '1–2 avec aide IA', 'Plusieurs via agents', 'Beaucoup via agents parallèles', 'Exécution continue au-delà de ma session directe'],
    14: ['Jamais', 'Occasionnellement', 'Fréquemment (2–3 agents)', 'Systématiquement (4+ agents)', 'L’exécution parallèle d’agents est le mode par défaut'],
    15: ['Totalement manuel', 'L’IA suggère des commentaires', 'L’IA fait une first-pass review, l’humain valide la majorité', 'L’IA pré-review la majorité, l’humain se concentre sur le critique', 'Seuls les chemins à risque critique reçoivent une review humaine'],
    16: ['Investigation totalement manuelle', 'L’IA aide à analyser logs ou metrics', 'L’IA suggère des correctifs', 'L’IA propose des correctifs et draft des PR', 'L’IA gère la first response avant validation humaine'],
    17: ['Humains uniquement', 'Humains avec support IA', 'Pré-checks IA + validation humaine', 'Policies automatisées + supervision humaine', 'Guardrails automatisés avec revue des exceptions'],
    18: ['Dashboards manuels et interprétation manuelle', 'Dashboards + explication IA', 'L’IA agrège plusieurs sources pour moi', 'Le système résume les signaux clés avant que je regarde', 'Le système interprète en continu les signaux et met à jour les priorités'],
    19: ['Via réunions uniquement', 'Via réunions avec synthèses IA', 'L’IA propose des priorités mais les humains décident', 'Les priorités sont mises à jour via workflows structurés', 'Le système ajuste en continu les priorités sous supervision humaine'],
    20: ['Vitesse de coding', 'Compréhension des requirements', 'Code review', 'Intégration / merge', 'Coordination / alignement', 'Test / QA', 'Déploiement / release', 'Validation de production']
  },
  ro: {
    1: ['Software Engineer', 'Tech Lead / Arhitect', 'QA / Tester', 'DevOps / SRE', 'Product / Project Manager', 'Production / Run / Support', 'Altul'],
    2: ['Greenfield', 'Brownfield (dezvoltare activă)', 'Mentenanță legacy', 'Modernizare / migrare legacy', 'Portofoliu mixt'],
    3: ['Nu', 'Da, ocazional', 'Da, este o parte semnificativă din munca mea', 'Da, este componenta centrală a proiectului curent'],
    4: ['Time & Material (T&M)', 'Preț fix / delivery asumat', 'Echipă internă de produs', 'Managed service / run', 'Model mixt'],
    5: ['1–3', '4–8', '9–15', '16+'],
    6: ['Niciunul', 'GitHub Copilot (doar autocomplete)', 'Copilot Chat / chat în IDE', 'ChatGPT (extern)', 'Claude (extern)', 'IDE AI-native (Cursor, Windsurf etc.)', 'Agenți CLI pentru coding (Claude Code, Codex CLI etc.)', 'Tool-uri AI interne (specifice companiei)'],
    7: ['Niciunul', 'GitHub Copilot (autocomplete)', 'Copilot Chat / chat în IDE', 'ChatGPT / Claude', 'IDE AI-native', 'Agent CLI de coding', 'Tool AI intern'],
    8: ['Nicăieri', 'Doar în editor', 'În tool-uri chat în afara codebase-ului', 'În IDE + repo + workflow PR', 'Direct în repo / terminal / workflow-uri CI'],
    9: ['Manual / fără AI', 'AI mă ajută să scriu mai rapid (autocomplete)', 'AI mă ajută să rezolv probleme (chat / prompting)', 'AI execută task-uri pentru mine (agenți)', 'Workflow-urile continuă fără mine (system-driven)', 'Sistemul se auto-îmbunătățește în timp'],
    10: ['Munca se oprește complet', 'Rămân note sau draft-uri', 'Output-uri generate de AI mă așteaptă', 'Unii agenți continuă task-urile', 'Sistemul continuă execuția și afișează rezultate mai târziu', 'Sistemul îmbunătățește workflow-urile în timp'],
    11: ['Niciunul', 'Snippet-uri / fragmente mici de cod', 'Un singur fișier / funcție', 'Schimbări multi-fișier', 'Feature complet / lucru la nivel de repo', 'Workflow-uri cross-system'],
    12: ['Nu', 'Doar prin copy/paste manual', 'Da, dar aprob fiecare pas', 'Da, cu autonomie limitată', 'Da, autonom în guardrails definite'],
    13: ['Una', '1–2 cu ajutor AI', 'Mai multe prin agenți', 'Multe prin agenți paraleli', 'Execuție continuă dincolo de sesiunea mea directă'],
    14: ['Niciodată', 'Ocazional', 'Frecvent (2–3 agenți)', 'Sistematic (4+ agenți)', 'Execuția paralelă a agenților este modul implicit de lucru'],
    15: ['Complet manual', 'AI sugerează comentarii', 'AI face first-pass review, omul validează majoritatea schimbărilor', 'AI pre-review pentru majoritate, omul se concentrează pe critic', 'Doar path-urile cu risc critic primesc review uman'],
    16: ['Investigație complet manuală', 'AI ajută la analiza de logs sau metrics', 'AI sugerează fix-uri', 'AI propune fix-uri și redactează PR-uri', 'AI gestionează first response înainte de validare umană'],
    17: ['Doar oameni', 'Oameni cu suport AI', 'Pre-check-uri AI + validare umană', 'Policy-uri automate + supervizare umană', 'Guardrails automate cu review pe excepții'],
    18: ['Dashboard-uri manuale și interpretare manuală', 'Dashboard-uri plus explicație AI', 'AI agregă mai multe surse pentru mine', 'Sistemul rezumă semnalele cheie înainte să mă uit', 'Sistemul interpretează continuu semnalele și actualizează prioritățile'],
    19: ['Doar prin meeting-uri', 'Prin meeting-uri susținute de rezumate AI', 'AI propune priorități, dar oamenii decid', 'Prioritățile se actualizează prin workflow-uri structurate', 'Sistemul ajustează continuu prioritățile sub supervizare umană'],
    20: ['Viteză de coding', 'Înțelegerea requirement-urilor', 'Code review', 'Integrare / merge', 'Coordonare / aliniere', 'Testing / QA', 'Deployment / release', 'Validare în producție']
  },
  pt: {
    1: ['Engenheiro de Software', 'Tech Lead / Arquiteto', 'QA / Tester', 'DevOps / SRE', 'Product / Project Manager', 'Production / Run / Support', 'Outro'],
    2: ['Greenfield', 'Brownfield (desenvolvimento ativo)', 'Manutenção legacy', 'Modernização / migração legacy', 'Portfólio misto'],
    3: ['Não', 'Sim, ocasionalmente', 'Sim, é uma parte relevante do meu trabalho', 'Sim, é o núcleo do meu projeto atual'],
    4: ['Time & Material (T&M)', 'Preço fixo / delivery comprometido', 'Time interno de produto', 'Managed service / run', 'Modelo misto'],
    5: ['1–3', '4–8', '9–15', '16+'],
    6: ['Nenhuma', 'GitHub Copilot (apenas autocomplete)', 'Copilot Chat / chat na IDE', 'ChatGPT (externo)', 'Claude (externo)', 'IDE AI-native (Cursor, Windsurf etc.)', 'Agentes CLI de coding (Claude Code, Codex CLI etc.)', 'Ferramentas internas de IA (empresa)'],
    7: ['Nenhuma', 'GitHub Copilot (autocomplete)', 'Copilot Chat / chat na IDE', 'ChatGPT / Claude', 'IDE AI-native', 'Agente CLI de coding', 'Ferramenta interna de IA'],
    8: ['Em nenhum lugar', 'Apenas no editor', 'Em ferramentas de chat fora da codebase', 'Ao longo de IDE + repo + workflow de PR', 'Diretamente em repo / terminal / workflows de CI'],
    9: ['Manual / sem IA', 'A IA me ajuda a digitar mais rápido (autocomplete)', 'A IA me ajuda a resolver problemas (chat / prompting)', 'A IA executa tarefas para mim (agentes)', 'Workflows continuam sem mim (system-driven)', 'O sistema melhora a si mesmo com o tempo'],
    10: ['O trabalho para completamente', 'Algumas notas ou drafts permanecem', 'Outputs gerados por IA ficam me aguardando', 'Alguns agentes continuam tarefas', 'O sistema continua a execução e mostra resultados depois', 'O sistema melhora workflows ao longo do tempo'],
    11: ['Nenhum', 'Snippets / pequenos fragmentos de código', 'Arquivo único / função', 'Mudanças em múltiplos arquivos', 'Feature completa / trabalho em nível de repo', 'Workflows cross-system'],
    12: ['Não', 'Somente via copy/paste manual', 'Sim, mas aprovo cada etapa', 'Sim, com autonomia limitada', 'Sim, autonomamente dentro de guardrails definidos'],
    13: ['Uma', '1–2 com ajuda de IA', 'Várias via agentes', 'Muitas via agentes paralelos', 'Execução contínua além da minha sessão direta'],
    14: ['Nunca', 'Ocasionalmente', 'Frequentemente (2–3 agentes)', 'Sistematicamente (4+ agentes)', 'Execução paralela de agentes é o modo padrão de trabalho'],
    15: ['Totalmente manual', 'A IA sugere comentários', 'A IA faz first-pass review, humano valida a maioria das mudanças', 'A IA pré-revisa a maioria, humano foca nos itens críticos', 'Somente caminhos de risco crítico recebem revisão humana'],
    16: ['Investigação totalmente manual', 'A IA ajuda a analisar logs ou metrics', 'A IA sugere correções', 'A IA propõe correções e cria drafts de PR', 'A IA faz first response antes da validação humana'],
    17: ['Somente humanos', 'Humanos com suporte de IA', 'Pré-checks de IA + validação humana', 'Policies automatizadas + supervisão humana', 'Guardrails automatizados com revisão de exceções'],
    18: ['Dashboards manuais e interpretação manual', 'Dashboards com explicação de IA', 'A IA agrega múltiplas fontes para mim', 'O sistema resume sinais-chave antes de eu olhar', 'O sistema interpreta continuamente os sinais e atualiza prioridades'],
    19: ['Apenas por reuniões', 'Por reuniões com apoio de resumos de IA', 'A IA propõe prioridades, mas humanos decidem', 'Prioridades são atualizadas por workflows estruturados', 'O sistema ajusta prioridades continuamente com supervisão humana'],
    20: ['Velocidade de coding', 'Entendimento de requirements', 'Code review', 'Integração / merge', 'Coordenação / alinhamento', 'Testing / QA', 'Deployment / release', 'Validação em produção']
  }
};

function translateQuestions(questionMapper) {
  return i18n.en.questions.map(questionMapper);
}

i18n.fr.questions = translateQuestions((q) => ({
  ...q,
  section: ({
    'Respondent Context': 'Contexte du répondant',
    'Tooling and AI Interfaces': 'Tooling et interfaces IA',
    'Overall Stage Signal': 'Signal global de stage',
    Scope: 'Scope', Parallelism: 'Parallélisme', Supervision: 'Supervision',
    'Feedback Loops and System Behavior': 'Feedback loops et comportement système',
    'Team Friction and Bottlenecks': 'Friction équipe et bottlenecks'
  })[q.section] || q.section,
  text: ({
    1: 'Quel est votre rôle principal ?',
    2: 'Quel type de projet est votre focus principal actuellement ?',
    3: 'Votre scope inclut-il de la migration legacy (ex. COBOL ou stack legacy modernization) ?',
    4: 'Quel modèle delivery décrit le mieux votre projet actuel ?',
    5: 'Quelle est la taille de votre équipe ?',
    6: 'Quels outils IA utilisez-vous régulièrement ?',
    7: 'Quel outil est votre interface IA principale ?',
    8: 'Où l’IA opère-t-elle dans votre workflow aujourd’hui ?',
    9: 'Quelle phrase décrit le mieux votre mode de fonctionnement actuel ?',
    10: 'Que se passe-t-il quand vous arrêtez de travailler en fin de journée ?',
    11: 'Quel scope de travail l’IA gère-t-elle typiquement pour vous ?',
    12: 'L’IA peut-elle modifier votre codebase end-to-end dans votre workflow ?',
    13: 'Combien de tâches exécutez-vous effectivement en parallèle ?',
    14: 'Utilisez-vous plusieurs agents simultanément ?',
    15: 'Comment le code review est-il géré en pratique ?',
    16: 'Comment la gestion d’incident est-elle gérée ?',
    17: 'Comment la qualité, la compliance et l’enforcement des policies sont-ils gérés ?',
    18: 'Comment comprenez-vous si une feature release fonctionne ?',
    19: 'Comment les priorités sont-elles mises à jour dans votre équipe ?',
    20: 'Quel est le principal bottleneck dans votre modèle delivery actuel ?'
  })[q.n],
  options: localizedOptions.fr[q.n] || q.options
}));

i18n.ro.questions = translateQuestions((q) => ({
  ...q,
  section: ({
    'Respondent Context': 'Context respondent',
    'Tooling and AI Interfaces': 'Tooling și interfețe AI',
    'Overall Stage Signal': 'Semnal stage global',
    Scope: 'Scope', Parallelism: 'Paralelism', Supervision: 'Supervizare',
    'Feedback Loops and System Behavior': 'Feedback loops și comportament de sistem',
    'Team Friction and Bottlenecks': 'Fricțiune în echipă și bottleneck-uri'
  })[q.section] || q.section,
  text: ({
    1: 'Care este rolul tău principal?',
    2: 'Care este tipul principal de proiect la care lucrezi acum?',
    3: 'Scope-ul tău curent include migrare legacy (de exemplu COBOL sau modernization pe stack legacy)?',
    4: 'Ce model de delivery descrie cel mai bine proiectul tău curent?',
    5: 'Care este dimensiunea actuală a echipei?',
    6: 'Ce tool-uri AI folosești regulat?',
    7: 'Care este interfața ta principală pentru AI?',
    8: 'Unde operează AI în workflow-ul tău astăzi?',
    9: 'Ce variantă descrie cel mai bine modul tău actual de lucru?',
    10: 'Ce se întâmplă când te oprești din lucru la finalul zilei?',
    11: 'Ce scope de lucru gestionează AI în mod tipic pentru tine?',
    12: 'Poate AI să modifice codebase-ul tău end-to-end în workflow-ul curent?',
    13: 'Câte task-uri rulezi efectiv în paralel?',
    14: 'Folosești mai mulți agenți simultan?',
    15: 'Cum este gestionat code review-ul în practică?',
    16: 'Cum este gestionat incident response?',
    17: 'Cum sunt gestionate quality, compliance și policy enforcement?',
    18: 'Cum înțelegi dacă un feature lansat funcționează?',
    19: 'Cum sunt actualizate prioritățile în echipa ta?',
    20: 'Care este bottleneck-ul principal în modelul tău curent de delivery?'
  })[q.n],
  options: localizedOptions.ro[q.n] || q.options
}));

i18n.pt.questions = translateQuestions((q) => ({
  ...q,
  section: ({
    'Respondent Context': 'Contexto do respondente',
    'Tooling and AI Interfaces': 'Tooling e interfaces de IA',
    'Overall Stage Signal': 'Sinal geral de stage',
    Scope: 'Escopo', Parallelism: 'Paralelismo', Supervision: 'Supervisão',
    'Feedback Loops and System Behavior': 'Feedback loops e comportamento do sistema',
    'Team Friction and Bottlenecks': 'Fricção de time e bottlenecks'
  })[q.section] || q.section,
  text: ({
    1: 'Qual é o seu papel principal?',
    2: 'Qual é o principal tipo de projeto em que você trabalha atualmente?',
    3: 'Seu escopo atual inclui migração legacy (por exemplo COBOL ou modernização de stack legado)?',
    4: 'Qual modelo de delivery descreve melhor o seu projeto atual?',
    5: 'Qual é o tamanho atual do seu time?',
    6: 'Quais ferramentas de IA você usa regularmente?',
    7: 'Qual ferramenta é sua interface principal de IA?',
    8: 'Onde a IA opera no seu workflow hoje?',
    9: 'Qual opção descreve melhor sua forma atual de trabalho?',
    10: 'O que acontece quando você para de trabalhar no fim do dia?',
    11: 'Qual escopo de trabalho a IA normalmente cobre para você?',
    12: 'A IA pode modificar sua codebase end-to-end no seu workflow?',
    13: 'Quantas tarefas você roda efetivamente em paralelo?',
    14: 'Você usa múltiplos agentes simultaneamente?',
    15: 'Como o code review é tratado na prática?',
    16: 'Como o incident response é tratado?',
    17: 'Como quality, compliance e policy enforcement são tratados?',
    18: 'Como você entende se uma feature em produção está funcionando?',
    19: 'Como as prioridades são atualizadas no seu time?',
    20: 'Qual é o principal bottleneck no seu modelo atual de delivery?'
  })[q.n],
  options: localizedOptions.pt[q.n] || q.options
}));

const questionHost = document.getElementById('questions');
const statusEl = document.getElementById('status');
const form = document.getElementById('survey-form');
const languageSelect = document.getElementById('language');
let currentLanguage = localStorage.getItem('agenticSdlcSurveyLang') || 'en';

const today = new Date().toISOString().split('T')[0];
document.getElementById('surveyDate').value = today;

function t() { return i18n[currentLanguage]; }

function applyUiText() {
  const lang = t();
  document.getElementById('subtitle').textContent = lang.subtitle;
  document.getElementById('meta-title').textContent = lang.metaTitle;
  document.getElementById('language-label').textContent = lang.language;
  document.getElementById('surveyDate-label').textContent = lang.surveyDate;
  document.getElementById('teamName-label').textContent = lang.teamName;
  document.getElementById('teamName').placeholder = lang.optional;
  document.getElementById('respondent-label').textContent = lang.respondent;
  document.getElementById('respondent').placeholder = lang.optional;
  document.getElementById('endpoint-label').textContent = lang.endpoint;
  document.getElementById('submit-btn').textContent = lang.submit;
  document.getElementById('save-draft').textContent = lang.saveDraft;
}

function renderQuestions() {
  questionHost.innerHTML = '';
  let currentSection = '';
  for (const q of t().questions) {
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
    meta.textContent = `Type: ${q.type === 'single' ? t().typeSingle : t().typeMulti}`;

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
    language: currentLanguage,
    surveyDate: form.surveyDate.value,
    teamName: form.teamName.value.trim(),
    respondent: form.respondent.value.trim(),
    submittedAt: new Date().toISOString(),
    answers: {}
  };

  t().questions.forEach((q) => {
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
  statusEl.textContent = t().draftSaved;
}

function hydrateAnswers(answers = {}) {
  Object.entries(answers).forEach(([key, value]) => {
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

function loadDraft() {
  const draft = localStorage.getItem('agenticSdlcSurveyDraft');
  if (!draft) return null;
  return JSON.parse(draft);
}

const draft = loadDraft();
if (draft?.language && i18n[draft.language]) {
  currentLanguage = draft.language;
}
languageSelect.value = currentLanguage;
applyUiText();
renderQuestions();

if (draft) {
  if (draft.surveyDate) form.surveyDate.value = draft.surveyDate;
  form.teamName.value = draft.teamName || '';
  form.respondent.value = draft.respondent || '';
  hydrateAnswers(draft.answers || {});
}

languageSelect.addEventListener('change', () => {
  const currentAnswers = collectFormData().answers;
  currentLanguage = languageSelect.value;
  localStorage.setItem('agenticSdlcSurveyLang', currentLanguage);
  statusEl.textContent = '';
  applyUiText();
  renderQuestions();
  hydrateAnswers(currentAnswers);
});

document.getElementById('save-draft').addEventListener('click', saveDraft);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusEl.textContent = t().submitting;

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
    statusEl.textContent = t().success;
  } catch (error) {
    console.error(error);
    statusEl.textContent = t().failed;
  }
});
