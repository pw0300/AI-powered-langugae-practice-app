import React from 'react';

interface OnboardingSummaryViewProps {
  goals: string[];
  level: string;
  onConfirm: () => void;
  onBack: () => void;
}

const goalDisplayNames: { [key: string]: string } = {
  'job-interview': 'Ace Job Interviews',
  'public-speaking': 'Improve Public Speaking',
  'conflict-resolution': 'Handle Difficult Conversations',
  'negotiation': 'Negotiate with Confidence',
  'career-development': 'Grow in Your Career',
  'customer-service': 'Excel in Customer Service',
};

const CheckIcon: React.FC = () => (
    <svg className="w-6 h-6 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);


export const OnboardingSummaryView: React.FC<OnboardingSummaryViewProps> = ({ goals, level, onConfirm, onBack }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4 text-center animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Great! Let's get started.</h1>
      <p className="text-base sm:text-lg text-slate-400 mb-6">We'll recommend scenarios based on your goals and level:</p>
      
      <div className="mb-8 p-4 sm:p-6 bg-slate-800/50 rounded-lg max-w-md mx-auto">
        <ul className="list-none space-y-3 text-left">
          {goals.map(goalId => (
            <li key={goalId} className="flex items-center gap-3">
              <CheckIcon />
              <span>{goalDisplayNames[goalId] || goalId}</span>
            </li>
          ))}
           <li className="flex items-center gap-3 pt-2 border-t border-slate-700/50">
              <CheckIcon />
              <span>Speaking Level: <strong>{level}</strong></span>
            </li>
        </ul>
      </div>
      
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={onBack}
          className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-colors duration-200"
        >
          Back
        </button>
        <button
          onClick={onConfirm}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-colors duration-200"
        >
          Start Practicing
        </button>
      </div>
    </div>
  );
};