import React from 'react';
import { ProfileView } from './ProfileView';

interface ProfileManagerProps {
    onSelectScenario: (scenarioId: string) => void;
}

export const ProfileManager: React.FC<ProfileManagerProps> = ({ onSelectScenario }) => {
    return (
        <div className="w-full h-full p-4">
            <ProfileView onSelectScenario={onSelectScenario} />
        </div>
    );
};