import express, { Express } from 'express';
import cors from 'cors';
import environment from './config/environment';

import userRoutes from './routes/user.routes';
import audioRoutes from './routes/audio.routes';
import iconRoutes from './routes/icon.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import collectionRoutes from './routes/collection.routes'

// import { errorHandler } from './middleware/error-handler.middleware';

const app: Express = express();

app.set('trust proxy', true);


app.use(cors({
    origin: environment.app.frontend, //'https://localhost:5173' 
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

// app.use(errorHandler); set this up to use custom error handler

export default app;