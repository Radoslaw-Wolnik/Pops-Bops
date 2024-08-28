// types/global.d.ts

import { Request } from 'express';
import { Types } from 'mongoose';
import { IUserDocument } from '../models/User';


declare global {

  interface AuthRequest extends Request {
    user?: IUserDocument;
  }

  interface AuthRequestWithFile extends AuthRequest {
    file?: Express.Multer.File;
  }

  interface AuthRequestWithFiles extends AuthRequest {
    files?: { [fieldname: string]: Express.Multer.File[] };
  }

}

export {};