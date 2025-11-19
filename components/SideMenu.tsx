import React, { useContext } from 'react';
import { View } from '../types';
import { AppContext } from '../App';

const NavIcon = ({
  path,
  active,
}: {
  path: string;
  active: boolean;
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={`h-6 w-6 mb-1 transition-colors ${active ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

const BottomNav: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) return null;
  const { view, setView } = context;

  const navItems = [
    {
      view: View.MAIN,
      label: '메인',
      path: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    },
    {
      view: View.MAILBOX,
      label: '편지함',
      path: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      view: View.ANALYTICS,
      label: '분석',
      path: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    },
    {
      view: View.PSYCH_TESTS,
      label: '심리검사',
      path: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    },
    {
      view: View.SHOPPING,
      label: '힐링샵',
      path: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 bg-gray-900/90 backdrop-blur-sm z-40 flex items-center justify-around border-t border-gray-800">
      {navItems.map(item => (
        <button
          key={item.view}
          onClick={() => setView(item.view)}
          className="flex flex-col items-center justify-center text-xs transition-colors group w-1/5 pt-3 pb-2 h-full"
          aria-current={view === item.view ? 'page' : undefined}
        >
          <NavIcon path={item.path} active={view === item.view} />
          <span className={`font-medium ${view === item.view ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}>
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav;