// adminController.ts
import { Response, NextFunction } from 'express';
import bcrypt from 'bcrypt'; // where is it used and wheather it should be?
import { NotFoundError, InternalServerError, ValidationError, ConflictError, CustomError } from '../utils/custom-errors.util';

import User from '../models/user.model';

export const getAdmins = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    next(new InternalServerError('Error fetching admins'));
  }
};

export const deleteAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedAdmin = await User.findOneAndDelete({ _id: id, role: 'admin' });
    if (!deletedAdmin) {
      throw new NotFoundError('Admin');
    }
    res.status(204).send();
  } catch (error) {
    next(error instanceof CustomError ? error : new InternalServerError('Error deleting admin'));
  }
};

interface AddAdminRequest extends AuthRequest {
  body: {
    username: string;
    password: string;
    email: string;
  }
}

export const addAdmin = async (req: AddAdminRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      throw new ValidationError('Username, password, and email are required');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      username,
      email,
      password: hashedPassword,
      role: 'admin'
    });
    await newAdmin.save();
    const { password: _, ...adminWithoutPassword } = newAdmin.toObject();
    res.status(201).json(adminWithoutPassword);
  } catch (error) {
    if (error instanceof Error && error.name === 'MongoError' && (error as any).code === 11000) {
      next(new ConflictError('An admin with that username or email already exists'));
    } else {
      next(error instanceof CustomError ? error : new InternalServerError('Error adding admin'));
    }
  }
};