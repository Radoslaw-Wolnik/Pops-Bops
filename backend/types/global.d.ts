// types/global.d.ts

import { Request } from 'express';
import { Types } from 'mongoose';
import { IUserDocument } from '../models/User';


declare global {

  interface AuthRequest extends Request {
    user?: IUserDocument;
  }

}

export {};