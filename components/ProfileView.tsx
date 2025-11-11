import React from 'react';
import { useGamificationContext } from '../contexts/GamificationContext';
import { achievements } from '../data/achievements';
import { scenarios } from '../data/scenarios';
import type { Scorecard } from '../types';

interface ProfileViewProps {
  onSelectScenario?: (scenarioId: string) => void;
}

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="bg-slate-800/70 p-4 rounded-lg text-center">
        <p className="text-sm text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
    </div>
);

export const ProfileView: React.FC<ProfileViewProps> = ({ onSelectScenario }) => {
    const { levelName, totalXp, streak, unlockedAchievements, completedScenarios } = useGamificationContext();

    // This is a dummy for the achievement condition check.
     const dummyScorecardForLink: Scorecard = {
        overallScore: 100,
        strengths: [],
        areasForImprovement: [],
        criteriaScores: [],
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 animate-fade-in">
            <h1 className="text-3xl font-bold text-white mb-2">Your Progress</h1>
            <p className="text-slate-400 mb-8">Here's an overview of your performance and achievements.</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard label="Current Level" value={levelName} />
                <StatCard label="Total XP" value={totalXp} />
                <StatCard label="Practice Streak" value={`${streak} days`} />
                <StatCard label="Scenarios Completed" value={completedScenarios.size} />
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-4">Unlocked Achievements</h2>
                {unlockedAchievements.length > 0 ? (
                    <div className="space-y-3">
                    {achievements.filter(a => unlockedAchievements.includes(a.id)).map(ach => {
                       const scenarioForAchievement = scenarios.find(s => ach.condition(dummyScorecardForLink, s));
                       return (
                        <button 
                            key={ach.id}
                            onClick={() => scenarioForAchievement && onSelectScenario && onSelectScenario(scenarioForAchievement.id)}
                            disabled={!scenarioForAchievement}
                            className="w-full text-left flex items-center gap-4 p-4 bg-slate-800/70 rounded-lg border border-slate-700 hover:border-amber-500 transition-colors duration-200 disabled:cursor-not-allowed disabled:hover:border-slate-700"
                        >
                            <span className="text-4xl">{ach.icon}</span>
                            <div>
                                <h3 className="font-bold text-amber-400">{ach.name}</h3>
                                <p className="text-sm text-slate-300">{ach.description}</p>
                                {scenarioForAchievement && <p className="text-xs text-indigo-400 mt-1">Click to practice this skill</p>}
                            </div>
                        </button>
                       )
                    })}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-slate-800/50 rounded-lg">
                        <p className="text-slate-400">Your unlocked achievements will appear here. Keep practicing!</p>
                    </div>
                )}
            </div>
        </div>
    );
};
