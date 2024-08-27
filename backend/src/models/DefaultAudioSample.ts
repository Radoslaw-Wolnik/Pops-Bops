// models/DefaultAudioSample.ts
import { AudioSample, IAudioSample } from './AudioSample';
import mongoose, { Schema, Document } from 'mongoose';

export interface IDefaultAudioSample extends IAudioSample {
  forMainPage: boolean;
}

const DefaultAudioSampleSchema = new Schema<IDefaultAudioSample>({
  forMainPage: { type: Boolean, default: false }
});

const DefaultAudioSample = AudioSample.discriminator<IDefaultAudioSample>('DefaultAudioSample', DefaultAudioSampleSchema);

export default DefaultAudioSample;