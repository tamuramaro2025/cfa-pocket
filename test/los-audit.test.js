import test from 'node:test';
import assert from 'node:assert/strict';
import { auditRows, auditSummary, auditView } from '../public/los-audit.js';
import { questions } from '../public/questions.js';
import { losQuestions } from '../public/questions-los.js';
import { units } from '../public/curriculum.js';
import { calculationIds } from '../public/calculation-evidence.js';
import { makeQueue } from '../public/engine.js';

test('all 340 official checklist locations have explicit traceable partial evidence', () => {
  assert.equal(auditRows.length, 340);
  assert.equal(new Set(auditRows.map(r => r.id)).size, 340);
  assert.equal(new Set(auditRows.map(r => r.line)).size, 340);
  const byId = new Map(questions.map(q => [q.id, q]));
  for (const row of auditRows) {
    assert.ok(row.page >= 1 && row.page <= 31);
    assert.ok(row.pageItem >= 1);
    assert.equal(row.status, 'partial');
    assert.ok(row.questionIds.length > 0, row.id);
    for (const id of row.questionIds) assert.ok(byId.has(id), `${row.id}: ${id}`);
  }
  assert.equal(auditRows.filter(r => r.before.length).length, 169);
  assert.equal(auditRows.filter(r => r.needsCalculation).length, 56);
  assert.ok(auditRows.filter(r => r.needsCalculation).every(r => r.hasCalculation));
  assert.equal(auditSummary().reduce((sum,s) => sum+s.questions, 0), questions.length);
  for (const id of calculationIds) assert.ok(byId.has(id), id);
});

test('new questions reference actual LOS and remain reachable in variable-size units', () => {
  assert.ok(losQuestions.length >= 176);
  const refs = new Set(auditRows.map(row => row.line));
  for (const q of losQuestions) {
    assert.ok(q.los.length > 0);
    assert.ok(q.los.every(line => refs.has(line)), q.id);
    const unit = units.find(u => u.id === q.unit);
    assert.ok(unit, q.id);
    assert.equal(q.topic, unit.topic, q.id);
    assert.ok(unit.questions.some(item => item.id === q.id));
    assert.equal(makeQueue([q], {}).length, 1);
  }
  assert.ok(units.some(u => u.questions.length > 3));
  assert.ok(auditView({heading: () => '', esc: String}).includes('完全対応'));
});

test('new numerical answers match independently evaluated formulas', () => {
  const cases = [
    ['los-35',12/8], ['los-35-downside',Math.sqrt(4/4)],
    ['los-42',.6*(-10)+.4*5], ['los-42-variance',Math.sqrt(.5*25+.5*25)],
    ['los-59',.01/(.04+.01)*100], ['los-14-mwr',.1*100], ['los-15-index',((30+80)/(20+80)-1)*100],
    ['los-77-anova',(1-36/100)*100], ['los-103',50**2+30**2+20**2], ['los-160-points',1.2+25*.0001],
    ['los-229',120/12], ['los-236',150-40], ['los-254',20+50-30-10], ['los-259',200-20],
    ['los-264',40/200*100], ['los-281',100-80], ['los-283',100+30-10], ['los-304',100*(.3-.25)],
    ['los-333',500*.1], ['los-343',(1.05*1.03-1)*100], ['los-240-dilution',(120+8)/(100+20)],
    ['los-259-suppliers',150+10-5], ['los-281-disposal',35-(100-70)], ['los-402',60/4],
    ['los-410',1000-300+100], ['los-418',150/1000*100], ['los-426',100*.2],
    ['los-387-two-stage',2/1.1+(2.2+2.2*1.03/(.10-.03))/1.1**2],
    ['los-478',6/1.08**.5+106/1.08**1.5], ['los-489',104/1.05], ['los-490',(100-98)/100*360/90*100],
    ['los-493',5/1.04+105/1.05**2], ['los-495-par',(1-.90)/(.96+.90)*100],
    ['los-500',(98-100+5)/100*100], ['los-503',(10/1.1+2*110/1.1**2)/100],
    ['los-515',.4*2+.6*5], ['los-519',(-3*.01+.5*20*.01**2)*100], ['los-507-pvbp',1000000*4*.0001],
    ['los-539',60/15], ['los-557',12-10], ['los-598',(1.04**2/1.03-1)*100],
    ['los-579-short-put',3-Math.max(50-42,0)], ['los-598-settlement',1000000*(.06-.05)*.5/(1+.06*.5)],
    ['los-637-fees',100+12-2-((12-2)-5)*.2], ['los-680',.06/(3*.2**2)*100],
    ['los-682',Math.sqrt(((-10)**2+0+10**2)/(3-1))], ['los-691',.4*15],
    ['los-703-m2',2+(10-2)*15/20], ['los-703-alpha',11-(3+1.2*(8-3))],
    ['los-49-test-stat',(12-10)/(4/Math.sqrt(16))], ['los-52-expected-count',40*30/100],
    ['los-150-fx-percent',((1/110)/(1/100)-1)*100], ['los-271-cost-method',(20-10)-(20-14)],
    ['los-512-price-convexity',(104.5+96-2*100)/(100*.01**2)], ['los-80-see',Math.sqrt(40/(12-2))],
    ['los-31-weighted-mean',.25*2+.5*4+.25*12],
    ['los-57-correlated-portfolio',Math.sqrt(.5**2*.1**2+.5**2*.1**2+2*.5*.5*.1*.1*.5)*100],
    ['los-15-cap-index',.2*10+.8*(-5)]
  ];
  for (const [id, expected] of cases) {
    const q = losQuestions.find(q => q.id === id);
    assert.ok(q,id);
    const actual = Number(q.options[q.answer].replaceAll('−','-').replace(/[^\d.\-]/g,''));
    assert.ok(Math.abs(actual-expected)<.0051, `${id}: ${actual} vs ${expected}`);
  }
  const interval = losQuestions.find(q => q.id === 'los-47-interval');
  assert.equal(interval.options[interval.answer], '[8.04, 11.96]');
  assert.equal(10-1.96*(6/Math.sqrt(36)),8.04);
  const binomial = losQuestions.find(q => q.id === 'los-40');
  assert.equal(binomial.options[binomial.answer],'2 and 1.6');
  assert.equal(10*.2,2);
  assert.ok(Math.abs(10*.2*(1-.2)-1.6)<1e-12);
  const mw = losQuestions.find(q => q.id === 'los-14-mwr');
  assert.ok(Math.abs(-100-100/1.1+231/1.1**2)<1e-10,mw.id);
});
