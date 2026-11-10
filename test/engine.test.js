import test from 'node:test';
import assert from 'node:assert/strict';
import { dayKey, addDays, schedule, makeQueue, streak } from '../public/engine.js';
import { questions, topics } from '../public/questions.js';

test('local calendar dates and year rollover', () => {
  assert.equal(dayKey(new Date(2026, 0, 2, 1)), '2026-01-02');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});
test('wrong answers and low confidence return tomorrow; confident answers advance', () => {
  const first = schedule(null, true, 'sure', '2026-11-08');
  assert.equal(first.due, '2026-11-11');
  assert.equal(schedule(first, true, 'sure', '2026-11-11').due, '2026-11-18');
  const wrong = schedule(first, false, 'sure', '2026-11-11');
  assert.equal(wrong.due, '2026-11-12');
  assert.equal(wrong.stage, 0);
  assert.equal(wrong.attempts, 2);
  assert.equal(wrong.correct, 1);
  assert.equal(schedule(first, true, 'unsure', '2026-11-11').due, '2026-11-12');
});
test('queue prioritizes due questions, never duplicates, respects topic and review mode', () => {
  const progress = { q5: { due: '2026-11-07' }, q1: { due: '2026-11-12' } };
  const queue = makeQueue(questions, progress, { today: '2026-11-08' });
  assert.equal(queue[0].id, 'q5');
  assert.equal(queue.length, 3);
  assert.equal(new Set(queue.map(q => q.id)).size, 3);
  assert.deepEqual(makeQueue(questions, progress, { mode: 'review', today: '2026-11-08' }).map(q => q.id), ['q5']);
  assert.ok(makeQueue(questions, progress, { topic: 'quant', today: '2026-11-08' }).every(q => q.topic === 'quant'));
  assert.deepEqual(makeQueue(questions, {}, { mode: 'review' }), []);
});
test('streak counts unique days and allows an unfinished today', () => {
  const history = [{ day: '2026-11-06' }, { day: '2026-11-07' }, { day: '2026-11-07' }];
  assert.equal(streak(history, '2026-11-08'), 2);
  assert.equal(streak(history, '2026-11-09'), 0);
});
test('sample question data has valid options, unique IDs and matching explanations', () => {
  assert.equal(new Set(questions.map(q => q.id)).size, questions.length);
  for (const q of questions) {
    assert.equal(q.options.length, 3);
    assert.ok(q.answer >= 0 && q.answer < q.options.length);
    assert.equal(q.reasons.length, q.options.length);
    assert.ok(q.explanation && q.summary && q.term && q.meaning);
    assert.ok(topics.some(t => t.id === q.topic), `Unknown topic: ${q.id}`);
    assert.ok(Number.isInteger(q.answer));
    assert.equal(new Set(q.options).size, 3);
  }
});

test('expanded bank preserves original IDs without a per-topic question cap', () => {
  assert.ok(questions.length >= 396);
  assert.equal(topics.length, 10);
  assert.equal(new Set(questions.map(q => q.prompt)).size, questions.length);
  for (let i = 1; i <= 60; i++) assert.ok(questions.some(q => q.id === `q${i}`));
  for (const topic of topics) {
    assert.ok(questions.filter(q => q.topic === topic.id).length >= 22, topic.id);
    assert.equal(makeQueue(questions, {}, { topic: topic.id }).length, 3);
  }
});

test('additional calculation answers agree with independent formula calculations', () => {
  const cases = [
    ['q16', 1210 / 1.1 ** 2, '$1,000'],
    ['q17', Math.sqrt(0.0225) * 100, '15%'],
    ['q18', (Math.sqrt(1.25 * 0.8) - 1) * 100, '0%'],
    ['q19', Math.abs(-20 / 10), '2.0'],
    ['q22', 900 - 540, '$360'],
    ['q23', 600 / 150, '4 times'],
    ['q24', 50 + 10 - 5, '$55'],
    ['q25', 6 / 0.08, '$75'],
    ['q26', 2 / (0.08 - 0.03), '$40'],
    ['q28', -5 * 0.005 * 100, '−2.5%'],
    ['q29', 1000 / 1.05, '$952.38'],
    ['q37', 110 / 1.05 - 100, '$4.76'],
    ['q38', (110 / 100 - 1) * 100, '10%'],
    ['q39', (0.6 * 0.1 + 0.4 * 0.05 * 0.75) * 100, '7.5%'],
    ['q41', 40 + 30 - 25, '45 days'],
    ['q43', 0.6 * 8 + 0.4 * 3, '6.0%'],
    ['q44', Math.sqrt(0.5 ** 2 * 0.1 ** 2 * 2) * 100, '7.07%'],
    ['q45', (8 - 2) / 12, '0.50'],
    ['q46', 3 + 1.2 * 5, '9.0%'],
    ['q49', 112 - 100, '+$12'],
    ['q50', Math.max(58 - 50, 0), '$8'],
    ['q51', Math.max(40 - 35, 0), '$5'],
    ['q52', Math.max(58 - 50, 0) - 3, '$5'],
    ['q56', 100 - 20, '$80'],
    ['q57', 80000 / 0.08, '$1,000,000'],
    ['q58', 1000000 * 0.02, '$20,000'],
    ['q59', 100000 * 0.2, '$20,000']
  ];
  for (const [id, calculated, label] of cases) {
    const q = questions.find(q => q.id === id);
    assert.equal(q.options[q.answer], label, id);
    const actual = Number(label.replaceAll('−', '-').replace(/[^\d.\-]/g, ''));
    assert.ok(Math.abs(actual - calculated) < 0.0051, `${id}: ${actual} vs ${calculated}`);
  }
});
