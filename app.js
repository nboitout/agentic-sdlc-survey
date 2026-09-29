// English interview content is loaded from the replacement questionnaire catalogue.
const { useEffect, useState } = React;
const STORAGE_KEY = 'digiterreAscendionLeadQaInterviewV1';
const emptyRecord = () => ({ candidate: '', interviewer: '', date: new Date().toISOString().slice(0, 10), answers: {}, other: {}, notes: {}, scores: {}, summaries: {} });
function loadDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!draft || draft.version !== 1) return null;
    const record = { ...emptyRecord(), ...draft.record };
    for (const key of ['answers', 'other', 'notes', 'scores', 'summaries']) if (!record[key] || typeof record[key] !== 'object' || Array.isArray(record[key])) record[key] = {};
    return { record, index: Number.isInteger(draft.index) && draft.index >= 0 ? draft.index : 0 };
  } catch { return null; }
}
const answered = (q, record) => {
  const value = record.answers[q.id];
  return (Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim().length > 0) && (![].concat(value || []).includes('other') || Boolean(record.other[q.id]?.trim()));
};
const plain = text => text.replace(/\*\*/g, '').replace(/^#{1,6} /gm, '').replace(/^> /gm, '');
function exportMarkdown(config, record, assessment) {
  const lines = ['# Digiterre / Ascendion | Lead QA AI Interview', '', `Candidate: ${record.candidate}`, `Interviewer: ${record.interviewer}`, `Date: ${record.date}`, `Questionnaire version: ${config.version}`, ''];
  for (const q of config.questions) {
    lines.push(`## Part ${q.part}, ${q.number}. ${q.title}`, '', q.prompt, '');
    if (q.options.length) {
      const selected = [].concat(record.answers[q.id] || []);
      q.options.forEach(o => lines.push(`- [${selected.includes(o.value) ? 'x' : ' '}] ${o.label}${o.value === 'other' && selected.includes('other') ? ': ' + (record.other[q.id] || '') : ''}`));
    } else lines.push(record.answers[q.id] || '_No response recorded._');
    if (assessment) lines.push('', 'Interviewer notes:', record.notes[q.id] || '_No notes._');
    lines.push('');
  }
  if (assessment) {
    lines.push('## Interviewer Scoring', '');
    config.scoring.forEach((d, i) => lines.push(`- ${d.title}: ${record.scores[i] ?? 'Not scored'} / 4`));
    const complete = config.scoring.every((_, i) => record.scores[i] !== undefined);
    lines.push('', `Total: ${complete ? config.scoring.reduce((sum, _, i) => sum + Number(record.scores[i]), 0) + ' / 20' : 'Incomplete'}`, '', '## Final Interviewer Summary', '');
    config.summaries.forEach((title, i) => lines.push(`### ${title}`, '', record.summaries[i] || '_No notes._', ''));
  }
  return lines.join('\n');
}
function App() {
  const [draft] = useState(loadDraft);
  const [record, setRecord] = useState(() => draft?.record || emptyRecord());
  const [index, setIndex] = useState(draft?.index || 0);
  const [config, setConfig] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [saveError, setSaveError] = useState(false);
  const [interviewerMode, setInterviewerMode] = useState(false);
  const [review, setReview] = useState(false);
  useEffect(() => {
    fetch('survey-config.json').then(r => { if (!r.ok) throw new Error('Cannot load questionnaire'); return r.json(); }).then(value => { setConfig(value); setIndex(i => Math.min(i, value.questions.length - 1)); }).catch(e => setLoadError(e.message));
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, record, index })); setSaveError(false); } catch { setSaveError(true); }
  }, [record, index]);
  const field = (group, key, value) => setRecord(previous => ({ ...previous, [group]: { ...previous[group], [key]: value } }));
  const select = (q, option) => setRecord(previous => {
    let selected = option;
    if (q.type === 'multi_select') {
      const old = Array.isArray(previous.answers[q.id]) ? previous.answers[q.id] : [];
      selected = option === 'none' ? (old.includes('none') ? [] : ['none']) : old.includes(option) ? old.filter(v => v !== option) : [...old.filter(v => v !== 'none'), option];
    }
    return { ...previous, answers: { ...previous.answers, [q.id]: selected } };
  });
  const download = () => {
    const url = URL.createObjectURL(new Blob([exportMarkdown(config, record, interviewerMode)], { type: 'text/markdown;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `lead-qa-interview-${record.date}.md`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  };
  if (loadError) return <section className="panel" role="alert">{loadError}. Reload to retry.</section>;
  if (!config) return <section className="panel">Loading questionnaire...</section>;
  const current = config.questions[index];
  const unanswered = config.questions.filter(q => !answered(q, record)).length;
  const scored = config.scoring.every((_, i) => record.scores[i] !== undefined);
  const total = config.scoring.reduce((sum, _, i) => sum + Number(record.scores[i] || 0), 0);
  return <div className="survey-shell">
    <header className="panel header-panel"><p className="section-title">Digiterre / Ascendion</p><h1>Lead QA - AI Experience Interview</h1><p>8 baseline MCQs, 9 discussion questions, and an interviewer assessment.</p><p>Baseline: ~5 minutes. Discussion: ~15-20 minutes. Leadership outlook: ~5 minutes.</p>
      <label className="interview-mode"><input type="checkbox" checked={interviewerMode} onChange={e => setInterviewerMode(e.target.checked)} />Show interviewer guidance and scoring</label>
      <p role="status" className={saveError ? 'error' : 'helper-text'}>{saveError ? 'Local saving unavailable. Download your record before leaving.' : 'Draft saved on this device.'}</p>
    </header>
    <section className="panel grid">{['candidate', 'interviewer', 'date'].map(key => <label key={key}>{key === 'date' ? 'Interview date' : key[0].toUpperCase() + key.slice(1)}<input type={key === 'date' ? 'date' : 'text'} value={record[key]} onChange={e => setRecord({ ...record, [key]: e.target.value })} /></label>)}</section>
    {!review ? <section className="panel question-panel"><p className="section-title">Part {current.part}: {config.parts[current.part - 1]} ({index + 1} / {config.questions.length})</p><h2>{current.number}. {current.title}</h2>{current.prompt && <p>{plain(current.prompt)}</p>}
      {current.options.length > 0 ? <><p>{current.type === 'single_choice' ? 'Select one.' : 'Select all that apply.'}</p><div className="options">{current.options.map(option => {
        const selected = [].concat(record.answers[current.id] || []).includes(option.value);
        return <label key={`${current.id}_${option.value}`} className={`option-card ${selected ? 'active' : ''}`}><input type={current.type === 'single_choice' ? 'radio' : 'checkbox'} name={current.id} checked={selected} onChange={() => select(current, option.value)} /><span>{option.label}</span></label>;
      })}</div>{[].concat(record.answers[current.id] || []).includes('other') && <label>Please specify<input value={record.other[current.id] || ''} onChange={e => field('other', current.id, e.target.value)} /></label>}</> : <label>Response / evidence<textarea rows="7" value={record.answers[current.id] || ''} onChange={e => field('answers', current.id, e.target.value)} /></label>}
      {interviewerMode && <div className="interviewer-only">{current.guidance && <details><summary>Follow-ups and evaluation guidance</summary><div className="guidance-text">{plain(current.guidance)}</div></details>}<label>Interviewer notes<textarea rows="4" value={record.notes[current.id] || ''} onChange={e => field('notes', current.id, e.target.value)} /></label></div>}
      <nav className="actions"><button className="secondary-action" disabled={index === 0} onClick={() => setIndex(index - 1)}>Previous</button><button onClick={() => index === config.questions.length - 1 ? setReview(true) : setIndex(index + 1)}>{index === config.questions.length - 1 ? 'Review interview' : 'Next'}</button></nav>
    </section> : <section className="panel"><h2>Review interview</h2><p>{unanswered} / {config.questions.length} unanswered</p><ol>{config.questions.map((q, i) => <li key={q.id}><button className="review-question secondary-action" onClick={() => { setIndex(i); setReview(false); }}>{q.title} ({answered(q, record) ? 'Recorded' : 'Unanswered'})</button></li>)}</ol><button className="secondary-action" onClick={() => setReview(false)}>Back to questions</button></section>}
    {review && interviewerMode && <section className="panel"><h2>Interviewer scoring</h2>{config.scoring.map((dimension, i) => <label className="score-field" key={dimension.title}>{dimension.title}<select value={record.scores[i] ?? ''} onChange={e => setRecord(previous => { const scores = { ...previous.scores }; if (e.target.value === '') delete scores[i]; else scores[i] = Number(e.target.value); return { ...previous, scores }; })}><option value="">Not scored</option>{dimension.levels.map((level, score) => <option key={score} value={score}>{score} - {level}</option>)}</select></label>)}<p><strong>{scored ? `${total} / 20` : 'Scoring incomplete'}</strong></p>{scored && <p>{config.interpretations[total <= 5 ? 0 : total <= 10 ? 1 : total <= 15 ? 2 : 3]}</p>}<h2>Final interviewer summary</h2>{config.summaries.map((title, i) => <label className="score-field" key={title}>{title}<textarea rows="3" value={record.summaries[i] || ''} onChange={e => field('summaries', i, e.target.value)} /></label>)}</section>}
    <footer className="panel"><p>Download includes answers{interviewerMode ? ', interviewer notes, scoring, and summary' : ' only. Enable interviewer view to include notes and scoring'}.</p><div className="actions"><button className="secondary-action" onClick={() => { if (window.confirm('Start a new interview? Download the current record first if you want to keep it.')) { setRecord(emptyRecord()); setIndex(0); setReview(false); setInterviewerMode(false); } }}>New interview</button><button onClick={download}>Download interview record (.md)</button></div></footer>
  </div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
