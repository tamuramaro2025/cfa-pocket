import { Capacitor, registerPlugin } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Preferences } from '@capacitor/preferences';
import { Keyboard } from '@capacitor/keyboard';

if (Capacitor.isNativePlatform()) {
  const Backup = registerPlugin('Backup');
  window.CFA_NATIVE = { preferences: Preferences, app: App, backup: Backup, keyboard: Keyboard };
  document.documentElement.classList.add('native-app');
}
import('../public/app.js').catch(() => {
  document.querySelector('#app').textContent = '起動できませんでした。アプリを開き直してください。データは削除しないでください。';
});
