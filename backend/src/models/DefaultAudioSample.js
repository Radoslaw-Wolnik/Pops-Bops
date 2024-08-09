import mongoose from 'mongoose';

const DefaultAudioSampleSchema = new mongoose.Schema({
  name: String,
  audioUrl: String,
  iconUrl: String,
  forMainPage: { type: Boolean, default: false },
  settings: Object,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('DefaultAudioSample', DefaultAudioSampleSchema);