const isRecord=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const integer=(value,min,max)=>Number.isSafeInteger(value)&&value>=min&&value<=max;
const validDay=value=>typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&!Number.isNaN(Date.parse(value+'T12:00:00Z'))&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value;
const confidences=new Set(['sure','maybe','unsure']);
export function validateBackup(raw,questionIds,unitIds){
  if(!isRecord(raw)||raw.version!==1||!isRecord(raw.progress)||!Array.isArray(raw.history)||!Array.isArray(raw.bookmarks))throw new Error('CFA Pocketのバックアップ形式ではありません。');
  if(raw.history.length>100000||Object.keys(raw.progress).length>10000)throw new Error('バックアップの件数が大きすぎます。');
  const questions=new Set(questionIds),units=new Set(unitIds),progress={};let skipped=0;
  for(const[id,p]of Object.entries(raw.progress)){
    if(!questions.has(id)){skipped++;continue;}
    if(!isRecord(p)||!validDay(p.due)||!integer(p.stage,0,4)||!integer(p.attempts,1,1000000)||!integer(p.correct,0,p.attempts)||typeof p.lastCorrect!=='boolean'||!confidences.has(p.lastConfidence))throw new Error('復習データに不正な値があります。');
    progress[id]={stage:p.stage,due:p.due,attempts:p.attempts,correct:p.correct,lastCorrect:p.lastCorrect,lastConfidence:p.lastConfidence};
  }
  const history=[];
  for(const h of raw.history){
    if(!isRecord(h)||typeof h.id!=='string')throw new Error('履歴の形式が正しくありません。');
    if(!questions.has(h.id)){skipped++;continue;}
    if(typeof h.correct!=='boolean'||!confidences.has(h.confidence)||!validDay(h.day)||typeof h.at!=='string'||Number.isNaN(Date.parse(h.at)))throw new Error('履歴の日付または回答が正しくありません。');
    history.push({id:h.id,correct:h.correct,confidence:h.confidence,day:h.day,at:h.at});
  }
  if(raw.exam!==''&&raw.exam!==undefined&&!validDay(raw.exam))throw new Error('受験予定日が正しくありません。');
  return{state:{progress,history,bookmarks:[...new Set(raw.bookmarks.filter(id=>questions.has(id)))],readUnits:[...new Set((Array.isArray(raw.readUnits)?raw.readUnits:[]).filter(id=>units.has(id)))],exam:raw.exam||'',goal:[3,6,9].includes(raw.goal)?raw.goal:3},skipped};
}
