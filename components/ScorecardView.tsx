import React from 'react';
import type { Scorecard } from '../types';

const ProgressBar: React.FC<{ score: number }> = ({ score }) => {
    const getScoreColor = () => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 50) return 'bg-amber-500';
        return 'bg-rose-500';
    };
    return (
        <div className="w-full bg-slate-700 rounded-full h-2.5">
            <div className={`${getScoreColor()} h-2.5 rounded-full transition-all duration-500 ease-out`} style={{ width: `${score}%` }}></div>
        </div>
    );
};

export const ScorecardView: React.FC<{ scorecard: Scorecard }> = ({ scorecard }) => {
  return (
    <div className="w-full max-w-2xl p-6 bg-slate-800/70 rounded-lg border border-slate-700 space-y-6">
        <div>
            <p className="text-sm text-slate-400 text-center">Overall Performance</p>
            <h2 className="text-5xl font-bold text-white text-center mt-1">{scorecard.overallScore}<span className="text-2xl text-slate-400">%</span></h2>
            <div className="mt-3">
                <ProgressBar score={scorecard.overallScore} />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <h3 className="text-lg font-semibold text-emerald-400 mb-2">Strengths</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {scorecard.strengths.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold text-rose-400 mb-2">Areas for Improvement</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {scorecard.areasForImprovement.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </div>
        </div>
        
        <div>
            <h3 className="text-lg font-semibold text-slate-200 mb-3">Detailed Breakdown</h3>
            <div className="space-y-3">
                {scorecard.criteriaScores.map(({ criterion, score }, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-slate-300">{criterion}</span>
                            <span className="text-sm font-bold text-white">{score}%</span>
                        </div>
                        <ProgressBar score={score} />
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};