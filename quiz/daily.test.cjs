const assert = require('node:assert/strict');
const E = require('./engine.js');
const qs = require('./questions.json');
const before = Date.parse('2026-10-29T23:59:59+09:00');
const midnight = before + 1000;
assert.equal(E.dayKey(before), '2026-10-29');
assert.equal(E.dayKey(midnight), '2026-10-30');
const s = E.fresh();
assert.ok(E.valid(s, qs)); // Existing backups remain valid.
E.setGoal(s, 2, qs.length, before);
E.answer(s, qs[0], qs[0].answers, before);
E.markWrong(s, qs[0]);
E.answer(s, qs[0], qs[0].answers, before);
assert.deepEqual(s.daily.ids, [1]);
assert.equal(E.claimGoal(s, before), false);
E.answer(s, qs[1], [qs[1].choices[0].id], before); // Wrong answers count too.
assert.equal(E.claimGoal(s, before), true);
assert.equal(E.claimGoal(s, before), false);
assert.ok(E.valid(JSON.parse(JSON.stringify(s)), qs));
assert.equal(E.claimGoal(JSON.parse(JSON.stringify(s)), before), false);
E.setGoal(s, 1, qs.length, before);
assert.equal(E.claimGoal(s, before), false); // Editing the target cannot replay confetti.
assert.deepEqual(E.daily(s, midnight), {goal: 1, day:'2026-10-30', ids:[], celebrated:false});
E.answer(s, qs[0], qs[0].answers, midnight);
assert.equal(E.claimGoal(s, midnight), true);
assert.equal(Object.keys(s.records).length, 2); // Midnight leaves overall progress intact.
for (const goal of [0, -1, 1.5, NaN, Infinity, qs.length + 1]) assert.throws(() => E.setGoal(s, goal, qs.length));
for (const bad of [{goal:0}, {day:'2026-02-30'}, {ids:[1,1]}, {ids:[51]}, {ids:['1']}, {celebrated:'yes'}]) {
  assert.equal(E.valid({...s,daily:{...s.daily,...bad}}, qs), false);
}
const other = E.fresh();
assert.equal(E.daily(other, midnight).goal, null);
assert.equal(E.daily(other, midnight).ids.length, 0);
const full = E.fresh();
E.setGoal(full, qs.length, qs.length, before);
for (const q of qs) E.answer(full, q, q.answers, before);
assert.ok(E.valid(full, qs));
assert.ok(Buffer.byteLength(JSON.stringify(full)) < 100000);
console.log('daily goal / KST midnight / unique questions / once-per-day / old backup / validation PASS');
