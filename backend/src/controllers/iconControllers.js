//import DefaultAudioSample from '../models/DefaultAudioSample.js';
import UserAudioSample from '../models/UserAudioSample.js';
import { uploadAudioIcon } from "../middleware/uploadAudioIcon";

export const handleIconUpload = (req, res, next) => {
  uploadIcon(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};
  
export const saveIconToStorage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const relativePath = `/uploads/icons/${req.file.filename}`;
    // Save the icon file information to your database here
  
    res.json({
      message: 'Icon uploaded successfully',
      iconPath: relativePath
    });
  } catch (error) {
    console.error('Error saving icon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const updateUserAudioSampleIcon = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      uploadAudioIcon(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  
    if (!req.files['icon']) {
      return res.status(400).json({ message: 'Icon file is required' });
    }
  
    const iconFile = req.files['icon'][0];
    const iconUrl = `/uploads/icons/user/${iconFile.filename}`;
  
    const audioSampleId = req.params.id;
    const updatedAudioSample = await UserAudioSample.findByIdAndUpdate(
      audioSampleId,
      { iconUrl: iconUrl },
      { new: true }
    );
  
    if (!updatedAudioSample) {
      return res.status(404).json({ message: 'Audio sample not found' });
    }
  
    res.status(200).json(updatedAudioSample);
  } catch (error) {
    console.error('Error updating audio sample icon:', error);
    res.status(500).json({ message: 'Error updating audio sample icon' });
  }
};