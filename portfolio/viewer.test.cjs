const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const code = fs.readFileSync(__dirname + '/viewer.js', 'utf8');
function setup(supported = true) {
  const events = {};
  const frame = {removeAttribute(key) { delete this[key]; }};
  const close = {addEventListener(_, fn) { this.click = fn; }};
  const viewer = {querySelector: s => s === 'iframe' ? frame : close,
    addEventListener: (name, fn) => events[name] = fn,
    close() { this.open = false; events.close(); }};
  if (supported) viewer.showModal = function () { this.open = true; };
  const nodes = {'viewer-title': {}, 'pdf-open': {}, 'pdf-download': {}};
  const buttons = ['one.pdf', 'two.pdf'].map(pdf => ({dataset: {pdf, title: pdf},
    addEventListener(_, fn) {this.click = fn;}, focus() {this.focused = true;}}));
  const window = {location: {}};
  vm.runInNewContext(code, {window, document: {
    querySelector: () => viewer, querySelectorAll: () => buttons, getElementById: id => nodes[id]}});
  return {viewer, frame, close, buttons, nodes, window, events};
}
const a = setup();
a.buttons[0].click();
assert.equal(a.viewer.open, true);
assert.equal(a.frame.src, 'one.pdf');
assert.equal(a.nodes['pdf-open'].href, 'one.pdf');
assert.equal(a.nodes['pdf-download'].href, 'one.pdf');
assert.equal(a.nodes['viewer-title'].textContent, 'one.pdf');
assert.equal(a.frame.title, 'one.pdf 발표자료');
a.close.click();
assert.equal(a.frame.src, undefined);
assert.equal(a.buttons[0].focused, true);
a.buttons[1].click();
assert.equal(a.frame.src, 'two.pdf');
// Model cancel followed by close; this does not simulate a browser Escape key.
a.events.cancel?.({preventDefault() {throw new Error('Escape must remain native');}});
a.viewer.close();
assert.equal(a.viewer.open, false);
assert.equal(a.frame.src, undefined);
assert.equal(a.buttons[1].focused, true);
a.buttons[0].click();
assert.equal(a.frame.src, 'one.pdf');
const b = setup(false);
b.buttons[0].click();
assert.equal(b.window.location.href, 'one.pdf');
console.log('viewer open/close/focus/reopen/simulated-cancel/fallback PASS');
