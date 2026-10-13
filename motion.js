(() => {
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  for (const figure of document.querySelectorAll('[data-motion]')) {
    const source = figure.querySelector('source');
    const img = figure.querySelector('img');
    const button = figure.querySelector('[data-motion-toggle]');
    if (!source || !img) continue;
    const gif = new URL(source.getAttribute('srcset'), document.baseURI).href;
    const png = img.getAttribute('src');
    let paused = preference.matches;
    let failed = false;
    function render() {
      source.media = paused || failed ? 'not all' : 'all';
      if (!button) return;
      button.hidden = failed;
      button.disabled = preference.matches;
      button.textContent = preference.matches ? '기기 설정으로 움직임 꺼짐' : paused ? '움직임 재생' : '움직임 멈춤';
      button.setAttribute('aria-pressed', String(paused || failed));
    }
    button?.addEventListener('click', () => {
      if (preference.matches || failed) return;
      paused = !paused;
      render();
    });
    preference.addEventListener('change', () => {
      if (preference.matches) paused = true;
      render();
    });
    function handleError() {
      const current = img.currentSrc;
      if (failed && current === gif) return;
      if (!failed && (current === gif || (!current && !paused))) {
        failed = true;
        source.removeAttribute('srcset');
        img.src = png;
        render();
      } else {
        failed = true;
        figure.classList.add('is-empty');
        render();
      }
    }
    img.addEventListener('error', handleError);
    if (img.complete && !img.naturalWidth) handleError();
    render();
  }
})();
