// models/UserAudioSample.js
import { AudioSample } from './AudioSample.js';
import mongoose from 'mongoose';

const UserAudioSample = AudioSample.discriminator('UserAudioSample', new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}));

export default UserAudioSample;