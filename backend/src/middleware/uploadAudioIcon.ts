// uploadAudioIcon.ts
import multer from 'multer';
import path from 'path';
import { Request } from 'express';

const createMultipleUpload = () => {
  const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
      let uploadPath = 'uploads/';
      if (file.fieldname === 'audio') {
        uploadPath += 'audio/';
      } else if (file.fieldname === 'icon') {
        uploadPath += 'icons/';
      }
      uploadPath += req.user ? 'user/' : 'default/';
      cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
      const userId = req.user ? req.user.id : 'default';
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
        cb(new Error("Error: File upload only supports audio files (wav, mp3, ogg)"), false);
      }
    } else if (file.fieldname === 'icon') {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const mimetype = allowedTypes.test(file.mimetype);
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        cb(null, true);
      } else {
        cb(new Error("Error: File upload only supports images (jpeg, jpg, png, gif)"), false);
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