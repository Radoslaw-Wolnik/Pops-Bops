// audioUtils.ts
import { AudioSettings } from '../types';
// also used audio worker

export const generateAudio = async (settings: AudioSettings): Promise<AudioBuffer> => {
  // Validate the audio settings
  validateAudioSettings(settings);
  const worker = new Worker(new URL('./audioWorker.ts', import.meta.url));
  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data.audioBuffer);
      }
      worker.terminate();
    };
    worker.postMessage(settings);
  });
};

const validateAudioSettings = (settings: AudioSettings) => {
  // Add validation logic here
  if (settings.frequency < 20 || settings.frequency > 20000) {
    throw new Error('Frequency must be between 20 and 20,000 Hz');
  }
  // Add more validation checks as needed
};