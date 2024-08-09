import mongoose from 'mongoose';

const UserAudioSampleSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    audioUrl: String,
    iconUrl: String,
    settings: Object,
    createdAt: { type: Date, default: Date.now }
});
  
export default mongoose.model('UserAudioSample', UserAudioSampleSchema);