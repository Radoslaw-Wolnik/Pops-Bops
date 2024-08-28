import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes.ts';
import audioRoutes from './routes/audioRoutes.ts';
import iconRoutes from './routes/iconRoutes.ts';
import authRoutes from './routes/authRoutes.ts';
import adminRoutes from './routes/adminRoutes.ts';
import collectionRoutes from './routes/collectionRoutes.ts'

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
app.use('/api/collection', collectionRoutes);

export default app;