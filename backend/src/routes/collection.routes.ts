import express, { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import {
  getUserCollections,
  createCollection,
  addToCollection,
  deleteCollection,
  removeFromCollection,
  getCollectionById,
  updateCollection
} from '../controllers/collection.controller';

const router: Router = express.Router();

router.use(authenticateToken);
// Get all collections for the authenticated user
router.get('/', getUserCollections);

// Get a specific collection by ID
router.get('/:id', getCollectionById);

// Create a new collection
router.post('/', createCollection);

// Update a collection
router.put('/:id', updateCollection);

// Delete a collection
router.delete('/:id', deleteCollection);

// Add samples to a collection
router.post('/:id/add', addToCollection);

// Remove a sample from a collection
router.delete('/:collectionId/samples/:sampleId', removeFromCollection);

export default router;
