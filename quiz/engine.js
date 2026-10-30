/* Shared with the small Node regression test. */
(function (root) {
  const VERSION = 'saa-c03-v3-first10';
  const fresh = () => ({ version: VERSION, count: 0, current: 1, records: {} });
  const dayKey = (now = Date.now()) => new Date(now + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
  function daily(s, now = Date.now()) {
    const day = dayKey(now);
    if (!s.daily || s.daily.day !== day) s.daily = { goal: s.daily?.goal ?? null, day, ids: [], celebrated: false };
    return s.daily;
  }
  function setGoal(s, goal, limit, now = Date.now()) {
    if (!Number.isInteger(goal) || goal < 1 || goal > limit) throw Error(`목표는 1~${limit}문제로 입력하세요.`);
    daily(s, now).goal = goal;
  }
  function claimGoal(s, now = Date.now()) {
    const d = daily(s, now);
    if (!d.goal || d.ids.length < d.goal || d.celebrated) return false;
    d.celebrated = true;
    return true;
  }
  function valid(s, questions) {
    if (!s || s.version !== VERSION || !Number.isSafeInteger(s.count) || s.count < 0 || !questions.some(q => q.id === s.current) || !s.records || typeof s.records !== 'object' || Array.isArray(s.records)) return false;
    if (s.autoReview !== undefined && s.autoReview !== null && s.autoReview !== s.current) return false;
    if (s.complete !== undefined && (typeof s.complete !== 'boolean' || s.complete && !questions.every(q => s.records[q.id]?.correct === true))) return false;
    if (s.review !== undefined) {
      const r = s.review;
      if (!r || !Array.isArray(r.queue) || r.queue.length > questions.length || new Set(r.queue).size !== r.queue.length || !r.queue.every(id => id !== s.current && questions.some(q => q.id === id)) || !r.back || !questions.some(q => q.id === r.back.current) || (r.back.autoReview !== null && r.back.autoReview !== r.back.current) || typeof r.back.complete !== 'boolean' || r.back.complete && !questions.every(q => s.records[q.id]?.correct === true) || !Object.keys(r.back).every(key => ['current', 'autoReview', 'complete'].includes(key)) || s.autoReview != null || s.complete === true) return false;
    }
    const d = s.daily;
    if (d !== undefined && (!d || typeof d !== 'object' || (d.goal !== null && (!Number.isInteger(d.goal) || d.goal < 1 || d.goal > questions.length)) || typeof d.day !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(d.day) || !Number.isFinite(Date.parse(d.day)) || new Date(d.day).toISOString().slice(0, 10) !== d.day || typeof d.celebrated !== 'boolean' || !Array.isArray(d.ids) || d.ids.length > questions.length || new Set(d.ids).size !== d.ids.length || !d.ids.every(id => questions.some(q => q.id === id)))) return false;
    return Object.entries(s.records).every(([id, r]) => {
      const q = questions.find(q => String(q.id) === id);
      const matched = q && r && Array.isArray(r.selected) && r.selected.length === q.answers.length && q.answers.every(a => r.selected.includes(a));
      return q && r && typeof r.correct === 'boolean' && Number.isSafeInteger(r.attempts) && r.attempts > 0 && Number.isSafeInteger(r.due) && r.due >= 0 && Array.isArray(r.selected) && r.selected.length > 0 && new Set(r.selected).size === r.selected.length && r.selected.every(a => q.choices.some(c => c.id === a)) && (q.answers.length > 1 || r.selected.length === 1) && (r.markedWrong === undefined || r.markedWrong === true) && (!r.markedWrong || matched) && r.correct === (matched && !r.markedWrong);
    });
  }
  function recoverNavigation(s, questions) {
    if (valid(s, questions) || !s || typeof s !== 'object') return s;
    // Older open tabs can update the question without updating these screen fields.
    const recovered = { ...s };
    delete recovered.autoReview; delete recovered.review; delete recovered.complete;
    return valid(recovered, questions) ? recovered : s;
  }
  function answer(s, q, selected, now = Date.now()) {
    if (!selected.length || new Set(selected).size !== selected.length || selected.some(a => !q.choices.some(c => c.id === a)) || (q.answers.length === 1 && selected.length !== 1)) throw Error('답을 선택하세요.');
    const correct = selected.length === q.answers.length && q.answers.every(a => selected.includes(a));
    const d = daily(s, now);
    if (!d.ids.includes(q.id)) d.ids.push(q.id);
    s.count++;
    s.records[q.id] = { correct, selected: [...selected], attempts: (s.records[q.id]?.attempts || 0) + 1, due: s.count + 10 };
    return correct;
  }
  function markWrong(s, q) {
    const record = s.records[q.id];
    if (!record?.correct) return false;
    record.correct = false;
    record.markedWrong = true;
    record.due = s.count + 10;
    return true;
  }
  function next(s, questions) {
    const pending = questions.filter(q => s.records[q.id] && !s.records[q.id].correct).sort((a, b) => s.records[a.id].due - s.records[b.id].due);
    return pending.find(q => s.records[q.id].due <= s.count) || questions.find(q => !s.records[q.id]) || pending[0] || null;
  }
  const api = { fresh, valid, answer, markWrong, next, dayKey, daily, setGoal, claimGoal, recoverNavigation };
  if (typeof module !== 'undefined') module.exports = api;
  else root.QuizEngine = api;
})(globalThis);
