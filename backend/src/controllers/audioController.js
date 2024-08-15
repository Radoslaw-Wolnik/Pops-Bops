import { AudioSample } from '../models/AudioSample.js';
import DefaultAudioSample from '../models/DefaultAudioSample.js';
import UserAudioSample from '../models/UserAudioSample.js';
import Collection from '../models/Collection.js';

import { uploadAudioIcon } from '../middleware/uploadAudioIcon.js';
import { deleteFileFromStorage } from '../utils/deleteFile.js';


/* for future audio generating ( also save preset settings )
import CacheService from '../services/CacheService.js';

const cacheService = new CacheService();
export const generateAudioSample = async (req, res) => {
  try {
    const { settings } = req.body;
    const cacheKey = `audio-sample-${req.user.id}-${JSON.stringify(settings)}`;

    // Check if the audio sample is already in the cache
    const cachedSample = await cacheService.getFromCache(cacheKey);
    if (cachedSample) {
      return res.json(cachedSample);
    }

    // Generate the audio sample
    const audioData = await generateAudioWithSettings(settings);

    // Save the audio sample to the cache
    await cacheService.setInCache(cacheKey, audioData);

    res.json(audioData);
  } catch (error) {
    console.error('Error generating audio sample:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
*/

// --------- helper functions ------------

