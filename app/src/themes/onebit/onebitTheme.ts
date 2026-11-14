import {defineTheme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

// 색은 Astryx 기본(Neutral)에 포인트 색 하나만 얹는다.
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
  // 포인트 색: 클라우드·인프라 톤의 딥 틸 블루. 다크 모드는 밝은 틸로, 그 위 글자는 어둡게.
  tokens: {
    '--color-accent': ['#0B6E8A', '#5FC3DD'],
    '--color-on-accent': ['#FFFFFF', '#0A1317'],
    // Neutral 은 강조 글자를 검정/흰색으로 고정해 둬서 따로 맞춘다. 흰 바탕 대비 5.6:1.
    '--color-text-accent': ['#0B6E8A', '#5FC3DD'],
    '--color-icon-accent': ['#0B6E8A', '#5FC3DD'],
  },
  // 맑은 고딕 Bold는 큰 크기에서 자간이 넓어 보여 살짝 조인다.
  components: {heading: {base: {letterSpacing: '-0.02em'}}},
});
