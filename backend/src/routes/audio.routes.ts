//src/routes/audioRoutes.ts
import express, { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/roles.middleware.js';
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

router.use(authenticateToken);
router.post('/upload/sample', multerErrorHandler(uploadAudio), saveAudioSample);
router.post('/upload/sample-with-icon', multerErrorHandler(uploadAudioAndIcon), saveAudioSampleWithIcon);

router.put('/sample/:id', updateAudioSample);
router.delete('/sample/:id', deleteAudioSample);

// Admin routes
router.use(isAdmin)
router.post('/upload/default-sample', multerErrorHandler(uploadAudio), saveAudioSample);
router.post('/upload/default-sample-with-icon', multerErrorHandler(uploadAudioAndIcon), saveAudioSampleWithIcon);
router.delete('/default-sample/:id', deleteAudioSample);

export default router;