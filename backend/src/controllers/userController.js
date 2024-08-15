import User from '../models/User.js';
import fs from 'fs';
import path from 'path';
import { uploadProfilePicture } from '../middleware/upload.js';

export const getUserOwnProfile = async (req, res) => {
  console.log("backend is trying");
  //console.log('data: ', req.user);

  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('user not found ughhh');
      return res.status(404).json({ message: 'User not found' });
    }
    //console.log('user found:', user);
    console.log("user found succesfully");
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const saveProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      // Delete the uploaded file if user not found
      await fs.unlink(req.file.path);
      return res.status(404).json({ message: 'User not found' });
    }

    // If user already has a profile picture, delete the old one
    if (user.profilePicture) {
      const oldPicturePath = path.join(__dirname, '..', user.profilePicture);
      await fs.unlink(oldPicturePath).catch(err => console.error('Error deleting old profile picture:', err));
    }

    const relativePath = `/uploads/profile-picture/${req.file.filename}`;
    user.profilePicture = relativePath;
    await user.save();

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: relativePath
    });
  } catch (error) {
    console.error('Error saving profile picture:', error);
    // If an error occurs, attempt to delete the uploaded file
    if (req.file) {
      await fs.unlink(req.file.path).catch(err => console.error('Error deleting uploaded file:', err));
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const handleProfilePictureUpload = (req, res, next) => {
  uploadProfilePicture(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ message: 'File upload error', error: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(500).json({ message: 'Unknown upload error', error: err.message });
    }
    
    // Everything went fine.
    next();
  });
};


export const getOtherUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};