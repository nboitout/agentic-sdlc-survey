const test = require('node:test');
const assert = require('node:assert/strict');
const model = require('../interview-model.js');
const config = require('../survey-config.json');
const toolsQuestion = config.questions.find(q => q.id === 'part1_q2');
const textQuestion = config.questions.find(q => !q.options.length);

test('legacy version-one drafts retain answers, notes, zero scores and summaries', () => {
  const record = model.emptyRecord();
  delete record.skipped;
  record.candidate = 'Example candidate';
  record.answers[toolsQuestion.id] = ['other'];
  record.other[toolsQuestion.id] = 'Internal tool';
  record.notes[textQuestion.id] = 'Evidence to revisit';
  record.scores[0] = 0;
  record.summaries[0] = 'Concrete example';
  const restored = model.restoreDraft(JSON.stringify({ version: 1, record, index: 8 }));
  assert.deepEqual(restored.record, { ...record, skipped: {} });
  assert.equal(restored.index, 8);
  assert.equal(restored.page, 'question');
  assert.equal(restored.started, true);
});

test('an untouched legacy draft does not pretend an interview has started', () => {
  assert.equal(model.restoreDraft({ version: 1, record: model.emptyRecord(), index: 0 }).started, false);
});

test('new drafts retain the resume stage and independent export preference', () => {
  const restored = model.restoreDraft({ version: 1, record: model.emptyRecord(), started: true,
    page: 'export', visited: [toolsQuestion.id], interviewerMode: false, includeAssessment: true });
  assert.equal(restored.page, 'export');
  assert.equal(restored.interviewerMode, false);
  assert.equal(restored.includeAssessment, true);
  assert.deepEqual(restored.visited, [toolsQuestion.id]);
});

test('corrupt drafts and unsupported versions are rejected or safely normalized', () => {
  assert.equal(model.restoreDraft('{broken'), null);
  assert.equal(model.restoreDraft({ version: 99, record: {} }), null);
  const restored = model.restoreDraft({ version: 1, record: { answers: [], notes: null, scores: { 0: 0, 1: 9, 2: null, 3: '4' } }, page: 'bad', index: -1 });
  assert.deepEqual(restored.record.answers, {});
  assert.deepEqual(restored.record.notes, {});
  assert.deepEqual(restored.record.scores, { 0: 0 });
  assert.equal(restored.index, 0);
  assert.equal(restored.page, 'question');
});

test('None is exclusive and selecting an ordinary tool clears None', () => {
  const tool = toolsQuestion.options.find(o => !['none', 'other'].includes(o.value)).value;
  let record = model.selectOption(toolsQuestion, model.emptyRecord(), tool);
  record = model.selectOption(toolsQuestion, record, 'none');
  assert.deepEqual(record.answers[toolsQuestion.id], ['none']);
  record = model.selectOption(toolsQuestion, record, tool);
  assert.deepEqual(record.answers[toolsQuestion.id], [tool]);
  record = model.selectOption(toolsQuestion, record, tool);
  assert.deepEqual(record.answers[toolsQuestion.id], []);
});

test('Other is incomplete until described, and review shows the entered description', () => {
  const record = model.selectOption(toolsQuestion, model.emptyRecord(), 'other');
  assert.equal(model.answered(toolsQuestion, record), false);
  assert.equal(model.status(toolsQuestion, record), 'Needs details');
  record.other[toolsQuestion.id] = '  ';
  assert.equal(model.answered(toolsQuestion, record), false);
  record.other[toolsQuestion.id] = 'An internal QA agent';
  assert.equal(model.answered(toolsQuestion, record), true);
  assert.match(model.formatAnswer(toolsQuestion, record), /Other: An internal QA agent/);
});

test('skipped, unanswered and recorded answers remain distinct', () => {
  let record = model.emptyRecord();
  assert.equal(model.status(toolsQuestion, record), 'Unanswered');
  record.skipped[toolsQuestion.id] = true;
  assert.equal(model.status(toolsQuestion, record), 'Skipped');
  assert.equal(model.answered(toolsQuestion, record), false);
  record = model.selectOption(toolsQuestion, record, 'none');
  assert.equal(model.status(toolsQuestion, record), 'Recorded');
  assert.equal(record.skipped[toolsQuestion.id], false);
});

test('all five dimensions are needed, and zero is a valid completed score', () => {
  const record = model.emptyRecord();
  record.scores[0] = 0;
  assert.equal(model.scoringComplete(config, record), false);
  for (let i = 0; i < 5; i++) record.scores[i] = 0;
  assert.equal(model.scoringComplete(config, record), true);
  assert.equal(model.scoreTotal(config, record), 0);
  assert.match(model.exportMarkdown(config, record, true), /Total: 0 \/ 20/);
  delete record.scores[4];
  assert.match(model.exportMarkdown(config, record, true), /Total: Incomplete/);
});

test('answers-only export never contains assessment, and full export includes it', () => {
  const record = model.emptyRecord();
  record.answers[textQuestion.id] = 'A reproducible test failure and fix.';
  record.notes[textQuestion.id] = 'PRIVATE_INTERVIEW_NOTE';
  record.scores[0] = 2;
  record.summaries[0] = 'PRIVATE_ASSESSMENT_SUMMARY';
  const answers = model.exportMarkdown(config, record, false);
  assert.match(answers, /A reproducible test failure and fix\./);
  assert.doesNotMatch(answers, /PRIVATE_|Interviewer Scoring|Final Interviewer Summary|Interviewer notes:/);
  const full = model.exportMarkdown(config, record, true);
  assert.match(full, /PRIVATE_INTERVIEW_NOTE/);
  assert.match(full, /PRIVATE_ASSESSMENT_SUMMARY/);
  assert.match(full, /Total: Incomplete/);
});

test('review and export keep full multiline evidence and original question content', () => {
  const record = model.emptyRecord();
  record.answers[textQuestion.id] = 'Line one.\n' + 'Evidence '.repeat(450);
  assert.equal(model.formatAnswer(textQuestion, record), record.answers[textQuestion.id].trim());
  const exported = model.exportMarkdown(config, record, false);
  assert.ok(exported.includes(record.answers[textQuestion.id]));
  for (const question of config.questions) assert.ok(exported.includes(question.title));
  assert.ok(exported.includes(config.version));
});
