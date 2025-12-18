
import { GoogleGenAI, Modality, Blob, Type, GenerateContentResponse } from '@google/genai';
import { encode } from '../utils/audio';
import type { Scenario, TurnFeedback, Scorecard, TranscriptLine } from '../types';
import { 
    getSystemInstruction, 
    getTurnFeedbackPrompt, 
    getFinalAssessmentPrompt, 
    getLocalizedInitialTurnPrompt, 
    generateCoachResponsePrompt,
    getPersonalizationPrompt
} from './prompts';

// Per guidelines, create a new instance right before making an API call to ensure the latest API key is used.
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY! });

// --- UTILITIES ---

const DEFAULT_TIMEOUT_MS = 30000; // 30 seconds

/**
 * Wraps a promise with a timeout.
 */
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number = DEFAULT_TIMEOUT_MS): Promise<T> => {
    return Promise.race([
        promise,
        new Promise<T>((_, reject) => 
            setTimeout(() => reject(new Error(`API request timed out after ${timeoutMs}ms`)), timeoutMs)
        )
    ]);
};

/**
 * Safely parses JSON from a string, handling markdown code blocks often returned by LLMs.
 */
const safeParseJSON = <T>(text: string): T | null => {
    try {
        // Remove markdown code blocks if present (e.g. ```json ... ```)
        let cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText) as T;
    } catch (error) {
        console.error("JSON Parse Error. Raw text:", text, error);
        return null;
    }
};

/**
 * Creates a Blob object for the Live API from raw audio data.
 */
export const createPcmBlob = (data: Float32Array): Blob => {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    // Per guidelines, convert to 16-bit integer by multiplying by 32768.
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
};

/**
 * Connects to Gemini's Live API for a real-time conversation session.
 */
export const connectToGemini = (
  persona: string,
  language: string,
  level: string,
  callbacks: {
    onopen: () => void;
    onmessage: (message: any) => void;
    onerror: (e: ErrorEvent) => void;
    onclose: (e: CloseEvent) => void;
  }
) => {
  const ai = getAiClient();
  const systemInstruction = getSystemInstruction(persona, language, level);

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      outputAudioTranscription: {},
      inputAudioTranscription: {},
      systemInstruction,
    },
  });
  return sessionPromise;
};

/**
 * Generates speech from text using the Gemini TTS model.
 */
export const generateSpeech = async (text: string, speechRate: number): Promise<string | null> => {
  if (!text.trim()) return null;
  try {
    const ai = getAiClient();
    
    // Construct a natural language prompt to control speech rate, which is more reliable than SSML.
    const rateDescription = speechRate === 1.0 ? 'a normal' : speechRate > 1.0 ? 'a slightly faster' : 'a slightly slower';
    const promptText = `Speak at ${rateDescription} pace: ${text}`;

    const response = await withTimeout<GenerateContentResponse>(ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-tts',
      contents: [{ parts: [{ text: promptText }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    }), 15000); // Shorter timeout for TTS
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
};


const turnFeedbackSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.NUMBER,
            description: "A score from 0-100 for the user's last response based on the assessment criteria.",
        },
        tip: {
            type: Type.STRING,
            description: "A single, concise, and actionable tip for improvement for the user. Should be one or two sentences.",
        },
        sampleReply: {
            type: Type.STRING,
            description: "A short, example of a better way the user could have responded. Should be one or two sentences.",
        },
    },
    required: ["score", "tip", "sampleReply"],
};

/**
 * Evaluates a user's response and provides feedback.
 */
export const getTurnFeedback = async (
    scenario: Scenario,
    conversationHistory: TranscriptLine[],
    language: string,
): Promise<TurnFeedback | null> => {
    try {
        const ai = getAiClient();
        const prompt = getTurnFeedbackPrompt(scenario, conversationHistory, language);

        const response = await withTimeout<GenerateContentResponse>(ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: turnFeedbackSchema,
            },
        }));
        
        return safeParseJSON<TurnFeedback>((response.text || "").trim());

    } catch (error) {
        console.error("Error getting turn feedback:", error);
        return null;
    }
};

