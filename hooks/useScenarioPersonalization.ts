import { useState } from 'react';
import { personalizeScenario } from '../services/geminiService';
import { useUserPreferences } from '../contexts/UserPreferencesContext';
import type { Scenario } from '../types';

interface UseScenarioPersonalizationProps {
    onSelectScenario: (scenario: Scenario, personalizedGoal: string | null) => void;
}

export const useScenarioPersonalization = ({ onSelectScenario }: UseScenarioPersonalizationProps) => {
    const [personalizingScenarioId, setPersonalizingScenarioId] = useState<string | null>(null);
    const { goals, level, language } = useUserPreferences();

    const personalizeAndSelectScenario = async (template: Scenario) => {
        setPersonalizingScenarioId(template.id);
        
        const { scenario: personalized, personalizedGoal } = await personalizeScenario(template, goals, level, language!);
        
        onSelectScenario(personalized, personalizedGoal);
        // The component will unmount, no need to reset state.
    };

    return {
        personalizingScenarioId,
        personalizeAndSelectScenario,
    };
};
