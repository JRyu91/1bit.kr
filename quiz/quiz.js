(async function () {
  const $ = id => document.getElementById(id);
  const key = '1bit-aws-quiz-v1';
  const E = window.QuizEngine;
  let questions, state, submitted = false, storageBroken = false;
  const notice = text => { $('notice').textContent = text; };
  function save() {
    if (storageBroken) return;
    try { localStorage.setItem(key, JSON.stringify(state)); }
    catch { notice('자동 저장을 할 수 없어. 진도를 백업해 줘.'); }
  }
  try {
    const response = await fetch('questions.json');
    if (!response.ok) throw Error();
    questions = await response.json();
  } catch { notice('문제를 불러오지 못했어. 인터넷 연결을 확인하고 새로고침해 줘.'); $('question').hidden = true; return; }
  state = E.fresh();
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const stored = JSON.parse(raw);
      if (!E.valid(stored, questions)) throw Error();
      state = stored;
    }
  } catch { storageBroken = true; notice('저장된 진도를 읽을 수 없어. 기존 데이터는 덮어쓰지 않았어. 백업을 불러오거나 처음부터 시작해 줘.'); }
  function render(focus = false, complete = false) {
    submitted = false;
    const q = questions.find(q => q.id === state.current);
    const records = Object.values(state.records);
    $('stats').textContent = `신규 학습 ${records.length} / ${questions.length} · 복습 대기 ${records.filter(r => !r.correct).length}개`;
    $('progress').value = records.length;
    $('question').hidden = complete; $('done').hidden = !complete;
    $('number').textContent = `문제 ${q.id}`;
    $('kind').textContent = state.records[q.id] ? (state.records[q.id].correct ? '다시 풀기' : '오답 복습') : '처음 풀기';
    $('prompt').textContent = q.prompt;
    $('instruction').textContent = q.answers.length > 1 ? `정답 ${q.answers.length}개를 선택해 줘` : '정답 1개를 선택해 줘';
    $('choices').replaceChildren();
    for (const c of q.choices) {
      const label = document.createElement('label'); label.className = 'choice';
      const input = document.createElement('input'); input.type = q.answers.length > 1 ? 'checkbox' : 'radio'; input.name = 'answer'; input.value = c.id;
      const text = document.createElement('span'); const letter = document.createElement('b'); letter.textContent = c.id + '.';
      text.append(letter, document.createTextNode(c.text)); label.append(input, text); $('choices').append(label);
    }
    $('result').hidden = true; $('result').replaceChildren(); $('submit').hidden = false; $('submit').disabled = true; $('next').hidden = true;
    $('numbers').replaceChildren();
    for (const item of questions) {
      const r = state.records[item.id]; const b = document.createElement('button');
      b.textContent = `${item.id} ${!r ? '○' : r.correct ? '✓' : '↻'}`;
      b.setAttribute('aria-label', `문제 ${item.id}, ${!r ? '미풀이' : r.correct ? '정답' : '오답'}`);
      if (item.id === state.current && !complete) b.setAttribute('aria-current', 'true');
      b.onclick = () => { state.current = item.id; save(); render(true); }; $('numbers').append(b);
    }
    if (focus) { $('number').focus({ preventScroll: true }); $('question').scrollIntoView({ block: 'start' }); }
  }
  $('form').onchange = () => { $('submit').disabled = !$('choices').querySelector('input:checked'); };
  $('form').onsubmit = event => {
    event.preventDefault(); if (submitted) return;
    const q = questions.find(q => q.id === state.current);
    const selected = [...$('choices').querySelectorAll('input:checked')].map(i => i.value);
    if (!selected.length) return;
    const correct = E.answer(state, q, selected); submitted = true; save();
    for (const input of $('choices').querySelectorAll('input')) {
      input.disabled = true;
      if (q.answers.includes(input.value)) input.parentElement.classList.add('correct');
      else if (input.checked) input.parentElement.classList.add('wrong');
    }
    const heading = document.createElement('h3'); heading.textContent = correct ? '정답이야' : '오답이야 · 다시 연습하자';
    const answers = document.createElement('p'); answers.textContent = `선택: ${selected.join(', ')} / 정답: ${q.answers.join(', ')}`;
    const explanation = document.createElement('p'); explanation.textContent = q.explanation || '등록된 해설이 없어.';
    $('result').replaceChildren(heading, answers, explanation); $('result').hidden = false; $('submit').hidden = true; $('next').hidden = false;
    $('stats').textContent = `신규 학습 ${Object.keys(state.records).length} / ${questions.length} · 복습 대기 ${Object.values(state.records).filter(r => !r.correct).length}개`;
    $('progress').value = Object.keys(state.records).length;
  };
  $('next').onclick = () => { const q = E.next(state, questions); if (q) state.current = q.id; save(); render(!!q, !q); };
  $('backup').onclick = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(state)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = '1bit-quiz-progress.json'; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000);
  };
  $('restore').onchange = async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > 100000) throw Error();
      const restored = JSON.parse(await file.text());
      if (!E.valid(restored, questions)) throw Error();
      if (!confirm('현재 진도를 백업 내용으로 바꿀까?')) return;
      state = restored; storageBroken = false; notice(''); save(); render();
    } catch { notice('이 연습판의 올바른 백업 파일이 아니야. 현재 진도는 유지했어.'); }
    finally { event.target.value = ''; }
  };
  $('reset').onclick = () => { if (confirm('진도와 오답 기록을 모두 지우고 처음부터 시작할까?')) { state = E.fresh(); storageBroken = false; notice(''); save(); render(true); } };
  window.addEventListener('storage', event => { if (event.key === key) { storageBroken = true; notice('다른 탭에서 진도가 변경됐어. 이 탭은 저장을 멈췄어. 새로고침해서 최신 진도를 불러와 줘.'); $('submit').disabled = true; } });
  render();
})();
