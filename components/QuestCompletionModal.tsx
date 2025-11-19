import React, { useState } from 'react';
import { DiaryEntry } from '../types';

interface QuestCompletionModalProps {
    diaryEntry: DiaryEntry;
    onComplete: (feedback: 'worse' | 'same' | 'better') => void;
    onClose: () => void;
}

const QuestCompletionModal: React.FC<QuestCompletionModalProps> = ({ diaryEntry, onComplete, onClose }) => {
    const [feedback, setFeedback] = useState<'worse' | 'same' | 'better' | null>(null);

    const feedbackOptions = {
        worse: { label: '안좋아졌어요', icon: '😕' },
        same: { label: '똑같아요', icon: '😐' },
        better: { label: '좋아졌어요', icon: '😊' },
    };

    const handleConfirm = () => {
        if (feedback) {
            onComplete(feedback);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="relative bg-gray-900 w-full max-w-sm rounded-2xl shadow-lg p-6 border border-gray-700 text-center text-white">
                
                <h2 className="text-xl font-bold text-white mb-2">{diaryEntry.quest?.title}</h2>
                <p className="text-gray-400 mb-6">퀘스트를 완료했어요!</p>

                <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="font-semibold mb-4">퀘스트를 하고 난 후 기분이</p>
                    <div className="grid grid-cols-3 gap-3">
                        {Object.entries(feedbackOptions).map(([key, { label, icon }]) => (
                            <button
                                key={key}
                                onClick={() => setFeedback(key as 'worse' | 'same' | 'better')}
                                className={`p-3 rounded-lg border transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${feedback === key ? 'border-green-400 bg-green-400/20 scale-105' : 'border-gray-700 bg-gray-700/50 hover:bg-gray-700'}`}
                            >
                                <span className="text-3xl">{icon}</span>
                                <span className="text-xs font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                <button
                    onClick={handleConfirm}
                    disabled={!feedback}
                    className="w-full mt-6 px-6 py-3 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-200 transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                    확인
                </button>
            </div>
        </div>
    );
};

export default QuestCompletionModal;