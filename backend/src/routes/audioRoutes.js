//src/routes/audioRoutes.js
import express from 'express';
import { authenticateToken, authenticateAdmin } from '../middleware/auth.js';
import {
  handleAudioUpload,
  saveAudioToStorage,
  
  getMainPageSamples,
  getUserSamples,
  getUserCollections,
  
  createCollection,
  addToCollection,


  saveUserAudioSampleWithIcon,
  saveDefaultAudioSampleWithIcon
} from '../controllers/audioController.js';

import { updateUserAudioSampleIcon } from '../controllers/iconControllers.js';

const router = express.Router();


router.get('/samples', getMainPageSamples);
router.get('/samples/:id', authenticateToken, getUserSamples)

router.post('/collections', authenticateToken, createCollection);
router.post('/collections/:id/add', authenticateToken, addToCollection);
router.get('/collections', authenticateToken, getUserCollections);

router.post('/upload-audio', authenticateToken, handleAudioUpload, saveAudioToStorage);
router.post('/upload-default-audio', authenticateAdmin, handleAudioUpload, saveAudioToStorage);

router.post('/user-audio-sample', authenticateToken, saveUserAudioSampleWithIcon);
router.put('/user-audio-sample/:id/icon', authenticateToken, updateUserAudioSampleIcon);
router.post('/default-audio-sample', authenticateAdmin, saveDefaultAudioSampleWithIcon);


export default router;