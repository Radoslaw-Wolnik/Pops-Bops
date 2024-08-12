// controllers/adminController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins' });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findOneAndDelete({ _id: id, role: 'admin' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin' });
  }
};

export const addAdmin = async (req, res) => {
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