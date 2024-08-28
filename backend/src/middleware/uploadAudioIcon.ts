// uploadAudioIcon.ts
import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { FileFilterCallback } from 'multer';

// Define a more specific type for the callback function
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const createMultipleUpload = () => {
  const storage = multer.diskStorage({
    destination: (req: AuthRequest, file: Express.Multer.File, cb: DestinationCallback ) => {
      let uploadPath = 'uploads/';
      if (file.fieldname === 'audio') {
        uploadPath += 'audio/';
      } else if (file.fieldname === 'icon') {
        uploadPath += 'icons/';
      }
      uploadPath += req.user ? 'user/' : 'default/';
      cb(null, uploadPath);
    },
    filename: (req: AuthRequest, file: Express.Multer.File, cb: FileNameCallback ) => {
      const userId = req.user ? req.user._id : 'default';
      const timestamp = Date.now();
      const ext = path.extname(file.originalname).toLowerCase();
      const filename = `${file.fieldname}-${userId}-${timestamp}${ext}`;
      cb(null, filename);
    }
  });

  const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.fieldname === 'audio') {
      const allowedTypes = /wav|mp3|ogg/;
      const mimetype = allowedTypes.test(file.mimetype);
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(new Error("Error: File upload only supports audio files (wav, mp3, ogg)"));
      }
    } else if (file.fieldname === 'icon') {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const mimetype = allowedTypes.test(file.mimetype);
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(new Error("Error: File upload only supports images (jpeg, jpg, png, gif)"));
      }
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10 MB limit
    }
  });
};

export const uploadAudioIcon = createMultipleUpload().fields([
  { name: 'audio', maxCount: 1 },
  { name: 'icon', maxCount: 1 }
]);