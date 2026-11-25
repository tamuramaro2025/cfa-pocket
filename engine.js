export function dayKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function addDays(key, days) {
  const date = new Date(key + 'T12:00:00');
  date.setDate(date.getDate() + days);
  return dayKey(date);
}
export function dueQuestions(questions, progress, today = dayKey()) {
  return questions.filter(q => progress[q.id]?.due <= today).sort((a, b) => progress[a.id].due.localeCompare(progress[b.id].due));
}
export function makeQueue(questions, progress, { mode = 'daily', topic = 'all', today = dayKey() } = {}) {
  const eligible = questions.filter(q => topic === 'all' || q.topic === topic);
  const due = dueQuestions(eligible, progress, today);
  if (mode === 'review') return due.slice(0, 3);
  const unseen = eligible.filter(q => !progress[q.id]);
  const future = eligible.filter(q => progress[q.id] && progress[q.id].due > today).sort((a, b) => progress[a.id].due.localeCompare(progress[b.id].due));
  return [...due, ...unseen, ...future].slice(0, 3);
}
export function schedule(previous, correct, confidence, today = dayKey()) {
  const oldStage = previous?.stage || 0;
  const stage = !correct ? 0 : confidence === 'sure' ? Math.min(oldStage + 1, 4) : Math.max(0, oldStage - 1);
  const interval = !correct || confidence === 'unsure' ? 1 : confidence === 'maybe' ? 3 : [1, 3, 7, 14, 30][stage];
  return { stage, due: addDays(today, interval), attempts: (previous?.attempts || 0) + 1, correct: (previous?.correct || 0) + Number(correct), lastCorrect: correct, lastConfidence: confidence };
}
export function streak(history, today = dayKey()) {
  const days = new Set(history.map(h => h.day));
  let cursor = days.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (days.has(cursor)) { count++; cursor = addDays(cursor, -1); }
  return count;
}
