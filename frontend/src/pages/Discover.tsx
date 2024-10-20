import React, { useState, useEffect } from 'react';
import { getPublicSamples, getPublicCollections, searchPublicContent } from '../services/api';
import { AudioSample, Collection } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { AudioPlayer } from './AudioPlayer';
import { Link } from 'react-router-dom';

export const DiscoverPage: React.FC = () => {
  const [samples, setSamples] = useState<AudioSample[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'samples' | 'collections'>('samples');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialContent();
  }, []);

  const fetchInitialContent = async () => {
    setLoading(true);
    setError(null);
    try {
      const [samplesData, collectionsData] = await Promise.all([
        getPublicSamples(),
        getPublicCollections()
      ]);
      setSamples(samplesData);
      setCollections(collectionsData);
    } catch (err) {
      setError('Failed to fetch public content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchInitialContent();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const results = await searchPublicContent(searchQuery, searchType);
      if (searchType === 'samples') {
        setSamples(results as AudioSample[]);
        setCollections([]);
      } else {
        setCollections(results as Collection[]);
        setSamples([]);
      }
    } catch (err) {
      setError('Failed to perform search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Discover</h1>

      <div className="mb-8">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for samples or collections"
          className="mr-2"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'samples' | 'collections')}
          className="mr-2 p-2 border rounded"
        >
          <option value="samples">Samples</option>
          <option value="collections">Collections</option>
        </select>
        <Button onClick={handleSearch}>Search</Button>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {samples.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Public Samples</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {samples.map((sample) => (
                  <AudioPlayer key={sample._id} src={sample.audioUrl} name={sample.name} />
                ))}
              </div>
            </div>
          )}

          {collections.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Public Collections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {collections.map((collection) => (
                  <Link
                    key={collection._id}
                    to={`/collections/${collection._id}`}
                    className="block p-4 border rounded hover:bg-gray-100"
                  >
                    <h3 className="font-semibold">{collection.name}</h3>
                    <p>{collection.samples.length} samples</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {samples.length === 0 && collections.length === 0 && (
            <div>No results found.</div>
          )}
        </>
      )}
    </div>
  );
};