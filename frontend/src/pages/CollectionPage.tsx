import React, { useState, useEffect, useRef } from 'react';
import { Collection, AudioSample } from '../types';
import { getUserCollections, createCollection, addToCollection, getUserSamples } from '../services/api';
import CollectionList from '../components/CollectionPage/CollectionList';
import AudioPlayer from '../components/CollectionPage/AudioPlayer';
import SampleList from '../components/CollectionPage/SampleList';

const CollectionPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [selectedSamples, setSelectedSamples] = useState<AudioSample[]>([]);
  const [currentlyPlayingSample, setCurrentlyPlayingSample] = useState<AudioSample | null>(null);
  const [availableSamples, setAvailableSamples] = useState<AudioSample[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    fetchCollections();
    fetchAudioSamples();
  }, []);

  const fetchCollections = async () => {
    try {
      const response = await getUserCollections();
      setCollections(response.data);
    } catch (error) {
      console.error('Error fetching collections:', error);
    }
  };

  const fetchAudioSamples = async () => {
    try {
      const response = await getUserSamples();
      setAvailableSamples(response.data);
    } catch (error) {
      console.error('Error fetching audio samples:', error);
    }
  };

  const handleCreateCollection = async () => {
    try {
      await createCollection(newCollectionName);
      setNewCollectionName('');
      fetchCollections();
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    try {
      await addToCollection(collectionId, selectedSamples.map((sample) => sample._id));
      setSelectedSamples([]);
      fetchCollections();
    } catch (error) {
      console.error('Error adding to collection:', error);
    }
  };

  const handlePlayAudio = (sample: AudioSample) => {
    setCurrentlyPlayingSample(sample);
    if (audioRef.current) {
      audioRef.current.src = sample.audioUrl;
      audioRef.current.play();
    }
  };

  const handleStopAudio = () => {
    setCurrentlyPlayingSample(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleVolumeChange = (volume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  const handleLoopToggle = () => {
    if (audioRef.current) {
      audioRef.current.loop = !audioRef.current.loop;
    }
  };

  const handleSampleSelect = (sample: AudioSample) => {
    setSelectedSamples((prevSamples) => {
      if (prevSamples.some((s) => s._id === sample._id)) {
        return prevSamples.filter((s) => s._id !== sample._id);
      }
      return [...prevSamples, sample];
    });
  };

  return (
    <div className="collection-manager">
      <h1>Collections</h1>

      <div className="create-collection">
        <input
          type="text"
          value={newCollectionName}
          onChange={(e) => setNewCollectionName(e.target.value)}
          placeholder="New collection name"
        />
        <button onClick={handleCreateCollection}>Create Collection</button>
      </div>

      <CollectionList collections={collections} onAddToCollection={handleAddToCollection} />

      <AudioPlayer
        audioRef={audioRef}
        currentlyPlayingSample={currentlyPlayingSample}
        onVolumeChange={handleVolumeChange}
        onLoopToggle={handleLoopToggle}
        onStopAudio={handleStopAudio}
      />

      <SampleList samples={availableSamples} onSampleSelect={handleSampleSelect} onPlayAudio={handlePlayAudio} />
    </div>
  );
};

export default CollectionPage;