export const handleAudioUpload = (req, res, next) => {
  uploadAudio(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

export const saveAudioToStorage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const relativePath = `/uploads/audio/${req.file.filename}`;
    // Save the audio file information to your database here

    res.json({
      message: 'Audio file uploaded successfully',
      audioPath: relativePath
    });
  } catch (error) {
    console.error('Error saving audio:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// functions gets
export const getUserCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id }).populate('samples');
    res.json(collections);
  } catch (error) {
    console.error('Error fetching user collections:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMainPageSamples = async (req, res) => {
  try {
    const samples = await DefaultAudioSample.find({ forMainPage: true });
    res.json(samples);
  } catch (error) {
    console.error('Error fetching main page samples:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserSamples = async (req, res) => {
  try {
    const samples = await UserAudioSample.find({ user: req.user.id });
    res.json(samples);
  } catch (error) {
    console.error('Error fetching user samples:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// save/create/add

export const createCollection = async (req, res) => {
  try {
    const { name } = req.body;
    const newCollection = new Collection({
      user: req.user.id,
      name
    });
    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addToCollection = async (req, res) => {
  try {
    const { sampleIds } = req.body;
    const userId = req.user._id;

    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if the authenticated user owns the collection
    if (collection.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to modify this collection' });
    }

    // Ensure all sampleIds are valid ObjectIds
    if (!Array.isArray(sampleIds) || sampleIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: 'Invalid sample IDs' });
    }
    
    // Find all samples in AudioSample (which includes both Default and User samples)
    const foundSamples = await AudioSample.find({
      _id: { $in: sampleIds },
      $or: [
        { sampleType: 'DefaultAudioSample' },
        { sampleType: 'UserAudioSample', user: userId }
      ]
    });

    const foundSampleIds = foundSamples.map(sample => sample._id);
    const missingSamples = sampleIds.filter(id => !foundSampleIds.includes(id.toString()));

    if (missingSamples.length > 0) {
      return res.status(404).json({ message: 'One or more samples not found', missingSamples });
    }

    collection.samples.push(...foundSampleIds);
    await collection.save();

    res.json(collection);
  } catch (error) {
    console.error('Error adding to collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserSample = async (req, res) => {
  try {
    const sampleId = req.params.id;
    const userId = req.user._id;
    const { name, settings } = req.body;

    const updatedSample = await UserAudioSample.findOneAndUpdate(
      { _id: sampleId, user: userId },
      { name, settings: JSON.parse(settings) },
      { new: true }
    );

    if (!updatedSample) {
      return res.status(404).json({ message: 'Sample not found or not authorized to update' });
    }

    res.json(updatedSample);
  } catch (error) {
    console.error('Error updating user sample:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// save audio plus icon
export const saveUserAudioSampleWithIcon = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      uploadAudioIcon(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { name, settings } = req.body;
    
    if (!req.files['audio'] || !req.files['icon']) {
      return res.status(400).json({ message: 'Both audio and icon files are required' });
    }

    const audioFile = req.files['audio'][0];
    const iconFile = req.files['icon'][0];

    const audioUrl = `/uploads/audio/user/${audioFile.filename}`;
    const iconUrl = `/uploads/icons/user/${iconFile.filename}`;

    const audioSample = new UserAudioSample({
      user: req.user._id,
      name,
      audioUrl,
      iconUrl,
      settings: JSON.parse(settings)
    });

    await audioSample.save();
    res.status(201).json(audioSample);
  } catch (error) {
    console.error('Error saving audio sample with icon:', error);
    res.status(500).json({ message: 'Error saving audio sample with icon' });
  }
};


export const saveDefaultAudioSampleWithIcon = async (req, res) => {
  try {
    await new Promise((resolve, reject) => {
      uploadAudioIcon(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    const { name, settings, forMainPage } = req.body;
    
    if (!req.files['audio'] || !req.files['icon']) {
      return res.status(400).json({ message: 'Both audio and icon files are required' });
    }

    const audioFile = req.files['audio'][0];
    const iconFile = req.files['icon'][0];

    const audioUrl = `/uploads/audio/default/${audioFile.filename}`;
    const iconUrl = `/uploads/icons/default/${iconFile.filename}`;

    const audioSample = new DefaultAudioSample({
      name,
      audioUrl,
      iconUrl,
      forMainPage: forMainPage === 'true',
      settings: JSON.parse(settings)
    });

    await audioSample.save();
    res.status(201).json(audioSample);
  } catch (error) {
    console.error('Error saving default audio sample with icon:', error);
    res.status(500).json({ message: 'Error saving default audio sample with icon' });
  }
};

// deletions

export const deleteUserSample = async (req, res) => {
  try {
    const sampleId = req.params.id;
    const userId = req.user._id;

    // Find and delete the user sample
    const deletedSample = await UserAudioSample.findOneAndDelete({
      _id: sampleId,
      user: userId
    });

    if (!deletedSample) {
      return res.status(404).json({ message: 'Sample not found or not authorized to delete' });
    }

    // Remove the sample from all collections
    await Collection.updateMany(
      { user: userId },
      { $pull: { samples: sampleId } }
    );

    // Here you would also delete the actual audio and icon files from your storage
    await deleteFileFromStorage(deletedSample.audioUrl);
    await deleteFileFromStorage(deletedSample.iconUrl);

    res.json({ message: 'Sample deleted successfully' });
  } catch (error) {
    console.error('Error deleting user sample:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteDefaultSample = async (req, res) => {
  try {
    const sampleId = req.params.id;

    // Ensure the user is an admin before allowing deletion of default samples
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete default samples' });
    }

    // Find and delete the default sample
    const deletedSample = await DefaultAudioSample.findByIdAndDelete(sampleId);

    if (!deletedSample) {
      return res.status(404).json({ message: 'Default sample not found' });
    }

    // Remove the sample from all collections
    await Collection.updateMany(
      {},
      { $pull: { samples: sampleId } }
    );

    // Here you would also delete the actual audio and icon files from your storage
    await deleteFileFromStorage(deletedSample.audioUrl);
    await deleteFileFromStorage(deletedSample.iconUrl);

    res.json({ message: 'Default sample deleted successfully' });
  } catch (error) {
    console.error('Error deleting default sample:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const userId = req.user._id;

    // Find and delete the collection
    const deletedCollection = await Collection.findOneAndDelete({
      _id: collectionId,
      user: userId
    });

    if (!deletedCollection) {
      return res.status(404).json({ message: 'Collection not found or not authorized to delete' });
    }

    res.json({ message: 'Collection deleted successfully' });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// just remove
export const removeFromCollection = async (req, res) => {
  try {
    const { collectionId, sampleId } = req.params;
    const userId = req.user._id;

    const collection = await Collection.findOne({ _id: collectionId, user: userId });
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found or not authorized' });
    }

    collection.samples = collection.samples.filter(sample => sample.toString() !== sampleId);
    await collection.save();

    res.json({ message: 'Sample removed from collection successfully' });
  } catch (error) {
    console.error('Error removing sample from collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};