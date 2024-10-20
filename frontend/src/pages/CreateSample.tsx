import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAudioSample } from '../services/api';
import { Button } from './Button';
import { Input } from './Input';

export const CreateSamplePage: React.FC = () => {
  const [name, setName] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!audio || !icon) {
      setError('Please select both audio and icon files.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('audio', audio);
      formData.append('icon', icon);

      await createAudioSample(formData);
      navigate('/');
    } catch (err) {
      setError('Failed to create audio sample. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create New Sample</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Sample Name:</label>
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="audio" className="block mb-1">Audio File:</label>
          <Input
            type="file"
            id="audio"
            onChange={(e) => setAudio(e.target.files?.[0] || null)}
            accept="audio/*"
            required
          />
        </div>
        <div>
          <label htmlFor="icon" className="block mb-1">Icon:</label>
          <Input
            type="file"
            id="icon"
            onChange={(e) => setIcon(e.target.files?.[0] || null)}
            accept="image/*"
            required
          />
        </div>
        <Button type="submit">Create Sample</Button>
      </form>
    </div>
  );
};