import React, { useState, useEffect, createContext, useRef } from 'react';
import { View, UserProfile, DiaryEntry, PsychologicalTestResult, Quest } from './types';
import Onboarding from './components/Onboarding';
import MainScreen from './components/MainScreen';
import BottomNav from './components/SideMenu';
import Mailbox from './components/Mailbox';
import Analytics from './components/Analytics';
import PsychologicalTests from './components/PsychologicalTests';
import Shopping from './components/MusicStudio'; // Renamed MusicStudio to Shopping
import Splash from './components/Splash';
import Header from './components/Header';
import CalendarModal from './components/CalendarModal';
import ChatModal from './components/ChatModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { EMOTIONS, KEYWORDS } from './constants';

interface AppContextType {
  view: View;
  userProfile: UserProfile | null;
  diaryEntries: DiaryEntry[];
  psychTestResults: PsychologicalTestResult[];
  setView: (view: View) => void;
  addDiaryEntry: (entry: DiaryEntry) => void;
  updateDiaryEntry: (entry: DiaryEntry) => void;
  deleteDiaryEntry: (id: string) => void;
  deleteMessage: (id: string) => void;
  addPsychTestResult: (result: PsychologicalTestResult) => void;
  deletePsychTestResult: (id: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const generateSampleEntries = (): DiaryEntry[] => {
  const entries: DiaryEntry[] = [];
  const today = new Date();
  
  const sampleData = [
    { memo: '친구랑 만나서 재밌게 놀았다.', aiResponse: '친구분과 좋은 시간을 보내셨군요! 듣기만 해도 저까지 즐거워지는 기분이에요. 어떤 점이 가장 재미있었나요?' },
    { memo: '업무 스트레스가 너무 심하다.', aiResponse: '업무 때문에 많이 힘드셨군요. 어떤 점이 가장 마음을 무겁게 하는지, 괜찮다면 저에게 털어놓아 주시겠어요? 잠시 모든 걸 잊고 심호흡 한 번 해봐요.' },
    { memo: '새로운 취미를 시작해서 설렌다.', aiResponse: '새로운 시작은 언제나 설레는 법이죠! 어떤 취미를 시작하셨는지 궁금해지네요. 당신의 열정을 응원할게요!' },
    { memo: '날씨가 좋아서 기분도 상쾌했다.', aiResponse: '화창한 날씨가 기분 좋은 에너지를 선물해 주었군요. 오늘처럼 상쾌한 하루가 계속되기를 바라요.' },
    { memo: '가족과 다퉈서 마음이 안 좋다.', aiResponse: '가까운 사람과의 다툼은 마음을 더 힘들게 하죠. 속상한 마음이 조금은 진정되었으면 좋겠어요. 시간이 지나면 분명 괜찮아질 거예요.' },
    { memo: '미래에 대한 걱정으로 잠을 설쳤다.', aiResponse: '보이지 않는 미래에 대한 걱정은 당연한 감정이에요. 너무 애쓰지 않아도 괜찮아요. 지금 이 순간, 당신의 호흡에만 집중해보는 건 어떨까요?' },
    { memo: '오랜만에 책을 읽으며 여유를 즐겼다.', aiResponse: '온전히 자신에게 집중하는 시간을 보내셨군요. 책 속에서 어떤 문장이 당신의 마음에 머물렀나요? 당신의 여유로운 시간이 참 소중하게 느껴져요.' },
    { memo: '맛있는 음식을 먹어서 행복했다.', aiResponse: '맛있는 음식은 정말 큰 행복이죠! 어떤 음식을 드셨는지 궁금하네요. 오늘의 작은 행복이 내일의 에너지가 되기를 바라요.' },
    { memo: '운동을 하고 나니 개운하다.', aiResponse: '몸을 움직이며 땀을 흘리는 건 정말 멋진 일이에요. 노력한 만큼 상쾌한 기분을 만끽하셨다니 다행이에요. 꾸준히 응원할게요!' },
    { memo: '보고 싶었던 영화가 실망스러웠다.', aiResponse: '기대했던 만큼 실망도 큰 법이죠. 아쉬운 마음이 드는 건 당연해요. 다음번에는 당신의 마음에 꼭 드는 영화를 만나게 될 거예요.' },
    { memo: '성과가 좋지 않아 우울하다.', aiResponse: '결과가 기대에 미치지 못해 속상하셨겠어요. 하지만 과정 속에서 당신이 쏟은 노력은 절대 사라지지 않아요. 스스로를 너무 자책하지 않았으면 좋겠어요.' },
    { memo: '뜻밖의 칭찬을 들어 뿌듯했다.', aiResponse: '칭찬은 언제 들어도 기분 좋은 말이죠. 당신의 노력을 인정받은 것 같아 저도 기쁘네요. 오늘 하루는 뿌듯한 마음을 마음껏 즐겨보세요!' },
    { memo: '별다른 일 없이 조용한 하루였다.', aiResponse: '때로는 아무 일 없는 평온한 하루가 가장 큰 휴식이 되기도 해요. 오늘 하루, 당신의 마음은 어떤 색이었나요?' },
    { memo: '친구가 힘들어 보여서 걱정된다.', aiResponse: '친구를 생각하는 당신의 마음이 참 따뜻하게 느껴져요. 따뜻한 말 한마디가 친구에게 큰 힘이 될 수 있을 거예요. 당신도, 친구분도 모두 괜찮을 거예요.' },
    { memo: '해야 할 일은 많은데 아무것도 하기 싫다.', aiResponse: '몸과 마음이 모두 지쳐서 잠시 멈추고 싶다는 신호를 보내는 걸지도 몰라요. 가장 중요한 일 하나만 남기고 나머지는 잠시 잊어보는 건 어떨까요? 작은 성공이 다시 나아갈 힘을 줄 거예요.' }
  ];
  
  const questTypes = ['쓰기', '행동하기', '생각하기'];
  const questIcons = ['✍️', '🏃‍♀️', '🤔', '🎨', '🎵'];
  const questTitles = ['오늘 감사했던 일 3가지 적기', '가벼운 산책 15분 하기', '좋아하는 노래 들으며 휴식하기', '긍정적인 자기 암시 5번 말하기'];

  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    const mood = Math.floor(Math.random() * 5);
    
    let category: 'positive' | 'negative' | 'neutral';
    if (mood > 2) category = 'positive';
    else if (mood < 2) category = 'negative';
    else category = 'neutral';
    
    const categoryEmotions = EMOTIONS[category].items;
    const detailedEmotions = Array.from(new Set([
      categoryEmotions[Math.floor(Math.random() * categoryEmotions.length)],
      ...(Math.random() > 0.5 ? [categoryEmotions[Math.floor(Math.random() * categoryEmotions.length)]] : [])
    ]));

    const selectedKeywords = Array.from(new Set([
        KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)],
        ...(Math.random() > 0.5 ? [KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)]] : [])
    ]));
    
    const sample = sampleData[i % sampleData.length];

    const entry: DiaryEntry = {
      id: `sample-${i + 1}-${date.getTime()}`,
      date: date.toISOString(),
      text: sample.memo,
      mood: mood,
      detailedEmotions: detailedEmotions,
      keywords: selectedKeywords,
      memo: sample.memo,
      emotion: detailedEmotions[0],
      aiResponse: sample.aiResponse,
    };
    
    if (Math.random() < 0.5) {
      entry.quest = {
        title: questTitles[Math.floor(Math.random() * questTitles.length)],
        duration: '15분',
        type: questTypes[Math.floor(Math.random() * questTypes.length)],
        icon: questIcons[Math.floor(Math.random() * questIcons.length)],
        isComplete: true,
        feedback: (['better', 'same', 'worse'] as const)[Math.floor(Math.random() * 3)],
      };
    }

    entries.push(entry);
  }
  return entries;
};

