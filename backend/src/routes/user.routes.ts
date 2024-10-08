import express, { Router } from 'express';
import { 
  getUserOwnProfile, 

  saveProfilePicture,
} from '../controllers/user.controller.js';
import  { authenticateToken } from '../middleware/auth.middleware.js';
import { uploadProfilePicture } from '../middleware/upload.middleware.js';
import { multerErrorHandler } from '../middleware/multer.middleware.js';

const router: Router = express.Router();
router.use(authenticateToken);
// it first executes authenticateToken then getUserProfile so in auth we decode the token to id of user
router.get('/me', getUserOwnProfile);

//router.put('/upload-profile-picture', authenticateToken, upload.single('profilePicture'), saveProfilePicture);
router.put('/upload-profile-picture', multerErrorHandler(uploadProfilePicture), saveProfilePicture);


export default router;
