import { inventory, outlineUrl, auditedAt, calculationRefs } from './los-inventory.js';
import { calculationIds } from './calculation-evidence.js';
import { baselineEvidence } from './los-evidence.js';
import { questions, topics } from './questions.js';

export { outlineUrl, auditedAt };
const byId = new Map(questions.map(q => [q.id, q]));
const pageCounters = new Map();
export const auditRows = inventory.flatMap(group => group.items.map(item => {
  const pageItem = (pageCounters.get(item.page) || 0) + 1;
  pageCounters.set(item.page, pageItem);
  const before = baselineEvidence[item.line] || [];
  const added = questions.filter(q => q.los?.includes(item.line)).map(q => q.id);
  const ids = [...new Set([...before, ...added])];
  return { ...item, topic: group.topic, pageItem, before, added, questionIds: ids,
    status: ids.length ? 'partial' : 'gap', needsCalculation: calculationRefs.includes(item.line),
    hasCalculation: ids.some(id => calculationIds.has(id)),
    source: `${outlineUrl}#page=${item.page}` };
}));

export function auditSummary() {
  return topics.map(topic => {
    const rows = auditRows.filter(row => row.topic === topic.id);
    return { topic, total: rows.length, before: rows.filter(r => r.before.length).length,
      partial: rows.filter(r => r.status === 'partial').length, gaps: rows.filter(r => r.status === 'gap').length,
      calculationNeeded: rows.filter(r => r.needsCalculation).length,
      calculationLinked: rows.filter(r => r.needsCalculation && r.hasCalculation).length,
      questions: questions.filter(q => q.topic === topic.id).length };
  });
}

export function auditView({ heading, esc }) {
  const summary = auditSummary();
  const before = auditRows.filter(r => r.before.length).length;
  const partial = auditRows.filter(r => r.status === 'partial').length;
  const gaps = auditRows.length - partial;
  return `${heading('EVIDENCE, NOT QUESTION COUNTS','学習範囲の確認', `2027年版公式アウトライン全31ページ・${auditRows.length}項目を位置ごとに照合。確認日 ${auditedAt}`)}
    <section class="card"><h2>確認結果：全範囲の「習得」を保証する教材にはまだなっていません</h2><p>追加前は${auditRows.length}項目中${before}項目に関連問題があり、残る${auditRows.length-before}項目はこの監査では未紐付けでした。今回、不足に沿って追加した結果、${partial}項目に関連問題があり、関連問題の未紐付けは${gaps}項目です。</p><p>計算等の実行要求を含む${auditRows.filter(r=>r.needsCalculation).length}項目中、${auditRows.filter(r=>r.needsCalculation&&r.hasCalculation).length}項目に少なくとも一つの数値演習を関連付けています。ただし、全ての計算法・条件や応用の深さを満たす意味ではありません。</p><p class="subtitle">「関連演習あり（部分対応）」はLOSの一部を問題で扱うという意味です。複合的なLOSの全動詞・例外・難度を評価した「完全対応」ではありません。項目の登録数や問題数を網羅率・合格可能性として表示しません。</p><p class="source-link"><a href="${outlineUrl}" target="_blank" rel="noopener noreferrer">公式2027アウトラインを開く ↗</a></p></section>
    <section class="card audit-table-wrap"><table class="audit-table"><thead><tr><th>分野</th><th>LOS数</th><th>追加前の関連演習</th><th>現在の関連演習</th><th>未紐付け</th><th>問題数</th></tr></thead><tbody>${summary.map(s=>`<tr><th>${s.topic.name}</th><td>${s.total}</td><td>${s.before}</td><td>${s.partial}</td><td>${s.gaps}</td><td>${s.questions}</td></tr>`).join('')}</tbody></table></section>
    <section class="card"><h2>全LOSの根拠を確認する</h2><p class="subtitle">原文を再配布せず、公式PDFのページ・ページ内のチェック項目番号を記録しています。監査IDは本アプリ独自の通算番号です。ひとつのLOSが複数ページにまたがる場合は開始ページを示します。</p>${summary.map(s=>`<details class="audit-group"><summary>${s.topic.name}：${s.total}項目</summary>${auditRows.filter(r=>r.topic===s.topic.id).map(r=>`<div class="audit-row"><a class="source-link" href="${r.source}" target="_blank" rel="noopener noreferrer">${r.id} · p.${r.page} 項目${r.pageItem} ↗</a><strong>${r.status==='gap'?'演習未対応':'関連演習あり（部分対応）'}</strong>${r.needsCalculation ? `<span class="calculation-badge">${r.hasCalculation ? '数値演習あり（一部）' : '計算演習の補強が必要'}</span>` : ''}<div>${r.questionIds.map(id=>{const q=byId.get(id);return q?`<button class="audit-question" data-action="audit-question" data-id="${id}">${esc(id)}：${esc(q.meaning)}${r.added.includes(id)?'〈追加〉':''}</button>`:`<span>参照エラー：${esc(id)}</span>`;}).join('') || '<span class="muted">追加が必要です。</span>'}</div></div>`).join('')}</details>`).join('')}</section>`;
}
