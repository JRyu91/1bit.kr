const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync(__dirname + '/contact.js', 'utf8');
async function check(clipboard, expected) {
  const button = {dataset: {copyEmail: 'ujun5190@gmail.com'}, addEventListener(_, fn) {this.click = fn;}};
  const status = {};
  vm.runInNewContext(code, {navigator: {clipboard}, document: {
    querySelector: selector => selector === '.copy-status' ? status : button
  }});
  await button.click();
  assert.match(status.textContent, expected);
}
(async () => {
  await check({writeText: async text => assert.equal(text, 'ujun5190@gmail.com')}, /복사했습니다/);
  await check({writeText: async () => {throw new Error('denied');}}, /선택해 복사/);
  await check(undefined, /선택해 복사/);
  console.log('email copy/success/denied/unavailable PASS');
})().catch(error => {console.error(error); process.exitCode = 1;});
