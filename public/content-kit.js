// 独自の単元と確認問題を同じ構造に揃える。正解・誤答理由は各問題で明記。
export function question(topic, id, prompt, options, answer, reasons, term, meaning) {
  return { id, topic, prompt, options, answer, reasons, term, meaning,
    summary: reasons[answer], explanation: reasons.map((reason, i) => `${'ABC'[i]}：${reason}`).join(' ') };
}
export function unit(topic, slug, title, objectives, notes, formula, pitfall, items, sources) {
  const id = `${topic}-${slug}`;
  return { id, topic, title, objectives, notes, formula, pitfall, sources,
    questions: items.map((args, i) => question(topic, `u-${id}-${i + 1}`, ...args)) };
}
export const outline = 'https://www.cfainstitute.org/programs/cfa-program/candidate-resources/level-i-exam';
