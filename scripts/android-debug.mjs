import { existsSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || path.join(process.env.HOME || '', 'Library/Android/sdk');
const jbr = '/Applications/Android Studio.app/Contents/jbr/Contents/Home';
const env = { ...process.env, ANDROID_HOME: sdk };
if (!env.JAVA_HOME && existsSync(jbr)) env.JAVA_HOME = jbr;
if (!existsSync(path.join(sdk, 'platforms/android-36'))) {
  console.error('Android SDK Platform 36 is missing. See docs/android.md.'); process.exit(1);
}
console.log('SDK platforms:', readdirSync(path.join(sdk, 'platforms')).join(', '));
const result = spawnSync('./gradlew', ['--no-daemon', '--console=plain', 'assembleDebug', 'testDebugUnitTest'], { cwd: path.join(root, 'android'), env, stdio: 'inherit', timeout: 10 * 60 * 1000 });
if (result.error) console.error(result.error.message);
if (result.status !== 0) process.exit(result.status || 1);
console.log('Debug APK: android/app/build/outputs/apk/debug/app-debug.apk');
