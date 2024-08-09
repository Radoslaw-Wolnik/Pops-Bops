// models/Collection.js
import mongoose from 'mongoose';


const CollectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  // references the userAudioSample or DefaultAudioSample in samples[]
  samples: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'sampleType'
  }],
  sampleType: {
    type: String,
    enum: ['DefaultAudioSample', 'UserAudioSample'],
    required: true
  },
});

export default mongoose.model('Collection', CollectionSchema);