import React from 'react';
import { AudioSample } from '../../types';

interface SampleListProps {
  samples: AudioSample[];
  onSampleSelect: (sample: AudioSample) => void;
  onPlayAudio: (sample: AudioSample) => void;
}

const SampleList: React.FC<SampleListProps> = ({ samples, onSampleSelect, onPlayAudio }) => {
  return (
    <div className="sample-list">
      {samples.map((sample) => (
        <div>
          <div key={sample._id} onClick={() => onSampleSelect(sample)}>
            {/* Render the sample information */}
          </div>
          <div key={sample._id} onClick={() => onPlayAudio(sample)}></div>
        </div>
      ))}
    </div>
  );
};

export default SampleList;
