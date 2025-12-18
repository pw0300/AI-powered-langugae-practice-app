
import React from 'react';
import { useUserPreferences } from '../contexts/UserContext';

const rates = [
  { label: 'Slower', value: 0.8 },
  { label: 'Normal', value: 1.0 },
  { label: 'Faster', value: 1.2 },
];

export const SpeechRateControl: React.FC = () => {
  const { speechRate, setSpeechRate } = useUserPreferences();

  return (
    <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-full">
        <span className="text-xs text-slate-400 font-semibold pl-2">Speech Rate</span>
        {rates.map(rate => (
            <button
            key={rate.label}
            onClick={() => setSpeechRate(rate.value)}
            className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors duration-200 ${
                speechRate === rate.value
                ? 'bg-indigo-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
            >
            {rate.label}
            </button>
        ))}
    </div>
  );
};
