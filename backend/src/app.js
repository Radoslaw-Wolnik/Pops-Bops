import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.js';
import audioRoutes from './routes/audioRoutes.js';
import iconRoutes from './routes/iconRoutes.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

// idk why but process.env.FRONTEND doesnt work but its not the most important thing
app.use(cors({
    origin: 'https://localhost:5173', // Note the 'https'
    credentials: true,
  }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/api/users', userRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/icon', iconRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

export default app;