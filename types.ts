export type PracticeStatus =
  | 'idle'
  | 'initializing'
  | 'ready'
  | 'listening'
  | 'processing'
  | 'evaluating'
  | 'speaking'
  | 'turn-complete'
  | 'assessing-final'
  | 'scenario-complete'
  | 'error'
  | 'permission-denied';

export type PracticeErrorType = 'network' | 'session' | 'audio' | 'unknown';

export interface PracticeErrorInfo {
  type: PracticeErrorType;
  message: string;
  troubleshooting?: string[];
}

export interface TranscriptLine {
  speaker: 'user' | 'coach';
  text: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  persona: string;
  initialTurn: string;
  maxTurns: number;
  completionGoal: string;
  assessmentCriteria: string[];
  difficulty: 'easy' | 'medium' | 'hard' | 'super hard';
  tags: string[];
  unlockLevel?: number;
}

export interface TurnFeedback {
  score: number;
  tip: string;
  sampleReply: string;
}

export interface Scorecard {
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  criteriaScores: {
    criterion: string;
    score: number;
  }[];
}

export interface GamificationState {
  level: number;
  levelName: string;
  streak: number;
  totalXp: number;
  xpInCurrentLevel: number;
  xpForNextLevel: number;
  unlockedAchievements: string[];
  completedScenarios: Set<string>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (scorecard: Scorecard, scenario: Scenario) => boolean;
}