type AppStatus = 'LOADING' | 'ONBOARDING' | 'READY';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useLocalStorage<UserProfile | null>('userProfile', null);
  const [diaryEntries, setDiaryEntries] = useLocalStorage<DiaryEntry[]>('diaryEntries', []);
  const [psychTestResults, setPsychTestResults] = useLocalStorage<PsychologicalTestResult[]>('psychTestResults', []);
  
  const [status, setStatus] = useState<AppStatus>('LOADING');
  const [view, setView] = useState<View>(View.MAIN);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (status === 'LOADING') {
        const timer = setTimeout(() => {
            // The user wants onboarding to always show for now.
            const profileExists = false; // userProfile && userProfile.gender;
            
            if (profileExists && diaryEntries.length === 0) {
                setDiaryEntries(generateSampleEntries());
            }
            console.log('Checking for user profile:', userProfile);
            console.log('Does a valid profile exist? (Onboarding will be skipped if true):', profileExists);
            setStatus(profileExists ? 'READY' : 'ONBOARDING');
        }, 2500);
        return () => clearTimeout(timer);
    }
  }, [status, userProfile, diaryEntries.length, setDiaryEntries]);

  useEffect(() => {
    if (mainRef.current) {
        mainRef.current.scrollTo(0, 0);
    }
  }, [view]);

  const handleSetUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setDiaryEntries(generateSampleEntries());
    setStatus('READY');
  };

  const addDiaryEntry = (entry: DiaryEntry) => {
    setDiaryEntries(prev => [entry, ...prev]);
  };

  const updateDiaryEntry = (updatedEntry: DiaryEntry) => {
    setDiaryEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
  };
  
  const deleteDiaryEntry = (id: string) => {
    setDiaryEntries(prev => prev.filter(e => e.id !== id));
  };

  const deleteMessage = (id: string) => {
    setDiaryEntries(prev => prev.map(e => e.id === id ? { ...e, aiResponse: undefined } : e));
  };

  const addPsychTestResult = (result: PsychologicalTestResult) => {
    setPsychTestResults(prev => [result, ...prev]);
  };
  
  const deletePsychTestResult = (id: string) => {
    setPsychTestResults(prev => prev.filter(r => r.id !== id));
  };

  const appContextValue: AppContextType = {
    view,
    userProfile,
    diaryEntries,
    psychTestResults,
    setView,
    addDiaryEntry,
    updateDiaryEntry,
    deleteDiaryEntry,
    deleteMessage,
    addPsychTestResult,
    deletePsychTestResult
  };
  
  if (status === 'LOADING') {
    return <Splash />;
  }

  if (status === 'ONBOARDING') {
    return <Onboarding onComplete={handleSetUserProfile} />;
  }

  const renderMainView = () => {
    switch(view) {
      case View.MAILBOX: return <Mailbox />;
      case View.ANALYTICS: return <Analytics />;
      case View.PSYCH_TESTS: return <PsychologicalTests />;
      case View.SHOPPING: return <Shopping />;
      case View.MAIN:
      default:
        return <MainScreen />;
    }
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <div className="relative h-screen w-full max-w-md mx-auto bg-gray-900 overflow-hidden no-scrollbar">
        <Header 
          title="RemindMe" 
          onCalendarClick={() => setShowCalendarModal(true)}
          onChatClick={() => setShowChatModal(true)}
        />
        <main ref={mainRef} className="h-full pt-16 pb-20 overflow-y-auto no-scrollbar">
          {renderMainView()}
        </main>
        <BottomNav />
        {showCalendarModal && 
            <CalendarModal 
                onClose={() => setShowCalendarModal(false)}
                diaryEntries={diaryEntries}
            />
        }
        {showChatModal && 
            <ChatModal onClose={() => setShowChatModal(false)} />
        }
      </div>
    </AppContext.Provider>
  );
};

export default App;