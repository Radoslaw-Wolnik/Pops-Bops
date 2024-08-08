import React from 'react';

interface PresetFormProps {
  presetName: string;
  onPresetNameChange: (name: string) => void;
  onSavePreset: () => void;
}

const PresetForm: React.FC<PresetFormProps> = ({ presetName, onPresetNameChange, onSavePreset }) => {
  return (
    <div className="preset-form">
      <input
        type="text"
        value={presetName}
        onChange={(e) => onPresetNameChange(e.target.value)}
        placeholder="New Preset Name"
      />
      <button onClick={onSavePreset}>Save Preset</button>
    </div>
  );
};

export default PresetForm;