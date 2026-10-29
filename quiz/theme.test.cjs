const assert = require('node:assert/strict'), vm = require('node:vm'), fs = require('node:fs');
const source = fs.readFileSync(__dirname + '/theme.js', 'utf8');
function setup(saved, blocked = false) {
  const events = {}, writes = [], root = { dataset: {} }, meta = {};
  const buttons = ['light', 'dark'].map(theme => ({ dataset: { quizThemeChoice: theme }, attrs: {}, setAttribute(k, v) { this.attrs[k] = v; }, addEventListener(event, fn) { this[event] = fn; } }));
  let ready = false;
  const context = { document: { documentElement: root, querySelector: () => ({ setAttribute: (k, v) => { meta[k] = v; } }), querySelectorAll: () => ready ? buttons : [], addEventListener: (event, fn) => { events[event] = fn; } }, localStorage: { getItem() { if (blocked) throw Error('blocked'); return saved; }, setItem(k, v) { if (blocked) throw Error('blocked'); writes.push([k, v]); } } };
  vm.runInNewContext(source, context);
  assert.equal(root.dataset.quizTheme, saved === 'dark' && !blocked ? 'dark' : 'light', 'apply before DOM ready');
  ready = true; events.DOMContentLoaded();
  return { root, buttons, writes, meta };
}
const dark = setup('dark'); assert.equal(dark.buttons[1].attrs['aria-pressed'], 'true'); assert.equal(dark.meta.content, '#161c24');
dark.buttons[0].click(); assert.equal(dark.root.dataset.quizTheme, 'light'); assert.deepEqual(dark.writes, [['1bit-quiz-theme', 'light']]);
dark.buttons[1].click(); assert.equal(dark.root.dataset.quizTheme, 'dark');
setup('invalid'); const blocked = setup('dark', true); blocked.buttons[1].click(); assert.equal(blocked.root.dataset.quizTheme, 'dark');
console.log('theme initial paint / persistence / button state / blocked storage PASS');
