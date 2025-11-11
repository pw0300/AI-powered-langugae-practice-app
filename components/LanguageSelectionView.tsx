import React from 'react';

interface LanguageSelectionViewProps {
  onSelect: (language: string) => void;
}

const languages = [
  { code: 'English', name: 'English' },
  { code: 'Spanish', name: 'Español' },
  { code: 'French', name: 'Français' },
  { code: 'German', name: 'Deutsch' },
  { code: 'Japanese', name: '日本語' },
];

export const LanguageSelectionView: React.FC<LanguageSelectionViewProps> = ({ onSelect }) => {
  return (
    <main className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md mx-auto p-4 text-center animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Welcome!</h1>
            <p className="text-lg text-slate-400 mb-8">Please select your practice language.</p>
            
            <div className="space-y-3">
                {languages.map(lang => (
                <button
                    key={lang.code}
                    onClick={() => onSelect(lang.code)}
                    className="w-full text-center p-4 bg-slate-800/70 rounded-lg border border-slate-700 hover:bg-slate-700/80 hover:border-indigo-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <span className="text-lg font-semibold">{lang.name}</span>
                </button>
                ))}
            </div>
        </div>
    </main>
  );
};