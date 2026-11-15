// 한글 어절 단위 줄바꿈(keep-all)에서 가운뎃점(·)이 줄 맨 앞으로 떨어지지 않게 앞뒤를 붙인다(U+2060 WORD JOINER).
export const keepDots = (s: string) => s.replaceAll('·', '⁠·⁠');
