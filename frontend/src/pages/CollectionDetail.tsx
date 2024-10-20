import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserCollections, updateCollection, removeFromCollection, addToCollection } from '../services/api';
import { Collection, AudioSample } from '../types';
import { Button } from './Button';
import { Input } from './Input';

export const CollectionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [name, setName] = useState('');
  const [availableSamples, setAvailableSamples] = useState<AudioSample[]>([]);
  const [selectedSample, setSelectedSample] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCollection(id);
      fetchAvailableSamples();
    }
  }, [id]);

  const fetchCollection = async (collectionId: string) => {
    try {
      const collections = await getUserCollections();
      const foundCollection = collections.find(c => c._id === collectionId);
      if (foundCollection) {
        setCollection(foundCollection);
        setName(foundCollection.name);
      } else {
        setError('Collection not found');
      }
    } catch (err) {
      setError('Failed to fetch collection. Please try again.');
    }
  };

  const fetchAvailableSamples = async () => {
    // This should be implemented in the API to get samples not in the current collection
    // For now, we'll use a placeholder
    setAvailableSamples([]);
  };

  const handleUpdateName = async () => {
    if (!collection) return;
    try {
      const updatedCollection = await updateCollection(collection._id, { name });
      setCollection(updatedCollection);
    } catch (err) {
      setError('Failed to update collection name. Please try again.');
    }
  };

  const handleRemoveSample = async (sampleId: string) => {
    if (!collection) return;
    try {
      await removeFromCollection(collection._id, sampleId);
      setCollection({
        ...collection,
        samples: collection.samples.filter(s => s._id !== sampleId)
      });
    } catch (err) {
      setError('Failed to remove sample from collection. Please try again.');
    }
  };

  const handleAddSample = async () => {
    if (!collection || !selectedSample) return;
    try {
      await addToCollection(collection._id, [selectedSample]);
      fetchCollection(collection._id);
      setSelectedSample('');
    } catch (err) {
      setError('Failed to add sample to collection. Please try again.');
    }
  };

  if (!collection) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Collection: {collection.name}</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="mb-8">
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mr-2"
        />
        <Button onClick={handleUpdateName}>Update Name</Button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Samples in Collection</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {collection.samples.map((sample) => (
          <div key={sample._id} className="border p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{sample.name}</h3>
            <Button onClick={() => handleRemoveSample(sample._id)} variant="destructive">
              Remove from Collection
            </Button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-4">Add Sample to Collection</h2>
      <div className="flex space-x-2 mb-8">
        <select
          value={selectedSample}
          onChange={(e) => setSelectedSample(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="">Select a sample</option>
          {availableSamples.map((sample) => (
            <option key={sample._id} value={sample._id}>{sample.name}</option>
          ))}
        </select>
        <Button onClick={handleAddSample} disabled={!selectedSample}>Add to Collection</Button>
      </div>

      <Button onClick={() => navigate('/collections')} variant="outline">Back to Collections</Button>
    </div>
  );
};