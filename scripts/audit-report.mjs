import { auditRows, auditSummary, outlineUrl, auditedAt } from '../public/los-audit.js';
import { questions } from '../public/questions.js';
import { losQuestions } from '../public/questions-los.js';

const report = {
  source: outlineUrl, date: auditedAt, questionCount: questions.length, added: losQuestions.length,
  summary: auditSummary().map(s => ({ name:s.topic.name, total:s.total, before:s.before, partial:s.partial,
    gaps:s.gaps, questions:s.questions, calculation:s.calculationLinked })),
  rows: auditRows.map(r => ({ id:r.id, page:r.page, n:r.pageItem, before:r.before, added:r.added,
    ids:r.questionIds, calc:r.needsCalculation, hasCalc:r.hasCalculation }))
};
if (process.argv.includes('--json')) console.log(JSON.stringify(report));
else {
  console.table(report.summary);
  console.log(`${report.rows.length} LOS / ${report.questionCount} questions / ${report.added} additions`);
  console.log('All links are partial evidence, not certification of complete coverage.');
}
