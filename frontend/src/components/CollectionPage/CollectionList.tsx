import React from 'react';
import { Collection } from '../../types';

interface CollectionListProps {
  collections: Collection[];
  onAddToCollection: (collectionId: string) => void;
}

const CollectionList: React.FC<CollectionListProps> = ({ collections, onAddToCollection }) => {
  return (
    <div className="collections-list">
      {collections.map((collection) => (
        <div key={collection._id} className="collection-item">
          <h3>{collection.name}</h3>
          <p>Samples: {collection.samples.length}</p>
          <button onClick={() => onAddToCollection(collection._id)}>
            Add Selected Samples
          </button>
        </div>
      ))}
    </div>
  );
};

export default CollectionList;