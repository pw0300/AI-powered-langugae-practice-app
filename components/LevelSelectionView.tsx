import React, { useState } from 'react';

interface LevelSelectionViewProps {
  onContinue: (level: string) => void;
  onBack: () => void;
}

const levels = [
  { 
    name: 'Beginner', 
    description: "I'm new to this and want simple, straightforward scenarios." 
  },
  { 
    name: 'Intermediate', 
    description: "I have some experience but want to build more confidence." 
  },
  { 
    name: 'Advanced', 
    description: "I'm comfortable and ready for complex, nuanced challenges." 
  },
];

export const LevelSelectionView: React.FC<LevelSelectionViewProps> = ({ onContinue, onBack }) => {
    const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

    return (
        <div className="w-full max-w-2xl mx-auto p-4 text-center animate-fade-in">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">What's your current level?</h1>
            <p className="text-base sm:text-lg text-slate-400 mb-6 sm:mb-8">This helps us adjust the difficulty of the AI coach.</p>

            <div className="space-y-4 mb-8">
                {levels.map(level => (
                    <button
                        key={level.name}
                        onClick={() => setSelectedLevel(level.name)}
                        className={`w-full text-left p-4 sm:p-6 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105
                            ${selectedLevel === level.name
                                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 border-blue-500 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-slate-800 border-slate-700 hover:border-blue-500 hover:bg-slate-700'
                            }`}
                    >
                        <h2 className="font-bold text-lg">{level.name}</h2>
                        <p className="text-sm">{level.description}</p>
                    </button>
                ))}
            </div>

            <div className="flex justify-center items-center gap-4">
                <button
                    onClick={onBack}
                    className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-colors duration-200"
                >
                    Back
                </button>
                <button
                    onClick={() => selectedLevel && onContinue(selectedLevel)}
                    disabled={!selectedLevel}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 sm:px-8 rounded-full transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 transform hover:scale-105 disabled:transform-none disabled:shadow-none"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};