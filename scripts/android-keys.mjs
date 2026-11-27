import { access, mkdir, writeFile, chmod } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const dir = path.join(root, '.local/android-signing');
const store = path.join(dir, 'upload-keystore.p12');
const config = path.join(dir, 'signing.properties');
const exists = async file => access(file).then(() => true, () => false);
if (await exists(store) || await exists(config)) {
  if (!await exists(store) || !await exists(config)) throw Error('Signing setup is incomplete. Existing files were preserved; inspect .local/android-signing locally.');
  console.log('Existing upload key preserved. No key or password was printed.');
} else {
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const password = randomBytes(32).toString('hex');
  const javaHome = process.env.JAVA_HOME || '/Applications/Android Studio.app/Contents/jbr/Contents/Home';
  const keytool = path.join(javaHome, 'bin/keytool');
  const env = { ...process.env, CFA_UPLOAD_KEY_PASSWORD: password };
  const run = args => {
    const result = spawnSync(keytool, args, { env, encoding: 'utf8' });
    if (result.error || result.status !== 0) throw Error('keytool failed; inspect local Java availability. Existing signing material was not overwritten.');
  };
  run(['-genkeypair', '-keystore', store, '-storetype', 'PKCS12', '-alias', 'upload', '-keyalg', 'RSA', '-keysize', '3072', '-validity', '10000', '-dname', 'CN=CFA Pocket Upload, OU=Android Upload', '-storepass:env', 'CFA_UPLOAD_KEY_PASSWORD', '-keypass:env', 'CFA_UPLOAD_KEY_PASSWORD', '-noprompt']);
  await chmod(store, 0o600);
  await writeFile(config, `storeFile=${store}\nstorePassword=${password}\nkeyAlias=upload\nkeyPassword=${password}\n`, { mode: 0o600, flag: 'wx' });
  run(['-exportcert', '-rfc', '-keystore', store, '-alias', 'upload', '-storepass:env', 'CFA_UPLOAD_KEY_PASSWORD', '-file', path.join(dir, 'upload-certificate.pem')]);
  console.log('Created a dedicated upload key in .local/android-signing (Git-ignored, mode 600). Back up this folder securely. Passwords were not printed.');
}
