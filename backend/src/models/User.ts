// models/User.ts
import mongoose, { Document, Types, Model } from 'mongoose';
import { encrypt, decrypt, hashEmail as hashinghelper } from '../utils/encryption';

export interface IUserDocument extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  emailHash: string;
  password: string;
  profilePicture?: string;
  isVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  role: 'user' | 'admin';
  setEncryptedEmail(email: string): void;
  getDecryptedEmail(): string;
  updateEncryptedEmail(email: string): void;
}

// Extend the IUserDocument interface to include static methods
export interface IUserModel extends Model<IUserDocument> {
  hashEmail(email: string): string;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  emailHash: { type: String, index: true }, // For faster lookups
  password: { type: String, required: true },
  profilePicture: { type: String },

  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  verificationTokenExpires: Date,

  resetPasswordToken: { type: String },
  resetPasswordExpires: Date,

  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

userSchema.methods.setEncryptedEmail = function(email: string) {
  try {
    this.email = encrypt(email);
    this.emailHash = hashinghelper(email);
  } catch (error) {
    throw new Error('Failed to set encrypted email');
  }
};

userSchema.methods.getDecryptedEmail = function() {
  try {
    return decrypt(this.email);
  } catch (error) {
    throw new Error('Failed to get decrypted email');
  }
};

userSchema.methods.updateEncryptedEmail = function(email: string) {
  this.setEncryptedEmail(email);
};

userSchema.statics.hashEmail = function(email: string) {
  return hashinghelper(email);
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;