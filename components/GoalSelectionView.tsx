import React, { useState } from 'react';

interface GoalSelectionViewProps {
  onContinue: (goals: string[]) => void;
}

const goals = [
  { id: 'job-interview', name: 'Ace Job Interviews', icon: '💼' },
  { id: 'public-speaking', name: 'Improve Public Speaking', icon: '🎤' },
  { id: 'conflict-resolution', name: 'Handle Difficult Conversations', icon: '🤝' },
  { id: 'negotiation', name: 'Negotiate with Confidence', icon: '💰' },
  { id: 'career-development', name: 'Grow in Your Career', icon: '🚀' },
  { id: 'customer-service', name: 'Excel in Customer Service', icon: '🎧' },
];

export const GoalSelectionView: React.FC<GoalSelectionViewProps> = ({ onContinue }) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const toggleGoal = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 text-center animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-2">What are your goals?</h1>
      <p className="text-lg text-slate-400 mb-8">Select one or more areas you'd like to improve in. We'll tailor your practice scenarios accordingly.</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {goals.map(goal => (
          <button
            key={goal.id}
            onClick={() => toggleGoal(goal.id)}
            className={`p-6 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900
              ${selectedGoals.includes(goal.id)
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-slate-800 border-slate-700 hover:border-indigo-500 hover:bg-slate-700'
              }`}
          >
            <div className="text-4xl mb-2">{goal.icon}</div>
            <span className="font-semibold">{goal.name}</span>
          </button>
        ))}
      </div>
      
      <button
        onClick={() => onContinue(selectedGoals)}
        disabled={selectedGoals.length === 0}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-10 rounded-full transition-colors duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
};
