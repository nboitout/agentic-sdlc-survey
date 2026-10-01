/* Shared draft and export rules, independent of the UI for compatibility checks. */
(function (root) {
  const STORAGE_KEY = 'digiterreAscendionLeadQaInterviewV1';
  const pages = ['details', 'question', 'review', 'assessment', 'export'];
  const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const strings = value => Object.fromEntries(Object.entries(object(value)).filter(([, v]) => typeof v === 'string'));
  const localDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };
  const emptyRecord = () => ({ candidate: '', interviewer: '', date: localDate(), answers: {}, other: {}, notes: {}, scores: {}, summaries: {}, skipped: {} });
  const plain = text => (text || '').replace(/\*\*/g, '').replace(/^#{1,6} /gm, '').replace(/^> /gm, '');
  const hasOther = (q, record) => [].concat(record.answers[q.id] || []).includes('other');
  const answered = (q, record) => {
    const value = record.answers[q.id];
    return (Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim().length > 0)
      && (!hasOther(q, record) || Boolean(record.other[q.id]?.trim()));
  };
  const status = (q, record) => answered(q, record) ? 'Recorded'
    : hasOther(q, record) ? 'Needs details' : record.skipped?.[q.id] ? 'Skipped' : 'Unanswered';
  function restoreDraft(raw) {
    try {
      const draft = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (!draft || draft.version !== 1 || !draft.record || typeof draft.record !== 'object') return null;
      const source = draft.record;
      const record = emptyRecord();
      for (const key of ['candidate', 'interviewer', 'date']) if (typeof source[key] === 'string') record[key] = source[key];
      for (const key of ['other', 'notes', 'summaries']) record[key] = strings(source[key]);
      record.answers = Object.fromEntries(Object.entries(object(source.answers)).filter(([, value]) => typeof value === 'string' || Array.isArray(value) && value.every(v => typeof v === 'string')));
      record.scores = Object.fromEntries(Object.entries(object(source.scores)).filter(([key, value]) => /^[0-4]$/.test(key) && Number.isInteger(value) && value >= 0 && value <= 4));
      record.skipped = Object.fromEntries(Object.entries(object(source.skipped)).filter(([, value]) => value === true));
      return {
        record, index: Number.isInteger(draft.index) && draft.index >= 0 ? draft.index : 0,
        page: pages.includes(draft.page) ? draft.page : 'question',
        visited: Array.isArray(draft.visited) ? draft.visited.filter(id => typeof id === 'string') : [],
        interviewerMode: draft.interviewerMode === true, includeAssessment: draft.includeAssessment === true,
        savedAt: typeof draft.savedAt === 'string' ? draft.savedAt : null,
        started: draft.started === true || Boolean(source.candidate || source.interviewer || draft.index > 0
          || ['answers', 'notes', 'scores', 'summaries'].some(key => Object.keys(object(source[key])).length))
      };
    } catch { return null; }
  }
  function selectOption(q, record, option) {
    let selected = option;
    if (q.type === 'multi_select') {
      const old = Array.isArray(record.answers[q.id]) ? record.answers[q.id] : [];
      selected = option === 'none' ? (old.includes('none') ? [] : ['none'])
        : old.includes(option) ? old.filter(value => value !== option) : [...old.filter(value => value !== 'none'), option];
    }
    return { ...record, answers: { ...record.answers, [q.id]: selected }, skipped: { ...record.skipped, [q.id]: false } };
  }
  function formatAnswer(q, record) {
    if (!q.options.length) return record.answers[q.id]?.trim() || (record.skipped[q.id] ? 'Skipped for now.' : 'No response recorded.');
    const selected = [].concat(record.answers[q.id] || []);
    return q.options.filter(option => selected.includes(option.value)).map(option => option.label
      + (option.value === 'other' ? `: ${record.other[q.id]?.trim() || 'Description needed'}` : '')).join('\n')
      || (record.skipped[q.id] ? 'Skipped for now.' : 'No response recorded.');
  }
  const scoringComplete = (config, record) => config.scoring.every((_, i) => Number.isInteger(record.scores[i]) && record.scores[i] >= 0 && record.scores[i] <= 4);
  const scoreTotal = (config, record) => config.scoring.reduce((sum, _, i) => sum + (record.scores[i] || 0), 0);
  function exportMarkdown(config, record, assessment) {
    const lines = ['# Digiterre / Ascendion | Lead QA AI Interview', '', `Candidate: ${record.candidate}`, `Interviewer: ${record.interviewer}`, `Date: ${record.date}`, `Questionnaire version: ${config.version}`, ''];
    for (const q of config.questions) {
      lines.push(`## Part ${q.part}, ${q.number}. ${q.title}`, '', q.prompt, '');
      if (q.options.length) {
        const selected = [].concat(record.answers[q.id] || []);
        q.options.forEach(o => lines.push(`- [${selected.includes(o.value) ? 'x' : ' '}] ${o.label}${o.value === 'other' && selected.includes('other') ? ': ' + (record.other[q.id] || '') : ''}`));
      } else lines.push(record.answers[q.id] || '_No response recorded._');
      if (!answered(q, record)) lines.push('', `Status: ${status(q, record)}`);
      if (assessment) lines.push('', 'Interviewer notes:', record.notes[q.id] || '_No notes._');
      lines.push('');
    }
    if (assessment) {
      lines.push('## Interviewer Scoring', '');
      config.scoring.forEach((d, i) => lines.push(`- ${d.title}: ${record.scores[i] ?? 'Not scored'} / 4`));
      lines.push('', `Total: ${scoringComplete(config, record) ? scoreTotal(config, record) + ' / 20' : 'Incomplete'}`, '', '## Final Interviewer Summary', '');
      config.summaries.forEach((title, i) => lines.push(`### ${title}`, '', record.summaries[i] || '_No notes._', ''));
    }
    return lines.join('\n');
  }
  const model = { STORAGE_KEY, emptyRecord, plain, hasOther, answered, status, restoreDraft, selectOption, formatAnswer, scoringComplete, scoreTotal, exportMarkdown };
  if (typeof module !== 'undefined' && module.exports) module.exports = model;
  else root.InterviewModel = model;
})(typeof window === 'undefined' ? globalThis : window);
