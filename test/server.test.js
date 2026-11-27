import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppServer } from '../server.mjs';

test('server serves home, modules and readiness endpoint', async t => {
  const server = createAppServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const base = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${base}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { app: 'cfa-pocket', status: 'ok' });
  const home = await fetch(base);
  assert.equal(home.status, 200);
  assert.match(await home.text(), /CFA Pocket/);
  for (const asset of ['/app.js', '/engine.js', '/questions.js', '/questions-extra.js', '/curriculum.js', '/learning-guide.js', '/content-kit.js', '/curriculum-foundations.js', '/curriculum-markets.js', '/curriculum-investing.js', '/questions-los.js', '/los-audit.js', '/los-inventory.js', '/style.css']) {
    const response = await fetch(base + asset);
    assert.equal(response.status, 200, asset);
  }
  assert.equal((await fetch(`${base}/missing-file`)).status, 404);
  for (const route of ['/api/auth/session', '/account.js', '/delete-account.html', '/delete-account-page.js']) {
    assert.equal((await fetch(base + route)).status, 404, route);
  }
  assert.equal((await fetch(`${base}/api/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })).status, 404);
  assert.equal((await fetch(`${base}/..%2Fserver.mjs`)).status, 403);
});
