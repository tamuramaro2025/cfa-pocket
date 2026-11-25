import { foundationUnits } from './curriculum-foundations.js';
import { marketUnits } from './curriculum-markets.js';
import { investingUnits } from './curriculum-investing.js';
import { losQuestions } from './questions-los.js';

export const curriculumYear = 2027;
export const curriculumSources = [
  { title: 'CFA Institute：Level Iの範囲・年度別ウェイト', url: 'https://www.cfainstitute.org/programs/cfa-program/candidate-resources/level-i-exam' },
  { title: 'CFA Institute：2027年版の学習目標', url: 'https://www.cfainstitute.org/sites/default/files/2027levelitopicoutline_online.pdf' },
  { title: 'CFA Institute：倫理・職業行為基準', url: 'https://www.cfainstitute.org/standards/professionals/code-ethics-standards' }
];
export const units = [...foundationUnits, ...marketUnits, ...investingUnits].map(unit => ({
  ...unit, questions: [...unit.questions, ...losQuestions.filter(q => q.unit === unit.id)]
}));
export const curriculumQuestions = units.flatMap(unit => unit.questions.map(q => ({ ...q, unit: unit.id })));
export function unitStatus(unit, progress) {
  const attempted = unit.questions.filter(q => progress[q.id]);
  const confident = unit.questions.filter(q => progress[q.id]?.lastCorrect && progress[q.id]?.lastConfidence === 'sure');
  return { attempted: attempted.length, confident: confident.length, total: unit.questions.length };
}
