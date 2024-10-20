import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';

interface AudioPlayerProps {
  src: string;
  name: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, name }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    // events
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    // clean up
    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const stopAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-semibold mb-2">{name}</h3>
      <audio ref={audioRef} src={src} />
      <div className="flex items-center space-x-2 mb-2">
        <Button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</Button>
        <Button onClick={stopAudio}>Stop</Button>
      </div>
      <div className="text-sm">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
      <input
        type="range"
        min={0}
        max={duration}
        value={currentTime}
        onChange={(e) => {
          if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
          }
        }}
        className="w-full"
      />
    </div>
  );
};