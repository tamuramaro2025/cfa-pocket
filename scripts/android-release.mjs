import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, copyFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { checkPlayRelease } from './check-play-release.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const draft = process.argv.includes('--draft');
const { info, issues } = await checkPlayRelease({ online: !draft });
if (issues.length && !draft) {
  console.error('公開用ビルドを停止しました:\n' + issues.map(issue => `- ${issue}`).join('\n'));
  process.exit(1);
}
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || path.join(process.env.HOME, 'Library/Android/sdk');
const java = process.env.JAVA_HOME || '/Applications/Android Studio.app/Contents/jbr/Contents/Home';
if (!existsSync(path.join(sdk, 'platforms/android-36'))) throw Error('Android SDK Platform 36 is required.');
const env = { ...process.env, ANDROID_HOME: sdk, JAVA_HOME: java };
const run = (cmd, args, cwd = root, capture = false) => {
  const result = spawnSync(cmd, args, { cwd, env, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', timeout: 10*60*1000 });
  if (result.error || result.status !== 0) throw Error(`${path.basename(cmd)} failed (${result.status ?? result.error?.code}); no bundle was exported.`);
  return result.stdout;
};
run(process.execPath, ['scripts/build-android-web.mjs']);
run(path.join(root, 'node_modules/.bin/cap'), ['sync', 'android']);
run('./gradlew', ['--no-daemon', '--console=plain', 'bundleRelease', 'assembleRelease', 'lintRelease', 'testReleaseUnitTest'], path.join(root, 'android'));
const bundle = path.join(root, 'android/app/build/outputs/bundle/release/app-release.aab');
const signature = run(path.join(java, 'bin/jarsigner'), ['-J-Duser.language=en', '-J-Duser.country=US', '-verify', bundle], root, true);
if (!signature.includes('jar verified')) throw Error('AAB signature could not be verified.');
const apk = path.join(root, 'android/app/build/outputs/apk/release/app-release.apk');
const analyzer = path.join(sdk, 'cmdline-tools/latest/bin/apkanalyzer');
const manifest = run(analyzer, ['manifest', 'print', apk], root, true);
if (/android:debuggable="true"/.test(manifest)) throw Error('Release APK is debuggable.');
if (!/android:targetSdkVersion="36"/.test(manifest)) throw Error('Unexpected release target SDK.');
const nativeLibraries = run('/usr/bin/unzip', ['-Z1', bundle], root, true).split('\n').filter(name => name.endsWith('.so'));
if (nativeLibraries.length) throw Error('Native .so libraries were added. Verify 16 KB page-size support before exporting this release.');
const out = path.join(root, 'dist/google-play', draft ? 'draft-do-not-upload' : `${info.versionName}-${info.versionCode}`);
await mkdir(out, { recursive: true });
const filename = `CFA-Pocket-${info.versionName}-${info.versionCode}${draft ? '-DRAFT' : ''}.aab`;
await copyFile(bundle, path.join(out, filename));
await copyFile(apk, path.join(out, 'CFA-Pocket-release-test.apk'));
const dependencies = run('./gradlew', ['--console=plain', ':app:dependencies', '--configuration', 'releaseRuntimeClasspath'], path.join(root, 'android'), true);
await writeFile(path.join(out, 'runtime-dependencies.txt'), dependencies);
const report = { draft, uploaded: false, appId: info.appId, versionName: info.versionName, versionCode: info.versionCode, usageMode: 'personal-local', aab: filename, sha256: createHash('sha256').update(await readFile(bundle)).digest('hex'), signatureVerified: true, debuggable: false, targetSdk: 36, nativeLibraries, checks: ['bundleRelease', 'assembleRelease', 'lintRelease', 'testReleaseUnitTest'], remaining: issues };
await writeFile(path.join(out, 'build-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (draft) console.log('DRAFT: 技術検証用です。未設定項目を解消するまでPlay Consoleへアップロードしないでください。');
