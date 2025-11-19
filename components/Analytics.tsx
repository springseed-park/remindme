
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../App';
import { DiaryEntry } from '../types';

// Helper component for section titles
const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode; }> = ({ title, subtitle, children }) => (
  <div className="mb-10">
    <div className="flex justify-between items-center mb-4">
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);


const Analytics: React.FC = () => {
  const context = useContext(AppContext);
  const { diaryEntries } = context!;

  const keywordRankData = useMemo(() => {
    const positiveKeywords = new Map<string, number>();
    const negativeKeywords = new Map<string, number>();
    const neutralKeywords = new Map<string, number>();
    let totalKeywordOccurrences = 0;

    diaryEntries.forEach(entry => {
        totalKeywordOccurrences += entry.detailedEmotions.length;
        entry.detailedEmotions.forEach(keyword => {
            if (entry.mood > 2) { // Positive
                positiveKeywords.set(keyword, (positiveKeywords.get(keyword) || 0) + 1);
            } else if (entry.mood < 2) { // Negative
                negativeKeywords.set(keyword, (negativeKeywords.get(keyword) || 0) + 1);
            } else { // Neutral
                neutralKeywords.set(keyword, (neutralKeywords.get(keyword) || 0) + 1);
            }
        });
    });
    
    if (totalKeywordOccurrences === 0) return [];

    const getTopKeywords = (map: Map<string, number>, count: number, moodValue: number) => {
        return Array.from(map.entries())
            .sort((a, b) => b[1] - a[1]) // sort by count desc
            .slice(0, count)
            .map(([name, keywordCount]) => ({
                name,
                mood: moodValue,
                percentage: (keywordCount / totalKeywordOccurrences) * 100,
                count: keywordCount,
            }));
    };

    const topPositive = getTopKeywords(positiveKeywords, 2, 4);
    const topNegative = getTopKeywords(negativeKeywords, 2, 0);
    const topNeutral = getTopKeywords(neutralKeywords, 1, 2);
    
    const combined = [...topPositive, ...topNegative, ...topNeutral];

    // Sort by count and take top 5 overall
    return combined.sort((a, b) => b.count - a.count).slice(0, 5);
  }, [diaryEntries]);

  const frequentFactorData = useMemo(() => {
    // Factor (Keyword) -> Count
    const factorCounts = new Map<string, number>();
    // Factor (Keyword) -> Related Emotions
    const factorToEmotions = new Map<string, string[]>();

    diaryEntries.forEach(entry => {
        // Use Set to count unique factors per entry
        const uniqueFactors = Array.from(new Set(entry.keywords));
        
        uniqueFactors.forEach((factor: string) => {
            factorCounts.set(factor, (factorCounts.get(factor) || 0) + 1);
            
            if (!factorToEmotions.has(factor)) {
                factorToEmotions.set(factor, []);
            }
            factorToEmotions.get(factor)!.push(...entry.detailedEmotions);
        });
    });

    // Sort by factor frequency
    const sortedFactors = [...factorCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6); // Top 6 factors
    
    return sortedFactors.map(([factor, count]) => {
        const emotions = factorToEmotions.get(factor) || [];
        const emotionCounts = new Map<string, number>();
        emotions.forEach(emo => emotionCounts.set(emo, (emotionCounts.get(emo) || 0) + 1));
        
        // Top 3 emotions for this factor
        const topEmotions = [...emotionCounts.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(k => k[0]);

        return {
            factor,
            count,
            relatedEmotions: topEmotions,
        };
    });
  }, [diaryEntries]);
  
  const completedQuestsData = useMemo(() => {
    // Initialize counts with 0 for default types to ensure they appear
    const counts: Record<string, number> = {
        '행동하기': 0,
        '쓰기': 0,
        '생각하기': 0
    };

    diaryEntries.forEach(entry => {
        if (entry.quest?.isComplete && entry.quest.type) {
            const type = entry.quest.type;
            // If it's a standard type or a new one, count it
            counts[type] = (counts[type] || 0) + 1;
        }
    });
    
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [diaryEntries]);

  const recentCompletedQuests = useMemo(() => {
    return diaryEntries
        .filter(entry => entry.quest?.isComplete)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
  }, [diaryEntries]);


  return (
    <div className="p-4 pb-8">
      <h1 className="text-xl font-bold text-center text-gray-300 py-2 mb-4">감정분석 리포트</h1>
      <div className="flex flex-col items-center text-center mb-10">
        <p className="text-2xl font-bold text-white">
            <span className="text-indigo-400">{diaryEntries.length}번</span>의 기록에서 발견한
        </p>
        <p className="text-2xl font-bold text-white">나의 마음 패턴이에요</p>
      </div>
      
      <Section title="키워드로 보는 마음" subtitle="자주 기록한 감정 키워드와 관련 기분을 확인해요">
        <div>
            {keywordRankData.length > 0 ? (
                <div className="space-y-4 bg-gray-800 p-4 rounded-2xl">
                    {keywordRankData.map((item, index) => {
                        const getMoodColor = (mood: number) => {
                            // HSL: Hue from blue (240) to yellow (60)
                            const hue = 240 - (mood / 4) * 180;
                            return `hsl(${hue}, 70%, 55%)`;
                        };

                        return (
                            <div key={item.name} className="flex items-center gap-4 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                                <p className="text-xl font-bold text-gray-500 w-6 text-center">{index + 1}</p>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="font-bold text-white">{item.name}</p>
                                        <p className="text-sm font-semibold text-gray-300">{item.percentage.toFixed(0)}%</p>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                        <div 
                                            className="h-2 rounded-full"
                                            style={{ 
                                                width: `${item.percentage}%`,
                                                backgroundColor: getMoodColor(item.mood) 
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center h-[180px]">
                    <p className="text-gray-400">데이터가 부족하여 키워드 분포를 표시할 수 없어요.</p>
                </div>
            )}
             {keywordRankData.length > 0 && (
                <div className="flex items-center justify-between gap-2 mt-4 text-xs text-gray-400 max-w-xs mx-auto">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'hsl(240, 70%, 55%)'}}></div>
                        <span>부정</span>
                    </div>
                    <div className="flex-1 h-1.5 rounded-full bg-gradient-to-r from-[hsl(240,70%,55%)] via-[hsl(150,70%,55%)] to-[hsl(60,70%,55%)]"></div>
                    <div className="flex items-center gap-1">
                        <span>긍정</span>
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: 'hsl(60, 70%, 55%)'}}></div>
                    </div>
                </div>
            )}
        </div>
      </Section>
      
      <Section title="자주 등장하는 감정 요인" subtitle="어떤 상황에서 주로 감정을 느꼈는지 확인해요">
        <div className="grid grid-cols-2 gap-3">
            {frequentFactorData.length > 0 ? frequentFactorData.map((item, i) => (
                <div key={item.factor} className="bg-gray-800 p-4 rounded-xl flex flex-col justify-between animate-fade-in-up" style={{ animationDelay: `${i * 100}ms`, minHeight: '120px' }}>
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <p className="font-bold text-white text-lg truncate pr-2">{item.factor}</p>
                            <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full flex-shrink-0">{item.count}회</span>
                        </div>
                        <div className="w-full h-px bg-gray-700 mb-3"></div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {item.relatedEmotions.map(emo => (
                            <span key={emo} className="text-xs bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 px-2 py-1 rounded-md">
                                {emo}
                            </span>
                        ))}
                    </div>
                </div>
            )) : (
              <div className="col-span-2 text-center text-gray-500 py-8 bg-gray-800 rounded-xl">
                  <p>기록된 요인이 아직 부족해요.</p>
                  <p className="text-sm mt-1">일기를 작성하여 나만의 패턴을 찾아보세요.</p>
              </div>
            )}
        </div>
      </Section>

      <Section title="완료한 퀘스트" subtitle="퀘스트를 이만큼 완료했어요">
        <div className="grid grid-cols-3 gap-3 mb-8">
            {completedQuestsData.map(q => (
                <div key={q.name} className="bg-gray-800 p-4 rounded-xl text-center flex flex-col items-center justify-center shadow-lg border border-gray-700/50">
                    <p className="text-sm font-medium text-gray-400 mb-2">{q.name}</p>
                    <p className="text-3xl font-bold text-white">{q.count}</p>
                </div>
            ))}
        </div>

        <div>
            <h3 className="text-white font-bold mb-4 text-lg">최근 완료한 퀘스트</h3>
            <div className="space-y-3">
                {recentCompletedQuests.length > 0 ? recentCompletedQuests.map((entry, i) => (
                    <div key={entry.id} className="bg-gray-800 p-4 rounded-xl flex items-center gap-4 animate-fade-in-up shadow-md border border-gray-700/30" style={{ animationDelay: `${i * 50}ms` }}>
                         <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-700/80 flex items-center justify-center text-xl">
                            {entry.quest?.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <p className="font-bold text-white truncate pr-2">{entry.quest?.title}</p>
                                <p className="text-xs text-gray-500 flex-shrink-0 mt-0.5">{new Date(entry.date).toLocaleDateString()}</p>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                                {entry.quest?.type} · {entry.quest?.duration}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center text-gray-500 py-8 bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
                        <p>아직 완료한 퀘스트가 없어요.</p>
                    </div>
                )}
            </div>
        </div>
      </Section>

    </div>
  );
};

export default Analytics;
