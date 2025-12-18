
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

interface UserPreferences {
  language: string | null;
  goals: string[];
  level: string;
  speechRate: number;
  isOnboardingComplete: boolean;
  isQuickStartComplete: boolean;
}

interface UserPreferencesContextType extends UserPreferences {
  setLanguage: (language: string) => void;
  setInitialPreferences: (goals: string[], level: string) => void;
  setSpeechRate: (rate: number) => void;
  completeQuickStart: () => void;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: UserPreferences = {
    language: null,
    goals: [],
    level: 'Beginner',
    speechRate: 1.0,
    isOnboardingComplete: false,
    isQuickStartComplete: false,
};

export const UserPreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    return getStorageItem('userPreferences', DEFAULT_PREFERENCES);
  });

  useEffect(() => {
    setStorageItem('userPreferences', preferences);
  }, [preferences]);

  const setLanguage = useCallback((language: string) => {
    setPreferences(prev => ({ ...prev, language }));
  }, []);

  const setInitialPreferences = useCallback((goals: string[], level: string) => {
    setPreferences(prev => ({ ...prev, goals, level, isOnboardingComplete: true }));
  }, []);

  const setSpeechRate = useCallback((rate: number) => {
    setPreferences(prev => ({ ...prev, speechRate: rate }));
  }, []);

  const completeQuickStart = useCallback(() => {
    setPreferences(prev => ({ ...prev, isQuickStartComplete: true }));
  }, []);

  const value = {
    ...preferences,
    setLanguage,
    setInitialPreferences,
    setSpeechRate,
    completeQuickStart,
  };

  return (
    <UserPreferencesContext.Provider value={value}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = (): UserPreferencesContextType => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
