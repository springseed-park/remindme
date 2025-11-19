import React, { useState } from 'react';
import { RecommendedQuest } from '../types';

interface QuestSelectionModalProps {
  quests: RecommendedQuest[];
  keywords: string[];
  onComplete: (selectedQuest: RecommendedQuest | null) => void;
}

const QuestItem: React.FC<{ quest: RecommendedQuest, isSelected: boolean, onSelect: () => void }> = ({ quest, isSelected, onSelect }) => {
    const typeColors = {
        '쓰기': { normal: 'border-gray-700 bg-gray-800/50 hover:bg-gray-800', selected: 'border-green-400 bg-green-900/40', textColor: 'text-green-300' },
        '행동하기': { normal: 'border-gray-700 bg-gray-800/50 hover:bg-gray-800', selected: 'border-yellow-400 bg-yellow-900/40', textColor: 'text-yellow-300' },
        '말하기': { normal: 'border-gray-700 bg-gray-800/50 hover:bg-gray-800', selected: 'border-rose-400 bg-rose-900/40', textColor: 'text-rose-300' },
        '생각하기': { normal: 'border-gray-700 bg-gray-800/50 hover:bg-gray-800', selected: 'border-cyan-400 bg-cyan-900/40', textColor: 'text-cyan-300' },
    };
    const colors = typeColors[quest.type as keyof typeof typeColors] || typeColors['행동하기'];

    return (
        <div 
            onClick={onSelect}
            className={`w-full p-4 rounded-xl border cursor-pointer transition-all duration-200 ${isSelected ? colors.selected : colors.normal}`}
        >
            <span className={`text-sm font-medium ${colors.textColor}`}>{quest.type}</span>
            <p className="text-base font-bold text-white mt-1">{quest.title}</p>
        </div>
    );
};


const QuestSelectionModal: React.FC<QuestSelectionModalProps> = ({ quests, keywords, onComplete }) => {
  const [selectedQuest, setSelectedQuest] = useState<RecommendedQuest | null>(quests.length > 0 ? quests[0] : null);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex flex-col justify-end animate-fade-in">
        {/* Bottom sheet container */}
        <div className="w-full max-w-md mx-auto bg-gray-900/95 backdrop-blur-sm rounded-t-2xl flex flex-col animate-fade-in-up" style={{ maxHeight: '90vh' }}>
            
            {/* Scrollable content area */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <div className="text-center">
                    {keywords.length > 0 && (
                         <div className="flex flex-wrap gap-2 justify-center mb-2">
                            {keywords.map(k => (
                                <span key={k} className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm font-semibold">{k}</span>
                            ))}
                         </div>
                    )}
                    <p className="text-xl font-bold text-gray-300">을(를) 위한 추천 중</p>
                    <h2 className="text-2xl font-bold text-white mt-1 mb-8">지금 해볼 퀘스트를 골라주세요.</h2>
                </div>
                
                <div className="space-y-3 pb-4">
                    {quests.map((quest, index) => (
                        <QuestItem 
                            key={index} 
                            quest={quest}
                            isSelected={selectedQuest?.title === quest.title}
                            onSelect={() => setSelectedQuest(quest)}
                        />
                    ))}
                </div>
            </div>
            
            {/* Footer with buttons */}
            <div className="w-full border-t border-gray-800 flex-shrink-0">
                <div className="p-4 space-y-3">
                    <button onClick={() => onComplete(selectedQuest)} className="w-full px-6 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-200 transition">
                        선택 완료
                    </button>
                     <button onClick={() => onComplete(null)} className="w-full text-gray-400 font-medium py-2 hover:text-white transition">
                        선택하지 않고 넘어갈게요
                    </button>
                </div>
          </div>
        </div>
    </div>
  );
};

export default QuestSelectionModal;