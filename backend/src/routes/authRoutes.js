// src/routes/authRoutes.js
import express from 'express';
import { 
    register, 
    login, 
    logout, 
    refreshToken, 
    
    sendVerificationEmail, 
    verifyEmail, 
    
    changePassword
} from '../controllers/authController.js';
import { authenticateToken, handlePostRegistrationAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);

router.post('/login', handlePostRegistrationAuth, login);
router.post('/logout', authenticateToken, logout);

router.post('/refresh-token', authenticateToken, refreshToken);

router.post('/send-verification', authenticateToken, sendVerificationEmail);
router.get('/verify-email/:token', verifyEmail);

router.put('/change-password', authenticateToken, changePassword);

export default router;