const viewer = document.querySelector('.viewer');
const frame = viewer.querySelector('iframe');
let trigger;
for (const button of document.querySelectorAll('[data-pdf]')) {
  button.addEventListener('click', () => {
    const pdf = button.dataset.pdf + (button.dataset.page ? '#page=' + button.dataset.page : '');
    if (typeof viewer.showModal !== 'function') {
      window.location.href = pdf;
      return;
    }
    trigger = button;
    document.getElementById('viewer-title').textContent = button.dataset.title;
    frame.title = button.dataset.title + ' 발표자료';
    frame.src = pdf;
    document.getElementById('pdf-open').href = pdf;
    document.getElementById('pdf-download').href = button.dataset.pdf;
    viewer.showModal();
  });
}
viewer.querySelector('.close').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {
  frame.removeAttribute('src');
  trigger?.focus();
});
