// adminController.ts
import { Response } from 'express';
import bcrypt from 'bcrypt'; // where is it used and wheather it should be?

import User from '../models/user.model';

export const getAdmins = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins' });
  }
};

export const deleteAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await User.findOneAndDelete({ _id: id, role: 'admin' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin' });
  }
};

interface AddAdminRequest extends AuthRequest {
  body: {
    username: string;
    password: string;
    email: string;
  }
}

export const addAdmin = async (req: AddAdminRequest, res: Response): Promise<void> => {
  try {
    const { username, password, email } = req.body;
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
    res.status(500).json({ message: 'Error adding admin' });
  }
};