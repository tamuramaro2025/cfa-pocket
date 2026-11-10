import test from 'node:test';
import assert from 'node:assert/strict';
import { units, unitStatus, curriculumQuestions } from '../public/curriculum.js';
import { topics } from '../public/questions.js';
import { guide, lesson } from '../public/learning-guide.js';
import { makeQueue } from '../public/engine.js';

test('curriculum has eight substantial units per topic with unique linked questions', () => {
  assert.equal(units.length, 80);
  assert.ok(curriculumQuestions.length >= 336);
  assert.equal(new Set(units.map(u => u.id)).size, units.length);
  assert.equal(new Set(curriculumQuestions.map(q => q.id)).size, curriculumQuestions.length);
  for (const topic of topics) assert.equal(units.filter(u => u.topic === topic.id).length, 8);
  for (const unit of units) {
    assert.ok(/^[a-z][a-z0-9-]+$/.test(unit.id));
    assert.equal(unit.objectives.length, 2);
    assert.ok(unit.notes.length >= 3);
    assert.ok(unit.notes.every(n => n.length > 20));
    assert.ok(unit.pitfall.length > 10);
    assert.ok(unit.sources.every(url => new URL(url).protocol === 'https:'));
    assert.ok(unit.questions.length >= 2);
    const queue = makeQueue(curriculumQuestions.filter(q => q.unit === unit.id), {});
    assert.equal(queue.length, Math.min(3, unit.questions.length));
    assert.ok(queue.every(q => q.unit === unit.id && q.topic === unit.topic));
  }
});

test('reading progress is independent of attempted and confident answers', () => {
  const unit = units[0];
  const progress = { [unit.questions[0].id]: { lastCorrect: true, lastConfidence: 'maybe' } };
  assert.deepEqual(unitStatus(unit, progress), { attempted: 1, confident: 0, total: unit.questions.length });
  progress[unit.questions[1].id] = { lastCorrect: true, lastConfidence: 'sure' };
  assert.deepEqual(unitStatus(unit, progress), { attempted: 2, confident: 1, total: unit.questions.length });
});

test('guide filtering, empty results, lesson links and not-found state render', () => {
  const args = { topics, state: { progress: {}, readUnits: [] }, esc: s => String(s), heading: (a,b,c='') => `${a} ${b} ${c}` };
  const filtered = guide({ ...args, topic: 'fsa', query: '税効果' });
  assert.match(filtered, /fsa-taxes/);
  assert.doesNotMatch(filtered, /href="#lesson\/quant-/);
  assert.match(guide({ ...args, query: 'NO-MATCH-XYZ' }), /一致する単元がありません/);
  assert.match(lesson({ ...args, id: 'quant-probability' }), /3問ずつ演習/);
  assert.match(lesson({ ...args, id: 'does-not-exist' }), /単元が見つかりません/);
});

test('new worked answers agree with independent calculations', () => {
  const cases = [
    ['u-quant-returns-1', (1.08/1.03-1)*100],
    ['u-quant-cashflows-1', (1.1*0.9-1)*100],
    ['u-quant-probability-1', .4*.5],
    ['u-quant-probability-2', .08/(.08+.18)*100],
    ['u-quant-distributions-2', .006/(.2*.1)],
    ['u-quant-sampling-1',12/Math.sqrt(36)],
    ['u-quant-regression-1',2+3*4],
    ['u-quant-regression-2',(-.8)**2],
    ['u-econ-cycles-1',8/(8+92)*100],
    ['u-econ-fiscal-1',1/(1-.75)],
    ['u-econ-fx-cross-1',150*1.1],
    ['u-econ-fx-forward-1',100*1.01/1.03],
    ['u-fsa-reports-1',(120-20)/50],
    ['u-fsa-cashflows-1',100-40+10],
    ['u-fsa-cashflows-2',80+10*.8-30],
    ['u-fsa-quality-models-1',.05*2*3*100],
    ['u-fixed-funding-1',100*.9],
    ['u-fixed-pricing-1',98+1.2],
    ['u-fixed-yields-1',(6.2-4)*100],
    ['u-fixed-yields-2',((1+.06/2)**2-1)*100],
    ['u-fixed-curves-1',(1.05**2/1.04-1)*100],
    ['u-fixed-duration-1',(-4*.01+.5*30*.01**2)*100],
    ['u-fixed-credit-1',.02*.6*1000],
    ['u-derivatives-forwards-1',100*1.05],
    ['u-derivatives-forwards-2',110-100/1.1],
    ['u-derivatives-futures-1',(103-100)*10],
    ['u-derivatives-swaps-1',1000000*(.05-.04)*.5],
    ['u-derivatives-option-values-1',9-Math.max(55-50,0)],
    ['u-derivatives-parity-1',8+95-3],
    ['u-derivatives-binomial-1',(1-.8)/(1.2-.8)],
    ['u-alternative-performance-1',(40+90)/100],
    ['u-corporate-liquidity-1',(10+5+25)/20],
    ['u-corporate-capital-allocation-1',30/200*100],
    ['u-corporate-leverage-1',800/(20-12)],
    ['u-equity-dcf-2',30-200*.1],
    ['u-equity-multiples-1',500+200-50],
    ['u-equity-forecasting-1',12*.6],
    ['u-portfolio-capm-1',.03/.02],
    ['u-portfolio-performance-1',2/4]
  ];
  for (const [id, expected] of cases) {
    const q = curriculumQuestions.find(q => q.id === id);
    assert.ok(q, id);
    const actual = Number(q.options[q.answer].replaceAll('−','-').replace(/[^\d.\-]/g,''));
    assert.ok(Math.abs(actual-expected) < .0051, `${id}: answer ${actual}, expected ${expected}`);
  }
});
