import { useState, useEffect, useCallback } from 'react';
import type { Achievement, Scenario, Scorecard } from '../types';
import { achievements } from '../data/achievements';

const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5000];
const LEVEL_NAMES = ['Novice', 'Apprentice', 'Initiate', 'Adept', 'Expert', 'Master', 'Grandmaster', 'Legend', 'Virtuoso', 'Champion'];

const getLevelFromXp = (xp: number) => {
  let level = 1;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1;
      break;
    }
  }
  return level;
};

export const useGamification = () => {
  const [totalXp, setTotalXp] = useState<number>(() => parseInt(localStorage.getItem('totalXp') || '0', 10));
  const [streak, setStreak] = useState<number>(() => parseInt(localStorage.getItem('practiceStreak') || '0', 10));
  const [lastPracticeDate, setLastPracticeDate] = useState<string | null>(() => localStorage.getItem('lastPracticeDate'));
  const [unlockedAchievements, setUnlockedAchievements] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('unlockedAchievements') || '[]')
  );
  const [completedScenarios, setCompletedScenarios] = useState<Set<string>>(() =>
    new Set(JSON.parse(localStorage.getItem('completedScenarios') || '[]'))
  );

  const level = getLevelFromXp(totalXp);
  const levelName = LEVEL_NAMES[level - 1] || 'Champion';
  const currentLevelXpStart = LEVEL_THRESHOLDS[level - 1] || 0;
  const xpForNextLevel = (LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length-1]) - currentLevelXpStart;
  const xpInCurrentLevel = totalXp - currentLevelXpStart;

  useEffect(() => { localStorage.setItem('totalXp', totalXp.toString()); }, [totalXp]);
  useEffect(() => { localStorage.setItem('practiceStreak', streak.toString()); }, [streak]);
  useEffect(() => { if (lastPracticeDate) { localStorage.setItem('lastPracticeDate', lastPracticeDate); } }, [lastPracticeDate]);
  useEffect(() => { localStorage.setItem('unlockedAchievements', JSON.stringify(unlockedAchievements)); }, [unlockedAchievements]);
  useEffect(() => { localStorage.setItem('completedScenarios', JSON.stringify(Array.from(completedScenarios))); }, [completedScenarios]);

  const checkStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastPracticeDate) {
      const lastDate = new Date(lastPracticeDate);
      const todayDate = new Date(today);
      const diffTime = todayDate.getTime() - lastDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) setStreak(s => s + 1);
      else if (diffDays > 1) setStreak(1);
    } else {
      setStreak(1);
    }
    setLastPracticeDate(today);
  }, [lastPracticeDate]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastPracticeDate) {
        const lastDate = new Date(lastPracticeDate);
        const todayDate = new Date(today);
        const diffTime = todayDate.getTime() - lastDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 1) setStreak(0);
    }
  }, [lastPracticeDate]);

  const addXpAndCheckAchievements = useCallback((scorecard: Scorecard, scenario: Scenario): Achievement[] => {
    const xpGained = Math.round(scorecard.overallScore);
    setTotalXp(prevXp => prevXp + xpGained);
    setCompletedScenarios(prev => new Set(prev).add(scenario.id));
    checkStreak();
    const newlyUnlocked: Achievement[] = [];
    achievements.forEach(ach => {
      if (!unlockedAchievements.includes(ach.id) && ach.condition(scorecard, scenario)) {
        newlyUnlocked.push(ach);
      }
    });
    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked.map(a => a.id)]);
    }
    return newlyUnlocked;
  }, [unlockedAchievements, checkStreak]);

  return {
    level,
    levelName,
    streak,
    totalXp,
    xpInCurrentLevel,
    xpForNextLevel,
    unlockedAchievements,
    completedScenarios,
    addXpAndCheckAchievements,
  };
};