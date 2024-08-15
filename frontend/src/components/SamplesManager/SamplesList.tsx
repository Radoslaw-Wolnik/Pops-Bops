import React from 'react';
import { AudioSample } from '../../types';

interface PresetListProps {
  samples: AudioSample[];
  onSampleSelect: (sample: AudioSample) => void;
  onSampleDelete: (sample: AudioSample) => void;
}

const SamplesList: React.FC<PresetListProps> = ({ samples, onSampleSelect, onSampleDelete }) => {
  return (
    <div className="preset-list">
      {samples.map((sample) => (
        <div key={sample._id} className="preset-item">
          <h3>{sample.name}</h3>
          <button onClick={() => onSampleSelect(sample)}>Load</button>
          <button onClick={() => onSampleDelete(sample)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default SamplesList;