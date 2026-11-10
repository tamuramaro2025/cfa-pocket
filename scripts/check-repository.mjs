// Local heuristic scan. Never print matching values or send content anywhere.
import { execFileSync } from 'node:child_process';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 32 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
const findings = [];
const rules = [
  ['private-key', /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/g],
  ['github-token', /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{50,})\b/g],
  ['openai-key', /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}\b/g],
  ['aws-access-id', /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/g],
  ['google-api-key', /\bAIza[A-Za-z0-9_-]{35}\b/g],
  ['slack-token', /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/g],
  ['stripe-secret', /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{20,}\b/g],
  ['jwt', /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{16,}\b/g],
  ['literal-bearer', /\bBearer\s+[A-Za-z0-9_.-]{24,}/g],
  ['credential-in-url', /https?:\/\/[^\s/"'<>:@]+:[^\s/"'<>@]+@/g],
  ['literal-secret-assignment', /(?:["']?(?:api[_-]?key|access[_-]?token|auth[_-]?token|refresh[_-]?token|client[_-]?secret|password|secret[_-]?key|aws_secret_access_key|token|secret|authorization)["']?)\s*[:=](?![=>=])\s*["']([^"'\r\n]{12,})["']/gi]
];
const placeholder = /^(?:YOUR[_ -]|REPLACE[_ -]|EXAMPLE[_ -]|<|\$\{|process\.env\.|test-placeholder|placeholder)/i;
function scan(bytes, file, scope) {
  if (bytes.includes(0)) return;
  const source = bytes.toString('utf8');
  for (const [rule, regex] of rules) {
    regex.lastIndex = 0;
    for (const match of source.matchAll(regex)) {
      if (placeholder.test(match[1] ?? '')) continue;
      findings.push({ scope, file, line: source.slice(0, match.index).split('\n').length, rule });
    }
  }
}
const tracked = git('ls-files', '-z').toString().split('\0').filter(Boolean);
const ignoredTracked = git('ls-files', '-ci', '--exclude-standard', '-z').toString().split('\0').filter(Boolean);
for (const file of ignoredTracked) findings.push({ scope: 'index', file, rule: 'tracked-despite-gitignore' });
const pending = git('ls-files', '--others', '--exclude-standard', '-z').toString().split('\0').filter(Boolean);
const commits = git('rev-list', '--all').toString().trim().split('\n').filter(Boolean);
const blobs = new Map();
for (const commit of commits) {
  for (const entry of git('ls-tree', '-r', '-z', commit).toString().split('\0').filter(Boolean)) {
    const match = entry.match(/^\d+ blob ([a-f0-9]+)\t([\s\S]+)$/);
    if (match && !blobs.has(match[1])) blobs.set(match[1], match[2]);
  }
}
if (blobs.size) {
  const ids = [...blobs.keys()];
  const batch = execFileSync('git', ['cat-file', '--batch'], { cwd: root, input: ids.join('\n') + '\n', maxBuffer: 32 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'] });
  let offset = 0;
  for (const id of ids) {
    const end = batch.indexOf(10, offset);
    const size = Number(batch.subarray(offset, end).toString().split(' ')[2]);
    if (!Number.isSafeInteger(size)) throw Error('Unable to inspect Git history');
    const bytes = batch.subarray(end + 1, end + 1 + size);
    scan(bytes, blobs.get(id), 'history'); offset = end + 1 + size + 1;
  }
}
let localFiles = 0;
const skipDirectories = new Set(['.git', 'node_modules', '.gradle', 'build', 'dist', 'www', '.cache', '.cxx', '.externalNativeBuild']);
async function walk(dir) {
  for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
    const file = path.posix.join(dir, entry.name);
    if (entry.isSymbolicLink()) continue; // Never follow a link outside this repository.
    if (entry.isDirectory()) { if (!skipDirectories.has(entry.name)) await walk(file); }
    else if (entry.isFile()) { localFiles++; scan(await readFile(path.join(root, file)), file, 'working-tree'); }
  }
}
await walk('');
// The index can differ from the working file, so inspect staged blobs as well.
for (const file of tracked) scan(git('show', `:${file}`), file, 'index');
const deny = /(?:^|\/)(?:\.env(?:\..+)?|\.envrc|\.npmrc|\.netrc|\.git-credentials|\.aws|\.azure|\.secrets|node_modules|\.local|\.openai|www|build|dist|coverage|\.gradle|local\.properties|secrets|credentials|google-services\.json|GoogleService-Info\.plist)(?:\/|$)|\.(?:jks|keystore|key|pem|p12|pfx|p8|apk|aab|aar|zip|tgz|tar(?:\.gz)?)$/i;
for (const file of [...tracked, ...pending]) {
  if (deny.test(file) && !/(?:^|\/)\.env\.(?:example|template)$/.test(file)) findings.push({ scope: 'commit-candidate', file, rule: 'sensitive-or-generated-path' });
}
let config = '';
try { config = git('config', '--local', '--list').toString(); } catch { /* Repository without local settings. */ }
scan(Buffer.from(config), '.git/config', 'local-config');
if (/^http\..*extraheader=.*(?:authorization|bearer|basic)/im.test(config)) findings.push({ scope: 'local-config', file: '.git/config', rule: 'persisted-auth-header' });
const unique = [...new Map(findings.map(item => [JSON.stringify(item), item])).values()];
console.log(JSON.stringify({ mode: 'local-only; matching values redacted', commits: commits.length, historyBlobs: blobs.size, indexFiles: tracked.length, untrackedCandidates: pending.length, localFilesScanned: localFiles, findings: unique, limitations: 'Heuristic patterns, not a guarantee that no secret exists. Ignored dependency/build directories, binary files and symlink targets are not content-scanned.' }, null, 2));
if (unique.length) process.exitCode = 1;
