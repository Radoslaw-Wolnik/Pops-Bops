import express, { Router } from 'express';
import { authenticateAdmin, authenticateToken } from '../middleware/auth.middleware.js';
import { 
  saveIconToStorage,
  updateIcon
} from "../controllers/icon.controller.js";
import { uploadIcon } from '../middleware/upload.middleware.js';
import { multerErrorHandler } from '../middleware/error-handler.middleware.js';

const router: Router = express.Router();

router.post('/upload-icon', authenticateToken, multerErrorHandler(uploadIcon), saveIconToStorage);
router.post('/upload-default-icon', authenticateAdmin, multerErrorHandler(uploadIcon), saveIconToStorage);

router.patch('/update-icon/:id', authenticateToken, multerErrorHandler(uploadIcon), updateIcon);
router.patch('/update-default-icon/:id', authenticateAdmin, multerErrorHandler(uploadIcon), updateIcon);


export default router;