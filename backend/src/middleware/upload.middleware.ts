import multer from 'multer';
import path from 'path';
import { Request, NextFunction } from 'express';
// Import Multer's FileFilterCallback type
import { FileFilterCallback } from 'multer';

import { FileTypeNotAllowedError, FileSizeTooLargeError, BadRequestError } from '../utils/custom-errors.util';


// Define a more specific type for the callback function
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;


const createStorage = (baseDir: string, useUserSubfolder: boolean = true) => multer.diskStorage({
  destination: (req: AuthRequestWithFile, file: Express.Multer.File, cb: DestinationCallback) => {
    const isAdmin = req.user && req.user.role === 'admin';
    let uploadPath = `uploads/${baseDir}/`;
    if (useUserSubfolder) {
      uploadPath += isAdmin ? 'default/' : 'user/';
    }
    cb(null, uploadPath);
  },
  filename: (req: AuthRequestWithFile, file: Express.Multer.File, cb: FileNameCallback) => {
    const userId = req.user ? req.user._id : 'default';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${baseDir}-${userId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

const audioStorage = createStorage('audio');
const iconStorage = createStorage('icons');
const profilePictureStorage = createStorage('profile-picture', false);



const createFileFilter = (allowedTypes: RegExp, errorMessage: string) => 
  (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      cb(null, true);
    } else {
      cb(new FileTypeNotAllowedError([...allowedTypes.source.matchAll(/\w+/g)].map(m => m[0])));
    }
  };

export const audioFileFilter = createFileFilter(/wav|mp3|ogg/, "File upload only supports audio files (wav, mp3, ogg)");
export const iconFileFilter = createFileFilter(/png/, "File upload only supports images (png)");
export const pictureFileFilter = createFileFilter(/jpeg|jpg|png|gif/, "File upload only supports image files (jpeg, jpg, png, gif)");



const createMulterUpload = (storage: multer.StorageEngine, fileFilter: multer.Options['fileFilter'], maxSize: number) => 
  multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: maxSize },
  }).single('file');

export const uploadProfilePicture = createMulterUpload(profilePictureStorage, pictureFileFilter, 5 * 1024 * 1024);
export const uploadAudio = createMulterUpload(audioStorage, audioFileFilter, 10 * 1024 * 1024);
export const uploadIcon = createMulterUpload(iconStorage, iconFileFilter, 2 * 1024 * 1024);

// Middleware to handle Multer errors
export const handleMulterError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      next(new FileSizeTooLargeError(err.field === 'audio' ? 10 * 1024 * 1024 : 2 * 1024 * 1024));
    } else {
      next(new BadRequestError(err.message));
    }
  } else if (err instanceof Error) {
    next(err);
  } else {
    next(new BadRequestError('Unknown error during file upload'));
  }
};


// Import the combined upload middleware
export { uploadAudioAndIcon } from './upload-combined.middleware';