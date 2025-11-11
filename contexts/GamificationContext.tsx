import React, { createContext, useContext } from 'react';
import { useGamification } from '../hooks/useGamification';

type GamificationContextType = ReturnType<typeof useGamification>;

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gamificationState = useGamification();

  return (
    <GamificationContext.Provider value={gamificationState}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamificationContext = (): GamificationContextType => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
};
