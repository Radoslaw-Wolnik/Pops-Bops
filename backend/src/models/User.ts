// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  role: 'user' | 'admin';
}


const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },

  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: Date,

  resetPasswordToken: { type: String },
  resetPasswordExpires: Date,

  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

export default mongoose.model<IUser>('User', userSchema);