import React, { useState, useEffect } from 'react';
import type { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Animate in
    setShow(true);

    // Animate out and close after a delay
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 500); // Wait for fade-out animation
    }, 4500);

    return () => clearTimeout(timer);
  }, [achievement, onClose]);

  return (
    <div
      className={`fixed bottom-5 right-5 w-80 bg-slate-800 border-2 border-amber-500 rounded-lg shadow-2xl p-4 transition-all duration-500 ease-in-out z-50 ${
        show ? 'transform translate-y-0 opacity-100' : 'transform translate-y-10 opacity-0'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="text-4xl">{achievement.icon}</div>
        <div>
          <h4 className="font-bold text-amber-400">Achievement Unlocked!</h4>
          <p className="font-semibold text-sm text-slate-100">{achievement.name}</p>
          <p className="text-xs text-slate-400 mt-1">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
};