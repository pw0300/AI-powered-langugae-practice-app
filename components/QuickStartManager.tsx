import React, { useState } from 'react';
import { QuickStartView } from './QuickStartView';
import { OnboardingPromptView } from './OnboardingPromptView';
import { OnboardingManager } from './OnboardingManager';
import { useUserPreferences } from '../contexts/UserPreferencesContext';

interface QuickStartManagerProps {
    onComplete: () => void;
}

type QuickStartStep = 'practice' | 'prompt' | 'onboarding';

export const QuickStartManager: React.FC<QuickStartManagerProps> = ({ onComplete }) => {
    const [step, setStep] = useState<QuickStartStep>('practice');
    const { setInitialPreferences } = useUserPreferences();

    const handlePracticeComplete = () => {
        setStep('prompt');
    };

    const handleStartOnboarding = () => {
        setStep('onboarding');
    };
    
    const handleOnboardingComplete = (goals: string[], level: string) => {
        setInitialPreferences(goals, level);
        onComplete();
    }

    if (step === 'practice') {
        return <QuickStartView onComplete={handlePracticeComplete} />;
    }

    if (step === 'prompt') {
        return <OnboardingPromptView onContinue={handleStartOnboarding} />;
    }
    
    if (step === 'onboarding') {
        return <OnboardingManager onComplete={handleOnboardingComplete} />;
    }

    return null;
};