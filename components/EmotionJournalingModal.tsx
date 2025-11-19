import React, { useState, useMemo } from 'react';
import { EMOTIONS, KEYWORDS } from '../constants';
import { analyzeTextForEmotionsAndKeywords } from '../services/openaiService';

interface EmotionJournalingModalProps {
  onComplete: (data: {
    mood: number;
    detailedEmotions: string[];
    keywords: string[];
    memo: string;
  }) => void;
  onClose: () => void;
}

const emotionCategoryMap: Map<string, keyof typeof EMOTIONS> = new Map();
Object.entries(EMOTIONS).forEach(([category, { items }]) => {
    items.forEach(item => {
        emotionCategoryMap.set(item, category as keyof typeof EMOTIONS);
    });
});

const emotionCategoryColors: { [key: string]: string } = {
    neutral: 'text-cyan-300 border-cyan-500 bg-cyan-500/10',
    positive: 'text-amber-300 border-amber-500 bg-amber-500/10',
    negative: 'text-indigo-300 border-indigo-500 bg-indigo-500/10',
};
const selectedEmotionCategoryColors: { [key: string]: string } = {
    neutral: 'text-white border-cyan-400 bg-cyan-500',
    positive: 'text-white border-amber-400 bg-amber-500',
    negative: 'text-white border-indigo-400 bg-indigo-500',
};


