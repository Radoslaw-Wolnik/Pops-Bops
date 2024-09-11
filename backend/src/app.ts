import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import environment from './config/environment';
import logger from './utils/logger.util';

import userRoutes from './routes/user.routes';
import audioRoutes from './routes/audio.routes';
import iconRoutes from './routes/icon.routes';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import collectionRoutes from './routes/collection.routes'

import { errorHandler } from './middleware/error.middleware';



const app: Express = express();

app.set('trust proxy', true);


app.use(cors({
    origin: environment.app.frontend, //'https://localhost:5173' 
    credentials: true,
  }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Use logger middleware for all requests
app.use(logger.logRequest);

// Conditional debug logging
if (environment.app.nodeEnv === 'development') {
  app.use((req: Request, res: Response, next: NextFunction) => {
      logger.debug('Request details', {
          method: req.method,
          url: req.url,
          query: req.query,
          params: req.params,
          headers: req.headers,
          // Avoid logging body here as it might contain sensitive information
      });
      next();
  });
}

app.use('/api/users', userRoutes);
app.use('/api/audio', audioRoutes);
app.use('/api/icon', iconRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/collection', collectionRoutes);

// Catch-all route for undefined endpoints
app.use((req: Request, res: Response) => {
  logger.warn(`404 Not Found: ${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    query: req.query,
    params: req.params
    // Omit logging the body to avoid potential sensitive data exposure
  });
  res.status(404).json({ message: 'Not Found' });
});

// Apply the custom error handler middleware after all routes
app.use(errorHandler);

// Log application initialization
logger.info('Application initialized', {
  nodeEnv: environment.app.nodeEnv,
  port: environment.app.port,
  frontendOrigin: environment.app.frontend
});

export default app;