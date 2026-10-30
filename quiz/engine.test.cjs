const assert = require('node:assert/strict');
const E = require('./engine.js');
const all = require('./questions.json');
const qs = all.slice(0, 10);
const missing = new Set([51, 73, 95, 147, 382, 933]);
assert.deepEqual(all.map(q => q.id), Array.from({length: all.at(-1).id}, (_, i) => i + 1).filter(id => !missing.has(id)));
for (const q of all) {
  assert.ok(q.prompt.length > 20);
  assert.deepEqual(q.choices.map(c => c.id), 'ABCDEF'.slice(0, q.choices.length).split(''));
  assert.ok(q.choices.every(c => c.text.length > 0));
  assert.ok(q.answers.length > 0 && q.answers.every(a => q.choices.some(c => c.id === a)));
  assert.equal(new Set(q.answers).size, q.answers.length);
  assert.ok(q.explanation === null || typeof q.explanation === 'string');
}
const oldProgress = E.fresh();
E.answer(oldProgress, qs[0], ['A']);
assert.ok(E.valid(oldProgress, all));
assert.equal(E.next(oldProgress, all).id, 2);
assert.equal(qs.length, 10);
assert.deepEqual(qs.map(q => q.answers.join('')), ['A','B','D','B','D','A','D','B','A','A']);
assert.equal(qs.filter(q => !q.explanation).length, 2);
let s = E.fresh();
E.answer(s, qs[0], ['B']);
const extra = Array.from({length:11}, (_, i) => ({...qs[1], id:i+2}));
const many = [qs[0], ...extra];
for (let i=0;i<9;i++) E.answer(s, extra[i], ['B']);
assert.equal(E.next(s,many).id, 11);
E.answer(s,extra[9],['B']);
assert.equal(E.next(s,many).id,1);
E.answer(s,qs[0],['B']);
assert.equal(s.records[1].due,s.count+10);
assert.equal(E.next(s,qs).id,1); // No unseen questions: review remaining errors now.
E.answer(s,qs[0],['A']);
assert.equal(E.next(s,qs),null);
assert.ok(E.valid(s,many));
assert.ok(!E.valid({...s,count:-1},qs));
assert.ok(!E.valid({...s,version:'other'},qs));
const multi={...qs[0],answers:['A','C']};
assert.equal(E.answer(E.fresh(),multi,['A']),false);
assert.equal(E.answer(E.fresh(),multi,['C','A']),true);
assert.throws(()=>E.answer(E.fresh(),qs[0],['Z']));
assert.throws(()=>E.answer(E.fresh(),qs[0],['A','A']));
console.log('quiz regression PASS');

const guessed = E.fresh();
E.answer(guessed, qs[0], ['A']);
assert.ok(E.markWrong(guessed, qs[0]));
assert.equal(guessed.records[1].correct, false);
assert.equal(guessed.count, 1);
assert.equal(guessed.records[1].attempts, 1);
assert.ok(E.valid(guessed, all));
assert.ok(E.valid(JSON.parse(JSON.stringify(guessed)), all));
assert.equal(E.markWrong(guessed, qs[0]), false);
E.answer(guessed, qs[0], ['A']);
assert.equal(guessed.records[1].correct, true);
assert.equal(guessed.records[1].markedWrong, undefined);
assert.ok(E.valid(guessed, all));
guessed.records[1].markedWrong = true;
assert.ok(!E.valid(guessed, all));
console.log('self-marked wrong / restore / re-answer PASS');

const ordered = E.fresh();
for (const question of all) {
  assert.equal(E.next(ordered, all).id, question.id);
  E.answer(ordered, question, question.answers);
}
assert.equal(E.next(ordered, all), null);
const spaced = E.fresh();
for (const question of all.slice(0, 16)) {
  E.answer(spaced, question, question.id === 6 ? ['B'] : question.answers);
}
assert.equal(E.next(spaced, all).id, 6);
E.answer(spaced, all[5], all[5].answers);
assert.equal(E.next(spaced, all).id, 17);
spaced.current = 6; spaced.autoReview = 6;
assert.ok(E.valid(spaced, all));
assert.equal(E.valid({...spaced, autoReview:17}, all), false);
assert.ok(E.valid({...spaced, autoReview:null}, all));
console.log('948-question sequence / automatic review return / review marker validation PASS');

spaced.current = 6; spaced.autoReview = null;
spaced.review = {queue:[7,8],back:{current:17,autoReview:null,complete:false}};
assert.ok(E.valid(JSON.parse(JSON.stringify(spaced)), all));
for (const queue of [[6],[7,7],[51],['7']]) assert.equal(E.valid({...spaced,review:{...spaced.review,queue}},all),false);
assert.equal(E.valid({...spaced,complete:true}, all), false);
ordered.complete = true;
assert.ok(E.valid(ordered, all));
console.log('persisted manual review / completion / invalid backup state PASS');

assert.equal(E.valid({...spaced,review:{...spaced.review,back:{...spaced.review.back,records:{}}}},all),false);
assert.equal(E.valid({...spaced,review:{...spaced.review,back:{...spaced.review.back,complete:true}}},all),false);
console.log('review return backup cannot replace records or fake completion PASS');

const staleNavigation = {...spaced,current:17,autoReview:6};
const recovered = E.recoverNavigation(staleNavigation,all);
assert.ok(E.valid(recovered,all));
assert.deepEqual(recovered.records,spaced.records);
assert.equal(recovered.current,17);
assert.equal(recovered.review,undefined);
assert.equal(E.recoverNavigation({...staleNavigation,count:-1},all).count,-1);
assert.equal(E.valid(E.recoverNavigation({...staleNavigation,count:-1},all),all),false);
console.log('old-tab navigation recovery preserves records and rejects invalid core state PASS');
