
import { EMOTIONS } from '../constants';

/**
 * 감정과 일기 ID, 그리고 기분 점수(mood)를 기반으로 로컬 이미지 경로를 반환합니다.
 * 
 * 우선순위:
 * 1. mood (기분 점수 0~4)가 있다면 이를 기준으로 happy/sad/nom을 결정합니다.
 * 2. mood가 없다면 emotion (감정 키워드)를 사용하여 결정합니다.
 * 
 * @param emotion 감정 키워드 (예: '기쁨', '슬픔')
 * @param entryId 일기 항목의 고유 ID (랜덤 시드 역할)
 * @param mood 기분 점수 (0: 매우 나쁨 ~ 4: 매우 좋음)
 * @returns 이미지 경로 문자열 (예: '../images/happy_1.jpg')
 */
export const getEmotionImage = (emotion: string | undefined, entryId?: string, mood?: number): string => {
  let prefix = 'nom'; // 기본값: 중립 (nom)
  const safeEmotion = emotion || '';

  if (mood !== undefined) {
    // Mood 점수가 있을 경우 점수 기반으로 분류 (가장 정확함)
    if (mood > 2) {
        prefix = 'happy'; // 3(좋음), 4(매우 좋음)
    } else if (mood < 2) {
        prefix = 'sad';   // 0(매우 나쁨), 1(나쁨)
    } else {
        prefix = 'nom';   // 2(보통)
    }
  } else {
    // Mood 점수가 없을 경우 텍스트 키워드 매칭 (Fallback)
    if (EMOTIONS.positive.items.includes(safeEmotion)) {
        prefix = 'happy';
    } else if (EMOTIONS.negative.items.includes(safeEmotion)) {
        prefix = 'sad';
    } else if (EMOTIONS.neutral.items.includes(safeEmotion)) {
        prefix = 'nom';
    }
  }

  // entryId가 없거나 유효하지 않을 경우에 대한 방어 코드
  const safeId = entryId || 'default-seed';

  // entryId 문자열을 기반으로 해시값을 생성하여 1~3 사이의 숫자를 결정
  let hash = 0;
  for (let i = 0; i < safeId.length; i++) {
    hash = ((hash << 5) - hash) + safeId.charCodeAt(i);
    hash |= 0; // 32bit integer로 변환
  }
  
  const imageIndex = (Math.abs(hash) % 3) + 1;

  // public 폴더의 images 경로 (절대 경로)
  return `/images/${prefix}_${imageIndex}.jpg`;
};
