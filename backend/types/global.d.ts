// types/global.d.ts

import { Request } from 'express';
import { Types } from 'mongoose';
import { IUserDocument } from '../models/User';


declare global {
  interface AuthenticatedUser {
    _id: Types.ObjectId;
    username: string;
    email: string;
    role: string;
    isVerified: boolean;
  }

  interface AuthRequest extends Request {
    user?: AuthenticatedUser;
  }

  type UploadedFile = Express.Multer.File;
}

export {};