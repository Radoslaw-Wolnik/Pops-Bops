// src/routes/authRoutes.js
import express from 'express';
import { refreshToken } from '../controllers/authController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.post('/refresh-token', authenticateToken, refreshToken);

export default router;