// models/DefaultAudioSample.js
import { AudioSample } from './AudioSample.js';
import mongoose from 'mongoose';

const DefaultAudioSample = AudioSample.discriminator('DefaultAudioSample', new mongoose.Schema({
  forMainPage: { type: Boolean, default: false }
}));

export default DefaultAudioSample;