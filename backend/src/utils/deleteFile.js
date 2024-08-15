import fs from 'fs';
import path from 'path';

export const deleteFileFromStorage = (filePath) => {
  return new Promise((resolve, reject) => {
    const fullPath = path.join(process.cwd(), 'public', filePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};