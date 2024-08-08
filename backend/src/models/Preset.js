// models/Preset.js
import mongoose from 'mongoose';

const PresetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  settings: Object
});
  

export default mongoose.model('Preset', PresetSchema);