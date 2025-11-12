import React from 'react';

type View = 'path' | 'scenarios' | 'profile';

interface BottomNavBarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const PathIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
    </svg>
);

const ScenariosIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const ProfileIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`w-6 h-6 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const NavItem: React.FC<{ label: string; isActive: boolean; onClick: () => void; children: React.ReactNode }> = ({ label, isActive, onClick, children }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full gap-1 p-2 focus:outline-none">
        {children}
        <span className={`text-xs ${isActive ? 'text-indigo-400 font-semibold' : 'text-slate-400'}`}>{label}</span>
    </button>
);


export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="w-full bg-slate-800/90 backdrop-blur-sm border-t border-slate-700 flex-shrink-0 pb-2 sm:pb-0">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        <NavItem label="My Path" isActive={currentView === 'path'} onClick={() => onNavigate('path')}>
            <PathIcon isActive={currentView === 'path'} />
        </NavItem>
        <NavItem label="All Scenarios" isActive={currentView === 'scenarios'} onClick={() => onNavigate('scenarios')}>
            <ScenariosIcon isActive={currentView === 'scenarios'} />
        </NavItem>
        <NavItem label="My Progress" isActive={currentView === 'profile'} onClick={() => onNavigate('profile')}>
            <ProfileIcon isActive={currentView === 'profile'} />
        </NavItem>
      </div>
    </nav>
  );
};