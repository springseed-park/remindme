
import React, { useContext } from 'react';
import { AppContext } from '../App';
import { DiaryEntry } from '../types';
import { getEmotionImage } from './emotionImages';

const MessageCard: React.FC<{ entry: DiaryEntry; onDelete: (id: string) => void; }> = ({ entry, onDelete }) => {
  const date = new Date(entry.date);
  const formattedDate = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  
  // entry.id와 함께 entry.mood(기분 점수)를 전달하여
  // 긍정/부정/중립 이미지가 정확히 나오도록 함
  const illustrationUrl = getEmotionImage(entry.emotion, entry.id, entry.mood);

  if (!entry.aiResponse) return null;

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 animate-fade-in-up flex gap-4 items-center">
      <img
        src={illustrationUrl}
        alt="감성 일러스트"
        className="w-20 h-20 rounded-md object-cover flex-shrink-0 bg-gray-700"
        // 로컬 테스트 시 이미지가 없더라도 영역이 유지되도록 onError 핸들러 제거
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-2">
          <p className="text-sm text-gray-400">{formattedDate}</p>
          <button
            onClick={() => onDelete(entry.id)}
            className="flex-shrink-0 p-1 -mt-1 -mr-1 text-gray-500 hover:text-red-400 transition-colors"
            aria-label="편지 삭제"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
        <p className="text-gray-200 leading-relaxed break-words">{entry.aiResponse}</p>
      </div>
    </div>
  );
};

const Mailbox: React.FC = () => {
  const context = useContext(AppContext);
  
  if (!context) return null;

  const { diaryEntries, deleteMessage } = context;

  const messages = diaryEntries.filter(entry => entry.aiResponse);

  const handleDelete = (id: string) => {
    if (window.confirm('이 편지를 정말 삭제하시겠어요?')) {
        deleteMessage(id);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center text-gray-300 py-2 mb-4">받은편지</h1>
      {messages.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">아직 받은 편지가 없어요.</p>
          <p className="text-gray-400">오늘의 감정을 기록하고 AI 친구의 답장을 받아보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map(entry => (
            <MessageCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Mailbox;
