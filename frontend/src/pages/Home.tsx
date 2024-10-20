import React, { useState, useEffect } from 'react';
import { getMainPageSamples } from '../services/api';
import { AudioSample } from '../types';
import { Button } from '../components/Button';

export const HomePage: React.FC = () => {
  const [samples, setSamples] = useState<AudioSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const data = await getMainPageSamples();
        setSamples(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch samples. Please try again later.');
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  const playSound = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-8">Welcome to Pops and Bops</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {samples.map((sample) => (
          <div key={sample._id} className="flex flex-col items-center">
            <Button
              onClick={() => playSound(sample.audioUrl)}
              className="w-24 h-24 rounded-full overflow-hidden mb-2"
            >
              <img
                src={sample.iconUrl}
                alt={sample.name}
                className="w-full h-full object-cover"
              />
            </Button>
            <span className="text-sm">{sample.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};