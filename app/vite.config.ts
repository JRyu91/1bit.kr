import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// 기존 URL(/profile/ 등)을 유지하려고 라우터 없이 페이지별 HTML 진입점을 둔다.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: ['index.html', 'profile/index.html', 'portfolio/index.html', 'contact/index.html', 'quiz/index.html', 'quiz/signup/index.html'],
    },
  },
});
