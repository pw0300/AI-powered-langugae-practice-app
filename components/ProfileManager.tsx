import React from 'react';
import { ProfileView } from './ProfileView';

interface ProfileManagerProps {
    onBack: () => void;
    onSelectScenario: (scenarioId: string) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ onBack, onSelectScenario }) => {
    return (
        <div className="w-full h-full p-4">
             <div className="flex items-center mb-6">
                <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors p-2 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                    </svg>
                    Back to Learning Path
                </button>
            </div>
            <ProfileView onSelectScenario={onSelectScenario} />
        </div>
    );
};
