import mongoose from 'mongoose';

const mainSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
});

export default mongoose.model('Main', mainSchema);
