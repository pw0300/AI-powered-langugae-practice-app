import type { Scenario } from '../types';

/**
 * Generates a sorted learning path based on user goals and scenario difficulty.
 *
 * @param allScenarios - The complete list of available scenarios.
 * @param userGoals - The goals selected by the user during onboarding.
 * @returns A new array of scenarios sorted into a logical learning path.
 */
export const generateLearningPath = (allScenarios: Scenario[], userGoals: string[]): Scenario[] => {
  const difficultyOrder: { [key in Scenario['difficulty']]: number } = {
    'easy': 1,
    'medium': 2,
    'hard': 3,
    'super hard': 4,
  };

  // Create a copy to avoid mutating the original array
  const scenarios = [...allScenarios];

  scenarios.sort((a, b) => {
    // Primary sort: by difficulty
    const difficultyA = difficultyOrder[a.difficulty];
    const difficultyB = difficultyOrder[b.difficulty];
    if (difficultyA !== difficultyB) {
      return difficultyA - difficultyB;
    }

    // Secondary sort: prioritize scenarios that match user goals
    const aHasGoal = a.tags.some(tag => userGoals.includes(tag));
    const bHasGoal = b.tags.some(tag => userGoals.includes(tag));

    if (aHasGoal && !bHasGoal) {
      return -1; // Scenario 'a' is more relevant, so it comes first
    }
    if (!aHasGoal && bHasGoal) {
      return 1; // Scenario 'b' is more relevant
    }

    // If both or neither match, maintain their original relative order (stable sort not guaranteed, but fine here)
    return 0;
  });

  return scenarios;
};
