import React from 'react';

interface LanguageSelectionViewProps {
  onSelect: (language: string) => void;
}

const languages = [
  { code: 'English', name: 'English', flag: '🇬🇧' },
  { code: 'Spanish', name: 'Español', flag: '🇪🇸' },
  { code: 'French', name: 'Français', flag: '🇫🇷' },
  { code: 'German', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'Japanese', name: '日本語', flag: '🇯🇵' },
];

export const LanguageSelectionView: React.FC<LanguageSelectionViewProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Welcome to <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Confident Communicator</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-lg mx-auto leading-relaxed">
            Master conversations with AI-powered practice in your target language
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Choose Your Practice Language</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                className="group relative overflow-hidden p-6 bg-slate-700/30 rounded-xl border-2 border-slate-600/50 hover:border-blue-500/60 hover:bg-slate-700/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105 active:scale-95"
              >
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-4xl">{lang.flag}</span>
                  <span className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {lang.name}
                  </span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-slate-500 mt-8 text-sm">
          You can change this later in settings
        </p>
      </div>
    </div>
  );
};