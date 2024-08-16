// src/controllers/authController.js
import crypto from 'crypto';
import bcrypt from 'bcrypt';

import RevokedToken from '../models/RevokedToken.js';
import User from '../models/User.js';

import { generateToken, setTokenCookie, refreshToken as refreshAuthToken, generateShortLivedToken, setShortLivedTokenCookie,  } from '../middleware/auth.js';
import env from '../config/environment.js';
import sendEmail from '../utils/sendEmail.js';


export const login = async (req, res) => {
  // If user is already authenticated via short-lived token, send success response
  if (req.user) {
    return res.json({ 
      message: 'Login successful', 
      user: { id: req.user._id, role: req.user.role, isVerified: req.user.isVerified }
    });
  }

  try {
    const { email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified 
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email before logging in' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and return JWT token
    const token = generateToken(user);
    setTokenCookie(res, token);
    res.json({ message: 'Login successful', user: { id: user._id, role: user.role } });
    // http
    // res.json({ token, user: { id: user._id, username: user.username, role: user.role } });

  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const logout = async (req, res) => {
  try {
    //const token = req.headers.authorization.split(' ')[1];
    //const token = extractToken(req);
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: 'No token provided.' });
    }

    const decodedToken = jwt.decode(token);
    if (!decodedToken) {
      return res.status(400).json({ message: 'Invalid token.' });
    }

    // Add the token to the revoked tokens list
    await RevokedToken.create({
      token: token,
      expiresAt: new Date(decodedToken.exp * 1000)
    });
    //console.log("Succes at revoking the token");

    //res.clearCookie('token');
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict' });
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ message: 'Token already revoked.' });
    }
    res.status(500).json({ message: 'Server error during logout' });
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Check if username is already taken
    user = await User.findOne({ username });
    if (user) {
      return res.status(401).json({ message: 'Username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create verification token
    const verificationToken = crypto.randomBytes(20).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires,
      role: 'user'
    });

    await user.save();

    // Generate a short-lived token and set it as a cookie
    const shortLivedToken = generateShortLivedToken(user);
    setShortLivedTokenCookie(res, shortLivedToken);

    const verificationUrl = `${env.FRONTEND}/verify-email/${verificationToken}`;
    console.log('Attempting to send email to:', user.email);
    console.log('Verification URL:', verificationUrl);
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `
    });
    console.log('Email sent successfully');

    res.status(201).json({ 
      message: 'User registered. Please check your email to verify your account.'
    });
  } catch (error) {
    console.error('Error in registration process:', error);
    if (error.response) {
      console.error('Email service response:', error.response.body);
    }
    res.status(500).send('Server error');
  }
};

export const refreshToken = async (req, res) => {
  // Use the existing refreshToken function from the auth module
  try {
    await refreshAuthToken(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Failed to refresh token', error: error.message });
  }
};

export const sendVerificationEmail = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    await user.save();

    const verificationUrl = `${env.FRONTEND}/verify-email/${verificationToken}`;
    
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email',
      html: `
        <h1>Verify Your Email</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `
    });

    res.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};