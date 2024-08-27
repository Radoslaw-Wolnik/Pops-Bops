// models/AudioSample.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IAudioSample extends Document {
  name: string;
  audioUrl: string;
  iconUrl: string;
  createdAt?: Date;
}

const AudioSampleSchema = new Schema<IAudioSample>({
  name: String,
  audioUrl: String,
  iconUrl: String,
  createdAt: { type: Date, default: Date.now }
}, { discriminatorKey: 'sampleType' });

export const AudioSample = mongoose.model<IAudioSample>('AudioSample', AudioSampleSchema);