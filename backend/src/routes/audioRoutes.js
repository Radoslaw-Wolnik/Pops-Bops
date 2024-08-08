//src/routes/audioRoutes.js
import express from 'express';
import authenticateToken from '../middleware/auth.js';
import { 
    generateAudioSample, 
    getSamples, 
    savePreset, 
    getPresets,
    createCollection,
    addToCollection,
    getCollections,
    saveAudioSample,
    deletePreset
} from '../controllers/audioController.js';

const router = express.Router();

router.post('/generate', authenticateToken, generateAudioSample);
router.get('/samples', authenticateToken, getSamples);
router.post('/presets', authenticateToken, savePreset);
router.get('/presets', authenticateToken, getPresets);
router.delete('/presets/:id', authenticateToken, deletePreset);
router.post('/collections', authenticateToken, createCollection);
router.post('/collections/:id/add', authenticateToken, addToCollection);
router.get('/collections', authenticateToken, getCollections);
router.post('/save', saveAudioSample);

export default router;