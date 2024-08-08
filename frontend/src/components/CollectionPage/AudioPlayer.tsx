import React from 'react';
import { AudioSample } from '../../types';

interface AudioPlayerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  currentlyPlayingSample: AudioSample | null;
  onVolumeChange: (volume: number) => void;
  onLoopToggle: () => void;
  onStopAudio: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioRef,
  currentlyPlayingSample,
  onVolumeChange,
  onLoopToggle,
  onStopAudio,
}) => {
  return (
    <div className="audio-player">
      {currentlyPlayingSample && (
        <div>
          <audio ref={audioRef} controls>
            <source src={currentlyPlayingSample.audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue="1"
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            />
            <button onClick={onLoopToggle}>
              {audioRef.current?.loop ? 'Stop Looping' : 'Loop'}
            </button>
            <button onClick={onStopAudio}>Stop</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;