import AudioSample from '../models/AudioSample.js';
import Preset from '../models/Preset.js';
import Collection from '../models/Collection.js';
import CacheService from '../services/CacheService.js';
import path from 'path';
import fs from 'fs';
import audioUpload from '../middleware/audioUpload.js';

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

export const getSamples = async (req, res) => {
  try {
    const samples = await AudioSample.find({ user: req.user.id });
    res.json(samples);
  } catch (error) {
    console.error('Error fetching samples:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const savePreset = async (req, res) => {
  try {
    const { name, settings } = req.body;
    const newPreset = new Preset({
      user: req.user.id,
      name,
      settings
    });
    await newPreset.save();
    res.status(201).json(newPreset);
  } catch (error) {
    console.error('Error saving preset:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPresets = async (req, res) => {
  try {
    const presets = await Preset.find({ user: req.user.id });
    res.json(presets);
  } catch (error) {
    console.error('Error fetching presets:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

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
    const { sampleId } = req.body;
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }
    collection.samples.push(sampleId);
    await collection.save();
    res.json(collection);
  } catch (error) {
    console.error('Error adding to collection:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id }).populate('samples');
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const saveAudioSample = async (req, res) => {
    try {
      await audioUpload.single('audio')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }
  
        const { settings } = req.body;
        const audioFile = req.file;
  
        // Save the audio file to your storage (e.g., local filesystem, S3, etc.)
        const audioUrl = await saveAudioToStorage(audioFile);
  
        // Create a new AudioSample document
        const audioSample = new AudioSample({
          user: req.user._id,
          name: `Sample_${Date.now()}`,
          audioUrl,
          settings: JSON.parse(settings)
        });
  
        await audioSample.save();
  
        res.status(201).json(audioSample);
      });
    } catch (error) {
      console.error('Error saving audio sample:', error);
      res.status(500).json({ message: 'Error saving audio sample' });
    }
  };
  
  const saveAudioToStorage = async (audioFile) => {
    // Generate a unique filename
    const filename = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${path.extname(audioFile.originalname).slice(1)}`;
    const filepath = path.join(process.cwd(), 'uploads', 'audio', filename);
  
    // Move the file to the uploads/audio directory
    await fs.promises.rename(audioFile.path, filepath);
  
    // Return the public URL of the saved file
    return `/uploads/audio/${filename}`;
  };


// additional to think about
  export const deletePreset = async (req, res) => {
    try {
      const { id } = req.params;
      await Preset.findByIdAndDelete(id);
      res.status(204).json();
    } catch (error) {
      console.error('Error deleting preset:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const deleteAudioSample = async (req, res) => {
    try {
      const { id } = req.params;
      await AudioSample.findByIdAndDelete(id);
      res.status(204).json();
    } catch (error) {
      console.error('Error deleting audio sample:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };