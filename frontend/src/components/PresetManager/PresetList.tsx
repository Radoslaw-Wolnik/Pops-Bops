import React from 'react';
import { Preset } from '../../types';

interface PresetListProps {
  presets: Preset[];
  onPresetSelect: (preset: Preset) => void;
  onPresetDelete: (presetId: string) => void;
}

const PresetList: React.FC<PresetListProps> = ({ presets, onPresetSelect, onPresetDelete }) => {
  return (
    <div className="preset-list">
      {presets.map((preset) => (
        <div key={preset._id} className="preset-item">
          <h3>{preset.name}</h3>
          <button onClick={() => onPresetSelect(preset)}>Load</button>
          <button onClick={() => onPresetDelete(preset._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default PresetList;