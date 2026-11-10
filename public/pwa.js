const listeners=new Set();
const state={secure:window.isSecureContext,online:navigator.onLine,standalone:matchMedia('(display-mode: standalone)').matches||navigator.standalone===true,installable:false,offlineReady:false,updateReady:false,persistent:null,message:''};
let deferredInstall,registration,reloadRequested=false;
export const pwaState=()=>({...state});
export const onPwaChange=callback=>{listeners.add(callback);return()=>listeners.delete(callback);};
const emit=()=>{for(const listener of listeners)listener(pwaState());};
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;state.installable=true;emit();});
window.addEventListener('appinstalled',()=>{deferredInstall=null;state.installable=false;state.standalone=true;state.message='ホーム画面に追加しました。';emit();});
window.addEventListener('online',()=>{state.online=true;emit();});
window.addEventListener('offline',()=>{state.online=false;emit();});
export async function installApp(){
  if(!deferredInstall){state.message='AndroidのChromeで右上の「︙」→「アプリをインストール」または「ホーム画面に追加」を選んでください。';emit();return;}
  const prompt=deferredInstall;deferredInstall=null;state.installable=false;
  await prompt.prompt();await prompt.userChoice;emit();
}
export function applyUpdate(){if(registration?.waiting){reloadRequested=true;registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});}}
export async function protectStorage(){
  try{state.persistent=await navigator.storage?.persist?.()||false;state.message=state.persistent?'保存領域の保護が許可されました。バックアップも併用してください。':'保存領域の保護は許可されませんでした。定期的にバックアップしてください。';}
  catch{state.message='保存領域の保護を設定できませんでした。バックアップをご利用ください。';}emit();
}
async function checkOfflineReady(){
  try{
    if(!navigator.serviceWorker.controller){state.offlineReady=false;return;}
    state.offlineReady=await new Promise(resolve=>{
      const channel=new MessageChannel();
      const timeout=setTimeout(()=>{channel.port1.close();resolve(false);},2000);
      channel.port1.onmessage=event=>{clearTimeout(timeout);channel.port1.close();resolve(event.data?.ready===true);};
      navigator.serviceWorker.controller.postMessage({type:'OFFLINE_STATUS'},[channel.port2]);
    });
  }
  catch{state.offlineReady=false;}
}
export async function initPwa(){
  try{state.persistent=await navigator.storage?.persisted?.()||false;}catch{/*optional*/}
  if(!state.secure||!('serviceWorker'in navigator)){emit();return;}
  navigator.serviceWorker.addEventListener('controllerchange',async()=>{if(reloadRequested){location.reload();return;}await checkOfflineReady();emit();});
  try{
    registration=await navigator.serviceWorker.register('/sw.js',{scope:'/',updateViaCache:'none'});
    state.updateReady=Boolean(registration.waiting);
    registration.addEventListener('updatefound',()=>{
      const worker=registration.installing;
      worker?.addEventListener('statechange',async()=>{if(worker.state==='installed'){state.updateReady=Boolean(registration.waiting&&navigator.serviceWorker.controller);await checkOfflineReady();emit();}});
    });
    await navigator.serviceWorker.ready;await checkOfflineReady();
  }catch{await checkOfflineReady();if(!state.offlineReady)state.message='オフライン教材の保存が完了していません。通信状態を確認して再度開いてください。';}
  emit();
}
export function pwaPanel(esc,studyActive=false){
  return `<section class="card mobile-install"><h2>Androidアプリとして使う</h2><p>${state.standalone?'✓ アプリモードで利用中':'Chromeからホーム画面に追加すると、アプリのように開けます。'}</p>
    ${!state.secure?'<div class="notice">この接続ではインストール・オフライン保存を利用できません。スマホではHTTPSの配信URLを開いてください。</div>':''}
    <div class="pwa-indicators"><span>${state.online?'● オンライン':'○ オフライン'}</span><span>${state.offlineReady?'✓ 教材を端末に保存済み':'教材のオフライン保存を確認中'}</span></div>
    <p class="subtitle">端末に保存済みになれば、問題と学習ガイドを通信なしで使えます。公式PDFなどの外部リンクには通信が必要です。</p>
    <div class="lesson-actions">${!state.standalone?`<button class="primary" data-action="pwa-install" ${!state.secure?'disabled':''}>${state.installable?'アプリをインストール':'ホーム画面への追加方法'}</button>`:''}
    ${state.updateReady?`<button class="secondary" data-action="pwa-update" ${studyActive?'disabled':''}>新しい教材に更新する</button>`:''}
    <button class="secondary" data-action="pwa-persist">保存領域を保護する</button></div>
    ${state.message?`<p class="notice" role="status">${esc(state.message)}</p>`:''}
    <p class="subtitle">履歴は端末・接続先ごとに保存されます。Macの履歴を移すにはバックアップを読み込んでください。定期的な書き出しもおすすめします。</p></section>`;
}
