import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

import User, { IUserDocument } from '../models/user.model';
import { ValidationError, UnauthorizedError, NotFoundError, UploadError } from '../utils/custom-errors.util';
import { deleteFileFromStorage } from '../utils/delete-file.util';

export const getUserOwnProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  console.log("backend is trying");
  //console.log('data: ', req.user);
  
  if (!req.user) {
    throw new UnauthorizedError('User not authenticated');
  }

  // Create a new object without the password
  const userWithoutPassword = req.user.toObject();
  delete userWithoutPassword.password;

  // Get the decrypted email using the model's method
  userWithoutPassword.email = req.user.getDecryptedEmail();

  res.json(userWithoutPassword);

};

export const saveProfilePicture = async (req: AuthRequestWithFile, res: Response): Promise<void> => {
  try {
    // i would like to delete this becouse we have already checked that based on the authToken middleware before in routes
    // but i need it - othervise ts error
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated'); // will never happen
    }

    if (!req.file) {
      throw new ValidationError('No file uploaded');
    }

    // If user already has a profile picture, delete the old one
    if (req.user.profilePicture) {
      const oldPicturePath = path.join(__dirname, '..', req.user.profilePicture);
      await deleteFileFromStorage(oldPicturePath)
    }

    // The file is already uploaded by the middleware, so we just need to save the path
    const relativePath = `/uploads/profile-picture/${req.file.filename}`;
    req.user.profilePicture = relativePath;
    await req.user.save();

    res.json({
      message: 'Profile picture updated successfully',
      profilePicture: relativePath
    });
  } catch (error) {
    console.error('Error saving profile picture:', error);
    // If an error occurs, attempt to delete the uploaded file
    if (req.file) {
      // should insted use the delete-file util
      await deleteFileFromStorage(req.file.path)
    }
    if (error instanceof UploadError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: (error as Error).message });
    }
  }
};


export const getOtherUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      throw new NotFoundError('User');
    }
    res.json(user);
  }  catch (error) {
    console.error('Error fetching user profile:', error);
    if (error instanceof NotFoundError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Server error' });
    }
  }
};