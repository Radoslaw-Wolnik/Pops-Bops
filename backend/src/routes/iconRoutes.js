import express from 'express';
import authenticateToken, { authenticateAdmin } from '../middleware/auth.js';
import { 
  handleIconUpload,
  saveIconToStorage
} from "../controllers/iconController.js";

const router = express.Router();

router.post('/upload-icon', authenticateToken, handleIconUpload, saveIconToStorage);
router.post('/upload-default-icon', authenticateAdmin, handleIconUpload, saveIconToStorage);

export default router;