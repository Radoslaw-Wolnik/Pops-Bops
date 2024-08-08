import React, { useState, useEffect } from 'react';
import { Preset } from '../types';
import { getPresets, savePreset, deletePreset } from '../services/api';
import PresetList from '../components/PresetManager/PresetList';
import PresetForm from '../components/PresetManager/PresetForm';

const PresetManagerPage: React.FC = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [newPresetName, setNewPresetName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);

  useEffect(() => {
    fetchPresets();
  }, []);

  useEffect(() => {
    fetchPresets();
  }, []);

  const fetchPresets = async () => {
    try {
      const response = await getPresets();
      setPresets(response.data);
    } catch (error) {
      console.error('Error fetching presets:', error);
    }
  };

  const handleSavePreset = async () => {
    try {
      const response = await savePreset({
        name: newPresetName,
        settings: selectedPreset?.settings || {
          frequency: 440,
          volume: 0.5,
          duration: 1,
          waveform: 'sine',
        },
      });
      setPresets([...presets, response.data]);
      setNewPresetName('');
    } catch (error) {
      console.error('Error saving preset:', error);
    }
  };

  const handleDeletePreset = async (presetId: string) => {
    try {
      await deletePreset(presetId);
      setPresets(presets.filter((preset) => preset._id !== presetId));
    } catch (error) {
      console.error('Error deleting preset:', error);
    }
  };

  const handlePresetSelect = (preset: Preset) => {
    setSelectedPreset(preset);
    // Optionally, update the audio settings in the AudioGenerator component
  };

  return (
    <div className="preset-manager">
      <h2>Preset Manager</h2>

      <PresetForm
        presetName={newPresetName}
        onPresetNameChange={setNewPresetName}
        onSavePreset={handleSavePreset}
      />

      <PresetList
        presets={presets}
        onPresetSelect={handlePresetSelect}
        onPresetDelete={handleDeletePreset}
      />
    </div>
  );
};

export default PresetManagerPage;