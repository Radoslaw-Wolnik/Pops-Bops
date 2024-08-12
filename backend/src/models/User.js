// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },

  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: Date,

  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

export default mongoose.model('User', userSchema);