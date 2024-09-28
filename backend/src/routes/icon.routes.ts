import express, { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/roles.middleware.js';
import { 
  saveIconToStorage,
  updateIcon
} from "../controllers/icon.controller.js";
import { uploadIcon } from '../middleware/upload.middleware.js';
import { multerErrorHandler } from '../middleware/multer.middleware.js';

const router: Router = express.Router();
router.use(authenticateToken);

router.post('/upload',  multerErrorHandler(uploadIcon), saveIconToStorage);
router.post('/upload-default', isAdmin, multerErrorHandler(uploadIcon), saveIconToStorage);

router.patch('/update/:id', multerErrorHandler(uploadIcon), updateIcon);
router.patch('/update-default/:id', isAdmin, multerErrorHandler(uploadIcon), updateIcon);


export default router;