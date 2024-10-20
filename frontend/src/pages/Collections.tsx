import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { getUserCollections, createCollection, deleteCollection, updateCollectionOrder } from '../services/api';
import { Collection } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { useInView } from 'react-intersection-observer';

const ITEMS_PER_PAGE = 10;

export const CollectionsPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const fetchCollections = useCallback(async () => {
    try {
      const data = await getUserCollections(page, ITEMS_PER_PAGE);
      setCollections(prevCollections => [...prevCollections, ...data]);
      setHasMore(data.length === ITEMS_PER_PAGE);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch collections. Please try again.');
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [inView, hasMore]);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const newCollection = await createCollection(newCollectionName);
      setCollections([newCollection, ...collections]);
      setNewCollectionName('');
    } catch (err) {
      setError('Failed to create collection. Please try again.');
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      await deleteCollection(collectionId);
      setCollections(collections.filter(c => c._id !== collectionId));
    } catch (err) {
      setError('Failed to delete collection. Please try again.');
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(collections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setCollections(items);

    try {
      await updateCollectionOrder(items.map(item => item._id));
    } catch (err) {
      setError('Failed to update collection order. Please try again.');
    }
  };

  if (loading && collections.length === 0) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">My Collections</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleCreateCollection} className="mb-8">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="New collection name"
            required
          />
          <Button type="submit">Create Collection</Button>
        </div>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="collections">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {collections.map((collection, index) => (
                <Draggable key={collection._id} draggableId={collection._id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="border p-4 rounded-lg mb-4"
                    >
                      <h2 className="text-xl font-semibold mb-2">{collection.name}</h2>
                      <p>{collection.samples.length} samples</p>
                      <div className="mt-4 space-x-2">
                        <Link to={`/collections/${collection._id}`}>
                          <Button variant="outline">View</Button>
                        </Link>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDeleteCollection(collection._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {hasMore && (
        <div ref={ref} className="text-center py-4">
          Loading more...
        </div>
      )}
    </div>
  );
};