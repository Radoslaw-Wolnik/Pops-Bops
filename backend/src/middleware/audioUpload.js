import multer from 'multer';
import path from 'path';

const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/audio/');
  },
  filename: (req, file, cb) => {
    const userId = req.user.id;
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `audio-${userId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

const audioFileFilter = (req, file, cb) => {
  const allowedTypes = /wav|mp3|ogg/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: File upload only supports audio files (wav, mp3, ogg)"));
};

const audioUpload = multer({
  storage: audioStorage,
  fileFilter: audioFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  }
});

export default audioUpload;