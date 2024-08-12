import express from 'express';
import { 
  register, 
  login, 
  logout, 
  
  getUserOwnProfile, 
  changePassword,

  handleProfilePictureUpload,
  saveProfilePicture,

  sendVerificationEmail, 
  verifyEmail 
} from '../controllers/userController.js';
import authenticateToken from '../middleware/auth.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateToken, logout);

// it first executes authenticateToken then getUserProfile so in auth we decode the token to id of user
router.get('/me', authenticateToken, getUserOwnProfile);

//router.put('/upload-profile-picture', authenticateToken, upload.single('profilePicture'), saveProfilePicture);
router.put('/upload-profile-picture', authenticateToken, handleProfilePictureUpload, saveProfilePicture);

router.put('/change-password', authenticateToken, changePassword);

router.post('/send-verification', authenticateToken, sendVerificationEmail);
router.get('/verify-email/:token', verifyEmail);


export default router;
