(function () {
  const key = '1bit-quiz-theme';
  let theme = 'light';
  try { if (localStorage.getItem(key) === 'dark') theme = 'dark'; } catch {}
  function apply() {
    document.documentElement.dataset.quizTheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#161c24' : '#FFF9ED');
    for (const button of document.querySelectorAll('[data-quiz-theme-choice]')) {
      button.setAttribute('aria-pressed', String(button.dataset.quizThemeChoice === theme));
    }
  }
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    for (const button of document.querySelectorAll('[data-quiz-theme-choice]')) {
      button.addEventListener('click', () => {
        theme = button.dataset.quizThemeChoice;
        apply();
        try { localStorage.setItem(key, theme); } catch {}
      });
    }
    apply();
  });
})();
