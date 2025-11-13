import type { Achievement } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first practice scenario.',
    icon: '🚀',
    condition: (scorecard, scenario) => {
      return scorecard.overallScore > 0;
    },
  },
  {
    id: 'customer-champ',
    name: 'De-escalation Expert',
    description: 'Ace the "Unhappy Customer" scenario with a high score.',
    icon: '🛡️',
    associatedScenarioId: 'customer-support-1',
    condition: (scorecard, scenario) => {
      return scenario.id === 'customer-support-1' && scorecard.overallScore >= 85;
    },
  },
  {
    id: 'interview-ace',
    name: 'Interview Ace',
    description: 'Impress the hiring manager in the job interview.',
    icon: '💼',
    associatedScenarioId: 'job-interview-1',
    condition: (scorecard, scenario) => {
      return scenario.id === 'job-interview-1' && scorecard.overallScore >= 90;
    },
  },
  {
    id: 'negotiator',
    name: 'Salary Sensei',
    description: 'Successfully negotiate a better salary.',
    icon: '💰',
    associatedScenarioId: 'negotiation-1',
    condition: (scorecard, scenario) => {
      return scenario.id === 'negotiation-1' && scorecard.overallScore >= 80;
    },
  },
  {
    id: 'feedback-guru',
    name: 'Feedback Guru',
    description: 'Handle the difficult feedback scenario with grace.',
    icon: '✨',
    associatedScenarioId: 'feedback-delivery-1',
    condition: (scorecard, scenario) => {
      return scenario.id === 'feedback-delivery-1' && scorecard.overallScore >= 75;
    },
  },
  {
    id: 'high-scorer',
    name: 'High Scorer',
    description: 'Achieve a score of 95 or higher in any scenario.',
    icon: '🏆',
    condition: (scorecard, scenario) => {
      return scorecard.overallScore >= 95;
    },
  },
];