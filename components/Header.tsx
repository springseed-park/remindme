import React from 'react';

interface HeaderProps {
  title: string;
  onCalendarClick: () => void;
  onChatClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onCalendarClick, onChatClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 max-w-md mx-auto h-16 bg-gray-900/90 backdrop-blur-sm z-30 flex items-center justify-between px-4 border-b border-gray-800">
      <h1 className="text-2xl font-bold text-white">{title}</h1>
      <div className="flex items-center space-x-2">
        <button onClick={onCalendarClick} className="p-2 text-gray-300 hover:text-white transition-colors" aria-label="달력 보기">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <button onClick={onChatClick} className="p-2 text-gray-300 hover:text-white transition-colors" aria-label="AI와 대화하기">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;