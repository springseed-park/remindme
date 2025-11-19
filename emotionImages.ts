
import { EMOTIONS } from './constants';

/**
 * 감정과 일기 ID를 기반으로 로컬 이미지 경로를 반환합니다.
 * 사용자 요청에 따라 /images 폴더 내의 happy_1~3, sad_1~3, nom_1~3 이미지를 사용합니다.
 * entryId를 기반으로 결정적인(deterministic) 랜덤값을 생성하여, 리렌더링 시 이미지가 바뀌지 않도록 합니다.
 * 
 * @param emotion 감정 키워드 (예: '기쁨', '슬픔')
 * @param entryId 일기 항목의 고유 ID (랜덤 시드 역할)
 * @returns 이미지 경로 문자열 (예: '/images/happy_1.png')
 */
export const getEmotionImage = (emotion: string, entryId: string): string => {
  let prefix = 'nom'; // 기본값: 중립 (nom)

  // 감정 분류 확인
  if (EMOTIONS.positive.items.includes(emotion)) {
    prefix = 'happy';
  } else if (EMOTIONS.negative.items.includes(emotion)) {
    prefix = 'sad';
  } else if (EMOTIONS.neutral.items.includes(emotion)) {
    prefix = 'nom';
  }

  // entryId 문자열을 기반으로 해시값을 생성하여 1~3 사이의 숫자를 결정
  // 이렇게 하면 완전 랜덤이 아니라 해당 편지에는 항상 같은 이미지가 뜹니다.
  let hash = 0;
  for (let i = 0; i < entryId.length; i++) {
    hash = ((hash << 5) - hash) + entryId.charCodeAt(i);
    hash |= 0; // 32bit integer로 변환
  }
  
  const imageIndex = (Math.abs(hash) % 3) + 1;

  // Vite의 base URL을 고려한 이미지 경로
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}images/${prefix}_${imageIndex}.png`;
};
