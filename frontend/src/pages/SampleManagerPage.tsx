import React, { useState, useEffect } from 'react';
import { AudioSample } from '../types';
import { getUserSamples, deleteUserSample } from '../services/api'; // also updateAudioSample
import SamplesList from '../components/SamplesManager/SamplesList';
//import SampleForm from '../components/SamplesManager/SampleForm';

const SampleManagerPage: React.FC = () => {
  const [samples, setSamples] = useState<AudioSample[]>([]);
  const [selectedSample, setSelectedSample] = useState<AudioSample | null>(null);

  useEffect(() => {
    fetchSamples();
  }, []);

  const fetchSamples = async () => {
    try {
      const response = await getUserSamples();
      setSamples(response.data);
    } catch (error) {
      console.error('Error fetching presets:', error);
    }
  };

  /*
  const handleSaveSample = async (formData: FormData) => {
    try {
      const id = formData.get('id') as string | null;
      let response;
      if (id) {
        response = await updateAudioSample(id, formData);
        setSamples(samples.map(sample => sample._id === id ? response.data : sample));
      } else {
        response = await createAudioSample(formData);
        setSamples([...samples, response.data]);
      }
      setSelectedSample(null);
    } catch (error) {
      console.error('Error saving sample:', error);
    }
  };
  */

  const handleDeleteSample = async (sample: AudioSample) => {
    try {
      await deleteUserSample(sample);
      setSamples(samples.filter((sample) => sample._id !== sample._id));
    } catch (error) {
      console.error('Error deleting preset:', error);
    }
  };

  const handleSampleSelect = (sample: AudioSample) => {
    setSelectedSample(sample);
    console.log(selectedSample);
    // Optionally, update the audio settings in the AudioGenerator component
  };


  // <SampleForm
  // sample={selectedSample}
  // onSaveSample={handleSaveSample}
  // />
  return (
    <div className="sample-manager">
      <h2>Sample Manager</h2>

      <SamplesList
        samples={samples}
        onSampleSelect={handleSampleSelect}
        onSampleDelete={handleDeleteSample}
      />
    </div>
  );
};

export default SampleManagerPage;