import React, { useState, useEffect, useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { analyzeEmotionAndCreateQuest } from '../services/geminiService';
import { DiaryEntry, RecommendedQuest, Quest } from '../types';
import { RANDOM_MESSAGES } from '../constants';
import QuestSelectionModal from './QuestSelectionModal';
import EmotionJournalingModal from './EmotionJournalingModal';
import QuestCompletionModal from './QuestCompletionModal';

interface AnalysisResult {
    emotion: string;
    quests: RecommendedQuest[];
    aiResponse: string;
    diaryData: {
        text: string;
        mood: number;
        detailedEmotions: string[];
        keywords: string[];
        memo: string;
    };
}


const MainScreen: React.FC = () => {
  const context = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(RANDOM_MESSAGES[0]);
  const [showJournalingModal, setShowJournalingModal] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [questToComplete, setQuestToComplete] = useState<DiaryEntry | null>(null);

  const latestEntry = context?.diaryEntries?.[0];

  const backgroundImage = useMemo(() => {
    if (!latestEntry) {
        return '../images/bg_neutral.jpg';
    }
    const mood = latestEntry.mood;
    if (mood < 2) { // negative
        return '../images/bg_sad.png';
    } else if (mood > 2) { // positive
        return '../images/bg_happy.png';
    }
    return '../images/bg_neutral.png'; // neutral
  }, [latestEntry]);


  useEffect(() => {
    const messageInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * RANDOM_MESSAGES.length);
      setMessage(RANDOM_MESSAGES[randomIndex]);
    }, 15000);
    return () => clearInterval(messageInterval);
  }, []);
  
  const activeQuestEntries = context?.diaryEntries.filter(entry => entry.quest && !entry.quest.isComplete);

  const handleApiFallback = (diaryDataWithText: { text: string; mood: number; detailedEmotions: string[]; keywords: string[]; memo: string; }) => {
    const fallbackQuests: RecommendedQuest[] = [
        { title: '좋아하는 노래 들으며 5분 휴식하기', duration: '5분', type: '행동하기', icon: '🎵' },
        { title: '오늘 감사했던 일 3가지 떠올리기', duration: '10분', type: '생각하기', icon: '🤔' },
        { title: '가볍게 10분 동안 산책하기', duration: '10분', type: '행동하기', icon: '🚶‍♀️' },
    ];
    setAnalysisResult({
        emotion: '감정',
        quests: fallbackQuests,
        aiResponse: '마음을 기록해주셔서 고마워요. 작은 퀘스트를 통해 기분을 전환해보는 건 어때요?',
        diaryData: diaryDataWithText
    });
  };

  const handleJournalingComplete = async (data: { mood: number; detailedEmotions: string[]; keywords: string[]; memo: string; }) => {
    setShowJournalingModal(false);
    if (!context?.userProfile) return;

    setIsLoading(true);
    const diaryDataWithText = { ...data, text: data.memo };
    try {
      const result = await analyzeEmotionAndCreateQuest(
          diaryDataWithText,
          context.userProfile.conversationStyle
      );

      if (result) {
        setAnalysisResult({ ...result, diaryData: diaryDataWithText });
      } else { // Fallback if API fails but does not throw
        handleApiFallback(diaryDataWithText);
      }
    } catch (e) {
      console.error(e);
      // Fallback if API throws an error
      handleApiFallback(diaryDataWithText);
    } finally {
        setIsLoading(false);
    }
  };

  const handleQuestSelected = (selectedQuest: RecommendedQuest | null) => {
    if (!analysisResult || !context) return;
    const { diaryData, emotion, aiResponse } = analysisResult;
    const newEntry: DiaryEntry = {
      id: new Date().toISOString(),
      date: new Date().toISOString(),
      text: diaryData.text,
      mood: diaryData.mood,
      detailedEmotions: diaryData.detailedEmotions,
      keywords: diaryData.keywords,
      memo: diaryData.memo,
      emotion,
      aiResponse,
      quest: selectedQuest ? { ...selectedQuest, isComplete: false } : undefined,
    };
    context.addDiaryEntry(newEntry);
    setAnalysisResult(null);
  };

  const handleQuestCompletion = (feedback: 'worse' | 'same' | 'better') => {
    if (!questToComplete || !questToComplete.quest || !context) return;
    const updatedEntry: DiaryEntry = {
      ...questToComplete,
      quest: {
        ...questToComplete.quest,
        isComplete: true,
        feedback: feedback,
      },
    };
    context.updateDiaryEntry(updatedEntry);
    setQuestToComplete(null);
  };

  return (
    <div 
        className="relative h-full flex flex-col transition-all duration-1000 bg-gray-900 overflow-y-auto no-scrollbar"
        style={{
            backgroundImage: `linear-gradient(to bottom, rgba(26, 42, 58, 0.5), rgba(13, 21, 28, 0.8)), url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}
    >
        {activeQuestEntries && activeQuestEntries.length > 0 && (
            <div className="flex-shrink-0 p-4 pt-6">
                <h2 className="text-lg font-bold text-white mb-3 px-2">진행 중인 퀘스트</h2>
                <div className="space-y-2">
                    {activeQuestEntries.map(entry => (
                        <div key={entry.id} className="bg-gray-800/70 p-4 rounded-lg flex items-center justify-between transition backdrop-blur-md">
                            <div className="flex items-center min-w-0 mr-4">
                                <span className="text-2xl mr-3 flex-shrink-0">{entry.quest?.icon}</span>
                                <div className="min-w-0">
                                    <p className="font-bold text-white truncate">{entry.quest?.title}</p>
                                    <p className="text-sm text-gray-300">{entry.quest?.duration} · {entry.quest?.type}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setQuestToComplete(entry)}
                                className="flex-shrink-0 bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition"
                                aria-label={`'${entry.quest?.title}' 퀘스트 완료`}
                            >
                                완료
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
            {/* Character */}
            <div className="relative w-40 h-36 mb-6">
                {/* Ears */}
                 <div className="absolute top-0 left-0 w-12 h-20 origin-bottom-left animate-twitch-left" style={{ transform: 'rotate(-20deg)', left: '10px', top: '-5px' }}>
                    <div className="w-full h-full bg-[#E3E3E3] rounded-t-[50px] rounded-b-[20px] shadow-inner">
                        <div className="absolute top-2 left-2 right-2 bottom-2 bg-[#FAF5EF] rounded-t-[45px] rounded-b-[18px]"></div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-12 h-20 origin-bottom-right animate-twitch-right" style={{ transform: 'rotate(20deg)', right: '10px', top: '-5px' }}>
                    <div className="w-full h-full bg-[#E3E3E3] rounded-t-[50px] rounded-b-[20px] shadow-inner">
                        <div className="absolute top-2 left-2 right-2 bottom-2 bg-[#FAF5EF] rounded-t-[45px] rounded-b-[18px]"></div>
                    </div>
                </div>

                {/* Head */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-32 bg-[#F0EBE3] rounded-full shadow-2xl shadow-white/10 flex flex-col items-center justify-center">
                    {/* Eyes */}
                    <div className="w-full flex justify-center items-center gap-6 mt-2">
                        <div className="relative w-9 h-9 bg-gray-900 rounded-full flex items-center justify-start animate-blink">
                            <div className="w-3 h-3 bg-white rounded-full ml-1.5"></div>
                        </div>
                        <div className="relative w-9 h-9 bg-gray-900 rounded-full flex items-center justify-start animate-blink">
                            <div className="w-3 h-3 bg-white rounded-full ml-1.5"></div>
                        </div>
                    </div>
                    {/* Blush */}
                    <div className="absolute w-6 h-3 bg-pink-200/50 rounded-full bottom-9 left-6 transform -rotate-12"></div>
                    <div className="absolute w-6 h-3 bg-pink-200/50 rounded-full bottom-9 right-6 transform rotate-12"></div>
                    {/* Mouth */}
                    <div className="w-4 h-2 border-2 border-gray-600 rounded-b-full border-t-0 mt-2"></div>
                </div>
            </div>

            <p className="text-gray-200 drop-shadow-md font-medium mb-6 min-h-[40px] flex items-center justify-center animate-fade-in px-4 bg-black/20 rounded-xl py-2">{message}</p>

            <button
                onClick={() => setShowJournalingModal(true)}
                className="px-8 py-4 bg-white/90 hover:bg-white text-gray-900 rounded-lg font-bold text-lg shadow-lg backdrop-blur-sm transition"
            >
                오늘의 마음 기록하기
            </button>
        </div>
        
        {isLoading && (
            <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 animate-fade-in">
                <div className="text-white text-center">
                    <svg className="animate-spin h-10 w-10 text-white mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg font-semibold">AI가 당신의 마음을</p>
                    <p className="text-lg font-semibold">분석하고 있어요...</p>
                </div>
            </div>
        )}

        {showJournalingModal && (
            <EmotionJournalingModal 
                onComplete={handleJournalingComplete}
                onClose={() => setShowJournalingModal(false)}
            />
        )}
        
        {analysisResult && (
            <QuestSelectionModal 
                quests={analysisResult.quests}
                keywords={analysisResult.diaryData.keywords}
                onComplete={handleQuestSelected}
            />
        )}
        
        {questToComplete && (
            <QuestCompletionModal
                diaryEntry={questToComplete}
                onComplete={handleQuestCompletion}
                onClose={() => setQuestToComplete(null)}
            />
        )}
    </div>
  );
};

export default MainScreen;