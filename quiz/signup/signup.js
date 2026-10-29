(function () {
  const $ = id => document.getElementById(id);
  let busy = false, created = false;
  $('signup-fields').disabled = false;
  $('signup-form').onsubmit = async event => {
    event.preventDefault();
    if (busy || created) return;
    const id = $('signup-id').value.trim(), pw = $('signup-password').value, name = $('signup-name').value.trim();
    if (pw !== $('signup-password-confirm').value) { $('signup-status').textContent = '비밀번호가 일치하지 않습니다. 다시 확인하세요.'; return; }
    const code = $('signup-code').value.trim();
    if (!code) { $('signup-status').textContent = '가입코드를 입력하세요.'; return; }
    if (!name) { $('signup-status').textContent = '닉네임을 입력하세요.'; return; }
    busy = true; $('signup-fields').disabled = true;
    $('signup-status').textContent = '회원가입 중입니다.';
    try {
      await window.QuizAccount.api('/quiz/signup', { id, pw, name, code });
      created = true; $('signup-password').value = ''; $('signup-password-confirm').value = '';
      await window.QuizAccount.api('/account/login', { id, pw });
      window.location.replace('../');
    } catch (e) {
      $('signup-status').textContent = created ? '회원가입이 완료되었습니다. 로그인 페이지에서 로그인하세요.' : e.message;
    } finally { busy = false; $('signup-fields').disabled = created; }
  };
})();
