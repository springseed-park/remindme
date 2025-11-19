
import React, { useState, useMemo, useRef } from 'react';
import { DiaryEntry } from '../types';
import { EMOTIONS } from '../constants';

const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() && 
    d1.getMonth() === d2.getMonth() && 
    d1.getDate() === d2.getDate();

const emotionCategoryMap: Map<string, keyof typeof EMOTIONS> = new Map();
Object.entries(EMOTIONS).forEach(([category, { items }]) => {
    items.forEach(item => {
        emotionCategoryMap.set(item, category as keyof typeof EMOTIONS);
    });
});

const emotionCategoryColors: { [key: string]: string } = {
    neutral: 'bg-cyan-500/50 text-cyan-200',
    positive: 'bg-amber-500/50 text-amber-200',
    negative: 'bg-indigo-500/50 text-indigo-200',
};

const EntryDetail: React.FC<{ entry: DiaryEntry }> = ({ entry }) => {
    const moodColors = ['border-red-400', 'border-orange-400', 'border-gray-400', 'border-blue-400', 'border-green-400'];

    return (
        <div className="bg-gray-800 p-4 rounded-lg space-y-4">
            <div className={`p-3 border-l-4 ${moodColors[entry.mood]} bg-gray-700/50 rounded-r-lg`}>
                <p className="font-bold text-white">" {entry.memo} "</p>
                <p className="text-sm text-gray-400 mt-1">나의 기록</p>
            </div>
            {entry.aiResponse && (
                <div className="p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-gray-200">{entry.aiResponse}</p>
                    <p className="text-sm text-gray-400 mt-1">AI 친구의 답장</p>
                </div>
            )}
            <div className="flex flex-wrap gap-2">
                {entry.detailedEmotions.map(e => {
                    const category = emotionCategoryMap.get(e) || 'neutral';
                    return <span key={e} className={`text-xs ${emotionCategoryColors[category]} px-2.5 py-1 rounded-md`}>{e}</span>
                })}
                {entry.keywords.map(k => <span key={k} className="text-xs bg-gray-600 text-gray-300 px-2.5 py-1 rounded-md">{k}</span>)}
            </div>
        </div>
    );
};

const CalendarModal: React.FC<{
    onClose: () => void;
    diaryEntries: DiaryEntry[];
}> = ({ onClose, diaryEntries }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const entriesByDate = useMemo(() => {
        const map = new Map<string, DiaryEntry[]>();
        diaryEntries.forEach(entry => {
            const dateStr = new Date(entry.date).toDateString();
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)!.push(entry);
            map.get(dateStr)!.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        });
        return map;
    }, [diaryEntries]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        setSelectedDate(null);
    };
    
    const scrollToTop = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-start-${i}`} className="w-full aspect-square"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const entriesForDay = entriesByDate.get(date.toDateString());
            const entryCount = entriesForDay ? entriesForDay.length : 0;
            const isToday = isSameDay(date, new Date());
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

            const moodColors = ['bg-red-500', 'bg-orange-500', 'bg-gray-500', 'bg-blue-500', 'bg-green-500'];

            days.push(
                <div key={day} className="w-full aspect-square flex items-center justify-center p-0.5">
                    <button 
                        onClick={() => setSelectedDate(date)}
                        className={`w-full h-full rounded-full flex flex-col items-center justify-center transition-colors ${isSelected ? 'bg-indigo-500 text-white' : 'hover:bg-gray-700'}`}
                    >
                        <span className={`text-sm ${isToday && !isSelected ? 'font-bold text-indigo-300' : ''}`}>{day}</span>
                        {entryCount > 0 && (
                            <div className="flex items-center justify-center gap-0.5 mt-0.5">
                                {Array.from({ length: Math.min(entryCount, 3) }).map((_, i) => (
                                    <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white/70' : moodColors[entriesForDay![0].mood]}`}></div>
                                ))}
                            </div>
                        )}
                    </button>
                </div>
            );
        }
        return days;
    };

    const selectedEntries = selectedDate ? entriesByDate.get(selectedDate.toDateString()) : null;

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-sm rounded-2xl shadow-lg flex flex-col animate-fade-in-up" style={{maxHeight: '90vh'}}>
                <header className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
                    <div className="flex items-center">
                        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-gray-700">‹</button>
                        <h2 className="text-lg font-bold w-32 text-center">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
                        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-gray-700">›</button>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-light">&times;</button>
                </header>
                <main ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 no-scrollbar scroll-smooth">
                    <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
                        {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>
                    {selectedDate && (
                        <div className="mt-4">
                            <h3 className="font-bold text-center text-white py-2 border-b border-gray-800 mb-4">{selectedDate.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' })}</h3>
                            {selectedEntries && selectedEntries.length > 0 ? (
                                <div className="space-y-4 pb-4">
                                    {selectedEntries.map(entry => (
                                        <EntryDetail key={entry.id} entry={entry} />
                                    ))}
                                    <button 
                                        onClick={scrollToTop}
                                        className="w-full py-3 mt-4 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg transition-colors"
                                    >
                                        ↑ 달력으로 이동
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 p-6">
                                    <p>이 날에는 기록이 없어요.</p>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default CalendarModal;
