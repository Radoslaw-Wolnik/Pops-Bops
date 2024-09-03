// models/User.ts
import mongoose, { Document, Types, Model } from 'mongoose';
import { encrypt, decrypt, hashEmail as hashinghelper } from '../utils/encryption.util';
//import isEmail from 'validator/lib/isEmail';

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
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens']
  },
  email: { 
    type: String, 
    required: true, 
    unique: true
  },
  /* email is already hashed here i think but not sure - if not could be validated
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    unique: true,
    validate: {
      validator: (value: string) => isEmail(value),
      message: 'Invalid email format'
    }
  },
  */
  emailHash: { type: String, index: true }, // For faster lookups
  password: { type: String, required: true }, // idk if minlenght here becouse its propably hashed and salted already
  profilePicture: { 
    type: String,
    validate: {
      validator: (value: string) => /^\/uploads\/profile-picture\/[\w-]+\.(jpg|jpeg|png|gif)$/.test(value),
      message: 'Invalid profile picture URL format'
    }
  },

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