const Chip: React.FC<{ label: string; onRemove: () => void; colorClass: string }> = ({ label, onRemove, colorClass }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold border transition-colors text-sm ${colorClass}`}>
        <span>{label}</span>
        <button onClick={onRemove} className="bg-white/20 rounded-full w-4 h-4 flex items-center justify-center text-white text-xs leading-none">
            &times;
        </button>
    </div>
);

const EmotionSelector: React.FC<{ visible: boolean; selected: string[]; onToggle: (emotion: string) => void; onClose: () => void; }> = ({ visible, selected, onToggle, onClose }) => {
    if (!visible) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-2xl w-full max-w-sm flex flex-col animate-fade-in-up" style={{maxHeight: '80vh'}}>
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold">감정키워드 선택</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </header>
                <main className="flex-1 overflow-y-auto p-4 no-scrollbar">
                    <div className="space-y-6">
                        {Object.entries(EMOTIONS).map(([key, { name, items, color }]) => (
                            <div key={key}>
                                <h3 className={`font-bold text-lg mb-3 text-${color}-300`}>{name}</h3>
                                <div className="flex flex-wrap gap-2">
                                    {items.map(emotion => (
                                        <button key={emotion} onClick={() => onToggle(emotion)}
                                            className={`px-4 py-2 rounded-full font-semibold border transition-colors ${selected.includes(emotion) ? selectedEmotionCategoryColors[key as keyof typeof selectedEmotionCategoryColors] : emotionCategoryColors[key as keyof typeof emotionCategoryColors]}`}>
                                            {emotion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
                <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                    <button onClick={onClose} className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg font-bold">완료</button>
                </footer>
            </div>
        </div>
    );
};

const KeywordSelector: React.FC<{ visible: boolean; selected: string[]; custom: string[]; onToggle: (keyword: string) => void; onAdd: (keyword: string) => void; onClose: () => void; }> = ({ visible, selected, custom, onToggle, onAdd, onClose }) => {
    const [isAddingKeyword, setIsAddingKeyword] = useState(false);
    const [newKeyword, setNewKeyword] = useState('');

    const handleAddKeyword = () => {
        const trimmed = newKeyword.trim();
        if (trimmed && !KEYWORDS.includes(trimmed) && !custom.includes(trimmed)) {
            onAdd(trimmed);
        }
        setNewKeyword('');
        setIsAddingKeyword(false);
    };

    if (!visible) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-800 rounded-2xl w-full max-w-sm flex flex-col animate-fade-in-up" style={{maxHeight: '80vh'}}>
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <h2 className="text-xl font-bold">감정요인키워드 선택</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </header>
                <main className="flex-1 overflow-y-auto p-4 no-scrollbar">
                     <div className="flex flex-wrap gap-2">
                        {[...KEYWORDS, ...custom].map(keyword => (
                            <button key={keyword} onClick={() => onToggle(keyword)}
                                className={`px-4 py-2 rounded-full font-semibold border transition-colors ${selected.includes(keyword) ? 'bg-green-400 text-gray-900 border-green-400' : 'bg-gray-800 border-gray-700'}`}>
                                {keyword}
                            </button>
                        ))}
                        {isAddingKeyword ? (
                            <div className="flex items-center gap-1 bg-gray-800 border border-dashed border-gray-600 rounded-full p-1 transition-all duration-300">
                                <input type="text" value={newKeyword} onChange={e => setNewKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddKeyword()} placeholder="키워드 입력..." className="bg-transparent text-white outline-none px-3 text-sm w-24" autoFocus />
                                <button onClick={handleAddKeyword} className="bg-green-500 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center text-white text-lg leading-none">✓</button>
                                <button onClick={() => { setIsAddingKeyword(false); setNewKeyword(''); }} className="bg-gray-600 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center text-white text-lg leading-none pb-0.5">×</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsAddingKeyword(true)} className="px-4 py-2 rounded-full font-semibold border border-dashed bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 transition-colors">+</button>
                        )}
                    </div>
                </main>
                <footer className="p-4 border-t border-gray-700 flex-shrink-0">
                    <button onClick={onClose} className="w-full px-4 py-3 bg-white text-gray-900 rounded-lg font-bold">완료</button>
                </footer>
            </div>
        </div>
    );
};


const EmotionJournalingModal: React.FC<EmotionJournalingModalProps> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState(1);
  const [memo, setMemo] = useState('');
  const [analyzedMemo, setAnalyzedMemo] = useState('');
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [customKeywords, setCustomKeywords] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [showEmotionSelector, setShowEmotionSelector] = useState(false);
  const [showKeywordSelector, setShowKeywordSelector] = useState(false);

  const handleNext = async () => {
    if (step === 1) {
      if (memo.trim().length > 0 && memo !== analyzedMemo) {
        setIsAnalyzing(true);
        setAnalyzedMemo(memo);
        const analysisResult = await analyzeTextForEmotionsAndKeywords(memo);

        if (analysisResult) {
            const { emotions, keywords } = analysisResult;
            const allEmotionItems = [ ...EMOTIONS.neutral.items, ...EMOTIONS.positive.items, ...EMOTIONS.negative.items ];
            const validEmotions = emotions.filter(e => allEmotionItems.includes(e));
            setSelectedEmotions(validEmotions);
            
            const validKeywords = keywords.filter(k => KEYWORDS.includes(k));
            setSelectedKeywords(validKeywords);
        }
        setIsAnalyzing(false);
      }
      setStep(2);
    } else { // step 2
      const moodScore = selectedEmotions.reduce((acc, emotion) => {
          const category = emotionCategoryMap.get(emotion);
          if (category === 'positive') return acc + 1;
          if (category === 'negative') return acc - 1;
          return acc;
      }, 0);
      
      let finalMood = 2; // neutral default
      if (moodScore > 0) finalMood = 3; // slightly positive
      if (moodScore > 1) finalMood = 4; // very positive
      if (moodScore < 0) finalMood = 1; // slightly negative
      if (moodScore < -1) finalMood = 0; // very negative

      onComplete({ mood: finalMood, detailedEmotions: selectedEmotions, keywords: selectedKeywords, memo });
    }
  };
  
  const handleBack = () => setStep(s => s - 1);

  const toggleEmotion = (emotion: string) => setSelectedEmotions(p => p.includes(emotion) ? p.filter(e => e !== emotion) : [...p, emotion]);
  const toggleKeyword = (keyword: string) => setSelectedKeywords(p => p.includes(keyword) ? p.filter(k => k !== keyword) : [...p, keyword]);
  const addCustomKeyword = (keyword: string) => {
    setCustomKeywords(prev => [...prev, keyword]);
    setSelectedKeywords(prev => [...prev, keyword]);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">오늘의 마음은 어땠나요?</h2>
            <p className="text-gray-400 mb-6">어떤 일이 있었고, 어떤 감정을 느꼈는지 자유롭게 이야기해주세요.</p>
            <textarea 
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="여기에 입력하세요..."
              className="w-full h-48 p-3 bg-gray-800 border-gray-700 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none resize-none"
            />
          </div>
        );
      case 2:
        const keywordChipStyle = 'text-gray-200 border-gray-600 bg-gray-700/50';
        return (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">AI가 추출한 핵심 감정과 키워드예요.</h2>
            <p className="text-gray-400 mb-6">결과를 수정하거나, 직접 추가/삭제할 수 있어요.</p>

            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-200">감정키워드</h3>
                    <button onClick={() => setShowEmotionSelector(true)} className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-2xl font-light text-green-400 hover:bg-gray-600">+</button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-900/50 rounded-lg min-h-[50px]">
                    {selectedEmotions.length > 0 ? selectedEmotions.map(emotion => {
                        const category = emotionCategoryMap.get(emotion) || 'neutral';
                        return <Chip key={emotion} label={emotion} onRemove={() => toggleEmotion(emotion)} colorClass={emotionCategoryColors[category]} />
                    }) : <p className="text-sm text-gray-500 p-2">선택된 감정이 없어요.</p>}
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-200">감정요인키워드</h3>
                    <button onClick={() => setShowKeywordSelector(true)} className="w-8 h-8 flex items-center justify-center bg-gray-700 rounded-full text-2xl font-light text-green-400 hover:bg-gray-600">+</button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-900/50 rounded-lg min-h-[50px]">
                     {selectedKeywords.length > 0 ? selectedKeywords.map(keyword => (
                        <Chip key={keyword} label={keyword} onRemove={() => toggleKeyword(keyword)} colorClass={keywordChipStyle} />
                     )) : <p className="text-sm text-gray-500 p-2">선택된 키워드가 없어요.</p>}
                </div>
            </div>
          </div>
        );
      default: return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex flex-col animate-fade-in">
        <div className="w-full max-w-md mx-auto flex flex-col h-full overflow-hidden">
            <header className="flex items-center justify-between p-4 h-16 flex-shrink-0">
                 {step > 1 ? (
                    <button onClick={handleBack} className="p-2 text-2xl font-bold">‹</button>
                 ) : <div className="w-10"></div>}
                 <button onClick={onClose} className="p-2 text-2xl font-bold">&times;</button>
            </header>
            
            <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
                {renderStepContent()}
            </main>

            <footer className="w-full bg-gray-900/80 backdrop-blur-sm border-t border-t-gray-800 flex-shrink-0">
                <div className="max-w-md mx-auto p-4 pb-20">
                    <button 
                        onClick={handleNext} 
                        className="w-full px-6 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-200 transition disabled:bg-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                        disabled={isAnalyzing || (step === 1 && memo.trim().length === 0)}
                    >
                        {isAnalyzing ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>분석 중...</span>
                            </>
                        ) : (
                            step < 2 ? '다음' : '작성 완료'
                        )}
                    </button>
                </div>
            </footer>
            
            <EmotionSelector visible={showEmotionSelector} selected={selectedEmotions} onToggle={toggleEmotion} onClose={() => setShowEmotionSelector(false)} />
            <KeywordSelector visible={showKeywordSelector} selected={selectedKeywords} custom={customKeywords} onToggle={toggleKeyword} onAdd={addCustomKeyword} onClose={() => setShowKeywordSelector(false)} />
        </div>
    </div>
  );
};

export default EmotionJournalingModal;