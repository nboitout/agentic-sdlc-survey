(() => {
const { useEffect, useRef, useState } = React;
const { STORAGE_KEY, emptyRecord, plain, hasOther, answered, status, restoreDraft, selectOption, formatAnswer, scoringComplete, scoreTotal, exportMarkdown } = InterviewModel;
const sections = [
  { title: 'AI baseline', description: 'Tools, habits and experience', time: '~5 minutes' },
  { title: 'Evidence & practice', description: 'Real work, decisions and outcomes', time: '~15–20 minutes' },
  { title: 'Leadership outlook', description: 'The next two years in QA', time: '~5 minutes' }
];
const pageNames = { details: 'Interview details', question: 'Questions', review: 'Review answers', assessment: 'Interviewer assessment', export: 'Export interview' };
function readDraft() {
  try { return restoreDraft(localStorage.getItem(STORAGE_KEY)); } catch { return null; }
}
function App() {
  const [draft] = useState(readDraft);
  const [record, setRecord] = useState(() => draft?.record || emptyRecord());
  const [index, setIndex] = useState(draft?.index || 0);
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState(false);
  const [started, setStarted] = useState(false);
  const [page, setPage] = useState('home');
  const [resumePage, setResumePage] = useState(draft?.page || 'details');
  const [interviewerMode, setInterviewerMode] = useState(draft?.interviewerMode || false);
  const [includeAssessment, setIncludeAssessment] = useState(draft?.includeAssessment || false);
  const [visited, setVisited] = useState(draft?.visited || []);
  const [editing, setEditing] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [exportError, setExportError] = useState('');
  const [resetOpen, setResetOpen] = useState(false);
  const resetDialog = useRef(null);
  const resetTrigger = useRef(null);
  const canResume = started || draft?.started;

  useEffect(() => {
    fetch('survey-config.json').then(response => {
      if (!response.ok) throw new Error('The questionnaire could not be loaded.');
      return response.json();
    }).then(value => {
      setConfig(value);
      setIndex(i => Math.min(i, value.questions.length - 1));
      setVisited(previous => [...new Set([...previous, ...value.questions.filter(q => answered(q, record)).map(q => q.id)])].filter(id => value.questions.some(q => q.id === id)));
    }).catch(error => setLoadError(error.message));
  }, []);
  useEffect(() => {
    if (!started || !config) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, record, index, page: resumePage, visited, interviewerMode, includeAssessment, started: true, savedAt: new Date().toISOString() }));
      setSaveError(false);
    } catch { setSaveError(true); }
  }, [record, index, resumePage, visited, interviewerMode, includeAssessment, started, config]);
  useEffect(() => {
    if (!config) return;
    document.getElementById('page-title')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [page, index, editing, config]);
  useEffect(() => {
    if (page === 'question' && config) setVisited(previous => previous.includes(config.questions[index].id) ? previous : [...previous, config.questions[index].id]);
  }, [page, index, config]);
  useEffect(() => { setDownloaded(false); setExportError(''); }, [record, includeAssessment]);
  useEffect(() => {
    if (resetOpen) resetDialog.current?.showModal();
    else if (resetDialog.current?.open) resetDialog.current.close();
  }, [resetOpen]);

  function go(nextPage, nextIndex = index, edit = false) {
    setEditing(edit); setIndex(nextIndex); setPage(nextPage);
    if (nextPage !== 'home') setResumePage(nextPage);
    setExportError('');
  }
  function start() { setStarted(true); go(canResume ? resumePage : 'details'); }
  function newInterview(event) { resetTrigger.current = event.currentTarget; setResetOpen(true); }
  function closeReset() { setResetOpen(false); resetTrigger.current?.focus(); }
  function reset() {
    setRecord(emptyRecord()); setVisited([]); setInterviewerMode(false); setIncludeAssessment(false);
    setStarted(true); setResetOpen(false); setDownloaded(false); go('details', 0);
  }
  function field(group, key, value) {
    setRecord(previous => ({ ...previous, [group]: { ...previous[group], [key]: value },
      ...(group === 'answers' || group === 'other' ? { skipped: { ...previous.skipped, [key]: false } } : {}) }));
  }
  function next() { go(editing || index === config.questions.length - 1 ? 'review' : 'question', editing ? index : Math.min(index + 1, config.questions.length - 1)); }
  function skip() { setRecord(previous => ({ ...previous, skipped: { ...previous.skipped, [current.id]: true } })); next(); }
  function download() {
    try {
      const url = URL.createObjectURL(new Blob([exportMarkdown(config, record, includeAssessment)], { type: 'text/markdown;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `lead-qa-interview-${record.date || 'undated'}${includeAssessment ? '-with-assessment' : '-answers'}.md`;
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloaded(true); setExportError('');
    } catch { setExportError('The download could not be prepared. Your draft is still available here. Please try again.'); }
  }
  if (loadError) return <main className="loading-panel" role="alert"><h1>Unable to load the interview</h1><p>{loadError}</p><button className="primary" onClick={() => window.location.reload()}>Try again</button></main>;
  if (!config) return <main className="loading-panel" role="status">Loading the interview…</main>;
  const current = config.questions[index];
  const count = config.questions.filter(q => answered(q, record)).length;
  const skippedCount = config.questions.filter(q => status(q, record) === 'Skipped').length;
  const scoresSet = config.scoring.filter((_, i) => record.scores[i] !== undefined).length;
  const scored = scoringComplete(config, record);
  const total = scoreTotal(config, record);
  const activePart = page === 'question' ? current.part - 1 : -1;
  const summary = `${count} of ${config.questions.length} answers recorded`;
  const saveMessage = saveError ? 'Device saving unavailable. Export before leaving.' : 'Draft saved on this device';
  const actions = (backLabel, onBack, nextLabel, onNext, extra) => <div className="question-actions">
    <button type="button" className="secondary" onClick={onBack}><span aria-hidden="true">←</span> {backLabel}</button>
    {extra && <span className="action-hint">{extra}</span>}
    <button type="button" className="primary" onClick={onNext}>{nextLabel} <span aria-hidden="true">→</span></button>
  </div>;
  const intro = (eyebrow, title, description) => <div className="question-heading"><p className="eyebrow">{eyebrow}</p><h1 id="page-title" tabIndex="-1">{title}</h1>{description && <p className="muted">{description}</p>}</div>;

  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <button className="brand" onClick={() => go('home')} aria-label="Digiterre / Ascendion — introduction"><strong>digiterre<span className="brand-dot">.</span></strong><span className="brand-divider" /><span className="brand-partner">ASCENDION</span></button>
      {page !== 'home' ? <label className="mode-switch"><input type="checkbox" checked={interviewerMode} onChange={e => { setInterviewerMode(e.target.checked); if (!e.target.checked && page === 'assessment') go('review'); }} /><span>Interviewer view</span></label> : <span className="header-caption">LEAD QA / AI EXPERIENCE</span>}
    </header>
    <main id="main" className={page === 'home' ? 'home-main' : 'survey-main'} tabIndex="-1">
      {page === 'home' ? <>
        <section className="hero">
          <div className="hero-copy"><p className="eyebrow">A structured interview</p><h1 id="page-title" tabIndex="-1">Lead QA.<br /><span>AI in practice.</span></h1><p className="hero-lead">A conversation about how you use AI in software quality — and how you lead its adoption.</p><p className="hero-purpose">Start with your tools and habits, explore the evidence from real work, then look ahead to the future of QA.</p><p className="hero-practical">25–30 minutes <span aria-hidden="true">·</span> 17 questions <span aria-hidden="true">·</span> 3 parts</p>
            {canResume && <div className="resume-card"><strong>{record.candidate || 'Your saved interview'}</strong><span>{summary}{record.date ? ` · ${record.date}` : ''}</span><small>Continue from {pageNames[resumePage].toLowerCase()}.</small></div>}
            <div className="hero-actions"><button className="primary" onClick={start}>{canResume ? 'Resume interview' : 'Start interview'} <span aria-hidden="true">→</span></button>{canResume && <button className="text-button" onClick={newInterview}>Start a new interview</button>}</div><p className="hero-reassurance">You can skip questions and return to them before exporting.</p>
          </div>
          <div className="journey-art" aria-label="The three interview parts"><div className="art-top"><span>YOUR EXPERIENCE.<br />YOUR EVIDENCE.</span><span className="art-mark" aria-hidden="true">✳</span></div>{sections.map((section, i) => <div className="journey-node" key={section.title}><span className="node-number">0{i + 1}</span><div><small>{section.description}</small><strong>{section.title}</strong><span className="journey-time">{section.time}</span></div><span aria-hidden="true">↗</span></div>)}<p className="art-bottom">Then review, assess and export your interview.</p></div>
        </section>
        <details className="privacy"><summary>About this interview and your saved record</summary><p>Your answers and interview details are stored in this browser on this device. Download a Markdown record to keep a copy. Interviewer view reveals guidance, notes and scoring; it is a display setting, so use your own device for private assessment notes. Nothing is submitted to a remote service.</p></details>
      </> : <>
        <div className={`save-strip ${saveError ? 'save-warning' : ''}`} role="status"><span className="save-dot" aria-hidden="true" />{saveMessage}{saveError && <button className="text-button" onClick={() => go('export')}>Export now</button>}</div>
        <div className="survey-layout">
          <aside className="survey-sidebar" aria-label="Interview navigation"><p className="eyebrow">Your interview</p><h2>Experience.<br />Evidence. Outlook.</h2><nav aria-label="Interview sections"><ol className="steps">{sections.map((section, i) => {
            const partQuestions = config.questions.filter(q => q.part === i + 1);
            const complete = partQuestions.every(q => answered(q, record));
            return <li key={section.title} className={`${activePart === i ? 'current' : ''} ${complete ? 'done' : ''}`}><button onClick={() => go('question', config.questions.findIndex(q => q.part === i + 1))} aria-current={activePart === i ? 'step' : undefined}><span className="step-number" aria-hidden="true">{complete ? '✓' : `0${i + 1}`}</span><span><strong>{section.title}</strong><small>{partQuestions.filter(q => answered(q, record)).length} / {partQuestions.length} recorded</small></span></button></li>;
          })}</ol></nav><div className="sidebar-progress"><strong>{summary}</strong><span>{visited.length} {visited.length === 1 ? 'question' : 'questions'} visited{skippedCount ? ` · ${skippedCount} skipped` : ''}</span><p>Go back or jump between parts. Your answers stay with you.</p></div>
            <nav className="stage-links" aria-label="Interview stages">{['details', 'review', ...(interviewerMode ? ['assessment'] : []), 'export'].map(stage => <button key={stage} className="text-button" aria-current={page === stage ? 'step' : undefined} onClick={() => go(stage)}>{pageNames[stage]}</button>)}</nav>
          </aside>
          <section className={`question-panel page-${page}`} aria-labelledby="page-title">
            {page === 'details' && <>
              {intro('Before you begin', 'Interview details', 'Add the details you want included in your record. You can update them at any time.')}
              <form onSubmit={event => { event.preventDefault(); go(editing ? 'review' : 'question'); }}>
                <div className="details-fields">{['candidate', 'interviewer', 'date'].map(key => <label key={key} htmlFor={`detail-${key}`}>{key === 'date' ? 'Interview date' : key === 'candidate' ? 'Candidate name' : 'Interviewer name'}<input id={`detail-${key}`} type={key === 'date' ? 'date' : 'text'} autoComplete="off" value={record[key]} onChange={event => setRecord(previous => ({ ...previous, [key]: event.target.value }))} /></label>)}</div>
                <div className="notice"><strong>Leading the interview?</strong><p>Turn on Interviewer view for follow-up prompts, per-question notes and the assessment. You choose what to include when you export.</p></div>
                <p className="field-hint">All details are optional. This record is saved on your device.</p>
                <div className="question-actions"><button type="button" className="secondary" onClick={() => go(editing ? 'review' : 'home')}>← Back</button><button className="primary" type="submit">{editing ? 'Save & return to review' : 'Continue to questions'} <span aria-hidden="true">→</span></button></div>
              </form>
            </>}
            {page === 'question' && <>
              <div className="progress-head"><span>Question {index + 1} / {config.questions.length}</span><span>{count} {count === 1 ? 'answer' : 'answers'} recorded</span></div><progress value={index + 1} max={config.questions.length} aria-label="Position in the interview" />
              {intro(`Part ${current.part} · ${sections[current.part - 1].title}`, current.title, plain(current.prompt))}
              <p className="question-help" id="question-help">{current.options.length ? current.type === 'single_choice' ? 'Select one answer.' : 'Select all that apply.' : 'Describe a concrete example, your role and the outcome.'} You can leave this unanswered and return later.</p>
              <fieldset aria-labelledby="page-title" aria-describedby="question-help">
                {current.options.length ? <>
                  <div className={`options ${current.options.every(option => option.label.length < 48) ? 'compact-options' : 'long-options'}`}>{current.options.map(option => {
                    const selected = [].concat(record.answers[current.id] || []).includes(option.value);
                    return <label key={`${current.id}-${option.value}`} className={`option ${selected ? 'selected' : ''}`}><input type={current.type === 'single_choice' ? 'radio' : 'checkbox'} name={current.id} checked={selected} onChange={() => setRecord(previous => selectOption(current, previous, option.value))} /><span>{option.label}</span></label>;
                  })}</div>
                  {hasOther(current, record) && <div className="option-details"><label htmlFor="other-answer">Please specify<input id="other-answer" value={record.other[current.id] || ''} onChange={event => field('other', current.id, event.target.value)} aria-describedby="other-hint" /></label><p id="other-hint" className="field-hint">{record.other[current.id]?.trim() ? 'These details will be included in your answer.' : 'Add a description for this answer to count as recorded.'}</p></div>}
                </> : <label className="response-label" htmlFor="response">Response / evidence<textarea id="response" rows="7" placeholder="Capture the example and the evidence…" value={record.answers[current.id] || ''} onChange={event => field('answers', current.id, event.target.value)} /></label>}
              </fieldset>
              {interviewerMode && <div className="interviewer-area" key={current.id}><p className="eyebrow">Interviewer workspace</p>{current.guidance && <details><summary>Follow-ups & evaluation guidance</summary><div className="guidance-text">{plain(current.guidance)}</div></details>}<details><summary>Interviewer notes{record.notes[current.id]?.trim() ? ' · Notes saved' : ''}</summary><label htmlFor="interviewer-notes">Observations and follow-ups<textarea id="interviewer-notes" rows="4" value={record.notes[current.id] || ''} onChange={event => field('notes', current.id, event.target.value)} /></label></details></div>}
              <div className="question-state"><span className={`status-badge ${answered(current, record) ? 'recorded' : ''}`}>{status(current, record)}</span>{!answered(current, record) && !hasOther(current, record) && <button className="text-button" onClick={skip}>Skip for now</button>}</div>
              {actions(editing ? 'Return to review' : 'Back', () => go(editing ? 'review' : index === 0 ? 'details' : 'question', Math.max(0, editing ? index : index - 1)), editing ? 'Save & return to review' : index === config.questions.length - 1 ? 'Review answers' : 'Next', next, 'Saved as you go')}
            </>}
            {page === 'review' && <>
              {intro('Your interview record', 'Review your answers', 'Check the details and evidence below. Edit any answer, then return here to continue.')}
              <div className="review-summary"><strong>{summary}</strong><span>{config.questions.length - count} unanswered or incomplete{skippedCount ? ` · ${skippedCount} skipped` : ''}</span></div>
              <div className="review-identity"><div><h2>Interview details</h2><dl>{[['Candidate', record.candidate], ['Interviewer', record.interviewer], ['Date', record.date]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || 'Not provided'}</dd></div>)}</dl></div><button className="text-button" onClick={() => go('details', index, true)}>Edit details</button></div>
              {sections.map((section, part) => <section className="review-section" key={section.title}><h2><span>0{part + 1}</span> {section.title}</h2><div className="review-list">{config.questions.map((q, i) => q.part !== part + 1 ? null : <article className="review-row" key={q.id}><div className="review-row-heading"><h3><span className="muted">{i + 1}.</span> {q.title}</h3><button className="text-button" onClick={() => go('question', i, true)} aria-label={`Edit question ${i + 1}`}>Edit</button></div><span className={`status-badge ${answered(q, record) ? 'recorded' : ''}`}>{status(q, record)}</span><p className="review-answer">{formatAnswer(q, record)}</p>{interviewerMode && record.notes[q.id]?.trim() && <details className="review-notes"><summary>Interviewer notes</summary><p>{record.notes[q.id]}</p></details>}</article>)}</div></section>)}
              {actions('Questions', () => go('question'), interviewerMode ? 'Continue to assessment' : 'Continue to export', () => go(interviewerMode ? 'assessment' : 'export'))}
            </>}
            {page === 'assessment' && <>
              {intro('Interviewer workspace', 'Assess the evidence', 'Score each dimension from 0 to 4 using the supplied rubric. You can leave dimensions unscored and return later.')}
              <div className="assessment-total" role="status"><strong>{scored ? `${total} / 20` : 'Scoring incomplete'}</strong><span>{scoresSet} of {config.scoring.length} dimensions scored</span></div>
              {scored && <p className="interpretation">{config.interpretations[total <= 5 ? 0 : total <= 10 ? 1 : total <= 15 ? 2 : 3]}</p>}
              <div className="score-grid">{config.scoring.map((dimension, i) => <div className="score-card" key={dimension.title}><label htmlFor={`score-${i}`}>{dimension.title}<select id={`score-${i}`} value={record.scores[i] ?? ''} onChange={event => setRecord(previous => { const scores = { ...previous.scores }; if (event.target.value === '') delete scores[i]; else scores[i] = Number(event.target.value); return { ...previous, scores }; })}><option value="">Not scored</option>{dimension.levels.map((level, score) => <option key={score} value={score}>{score} — {level}</option>)}</select></label><p className="score-description">{record.scores[i] !== undefined ? dimension.levels[record.scores[i]] : 'Choose the level supported by the interview.'}</p><details><summary>View scoring rubric</summary><ol start="0">{dimension.levels.map(level => <li key={level}>{level}</li>)}</ol></details></div>)}</div>
              <section className="assessment-summary"><h2>Final interviewer summary</h2><p className="muted">Bring together the strongest evidence and any gaps.</p>{config.summaries.map((title, i) => <label key={title} htmlFor={`summary-${i}`}>{title}<textarea id={`summary-${i}`} rows="3" value={record.summaries[i] || ''} onChange={event => field('summaries', i, event.target.value)} /></label>)}</section>
              {actions('Review answers', () => go('review'), 'Continue to export', () => go('export'))}
            </>}
            {page === 'export' && <>
              {intro('Keep your interview record', 'Export your interview', 'Download a Markdown file you can read, share or keep with your interview records.')}
              <div className="export-stats"><div><strong>{count} / {config.questions.length}</strong><span>answers recorded</span></div><div><strong>{scoresSet} / {config.scoring.length}</strong><span>dimensions scored</span></div></div>
              <fieldset className="export-choices"><legend>What should the download include?</legend><label className={`option ${!includeAssessment ? 'selected' : ''}`}><input type="radio" name="export-content" checked={!includeAssessment} onChange={() => setIncludeAssessment(false)} /><span><strong>Answers only</strong><small>Interview details and responses to all 17 questions.</small></span></label><label className={`option ${includeAssessment ? 'selected' : ''}`}><input type="radio" name="export-content" checked={includeAssessment} onChange={() => setIncludeAssessment(true)} /><span><strong>Answers & interviewer assessment</strong><small>Also includes interviewer notes, scores and the final summary.</small></span></label></fieldset>
              <div className="notice"><strong>{includeAssessment ? 'Includes interviewer assessment' : 'Ready to keep a copy'}</strong><p>{includeAssessment ? 'This file contains assessment notes as well as answers. Choose the people you share it with accordingly.' : 'Interviewer notes, scores and the final summary are omitted from this file.'}</p>{count < config.questions.length && <p>{config.questions.length - count} questions remain unanswered or incomplete. You can still export your record.</p>}{includeAssessment && !scored && <p>The total will be marked “Incomplete” until all five dimensions are scored.</p>}</div>
              {exportError && <p role="alert" className="error">{exportError}</p>}{downloaded && <div className="download-status" role="status"><strong>Download prepared</strong><p>Check your browser’s downloads for the Markdown file. Your draft remains on this device.</p></div>}
              {actions(interviewerMode ? 'Assessment' : 'Review answers', () => go(interviewerMode ? 'assessment' : 'review'), downloaded ? 'Download again (.md)' : 'Download record (.md)', download)}
              <div className="finish-actions"><button className="text-button" onClick={() => go('home')}>Return to introduction</button><button className="text-button" onClick={newInterview}>Start a new interview</button></div>
            </>}
          </section>
        </div>
      </>}
    </main>
    {page === 'home' && <footer className="site-footer"><span>Digiterre / Ascendion</span><span>Lead QA · AI experience interview</span></footer>}
    <dialog ref={resetDialog} className="reset-dialog" aria-labelledby="reset-title" aria-describedby="reset-description" onCancel={event => { event.preventDefault(); closeReset(); }} onClose={() => setResetOpen(false)}><h2 id="reset-title">Start a new interview?</h2><p id="reset-description">This replaces the saved interview on this device. Download the current record first if you want to keep it.</p><div className="dialog-actions"><button className="secondary" autoFocus onClick={closeReset}>Keep this interview</button><button className="primary" onClick={reset}>Start new interview</button></div></dialog>
  </>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
