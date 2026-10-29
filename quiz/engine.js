/* Shared with the small Node regression test. */
(function (root) {
  const VERSION = 'saa-c03-v3-first10';
  const fresh = () => ({ version: VERSION, count: 0, current: 1, records: {} });
  function valid(s, questions) {
    if (!s || s.version !== VERSION || !Number.isSafeInteger(s.count) || s.count < 0 || !questions.some(q => q.id === s.current) || !s.records || typeof s.records !== 'object' || Array.isArray(s.records)) return false;
    return Object.entries(s.records).every(([id, r]) => {
      const q = questions.find(q => String(q.id) === id);
      const matched = q && r && Array.isArray(r.selected) && r.selected.length === q.answers.length && q.answers.every(a => r.selected.includes(a));
      return q && r && typeof r.correct === 'boolean' && Number.isSafeInteger(r.attempts) && r.attempts > 0 && Number.isSafeInteger(r.due) && r.due >= 0 && Array.isArray(r.selected) && r.selected.length > 0 && new Set(r.selected).size === r.selected.length && r.selected.every(a => q.choices.some(c => c.id === a)) && (q.answers.length > 1 || r.selected.length === 1) && (r.markedWrong === undefined || r.markedWrong === true) && (!r.markedWrong || matched) && r.correct === (matched && !r.markedWrong);
    });
  }
  function answer(s, q, selected) {
    if (!selected.length || new Set(selected).size !== selected.length || selected.some(a => !q.choices.some(c => c.id === a)) || (q.answers.length === 1 && selected.length !== 1)) throw Error('답을 선택하세요.');
    const correct = selected.length === q.answers.length && q.answers.every(a => selected.includes(a));
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
  const api = { fresh, valid, answer, markWrong, next };
  if (typeof module !== 'undefined') module.exports = api;
  else root.QuizEngine = api;
})(globalThis);
