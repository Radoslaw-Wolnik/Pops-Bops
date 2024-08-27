// models/UserAudioSample.ts
import { AudioSample, IAudioSample } from './AudioSample';
import mongoose, { Schema } from 'mongoose';

export interface IUserAudioSample extends IAudioSample {
  user: mongoose.Schema.Types.ObjectId;
}

const UserAudioSampleSchema = new Schema<IUserAudioSample>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const UserAudioSample = AudioSample.discriminator<IUserAudioSample>('UserAudioSample', UserAudioSampleSchema);

export default UserAudioSample;