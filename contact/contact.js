const copyButton = document.querySelector('[data-copy-email]');
const copyStatus = document.querySelector('.copy-status');
copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyButton.dataset.copyEmail);
    copyStatus.textContent = '이메일 주소를 복사했습니다.';
  } catch {
    copyStatus.textContent = '복사하지 못했습니다. 위 이메일 주소를 선택해 복사해 주세요.';
  }
});
