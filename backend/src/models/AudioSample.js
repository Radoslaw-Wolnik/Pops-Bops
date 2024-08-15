// models/AudioSample.js
import mongoose from 'mongoose';

const AudioSampleSchema = new mongoose.Schema({
  name: String,
  audioUrl: String,
  iconUrl: String,
  settings: Object, // this should be a new model
  createdAt: { type: Date, default: Date.now }
}, { discriminatorKey: 'sampleType' });

export const AudioSample = mongoose.model('AudioSample', AudioSampleSchema);