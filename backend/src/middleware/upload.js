import multer from 'multer';
import path from 'path';


const createStorage = (baseDir) => multer.diskStorage({
  destination: (req, file, cb) => {
    const userType = req.path.includes('default') ? 'default' : 'user';
    cb(null, `uploads/${baseDir}/${userType}/`);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user.id : 'default';
    const timestamp = Date.now();
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${baseDir}-${userId}-${timestamp}${ext}`;
    cb(null, filename);
  }
});

const profilePictureStorage = createStorage('profile-picture');
const audioStorage = createStorage('audio');
const iconStorage = createStorage('icons');


const picturefileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: File upload only supports images (jpeg, jpg, png, gif)"));
};

const audiofileFilter = (req, file, cb) => {
  const allowedTypes = /wav|mp3|ogg/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: File upload only supports audio files (wav, mp3, ogg)"));
};

const iconfileFilter = (req, file, cb) => {
  const allowedTypes = /png/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error("Error: File upload only supports images (png)"));
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