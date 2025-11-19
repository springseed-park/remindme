import React, { useState, useRef, useMemo, useEffect } from 'react';
import { UserProfile } from '../types';
import { ONBOARDING_CONCERNS } from '../constants';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const concernColors = [
    'bg-red-400', 'bg-green-400', 'bg-blue-400', 'bg-teal-400',
    'bg-orange-400', 'bg-indigo-400', 'bg-gray-400'
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [birthYear, setBirthYear] = useState(new Date().getFullYear() - 25);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [conversationStyle, setConversationStyle] = useState({ empathySolution: 0.8, friendlyFormal: 0.2 }); // y, x

  const gridRef = useRef<HTMLDivElement>(null);

  const daysInMonth = useMemo(() => new Date(birthYear, birthMonth, 0).getDate(), [birthYear, birthMonth]);

  useEffect(() => {
    if (birthDay > daysInMonth) {
      setBirthDay(daysInMonth);
    }
  }, [daysInMonth]);


  const toggleConcern = (concern: string) => {
    setConcerns(prev =>
      prev.includes(concern)
        ? prev.filter(c => c !== concern)
        : [...prev, concern]
    );
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSubmit = () => {
    if (step === 3) {
      const today = new Date();
      const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      onComplete({ age: calculatedAge, gender, concerns, curiousAbout: '', dislikes: '', conversationStyle });
    } else {
      nextStep();
    }
  };
  
  const handleGridInteraction = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gridRef.current) return;
    const rect = gridRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / rect.width;
    let y = (e.clientY - rect.top) / rect.height;
    x = Math.max(0, Math.min(1, x));
    y = Math.max(0, Math.min(1, y));
    setConversationStyle({ friendlyFormal: x, empathySolution: y });
  };

  const styleDescription = useMemo(() => {
    const empathy = conversationStyle.empathySolution > 0.5 ? '공감 중심' : '해결 중심';
    const friendly = conversationStyle.friendlyFormal < 0.5 ? '친근한' : '정중한';
    return `${empathy} • ${friendly}`;
  }, [conversationStyle]);

  const renderStep = () => {
    switch (step) {
      case 1: // Birthdate & Gender
        const currentYear = new Date().getFullYear();
        const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

        return (
          <div>
            <h2 className="text-3xl font-bold mb-4">당신에 대해 알려주세요.</h2>
            <p className="mb-8 text-gray-400">맞춤형 힐링 경험을 위해 필요해요.</p>
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">생년월일</label>
              <div className="flex gap-2">
                <select value={birthYear} onChange={e => setBirthYear(parseInt(e.target.value))} className="flex-1 w-full p-3 bg-gray-800 border-gray-700 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none">
                  {years.map(y => <option key={y} value={y}>{y}년</option>)}
                </select>
                <select value={birthMonth} onChange={e => setBirthMonth(parseInt(e.target.value))} className="flex-1 w-full p-3 bg-gray-800 border-gray-700 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none">
                  {months.map(m => <option key={m} value={m}>{m}월</option>)}
                </select>
                <select value={birthDay} onChange={e => setBirthDay(parseInt(e.target.value))} className="flex-1 w-full p-3 bg-gray-800 border-gray-700 border rounded-lg focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none">
                  {days.map(d => <option key={d} value={d}>{d}일</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-gray-300 mb-2 font-medium">성별</label>
              <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setGender('male')} className={`w-full p-3 rounded-lg font-medium border transition-colors ${gender === 'male' ? 'bg-green-400/20 border-green-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                      남성
                  </button>
                  <button onClick={() => setGender('female')} className={`w-full p-3 rounded-lg font-medium border transition-colors ${gender === 'female' ? 'bg-green-400/20 border-green-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                      여성
                  </button>
              </div>
            </div>
          </div>
        );
      case 2: // Concerns
        return (
          <div>
            <h2 className="text-3xl font-bold mb-4">요즘 어떤 고민이 있으신가요?</h2>
            <p className="mb-8 text-gray-400">(여러 개 선택할 수 있어요)</p>
            <div className="space-y-3">
              {ONBOARDING_CONCERNS.map((concern, index) => (
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 flex items-center justify-between border ${concerns.includes(concern) ? 'border-green-400 bg-green-400/10' : 'border-gray-700'}`}
                >
                  <div className="flex items-center">
                    <span className={`w-3 h-3 rounded-full mr-4 ${concernColors[index % concernColors.length]}`}></span>
                    <span className="font-medium">{concern}</span>
                  </div>
                  {concerns.includes(concern) && (
                     <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      case 3: // Conversation Style
        const gridSize = 10;
        return (
            <div>
              <h2 className="text-3xl font-bold mb-4">어떤 대화 스타일을 선호하시나요?</h2>
               <div className="bg-gray-800/50 p-3 rounded-lg text-center my-8 max-w-xs mx-auto">
                    <p className="font-semibold text-lg">{styleDescription}</p>
                </div>

              <div className="relative aspect-square max-w-sm mx-auto my-4">
                <div 
                    ref={gridRef}
                    className="absolute inset-0 bg-gray-800/30 rounded-2xl cursor-pointer p-4"
                    onClick={handleGridInteraction}
                >
                    <div className="w-full h-full grid grid-cols-10 grid-rows-10">
                        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                             const row = Math.floor(i / gridSize);
                             const col = i % gridSize;
                             const dx = (col / (gridSize - 1)) - conversationStyle.friendlyFormal;
                             const dy = (row / (gridSize - 1)) - conversationStyle.empathySolution;
                             const distance = Math.sqrt(dx*dx + dy*dy);
                             const opacity = Math.max(0.1, 1 - distance * 2.5);
                             const scale = Math.max(0.4, 1 - distance * 1.8);
                             return (
                                <div key={i} className="flex items-center justify-center">
                                    <div 
                                        className="rounded-full transition-all duration-200"
                                        style={{ 
                                            width: `${scale * 100}%`,
                                            height: `${scale * 100}%`,
                                            backgroundColor: `rgba(255, 255, 255, ${opacity})`,
                                            opacity: opacity
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    <div 
                        className="absolute w-8 h-8 -m-4 bg-white rounded-full pointer-events-none shadow-2xl shadow-white/30"
                        style={{
                            left: `${conversationStyle.friendlyFormal * 100}%`,
                            top: `${conversationStyle.empathySolution * 100}%`,
                            transition: 'left 0.1s ease-out, top 0.1s ease-out',
                        }}
                    />
                </div>
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm">해결 중심</span>
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-gray-400 text-sm">공감 중심</span>
                <span className="absolute -left-6 top-1/2 -translate-y-1/2 -rotate-90 text-gray-400 text-sm">친근한</span>
                <span className="absolute -right-6 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 text-sm">정중한</span>
              </div>
            </div>
          );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-md mx-auto p-6 pb-28">
        <div>
          <div className="flex items-center gap-2 mb-8">
              {step > 1 && <button onClick={prevStep} className="text-2xl p-2 -ml-2">‹</button>}
              <div className="w-full flex gap-1.5 h-1.5">
                  <div className={`flex-1 rounded-full ${step >= 1 ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                  <div className={`flex-1 rounded-full ${step >= 2 ? 'bg-green-400' : 'bg-gray-700'}`}></div>
                  <div className={`flex-1 rounded-full ${step >= 3 ? 'bg-green-400' : 'bg-gray-700'}`}></div>
              </div>
          </div>
          
          <div className="animate-fade-in">
           {renderStep()}
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 w-full bg-gray-900/80 backdrop-blur-sm border-t border-t-gray-800">
        <div className="max-w-md mx-auto p-4">
            <button onClick={handleSubmit} className="w-full px-6 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-200 transition">
                {step < 3 ? '다음' : '완료'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;