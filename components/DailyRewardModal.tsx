import React from 'react';

interface DailyRewardModalProps {
  onClose: () => void;
  onClaim: () => void;
}

const DailyRewardModal: React.FC<DailyRewardModalProps> = ({ onClose, onClaim }) => {
    return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 text-white animate-fade-in-up relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 text-2xl">&times;</button>
        <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">DAILY REWARD</h2>
            <p className="text-sm text-gray-400">매일 자정 초기화</p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg space-y-4">
            <p className="font-bold text-left">오늘의 별</p>
            
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300">출석하기</p>
                <button onClick={onClaim} className="bg-yellow-500 text-black font-bold px-4 py-2 rounded-lg text-sm">
                   ⭐ 1 받기
                </button>
            </div>

            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300">감정 기록 1회</p>
                <button disabled className="bg-gray-600 text-gray-400 font-bold px-4 py-2 rounded-lg text-sm cursor-not-allowed">
                   ⭐ 5 받기
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DailyRewardModal;