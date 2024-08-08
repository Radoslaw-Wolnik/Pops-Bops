import React from 'react';

interface WaveformSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const WaveformSelector: React.FC<WaveformSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="waveform-selector">
      <label>
        Waveform:
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </label>
    </div>
  );
};

export default WaveformSelector;