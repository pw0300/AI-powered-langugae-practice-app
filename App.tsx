
import React from 'react';
import { OnboardingManager } from './components/OnboardingManager';
import { LanguageSelectionView } from './components/LanguageSelectionView';
import { UserPreferencesProvider, useUserPreferences } from './contexts/UserContext';
import { GamificationProvider } from './contexts/GamificationContext';
import { ToastProvider } from './contexts/ToastContext';
import { ConversationManager } from './components/ConversationManager';
import { QuickStartManager } from './components/QuickStartManager';

const AppContent: React.FC = () => {
  const { 
      isOnboardingComplete, 
      setInitialPreferences,
      language,
      setLanguage,
      isQuickStartComplete,
      completeQuickStart,
   } = useUserPreferences();

  if (!language) {
      return <LanguageSelectionView onSelect={setLanguage} />;
  }
  
  if (!isQuickStartComplete) {
    return <QuickStartManager onComplete={completeQuickStart} />;
  }

  if (!isOnboardingComplete) {
    return <OnboardingManager onComplete={setInitialPreferences} />;
  }
  
  return <ConversationManager />;
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <UserPreferencesProvider>
        <GamificationProvider>
          <div className="bg-slate-900 text-white h-screen font-sans">
            <AppContent />
          </div>
        </GamificationProvider>
      </UserPreferencesProvider>
    </ToastProvider>
  );
};

export default App;
