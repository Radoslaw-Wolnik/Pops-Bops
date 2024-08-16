//src/routes/audioRoutes.js
import express from 'express';
import { authenticateAdmin, authenticateToken } from '../middleware/auth.js';
import {
  handleAudioUpload,
  saveAudioToStorage,
  
  getMainPageSamples,
  getUserSamples,
  getUserCollections,
  
  createCollection,
  addToCollection,

  saveUserAudioSampleWithIcon,
  saveDefaultAudioSampleWithIcon,

  deleteUserSample,
  deleteDefaultSample,
  deleteCollection
} from '../controllers/audioController.js';

import { updateUserAudioSampleIcon } from '../controllers/iconController.js';

const router = express.Router();


router.get('/main-samples', getMainPageSamples);
router.get('/my-samples', authenticateToken, getUserSamples)

router.post('/collections', authenticateToken, createCollection);
router.post('/collections/:id/add', authenticateToken, addToCollection);
router.get('/collections', authenticateToken, getUserCollections);

router.post('/upload-audio', authenticateToken, handleAudioUpload, saveAudioToStorage);
router.post('/upload-default-audio', authenticateAdmin, handleAudioUpload, saveAudioToStorage);

router.post('/user-audio-sample', authenticateToken, saveUserAudioSampleWithIcon);
router.put('/user-audio-sample/:id/icon', authenticateToken, updateUserAudioSampleIcon);
router.post('/default-audio-sample', authenticateAdmin, saveDefaultAudioSampleWithIcon);

router.delete('/sample/:id', authenticateToken, deleteUserSample);
router.delete('/default-sample/:id', authenticateAdmin, deleteDefaultSample);
router.delete('/collections/:id', authenticateToken, deleteCollection)


export default router;