const scorecardSchema = {
    type: Type.OBJECT,
    properties: {
        overallScore: {
            type: Type.NUMBER,
            description: "An overall score from 0-100 for the user's performance across the entire scenario.",
        },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 specific strengths the user demonstrated.",
        },
        areasForImprovement: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 2-3 specific, actionable areas for improvement.",
        },
        criteriaScores: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    criterion: { type: Type.STRING },
                    score: { type: Type.NUMBER },
                },
                required: ["criterion", "score"]
            },
            description: "A list of scores (0-100) for each of the specific assessment criteria.",
        },
    },
    required: ["overallScore", "strengths", "areasForImprovement", "criteriaScores"],
};


/**
 * Generates a final performance scorecard for the entire scenario.
 */
export const getFinalAssessment = async (
    scenario: Scenario,
    conversationHistory: TranscriptLine[],
    language: string,
): Promise<Scorecard | null> => {
     try {
        const ai = getAiClient();
        const prompt = getFinalAssessmentPrompt(scenario, conversationHistory, language);
        
        // Use gemini-3-pro-preview for complex reasoning tasks like final assessment
        const response = await withTimeout<GenerateContentResponse>(ai.models.generateContent({
            model: 'gemini-3-pro-preview', 
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: scorecardSchema,
            },
        }), 45000);

        return safeParseJSON<Scorecard>((response.text || "").trim());

    } catch (error) {
        console.error("Error getting final assessment:", error);
        return null;
    }
}

/**
 * Generates the initial turn for the AI coach in the specified language.
 */
export const getLocalizedInitialTurn = async (scenario: Scenario, language: string): Promise<string> => {
    if (language.toLowerCase().includes('english')) {
        return scenario.initialTurn;
    }
    try {
        const ai = getAiClient();
        const prompt = getLocalizedInitialTurnPrompt(scenario, language);
        const response = await withTimeout<GenerateContentResponse>(ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        }));
        return (response.text || "").trim();
    } catch (error) {
        console.error("Error getting initial turn:", error);
        return scenario.initialTurn; // Fallback to English
    }
};

/**
 * Generates the AI coach's next response in the conversation.
 */
export const generateCoachResponse = async (
    scenario: Scenario,
    conversationHistory: TranscriptLine[],
    language: string,
    level: string,
): Promise<string> => {
    try {
        const ai = getAiClient();
        const prompt = generateCoachResponsePrompt(scenario, conversationHistory, language, level);
        const response = await withTimeout<GenerateContentResponse>(ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        }));
        return (response.text || "").trim();
    } catch (error) {
        console.error("Error generating coach response:", error);
        return "I'm having trouble thinking of a response right now. Let's continue.";
    }
};


const personalizedScenarioSchema = {
    type: Type.OBJECT,
    properties: {
        scenario: {
            type: Type.OBJECT,
            properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                persona: { type: Type.STRING },
                initialTurn: { type: Type.STRING },
                maxTurns: { type: Type.NUMBER },
                completionGoal: { type: Type.STRING },
                assessmentCriteria: { type: Type.ARRAY, items: { type: Type.STRING } },
                difficulty: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
             required: ["id", "title", "description", "persona", "initialTurn", "maxTurns", "completionGoal", "assessmentCriteria", "difficulty", "tags"],
        },
        personalizedGoal: { 
            type: Type.STRING,
            description: "The primary user goal that was used to influence the personalization. e.g., 'career development'. Should be null if no specific goal was applicable."
        },
    },
    required: ["scenario", "personalizedGoal"],
};

/**
 * Personalizes a scenario template based on user preferences.
 */
export const personalizeScenario = async (
    template: Scenario,
    goals: string[],
    level: string,
    language: string
): Promise<{ scenario: Scenario; personalizedGoal: string | null }> => {
    try {
        const ai = getAiClient();
        const prompt = getPersonalizationPrompt(template, goals, level, language);

        const response = await withTimeout<GenerateContentResponse>(ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: personalizedScenarioSchema,
            },
        }));
        
        const result = safeParseJSON<{ scenario: Scenario; personalizedGoal: string | null }>((response.text || "").trim());
        if (!result) throw new Error("Parsed JSON was null");
        return result;

    } catch (error) {
        console.error("Error personalizing scenario:", error);
        // Fallback to a simple translation of the initial turn if personalization fails
        const localizedInitialTurn = await getLocalizedInitialTurn(template, language);
        return { 
            scenario: { ...template, initialTurn: localizedInitialTurn },
            personalizedGoal: null
        };
    }
};
