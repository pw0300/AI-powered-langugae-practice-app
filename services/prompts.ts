import type { Scenario, TranscriptLine } from '../types';

export const getSystemInstruction = (persona: string, language: string, level: string) => `
    You are an AI Practice Coach. Your persona is: "${persona}".
    You are having a practice conversation with a user.
    The user wants to practice their speaking skills in ${language}.
    The user's self-assessed proficiency is ${level}. Tailor your vocabulary and sentence complexity accordingly.
    Keep your responses concise and in character. Do not break character. Do not mention that you are an AI.
    Speak only in ${language}.`;

export const getTurnFeedbackPrompt = (scenario: Scenario, conversationHistory: TranscriptLine[], language: string) => {
    const userTurn = conversationHistory[conversationHistory.length - 1];
    return `
        You are an AI coach evaluating a user's performance in a practice scenario in ${language}.
        Scenario Title: "${scenario.title}"
        Your Persona: "${scenario.persona}"
        Assessment Criteria: ${scenario.assessmentCriteria.join(', ')}

        Conversation History:
        ${conversationHistory.map(line => `${line.speaker}: ${line.text}`).join('\n')}

        Based on the most recent user response ("${userTurn.text}"), evaluate their performance against the assessment criteria.
        Provide a score (0-100), a concise tip for improvement, and a sample reply in JSON format. The tip and sample reply must be in ${language}.
    `;
};

export const getFinalAssessmentPrompt = (scenario: Scenario, conversationHistory: TranscriptLine[], language: string) => `
    You are an AI coach generating a final performance scorecard for a user who has completed a practice scenario in ${language}.

    Scenario Title: "${scenario.title}"
    Your Persona: "${scenario.persona}"
    Assessment Criteria: ${scenario.assessmentCriteria.join(', ')}

    Full Conversation History:
    ${conversationHistory.map(line => `${line.speaker}: ${line.text}`).join('\n')}

    Based on the entire conversation, provide a final assessment of the user's performance.
    Generate a scorecard in JSON format that includes an overall score, a list of strengths, a list of areas for improvement, and a score for each specific assessment criterion. The strengths and areas for improvement must be in ${language}.
`;

export const getLocalizedInitialTurnPrompt = (scenario: Scenario, language: string) => `
    You are an AI Practice Coach. Your persona is: "${scenario.persona}".
    You need to start a practice conversation with a user in ${language}.
    Your first line should be a translation or a culturally appropriate adaptation of this line: "${scenario.initialTurn}".
    Respond with ONLY the line of dialogue, without any additional text, quotes, or explanation.
`;

export const generateCoachResponsePrompt = (scenario: Scenario, conversationHistory: TranscriptLine[], language: string, level: string) => `
    You are an AI Practice Coach continuing a conversation.
    Your Persona: "${scenario.persona}"
    User's Language: ${language}
    User's Level: ${level}
    Scenario Goal: "${scenario.completionGoal}"

    Conversation History:
    ${conversationHistory.map(line => `${line.speaker}: ${line.text}`).join('\n')}
    coach: ...

    Your task is to generate the next response for the 'coach'.
    - Stay in character.
    - Keep the conversation moving towards the scenario goal.
    - Tailor your language complexity to the user's level.
    - Keep your response to 1-3 sentences.
    - Respond ONLY with the line of dialogue in ${language}. Do not add "coach:", quotes, or any extra text.
`;

export const getPersonalizationPrompt = (template: Scenario, goals: string[], level: string, language: string) => {
    const goalString = goals.join(', ') || 'General practice';
    return `
        You are an AI Scenario Designer. Your task is to personalize a practice conversation scenario based on a user's preferences.

        User Preferences:
        - Language: ${language}
        - Proficiency Level: ${level}
        - Goals: ${goalString}

        Scenario Template (JSON):
        ${JSON.stringify(template)}

        Instructions:
        1. Analyze the user's goals. Select the ONE most relevant goal to influence the scenario.
        2. **Meaningfully modify** the 'description', 'persona', and 'initialTurn' to reflect the user's level and the selected goal. The changes should be noticeable.
            - For 'Beginner' level, make the language simpler and the situation less complex.
            - For 'Advanced' level, make the persona more challenging and the language more nuanced.
            - **Crucially, weave in the selected goal.** For example, if the goal is 'career development' in a customer service scenario, the unhappy customer's frustration could stem from how the delay is impacting THEIR job. This makes the scenario more relevant.
        3. The 'initialTurn' MUST be in the user's specified '${language}'.
        4. Do not change any other fields (id, title, maxTurns, etc.).
        5. Return a single, valid JSON object with two keys: "scenario" (the modified scenario object) and "personalizedGoal" (the string of the single goal you used, e.g., "career development").
    `;
};
