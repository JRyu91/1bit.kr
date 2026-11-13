import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

// 색은 Astryx 기본(Neutral) 그대로 쓰고 서체만 바꾼다.
// 맑은 고딕은 Windows 시스템 서체라 웹폰트로 배포할 수 없다. 없는 기기는 fallback으로 표시된다.
export const onebitTheme = defineTheme({
  name: 'onebit',
  extends: neutralTheme,
  typography: {
    scale: {base: 16, ratio: 1.2},
    body: {
      family: 'Malgun Gothic',
      // 없는 기기는 시스템 한글 고딕(아이폰·맥: Apple SD 산돌고딕 Neo)으로 표시된다.
      fallbacks: 'system-ui, sans-serif',
    },
    // 맑은 고딕은 Regular/Bold 두 굵기뿐이라 중간 굵기를 쓰지 않는다.
    heading: {weight: 'bold'},
  },
  // 맑은 고딕 Bold는 큰 크기에서 자간이 넓어 보여 살짝 조인다.
  components: {heading: {base: {letterSpacing: '-0.02em'}}},
});
