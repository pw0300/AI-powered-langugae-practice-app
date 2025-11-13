import React from 'react';
import { SpeechRateControl } from './SpeechRateControl';

interface PracticeHeaderProps {
  title: string;
  currentTurn: number;
  totalTurns: number;
  onBack: () => void;
  onCustomize: () => void;
  personalizedGoal: string | null;
}

const BackIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
);

const CustomizeIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

const goalDisplayNames: { [key: string]: string } = {
  'job-interview': 'Job Interviews',
  'public-speaking': 'Public Speaking',
  'conflict-resolution': 'Difficult Conversations',
  'negotiation': 'Negotiation',
  'career-development': 'Career Development',
  'customer-service': 'Customer Service',
};

export const PracticeHeader: React.FC<PracticeHeaderProps> = ({ title, currentTurn, totalTurns, onBack, onCustomize, personalizedGoal }) => {
  const progress = Math.min(currentTurn, totalTurns);

  return (
    <header className="flex-shrink-0 w-full bg-slate-900/80 backdrop-blur-sm z-10">
      <div className="flex items-center justify-between py-2 border-b border-slate-700">
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors p-2 rounded-md">
            <BackIcon className="w-5 h-5" />
            <span className="hidden sm:inline">End Practice</span>
        </button>
        <button onClick={onCustomize} className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors p-2 rounded-md">
            <CustomizeIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Customize Persona</span>
        </button>
      </div>
       <div className="text-center pt-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-100">{title}</h2>
           {personalizedGoal && (
            <div className="flex items-center justify-center mt-2">
              <span className="text-xs bg-indigo-600/50 text-indigo-300 font-semibold px-2 py-1 rounded-full">
                ✨ Personalized for: {goalDisplayNames[personalizedGoal] || personalizedGoal}
              </span>
            </div>
          )}
          <p className="text-sm text-slate-400 mt-2">Your Turn: {progress} of {totalTurns}</p>
        </div>
        <div className="flex justify-center pt-4">
          <SpeechRateControl />
        </div>
    </header>
  );
};