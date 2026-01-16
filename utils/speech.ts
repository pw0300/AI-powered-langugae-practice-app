import { generateSpeech } from '../services/geminiService';
import { decodeBase64, decodePcmAudioData, playAudioBuffer } from './audio';

let currentAudioSource: AudioBufferSourceNode | null = null;

export const speak = async (
  text: string,
  speechRate: number,
  onEndCallback?: () => void,
  onErrorCallback?: (error: Error) => void
) => {
  if (currentAudioSource) {
    try {
        currentAudioSource.stop();
    } catch (e) {
        console.warn("Could not stop previous audio source", e);
    }
    currentAudioSource = null;
  }

  if (!text || text.trim().length < 1) {
      if (onEndCallback) onEndCallback();
      return;
  }

  try {
    const base64Audio = await generateSpeech(text, speechRate);
    if (base64Audio) {
        const audioBytes = decodeBase64(base64Audio);
        const audioBuffer = await decodePcmAudioData(audioBytes);
        currentAudioSource = playAudioBuffer(audioBuffer, () => {
            currentAudioSource = null;
            if (onEndCallback) {
                onEndCallback();
            }
        });
    } else {
        const error = new Error("TTS generation failed, no audio data received.");
        console.error(error.message);
        if (onErrorCallback) {
          onErrorCallback(error);
        } else if (onEndCallback) {
          onEndCallback();
        }
    }
  } catch (error) {
    console.error("An error occurred during speech synthesis:", error);
    if (onErrorCallback) {
      onErrorCallback(error as Error);
    } else if (onEndCallback) {
      onEndCallback();
    }
  }
};
