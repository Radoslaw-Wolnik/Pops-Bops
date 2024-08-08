// models/AudioSample.js
import mongoose from 'mongoose';

const AudioSampleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  audioUrl: String,
  settings: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('AudioSample', AudioSampleSchema);
