import {StrictMode, Suspense, lazy, useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import {Theme} from '@astryxdesign/core/theme';
import {themes, defaultThemeSlug} from './astryx-themes';
import Shell, {type Mode} from './Shell';

const pages = {
  profile: () => import('./pages/Profile'),
  portfolio: () => import('./pages/Portfolio'),
  contact: () => import('./pages/Contact'),
  quiz: () => import('./pages/Quiz'),
};
const [, current, sub] = location.pathname.split('/');
const Page = lazy(
  current === 'quiz' && sub === 'signup' ? () => import('./pages/Signup') : (pages[current as keyof typeof pages] ?? (() => import('./pages/Home'))),
);

// 저장소 접근이 막힌 브라우저(사생활 보호 모드 등)에서는 시스템 설정으로 동작한다.
function savedMode(): Mode {
  try {
    const mode = localStorage.getItem('mode');
    return mode === 'light' || mode === 'dark' ? mode : 'system';
  } catch {
    return 'system';
  }
}

function App() {
  const [mode, setMode] = useState(savedMode);
  function changeMode(next: Mode) {
    setMode(next);
    try {
      localStorage.setItem('mode', next);
    } catch {
      // 저장 실패 시 이번 방문에만 적용된다.
    }
  }
  return (
    <Theme theme={themes[defaultThemeSlug]} mode={mode}>
      <Shell current={current} mode={mode} onModeChange={changeMode}>
        <Suspense>
          <Page />
        </Suspense>
      </Shell>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
