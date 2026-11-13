import {StrictMode, useState} from 'react';
import {createRoot} from 'react-dom/client';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import {Theme} from '@astryxdesign/core/theme';
import {themes, defaultThemeSlug} from './astryx-themes';
import Shell, {type Mode} from './Shell';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import Quiz from './pages/Quiz';
import Signup from './pages/Signup';

const pages = {profile: Profile, portfolio: Portfolio, contact: Contact, quiz: Quiz};
const [, current, sub] = location.pathname.split('/');
const Page = current === 'quiz' && sub === 'signup' ? Signup : (pages[current as keyof typeof pages] ?? Home);

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
        <Page />
      </Shell>
    </Theme>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
