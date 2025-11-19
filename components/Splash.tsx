import React from 'react';

const Splash: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#1a2a3a] to-[#0d151c] p-4 text-center text-white">
      <div className="flex-grow flex flex-col items-center justify-center">
        {/* Character */}
        <div className="relative w-40 h-36 mb-6 animate-bounce">
            {/* Ears */}
            <div className="absolute top-0 left-0 w-12 h-20 origin-bottom-left" style={{ transform: 'rotate(-20deg)', left: '10px', top: '-5px' }}>
                <div className="w-full h-full bg-[#E3E3E3] rounded-t-[50px] rounded-b-[20px] shadow-inner">
                    <div className="absolute top-2 left-2 right-2 bottom-2 bg-[#FAF5EF] rounded-t-[45px] rounded-b-[18px]"></div>
                </div>
            </div>
            <div className="absolute top-0 right-0 w-12 h-20 origin-bottom-right" style={{ transform: 'rotate(20deg)', right: '10px', top: '-5px' }}>
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
        <h1 className="text-5xl font-bold mb-2">RemindMe</h1>
        <p className="text-gray-300">하루를 남기고, 마음은 흘려보내는 기록</p>
      </div>

      <div className="w-full max-w-xs">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-green-400 h-2.5 rounded-full animate-progress"></div>
          </div>
      </div>
    </div>
  );
};

export default Splash;