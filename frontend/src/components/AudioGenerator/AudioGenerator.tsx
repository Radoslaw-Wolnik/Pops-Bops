/*import React, { useState } from 'react';
import { AudioSettings } from '../../types';
import { savePreset, saveAudioSample } from '../../services/api';
import { generateAudio } from '../../utils/audioUtils';
import Slider from './Slider';
import WaveformSelector from './WaveformSelector';

const AudioGenerator: React.FC = () => {
  const [settings, setSettings] = useState<AudioSettings>({
    frequency: 440,
    volume: 0.5,
    duration: 1,
    waveform: 'sine',
  });
  const [presetName, setPresetName] = useState('');
  const [savedAudioSamples, setSavedAudioSamples] = useState
    { audioUrl: string; settings: AudioSettings }[]
  >([]);

  const handleGenerate = async () => {
    try {
      const audioBuffer = await generateAudio(settings);
      const audioBlob = await new Response(audioBuffer).blob();
      const savedAudio = await saveAudioSample(audioBlob, settings);
      setSavedAudioSamples((prev) => [...prev, { audioUrl: savedAudio.data.audioUrl, settings }]);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const saveCurrentPreset = async () => {
    try {
      await savePreset({ name: presetName, settings });
      alert('Preset saved successfully!');
      setPresetName('');
    } catch (error) {
      console.error('Error saving preset:', error);
      alert('Failed to save preset');
    }
  };

  const handleSettingChange = (setting: keyof AudioSettings, value: number | string) => {
    setSettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="audio-generator">
      <h1>Pop and Bob Generator</h1>

      <Slider
        label="Frequency"
        value={settings.frequency}
        min={20}
        max={20000}
        onChange={(value) => handleSettingChange('frequency', value)}
      />

      <Slider
        label="Volume"
        value={settings.volume}
        min={0}
        max={1}
        step={0.01}
        onChange={(value) => handleSettingChange('volume', value)}
      />

      <Slider
        label="Duration"
        value={settings.duration}
        min={0.1}
        max={5}
        step={0.1}
        onChange={(value) => handleSettingChange('duration', value)}
      />

      <WaveformSelector
        value={settings.waveform}
        onChange={(value) => handleSettingChange('waveform', value)}
      />

      <button onClick={handleGenerate}>Generate Audio</button>

      <div className="save-preset">
        <input
          type="text"
          value={presetName}
          onChange={(e) => setPresetName(e.target.value)}
          placeholder="Preset name"
        />
        <button onClick={saveCurrentPreset}>Save Preset</button>
      </div>

      <div className="saved-samples">
        <h2>Saved Audio Samples</h2>
        {savedAudioSamples.map((sample, index) => (
          <div key={index} className="saved-sample">
            <audio src={sample.audioUrl} controls />
            <p>Frequency: {sample.settings.frequency}Hz</p>
            <p>Volume: {sample.settings.volume}</p>
            <p>Duration: {sample.settings.duration}s</p>
            <p>Waveform: {sample.settings.waveform}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudioGenerator;

*/