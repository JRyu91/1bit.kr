const assert = require('node:assert/strict'), vm = require('node:vm'), fs = require('node:fs');
const source = fs.readFileSync(__dirname + '/signup.js', 'utf8');
function setup(fail) {
  const elements = new Map();
  const element = id => elements.get(id) || (elements.set(id, { value: '', textContent: '', disabled: false }), elements.get(id));
  const calls = []; let destination;
  const context = { document: { getElementById: element }, window: { location: { replace(url) { destination = url; } }, QuizAccount: { async api(path, data) { calls.push({ path, data }); if (path === fail) throw Error('입력 내용을 확인하세요.'); } } } };
  vm.runInNewContext(source, context);
  element('signup-code').value = 'ktcloud'; element('signup-id').value = 'tester'; element('signup-password').value = 'password123'; element('signup-password-confirm').value = 'password123'; element('signup-name').value = '닉네임';
  return { element, calls, submit: () => element('signup-form').onsubmit({ preventDefault() {} }), destination: () => destination };
}
(async () => {
  const ok = setup(); await ok.submit();
  assert.deepEqual(ok.calls.map(c => c.path), ['/quiz/signup', '/account/login']);
  assert.equal(ok.calls[0].data.code, 'ktcloud'); assert.equal(ok.calls[0].data.name, '닉네임'); assert.equal(ok.destination(), '../');
  await ok.submit(); assert.equal(ok.calls.length, 2, 'prevent duplicate signup');
  const failed = setup('/quiz/signup'); await failed.submit(); assert.equal(failed.element('signup-fields').disabled, false); assert.equal(failed.destination(), undefined);
  const loginFailed = setup('/account/login'); await loginFailed.submit(); assert.equal(loginFailed.element('signup-fields').disabled, true); assert.match(loginFailed.element('signup-status').textContent, /로그인 페이지/);
  const blank = setup(); blank.element('signup-name').value = '  '; await blank.submit(); assert.equal(blank.calls.length, 0);
  const noCode = setup(); noCode.element('signup-code').value = ''; await noCode.submit(); assert.equal(noCode.calls.length, 0);
  const mismatch = setup(); mismatch.element('signup-password-confirm').value = 'different123'; await mismatch.submit(); assert.equal(mismatch.calls.length, 0); assert.match(mismatch.element('signup-status').textContent, /일치하지 않습니다/);
  const noConfirm = setup(); noConfirm.element('signup-password-confirm').value = ''; await noConfirm.submit(); assert.equal(noConfirm.calls.length, 0);
  console.log('signup page creation / auto-login redirect / retry / duplicate protection PASS');
})().catch(e => { console.error(e); process.exitCode = 1; });
