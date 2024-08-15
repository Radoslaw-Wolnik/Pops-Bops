import express from 'express';
import { 
  getUserOwnProfile, 

  handleProfilePictureUpload,
  saveProfilePicture,
} from '../controllers/userController.js';
import  { authenticateToken } from '../middleware/auth.js';


const router = express.Router();

// it first executes authenticateToken then getUserProfile so in auth we decode the token to id of user
router.get('/me', authenticateToken, getUserOwnProfile);

//router.put('/upload-profile-picture', authenticateToken, upload.single('profilePicture'), saveProfilePicture);
router.put('/upload-profile-picture', authenticateToken, handleProfilePictureUpload, saveProfilePicture);



export default router;
