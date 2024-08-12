// src/pages/AdminAddDefaultSoundPage.tsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { addDefaultAudioSample } from '../services/api';
import { Navigate } from 'react-router-dom';

const AdminAddDefaultSoundPage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [forMainPage, setForMainPage] = useState(false);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAudio(event.target.files[0]);
    }
  };

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setIcon(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!audio || !icon || !name) {
      alert('Please fill in all fields');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('audio', audio);
    formData.append('icon', icon);
    formData.append('forMainPage', forMainPage.toString());

    try {
      await addDefaultAudioSample(formData);
      alert('Default audio sample added successfully!');
      // Reset form
      setName('');
      setAudio(null);
      setIcon(null);
      setForMainPage(false);
      if (audioInputRef.current) audioInputRef.current.value = '';
      if (iconInputRef.current) iconInputRef.current.value = '';
    } catch (error) {
      console.error('Error adding default audio sample:', error);
      alert('Error adding default audio sample');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Default Audio Sample</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Sample Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="audio" className="block mb-1">Upload Audio</label>
          <input
            type="file"
            id="audio"
            accept="audio/*"
            onChange={handleAudioUpload}
            className="w-full p-2 border rounded"
            required
            ref={audioInputRef}
          />
        </div>
        <div>
          <label htmlFor="icon" className="block mb-1">Upload Icon</label>
          <input
            type="file"
            id="icon"
            accept="image/png"
            onChange={handleIconUpload}
            className="w-full p-2 border rounded"
            required
            ref={iconInputRef}
          />
        </div>
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={forMainPage}
              onChange={(e) => setForMainPage(e.target.checked)}
              className="mr-2"
            />
            Display on Main Page
          </label>
        </div>
        <button type="submit" className="w-full p-2 rounded bg-blue-500 text-white">
          Add Default Sample
        </button>
      </form>
    </div>
  );
};

export default AdminAddDefaultSoundPage;