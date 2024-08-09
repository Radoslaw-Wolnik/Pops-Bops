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

const profilePictureUpload = multer({
  storage: profilePictureStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

const audioUpload = multer({
  storage: audioStorage,
  fileFilter: audioFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const iconUpload = multer({
  storage: iconStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});


export const uploadProfilePicture = profilePictureUpload.single('profilePicture');
export const uploadAudio = audioUpload.single('audio');
export const uploadIcon = iconUpload.single('icon');