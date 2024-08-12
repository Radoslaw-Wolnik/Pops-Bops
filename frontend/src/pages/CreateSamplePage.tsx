// src/pages/CreateSamplePage.tsx
import React, { useState, useRef, useEffect } from 'react';
//import { useAuth } from '../hooks/useAuth';
import { createAudioSample } from '../services/api';

const CreateSamplePage: React.FC = () => {
  //const { user } = useAuth();
  const [name, setName] = useState('');
  const [audio, setAudio] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState<'brush' | 'pencil'>('pencil');
  const [brushSize, setBrushSize] = useState(5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 200;
      canvas.height = 200;
      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = color;
        context.lineWidth = brushSize;
        contextRef.current = context;
      }
    }
  }, []);

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

  const startDrawing = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    if (contextRef.current) {
      contextRef.current.clearRect(0, 0, 200, 200);
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    if (contextRef.current) {
      contextRef.current.strokeStyle = e.target.value;
    }
  };

  const handleBrushSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value);
    setBrushSize(size);
    if (contextRef.current) {
      contextRef.current.lineWidth = size;
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
          <label htmlFor="color" className="block mb-1">Color</label>
          <input
            type="color"
            id="color"
            value={color}
            onChange={handleColorChange}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="brushSize" className="block mb-1">Brush Size</label>
          <input
            type="range"
            id="brushSize"
            min="1"
            max="20"
            value={brushSize}
            onChange={handleBrushSizeChange}
            className="w-full"
          />
        </div>
        <div>
          <button
            type="button"
            onClick={() => setTool('pencil')}
            className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-500' : 'bg-gray-300'} text-white mr-2`}
          >
            Ołówek
          </button>
          <button
            type="button"
            onClick={() => setTool('brush')}
            className={`p-2 rounded ${tool === 'brush' ? 'bg-blue-500' : 'bg-gray-300'} text-white`}
          >
            Pędzel
          </button>
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border"
        ></canvas>
        <button
          type="button"
          onClick={clearCanvas}
          className="p-2 rounded bg-red-500 text-white"
        >
          Clear Canvas
        </button>
        <button type="submit" className="w-full p-2 rounded bg-blue-500 text-white">Create Sample</button>
      </form>
    </div>
  );
};

export default CreateSamplePage;