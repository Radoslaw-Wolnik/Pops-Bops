import multer from 'multer';
import path from 'path';
import { Request } from 'express';
//import { AuthRequest } from '../../types/global'; // Import the AuthRequest type
// Import Multer's FileFilterCallback type
import { FileFilterCallback } from 'multer';


// Define a more specific type for the callback function
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;


const createStorage = (baseDir: string) => multer.diskStorage({
  destination: (req: AuthRequest, file: Express.Multer.File, cb: DestinationCallback) => {
    const userType = req.path.includes('default') ? 'default' : 'user';
    cb(null, `uploads/${baseDir}/${userType}/`);
  },
  filename: (req: AuthRequest, file: Express.Multer.File, cb: FileNameCallback) => {
    const userId = req.user ? req.user._id : 'default';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${baseDir}-${userId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

const profilePictureStorage = createStorage('profile-picture');
const audioStorage = createStorage('audio');
const iconStorage = createStorage('icons');


// Define a more specific type for the file filter callback
//type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;

const picturefileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Error: File upload only supports audio files (wav, mp3, ogg)"));
  }
};

const audiofileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /wav|mp3|ogg/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Error: File upload only supports audio files (wav, mp3, ogg)"));
  }
};

const iconfileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedTypes = /png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Error: File upload only supports images (png)"));
  }
};

const profilePictureUpload = multer({
  storage: profilePictureStorage,
  fileFilter: picturefileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const audioUpload = multer({
  storage: audioStorage,
  fileFilter: audiofileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const iconUpload = multer({
  storage: iconStorage,
  fileFilter: iconfileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});

export const uploadProfilePicture = profilePictureUpload.single('profilePicture');
export const uploadAudio = audioUpload.single('audio');
export const uploadIcon = iconUpload.single('icon');
