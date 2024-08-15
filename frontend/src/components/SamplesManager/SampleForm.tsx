import React, { useState, useEffect } from 'react';
import { AudioSample } from '../../types';

interface SampleFormProps {
  sample: AudioSample | null;
  onSaveSample: (formData: FormData) => void;
}

const SampleForm: React.FC<SampleFormProps> = ({ sample, onSaveSample }) => {
  const [name, setName] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    if (sample) {
      setName(sample.name);
      setSettings(sample.settings);
    } else {
      setName('');
      setSettings({});
    }
  }, [sample]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (audio) formData.append('audio', audio);
    if (icon) formData.append('icon', icon);
    formData.append('settings', JSON.stringify(settings));
    
    onSaveSample(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Sample Name"
        required
      />
      <input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files?.[0] || null)}
        required={!sample}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setIcon(e.target.files?.[0] || null)}
        required={!sample}
      />
      {/* Add inputs for settings here */}
      <button type="submit">{sample ? 'Update Sample' : 'Create Sample'}</button>
    </form>
  );
};

export default SampleForm;