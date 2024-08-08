// models/Collection.js
import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  samples: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AudioSample' }]
});

export default mongoose.model('Collection', CollectionSchema);