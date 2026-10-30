(async function () {
  const $ = id => document.getElementById(id);
  const key = '1bit-aws-quiz-v1';
  const E = window.QuizEngine;
  let account;
  let questions, state, submitted = false, storageBroken = false;
  const notice = text => { $('notice').textContent = text; };
  function save() {
    if (storageBroken) return;
    if (account) account.save(state);
  }
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw Error();
    questions = await response.json();
  } catch { notice('문제를 불러오지 못했습니다. 인터넷 연결을 확인하고 새로고침하세요.'); $('question').hidden = true; return; }
  state = E.fresh();
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const stored = JSON.parse(raw);
      if (!E.valid(stored, questions)) throw Error();
      state = stored;
    }
  } catch { storageBroken = true; notice('저장된 진도를 읽을 수 없습니다. 기존 데이터는 유지됩니다. 백업을 불러오거나 처음부터 시작하세요.'); }
  account = new window.QuizAccount(questions, value => { state = value; storageBroken = false; render(); });
  state = await account.start(state);
  $('account-fields').disabled = false;
  if (account.user && !account.paused) storageBroken = false;
  function updateDaily() {
    const d = E.daily(state);
    $('daily-count').textContent = d.goal ? `오늘 ${d.ids.length} / ${d.goal}문제` : `오늘 ${d.ids.length}문제 · 목표를 설정하세요.`;
    $('daily-progress').max = d.goal || 1;
    $('daily-progress').value = d.goal ? Math.min(d.ids.length, d.goal) : 0;
    if (document.activeElement !== $('daily-target')) $('daily-target').value = d.goal || '';
    $('daily-message').textContent = d.goal && d.ids.length >= d.goal ? '오늘의 학습 목표를 달성했습니다!' : '';
  }
  let confettiTimer;
  function clearConfetti() { document.getElementById('goal-confetti')?.remove(); clearTimeout(confettiTimer); }
  function celebrateGoal() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearConfetti();
    const layer = document.createElement('div'); layer.id = 'goal-confetti'; layer.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('i');
      const angle = (i / 40) * Math.PI * 2, distance = 100 + Math.random() * 160;
      piece.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
      piece.style.setProperty('--y', `${Math.sin(angle) * distance - 100}px`);
      piece.style.setProperty('--spin', `${180 + Math.random() * 540}deg`);
      piece.style.background = ['#78afff', '#e3b84b', '#88c8a2', '#e98d9c'][i % 4];
      layer.append(piece);
    }
    document.body.append(layer);
    confettiTimer = setTimeout(clearConfetti, 1400);
  }
  function render(focus = false, complete = state.complete === true) {
    clearConfetti(); updateDaily();
    submitted = false;
    const q = questions.find(q => q.id === state.current);
    $('question').hidden = complete; $('done').hidden = !complete;
    $('number').textContent = `문제 ${q.id}`;
    $('auto-review').hidden = state.autoReview !== q.id;
    $('prompt').textContent = q.prompt;
    $('choices').replaceChildren();
    for (const c of q.choices) {
      const label = document.createElement('label'); label.className = 'choice';
      const input = document.createElement('input'); input.type = q.answers.length > 1 ? 'checkbox' : 'radio'; input.name = 'answer'; input.value = c.id;
      const text = document.createElement('span'); const letter = document.createElement('b'); letter.textContent = c.id + '.';
      text.append(letter, document.createTextNode(c.text)); label.append(input, text); $('choices').append(label);
    }
    $('mark-wrong').hidden = true; $('mark-wrong').disabled = false; $('mark-wrong').textContent = '찍어서 맞힘 · 오답으로 저장';
    $('next').className = 'primary'; $('next').textContent = '다음 문제';
    $('result').hidden = true; $('result').className = ''; $('result').replaceChildren(); $('submit').hidden = false; $('submit').disabled = true; $('next').hidden = true;
    updateNumbers(complete);
    if (focus) { $('number').focus({ preventScroll: true }); $('question').scrollIntoView({ block: 'start' }); }
  }
  function updateNumbers(complete = state.complete === true) {
    const wrongCount = Object.values(state.records).filter(r => !r.correct).length;
    $('review-status').textContent = state.review ? '오답만 복습 중' : '';
    $('review').textContent = !state.review ? `복습하기 (${wrongCount})` : '복습 종료';
    $('review').disabled = !state.review && wrongCount === 0;
    const status = id => !state.records[id] ? 'unanswered' : state.records[id].correct ? 'correct' : 'wrong';
    const text = id => `${id} [${!state.records[id] ? '△' : state.records[id].correct ? 'O' : 'X'}]`;
    $('number-current').textContent = complete ? '문제 번호 지정' : text(state.current);
    $('number-current').className = complete ? '' : status(state.current);
    $('numbers').replaceChildren();
    for (const item of questions) {
      const button = document.createElement('button');
      button.type = 'button'; button.textContent = text(item.id); button.className = status(item.id);
      button.setAttribute('aria-label', `문제 ${item.id}, ${!state.records[item.id] ? '미풀이' : state.records[item.id].correct ? '정답' : '오답'}`);
      if (!complete && item.id === state.current) button.setAttribute('aria-current', 'true');
      button.onclick = () => { if (!account.canEdit()) return; delete state.review; $('review-status').textContent = ''; state.current = item.id; state.autoReview = null; state.complete = false; $('number-picker').open = false; save(); render(true); };
      $('numbers').append(button);
    }
  }
  $('daily-target').max = questions.length;
  $('daily-form').onsubmit = event => {
    event.preventDefault(); if (!account.canEdit() || storageBroken) return;
    try {
      E.setGoal(state, Number($('daily-target').value), questions.length);
      const achieved = E.claimGoal(state); save(); updateDaily();
      if (achieved) celebrateGoal();
      else if (E.daily(state).ids.length < E.daily(state).goal) $('daily-message').textContent = '목표가 저장되었습니다.';
    } catch (e) { $('daily-message').textContent = e.message; }
  };
  let midnightTimer;
  function checkDay() {
    clearTimeout(midnightTimer);
    if (state.daily?.day !== E.dayKey()) {
      clearConfetti(); updateDaily();
      if (!storageBroken && account.canEdit()) save();
    }
    const now = Date.now();
    const nextMidnight = Date.parse(E.dayKey(now) + 'T00:00:00+09:00') + 86400000;
    midnightTimer = setTimeout(checkDay, Math.max(1, nextMidnight - now));
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) checkDay(); });
  window.addEventListener('focus', checkDay);
  $('number-picker').onkeydown = event => { if (event.key === 'Escape') { $('number-picker').open = false; $('number-current').focus(); } };
  document.addEventListener('click', event => { if (!$('number-picker').contains(event.target)) $('number-picker').open = false; });
  $('form').onchange = () => { $('submit').disabled = !$('choices').querySelector('input:checked'); };
  $('form').onsubmit = event => {
    event.preventDefault(); if (submitted || !account.canEdit()) return;
    const q = questions.find(q => q.id === state.current);
    const selected = [...$('choices').querySelectorAll('input:checked')].map(i => i.value);
    if (!selected.length) return;
    const correct = E.answer(state, q, selected); submitted = true;
    const achieved = E.claimGoal(state); save(); updateDaily();
    if (achieved) celebrateGoal();
    updateNumbers();
    for (const input of $('choices').querySelectorAll('input')) {
      input.disabled = true;
      if (q.answers.includes(input.value)) input.parentElement.classList.add('correct');
      else if (input.checked) input.parentElement.classList.add('wrong');
    }
    const heading = document.createElement('h3'); heading.textContent = correct ? '정답입니다!' : '오답입니다 · 다시 복습하세요.';
    const answers = document.createElement('p'); answers.textContent = `선택: ${selected.join(', ')} / 정답: ${q.answers.join(', ')}`;
    const explanation = document.createElement('p'); explanation.textContent = q.explanation || '등록된 해설이 없습니다.';
    $('result').className = correct ? 'correct' : 'wrong';
    $('mark-wrong').hidden = !correct;
    $('next').classList.toggle('success', correct);
    $('next').textContent = correct ? '정답입니다! 다음 문제' : '다음 문제';
    $('result').replaceChildren(heading, answers, explanation); $('result').hidden = false; $('submit').hidden = true; $('next').hidden = false;
  };
  $('mark-wrong').onclick = () => {
    if (!account.canEdit()) return;
    const q = questions.find(q => q.id === state.current);
    if (!submitted || !E.markWrong(state, q)) return;
    save(); updateNumbers();
    $('mark-wrong').textContent = '오답으로 저장되었습니다.'; $('mark-wrong').disabled = true;
    $('next').className = 'primary'; $('next').textContent = '다음 문제';
    $('result').className = 'wrong';
    $('result').querySelector('h3').textContent = '학습 기록을 X로 저장했습니다.';
  };
  $('review').onclick = () => {
    if (!account.canEdit()) return;
    if (state.review) {
      const back = state.review.back; delete state.review; Object.assign(state, { current: back.current, autoReview: back.autoReview, complete: back.complete });
      save(); render(true); return;
    }
    const queue = questions.filter(q => state.records[q.id] && !state.records[q.id].correct).map(q => q.id);
    if (!queue.length) return;
    const back = { current: state.current, autoReview: state.autoReview ?? null, complete: state.complete === true };
    state.current = queue.shift(); state.autoReview = null; state.complete = false;
    state.review = { queue, back }; save(); render(true);
  };
  $('next').onclick = () => {
    if (!account.canEdit()) return;
    if (state.review) {
      const id = state.review.queue.shift();
      if (id !== undefined) { state.current = id; save(); render(true); return; }
      const back = state.review.back; delete state.review; Object.assign(state, { current: back.current, autoReview: back.autoReview, complete: back.complete });
      const remaining = Object.values(state.records).filter(r => !r.correct).length;
      save(); render(); $('review-status').textContent = `복습 완료 · 남은 오답 ${remaining}개`; return;
    }
    const q = E.next(state, questions);
    state.autoReview = q && state.records[q.id] && !state.records[q.id].correct ? q.id : null;
    state.complete = !q;
    if (q) state.current = q.id; save(); render(!!q);
  };
  $('backup').onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(state)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = '1bit-quiz-progress.json'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
  };
  $('restore').onchange = async event => {
    if (!account.canEdit()) return;
    const file = event.target.files[0]; if (!file) return;
    const owner = account.user.id, before = state, sequence = account.sequence;
    try {
      if (file.size > 100000) throw Error();
      const restored = JSON.parse(await file.text());
      if (!E.valid(restored, questions)) throw Error();
      if (!account.canEdit() || account.user.id !== owner || state !== before || account.sequence !== sequence) { notice('파일을 읽는 동안 계정 또는 진도가 변경되어 복원을 중단했습니다. 다시 백업을 선택하세요.'); return; }
      if (!confirm('현재 진도를 백업 내용으로 변경하시겠습니까?')) return;
      $('review-status').textContent = ''; state = restored; storageBroken = false; notice(''); save(); render();
    } catch { notice('이 퀴즈에서 사용할 수 없는 백업 파일입니다. 현재 진도는 유지됩니다.'); }
    finally { event.target.value = ''; }
  };
  $('reset').onclick = () => { if (!account.canEdit()) return; if (confirm('진도와 오답 기록을 모두 지우고 처음부터 시작하시겠습니까?')) { delete state.review; $('review-status').textContent = ''; state = { ...E.fresh(), daily: E.daily(state) }; storageBroken = false; notice(''); save(); render(true); } };

  render(); checkDay();
})();
