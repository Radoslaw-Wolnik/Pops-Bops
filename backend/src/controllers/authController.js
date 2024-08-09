// src/controllers/authController.js
import { generateToken } from '../middleware/auth.js';

export const refreshToken = async (req, res) => {
  // The user object is attached to the request by the authenticateToken middleware
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const newToken = generateToken(user);

  res.json({ token: newToken });
};