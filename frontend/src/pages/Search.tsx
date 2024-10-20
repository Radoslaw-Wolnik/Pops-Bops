import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchSamplesAndCollections } from '../services/api';
import { AudioSample, Collection } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { Link } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [samples, setSamples] = useState<AudioSample[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      performSearch(query);
    }
  }, [location.search]);

  const performSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const { samples, collections } = await searchSamplesAndCollections(query);
      setSamples(samples);
      setCollections(collections);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Search Results</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Samples</h2>
        {samples.length === 0 ? (
          <p>No samples found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {samples.map((sample) => (
              <AudioPlayer key={sample._id} src={sample.audioUrl} name={sample.name} />
            ))}
          </div>
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Collections</h2>
        {collections.length === 0 ? (
          <p>No collections found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map((collection) => (
              <Link key={collection._id} to={`/collections/${collection._id}`} className="block p-4 border rounded hover:bg-gray-100">
                <h3 className="font-semibold">{collection.name}</h3>
                <p>{collection.samples.length} samples</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};