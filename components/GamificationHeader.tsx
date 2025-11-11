import React from 'react';
import { useGamificationContext } from '../contexts/GamificationContext';

const StreakIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071 1.071l9.293 9.293-1.071 1.071-9.293-9.293a.75.75 0 0 0-1.071 1.071l9.293 9.293-1.071 1.071-9.293-9.293a.75.75 0 0 0-1.071 1.071l9.293 9.293-1.071 1.071-9.293-9.293a.75.75 0 0 0-1.071 1.071l9.293 9.293a.75.75 0 0 0 1.071-1.071l-9.293-9.293a.75.75 0 0 0-1.071-1.071l-1.515 1.515a.75.75 0 0 0 0 1.071l.172.172a.75.75 0 0 0 1.071 0l.172-.172.172.172a.75.75 0 0 0 1.071 0l.172-.172.172.172a.75.75 0 0 0 1.071 0l.172-.172.172.172a.75.75 0 0 0 1.071 0l.172-.172a.75.75 0 0 0 0-1.071l-.172-.172a.75.75 0 0 0-1.071 0l-.172.172-.172-.172a.75.75 0 0 0-1.071 0l-.172.172-.172-.172a.75.75 0 0 0-1.071 0l-.172.172a.75.75 0 0 0 0 1.071l.172.172a.75.75 0 0 0 1.071 0l.172-.172.172.172a.75.75 0 0 0 1.071 0l.172-.172.172.172a.75.75 0 0 0 1.071 0l1.515-1.515a.75.75 0 0 0-1.071-1.071L12.963 2.286Z" clipRule="evenodd" />
    </svg>
);

export const GamificationHeader: React.FC = () => {
    const gamification = useGamificationContext();
    const { level, levelName, streak, xpInCurrentLevel, xpForNextLevel } = gamification;
    const progressPercent = (xpInCurrentLevel / xpForNextLevel) * 100;

    return (
        <div className="mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-slate-400">Level {level}</p>
                    <h1 className="text-xl font-bold text-white">{levelName}</h1>
                </div>
                {streak > 0 && (
                     <div className="flex items-center gap-2 text-orange-400 bg-orange-400/20 px-3 py-1 rounded-full">
                        <StreakIcon className="w-5 h-5" />
                        <span className="font-bold text-sm">{streak} Day Streak</span>
                    </div>
                )}
            </div>
            <div className="mt-3">
                 <div className="flex justify-between items-center mb-1 text-xs text-slate-400">
                    <span>Progress</span>
                    <span>{xpInCurrentLevel} / {xpForNextLevel} XP</span>
                 </div>
                 <div className="w-full bg-slate-700 rounded-full h-2">
                    <div className="bg-indigo-500 h-2 rounded-full" style={{width: `${progressPercent}%`}}></div>
                 </div>
            </div>
        </div>
    );
};