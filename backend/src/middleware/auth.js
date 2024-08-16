// src/middleware/auth.js
// although now im thinking it mby should be in utils ?? 

import jwt from 'jsonwebtoken';
import RevokedToken from '../models/RevokedToken.js';
import User from '../models/User.js';

// Helper function to generate a short-lived token
export const generateShortLivedToken = (user) => {
  return jwt.sign(
    { userId: user._id, shortLived: true },
    process.env.JWT_SECRET,
    { expiresIn: '5m' } // Token expires in 5 minutes
  );
};

// Helper function to set a short-lived token as a cookie
export const setShortLivedTokenCookie = (res, token) => {
  res.cookie('shortLivedToken', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 300000 // 5 minutes in milliseconds
  });
};


export const generateToken = (user) => {
  return jwt.sign(
    { user: { id: user._id, role: user.role } },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    //secure: process.env.NODE_ENV === 'production', // Use secure in production
    secure: true,
    sameSite: 'strict',
    maxAge: 3600000 // 1 hour in milliseconds
  });
};

export const authenticateAdmin = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Check if the token has been revoked
    const revokedToken = await RevokedToken.findOne({ token: token });
    if (revokedToken) {
      return res.status(403).json({ message: 'Token has been revoked.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the user from the database to get the most up-to-date role information
    const user = await User.findById(decoded.user.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Check if the token has been revoked
    const revokedToken = await RevokedToken.findOne({ token: token });
    if (revokedToken) {
      return res.status(403).json({ message: 'Token has been revoked.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    req.user = user; // Ensure req.user is the same as user decoded;
    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const refreshToken = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    /* Check if the user's email is verified
     * if (!user.isVerified) {
     *   return res.status(403).json({ message: 'Email not verified. Please verify your email to continue.' });
     * }
    */

    const newToken = generateToken(user);
    setTokenCookie(res, newToken);

    res.json({ message: 'Token refreshed successfully', user: { id: user._id, role: user.role } });
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};


export const handlePostRegistrationAuth = async (req, res, next) => {
  const shortLivedToken = req.cookies.shortLivedToken;

  if (!shortLivedToken) {
    return next(); // Proceed to next middleware if no short-lived token
  }

  try {
    const decoded = jwt.verify(shortLivedToken, process.env.JWT_SECRET);
    
    if (!decoded.shortLived) {
      return next(); // Not a short-lived token, proceed to next middleware
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Clear the short-lived token cookie
    res.clearCookie('shortLivedToken');

    // Set the user on the request object
    req.user = user;

    // Generate and set a regular session token
    const sessionToken = generateToken(user);
    setTokenCookie(res, sessionToken);

    // Proceed to the next middleware
    next();

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      // Clear the invalid short-lived token and proceed
      res.clearCookie('shortLivedToken');
      return next();
    }
    console.error('Error in post-registration auth:', error);
    res.status(500).send('Server error');
  }
};