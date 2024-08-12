// src/components/HomePage.tsx

import React, { useState, useEffect } from 'react';
import { getMainPageSamples } from '../services/api';
import { AudioSample } from '../types';
// import { getFullImageUrl } from '../utils/imageUtils'; not sure if its needed

const HomePage: React.FC = () => {
  const [samples, setSamples] = useState<AudioSample[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const response = await getMainPageSamples();
        setSamples(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching main page samples:', error);
        setLoading(false);
      }
    };

    fetchSamples();
  }, []);

  const playSound = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    //const audio = new Audio(getFullImageUrl(audioUrl));
    audio.play();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pops and Bops</h1>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
        {samples.map((sample) => (
          <div
            key={sample._id}
            className="flex flex-col items-center"
            onClick={() => playSound(sample.audioUrl)}
          >
            <img
              src={sample.iconUrl}
              alt={sample.name}
              className="w-24 h-24 object-cover rounded-full cursor-pointer transition-transform hover:scale-110"
            />
            <span className="mt-2 text-sm">{sample.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;