import { question } from './content-kit.js';
// refsは公式PDF内のLOS位置。各問題が扱うのは当該LOSの一部であり、完全対応とはしない。
export function a(refs, unit, term, meaning, prompt, options, answer, reasons, suffix = '') {
  const los = Array.isArray(refs) ? refs : [refs];
  return { ...question(unit.split('-')[0], `los-${los[0]}${suffix}`, prompt, options, answer, reasons, term, meaning), unit, los };
}
