// src/pages/CreateSamplePage.tsx
import React, { useState, useRef } from 'react';
//import { useAuth } from '../hooks/useAuth';
import { createAudioSample } from '../services/api';

const CreateSamplePage: React.FC = () => {
  //const { user } = useAuth();
  const [name, setName] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [iconColor, setIconColor] = useState('#000000');
  const [iconText, setIconText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAudio(event.target.files[0]);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      chunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
      setAudio(new File([blob], 'recording.wav', { type: 'audio/wav' }));
      chunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const createIcon = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = iconColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(iconText, canvas.width / 2, canvas.height / 2);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!audio || !name) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const formData = new FormData();
      formData.append('name', name);
      formData.append('audio', audio);
      formData.append('icon', blob, 'icon.png');

      try {
        await createAudioSample(formData);
        alert('Sample created successfully!');
        // Reset form or redirect
      } catch (error) {
        console.error('Error creating sample:', error);
        alert('Error creating sample');
      }
    }, 'image/png');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Sample</h1>
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
            onChange={handleFileUpload}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-2 rounded ${isRecording ? 'bg-red-500' : 'bg-blue-500'} text-white`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
        <div>
          <label htmlFor="iconColor" className="block mb-1">Icon Color</label>
          <input
            type="color"
            id="iconColor"
            value={iconColor}
            onChange={(e) => setIconColor(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="iconText" className="block mb-1">Icon Text</label>
          <input
            type="text"
            id="iconText"
            value={iconText}
            onChange={(e) => setIconText(e.target.value)}
            className="w-full p-2 border rounded"
            maxLength={2}
          />
        </div>
        <div>
          <button
            type="button"
            onClick={createIcon}
            className="p-2 rounded bg-green-500 text-white"
          >
            Preview Icon
          </button>
        </div>
        <canvas ref={canvasRef} width="100" height="100" className="border"></canvas>
        <button type="submit" className="w-full p-2 rounded bg-blue-500 text-white">Create Sample</button>
      </form>
    </div>
  );
};

export default CreateSamplePage;