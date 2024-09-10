//src/routes/audioRoutes.ts
import express, { Router } from 'express';
import { authenticateAdmin, authenticateToken } from '../middleware/auth.middleware.js';
import {
  getMainPageSamples,
  getUserSamples,
  
  saveAudioSampleWithIcon,
  saveAudioSample,
  updateAudioSample,
  deleteAudioSample
} from '../controllers/audio.controller.js';

import { uploadAudio, uploadAudioAndIcon } from '../middleware/upload.middleware.js';
import { multerErrorHandler } from '../middleware/multer.middleware.js';

const router: Router = express.Router();

router.get('/main-samples', getMainPageSamples);
router.get('/my-samples', authenticateToken, getUserSamples);

router.post('/upload/audio', authenticateToken, multerErrorHandler(uploadAudio), saveAudioSample);
router.post('/upload/audio-with-icon', authenticateToken, multerErrorHandler(uploadAudioAndIcon), saveAudioSampleWithIcon);

router.put('/audio-sample/:id', authenticateToken, updateAudioSample);

router.delete('/audio-sample/:id', authenticateToken, deleteAudioSample);

// Admin routes
router.post('/upload/default-audio', authenticateAdmin, multerErrorHandler(uploadAudio), saveAudioSample);
router.post('/upload/default-audio-with-icon', authenticateAdmin, multerErrorHandler(uploadAudioAndIcon), saveAudioSampleWithIcon);
router.delete('/default-audio-sample/:id', authenticateAdmin, deleteAudioSample);

export default router;