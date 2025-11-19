import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../App';
import { PSYCH_TESTS } from '../constants';
import { PsychologicalTestResult } from '../types';
import GaugeChart from './GaugeChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

type Test = typeof PSYCH_TESTS[0];

const TestRunner: React.FC<{ 
    test: Test, 
    onComplete: (result: PsychologicalTestResult) => void 
}> = ({ test, onComplete }) => {
  const [answers, setAnswers] = useState<number[]>(new Array(test.questions.length).fill(-1));

  const handleAnswer = (qIndex: number, score: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = score;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.some(a => a === -1)) {
        alert("모든 문항에 답변해주세요.");
        return;
    }
    const totalScore = answers.reduce((sum, score) => sum + score, 0);
    const result: PsychologicalTestResult = {
        id: new Date().toISOString(),
        testId: test.id,
        score: totalScore,
        date: new Date().toISOString(),
    };
    onComplete(result);
  };
  
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in-up">
      <p className="text-gray-400 mb-8">지난 2주 동안, 아래의 문제들을 얼마나 자주 경험했는지 가장 잘 나타내는 항목을 선택해주세요.</p>
      <div className="space-y-8">
        {test.questions.map((q, i) => (
          <div key={i}>
            <p className="mb-3 text-gray-200">{i + 1}. {q}</p>
            <div className="flex justify-between text-xs text-gray-400 px-1 mb-2">
              <span>전혀 아님</span>
              <span>매우 자주</span>
            </div>
            <div className="flex justify-between items-center space-x-2">
              {[0, 1, 2, 3, 4].slice(0, test.id === 'attachment' || test.id === 'defense' ? 3: 5).map(score => (
                <button 
                  key={score}
                  onClick={() => handleAnswer(i, score)}
                  className={`w-10 h-10 rounded-full transition-transform transform ${answers[i] === score ? 'bg-indigo-500 scale-110' : 'bg-gray-700 hover:bg-gray-600'}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <button 
            onClick={handleSubmit} 
            disabled={answers.some(a => a === -1)}
            className="w-full px-4 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-200 transition disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
            결과 보기
        </button>
      </div>
    </div>
  );
}

const TestResultHistory: React.FC<{
    test: Test,
    results: PsychologicalTestResult[],
    onBack: () => void,
    onRetry: () => void,
    onDelete: (id: string) => void,
}> = ({ test, results, onBack, onRetry, onDelete }) => {
    const latestResult = results[0];

    const getInterpretation = (score: number) => {
        return test.interpretations.find(interp => score <= interp.score) || test.interpretations[test.interpretations.length - 1];
    }
    const interpretation = getInterpretation(latestResult.score);

    const displayResults = useMemo(() => {
        return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [results]);


    const monthLabels = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    const chartData = useMemo(() => {
        const monthlyData = displayResults.reduce((acc, result) => {
            const month = new Date(result.date).getMonth();
            if (!acc[month]) {
                acc[month] = { totalScore: 0, count: 0 };
            }
            acc[month].totalScore += result.score;
            acc[month].count++;
            return acc;
        }, [] as { totalScore: number, count: number }[]);

        return monthLabels.map((name, index) => {
            const data = monthlyData[index];
            const avgScore = data ? Math.round(data.totalScore / data.count) : null;
            return { name: `${index + 1}월`, score: avgScore };
        });
    }, [displayResults]);


    return (
        <div className="animate-fade-in-up">
            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6 text-center">
                 <GaugeChart score={latestResult.score} maxScore={test.maxScore} />
                 <p className="mt-2">
                    <span className="text-6xl font-bold text-white">{latestResult.score}</span>
                    <span className="text-2xl text-gray-400 font-medium"> / {test.maxScore}</span>
                 </p>
                 <p className="font-bold text-lg text-indigo-300">{interpretation.level}</p>
                 <p className="text-gray-300 mt-4 leading-relaxed">{interpretation.description}</p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl shadow-lg mb-6">
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                            <YAxis domain={[0, test.maxScore]} stroke="#9ca3af" fontSize={12} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '0.5rem' }}
                                labelStyle={{ color: '#d1d5db' }}
                            />
                            <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={2} connectNulls>
                                <LabelList dataKey="score" position="top" fill="#d1d5db" fontSize={12} />
                            </Line>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <button onClick={onRetry} className="text-center w-full text-indigo-400 font-semibold py-3 hover:text-indigo-300 transition">
                ↻ 기록 전체 삭제 후 다시하기
            </button>
            
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">모든 결과</h2>
                <div className="space-y-3">
                    {displayResults.map(r => (
                         <div key={r.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">{new Date(r.date).toLocaleDateString('ko-KR')}</p>
                                <p className="text-white font-bold">{getInterpretation(r.score).level} <span className="text-gray-300 font-normal">({r.score}점)</span></p>
                            </div>
                            <button onClick={() => onDelete(r.id)} className="text-gray-500 hover:text-red-400 p-2">
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="w-full mt-8">
                <button onClick={onBack} className="w-full py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-200 transition">
                    확인 완료
                </button>
            </div>
        </div>
    )
}

const PsychologicalTests: React.FC = () => {
  const context = useContext(AppContext);
  const { psychTestResults, addPsychTestResult, deletePsychTestResult } = context!;
  
  const [currentView, setCurrentView] = useState<'list' | 'runner' | 'history'>('list');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const handleStartTest = (test: Test) => {
    setSelectedTest(test);
    setCurrentView('runner');
  };

  const handleShowHistory = (test: Test) => {
    setSelectedTest(test);
    setCurrentView('history');
  }

  const handleTestComplete = (result: PsychologicalTestResult) => {
    addPsychTestResult(result);
    setCurrentView('history');
  };
  
  const handleDeleteResult = (id: string) => {
    if (window.confirm('이 기록을 정말 삭제하시겠어요?')) {
        deletePsychTestResult(id);
        if (psychTestResults.filter(r => r.testId === selectedTest?.id).length === 1) {
            setCurrentView('list');
            setSelectedTest(null);
        }
    }
  }

  const handleRetryTest = (testId: string) => {
    const testName = PSYCH_TESTS.find(t => t.id === testId)?.name;
    if (window.confirm(`${testName} 기록을 모두 삭제하고 다시 시작하시겠어요?`)) {
        const resultsToDelete = psychTestResults.filter(r => r.testId === testId);
        resultsToDelete.forEach(r => deletePsychTestResult(r.id));
        setCurrentView('runner');
    }
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedTest(null);
  }

  const renderContent = () => {
    switch(currentView) {
        case 'runner':
            return selectedTest && <TestRunner test={selectedTest} onComplete={handleTestComplete} />;
        case 'history':
            const relevantResults = psychTestResults
                .filter(r => r.testId === selectedTest?.id)
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            return selectedTest && <TestResultHistory 
                test={selectedTest} 
                results={relevantResults}
                onBack={handleBack}
                onRetry={() => selectedTest && handleRetryTest(selectedTest.id)}
                onDelete={handleDeleteResult}
            />;
        case 'list':
        default:
            return (
                <div>
                  <p className="text-gray-400 my-8 text-center">간단한 자가 평가를 통해 현재 마음 상태를 점검해보세요. 이 검사는 전문적인 진단을 대체할 수 없습니다.</p>
                  <div className="grid grid-cols-2 gap-4">
                    {PSYCH_TESTS.map(test => {
                      const latestResult = psychTestResults
                        .filter(r => r.testId === test.id)
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

                      if (latestResult) {
                        const interpretation = test.interpretations.find(interp => latestResult.score <= interp.score) || test.interpretations[test.interpretations.length - 1];
                        return (
                          <div key={test.id} onClick={() => handleShowHistory(test)} className="bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col justify-between aspect-square cursor-pointer hover:bg-gray-700 transition">
                            <div>
                                <h2 className="text-lg font-bold text-white">{test.name}</h2>
                            </div>
                            <div className="text-center">
                                <GaugeChart score={latestResult.score} maxScore={test.maxScore} />
                                <p className="mt-2">
                                    <span className="text-4xl font-bold">{latestResult.score}</span>
                                    <span className="text-lg text-gray-400"> / {test.maxScore}</span>
                                </p>
                                <p className="text-sm font-semibold text-gray-300">{interpretation.level}</p>
                            </div>
                          </div>
                        )
                      } else {
                        return (
                          <div key={test.id} onClick={() => handleStartTest(test)} className="bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col justify-between aspect-square cursor-pointer hover:bg-gray-700 transition">
                            <div>
                               <h2 className="text-lg font-bold text-white">{test.name}</h2>
                            </div>
                            <div className="flex-grow flex items-center justify-center">
                               <div className="w-full h-full border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center text-indigo-400">
                                  <span className="text-4xl font-light">+</span>
                                  <p className="font-semibold mt-1">시작하기</p>
                               </div>
                            </div>
                          </div>
                        )
                      }
                    })}
                  </div>
                </div>
            )
    }
  }
  
  const getTitle = () => {
    if (!selectedTest) return '심리 검사';
    switch (currentView) {
        case 'history': return `월간 ${selectedTest.name}`;
        case 'runner': return selectedTest.name;
        default: return '심리 검사';
    }
  };

  return (
    <div className="p-4">
        <div className="relative flex items-center justify-center h-12 mb-4">
            {currentView !== 'list' && (
                <button onClick={handleBack} className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl p-2 -ml-2 font-light text-gray-400 hover:text-white transition-colors">‹</button>
            )}
            <h1 className="text-xl font-bold text-gray-300">{getTitle()}</h1>
        </div>
        {renderContent()}
    </div>
  );
};

export default PsychologicalTests;
