// src/utils/audioWorker.ts
import { AudioSettings } from "../types";

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

const generateAudioBuffer = async (
  frequency: number,
  volume: number,
  duration: number,
  waveform: OscillatorType,
  audioContext: OfflineAudioContext
): Promise<AudioBuffer> => {
  const oscillator = audioContext.createOscillator();
  oscillator.type = waveform;
  oscillator.frequency.setValueAtTime(frequency, 0);

  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0, 0);
  gainNode.gain.linearRampToValueAtTime(volume, 0.005);
  gainNode.gain.linearRampToValueAtTime(volume, duration - 0.005);
  gainNode.gain.linearRampToValueAtTime(0, duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(duration);

  return audioContext.startRendering();
};

self.onmessage = async (event: MessageEvent<AudioSettings>) => {
  try {
    const { frequency, volume, duration, waveform } = event.data;

    // Validate the audio settings
    if (frequency < 20 || frequency > 20000) {
      throw new Error('Frequency must be between 20 and 20,000 Hz');
    }
    if (volume < 0 || volume > 1) {
      throw new Error('Volume must be between 0 and 1');
    }
    if (duration <= 0) {
      throw new Error('Duration must be greater than 0');
    }

    const offlineContext = new OfflineAudioContext(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const audioBuffer = await generateAudioBuffer(frequency, volume, duration, waveform, offlineContext);
    self.postMessage({ audioBuffer });
  } catch (error) {
    self.postMessage({ error: (error as Error).message });
  }
};