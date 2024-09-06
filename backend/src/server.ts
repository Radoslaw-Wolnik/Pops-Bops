import * as http from 'http';
import mongoose from 'mongoose';

import app from './app.js';
import connectDB from './utils/db-connection.util.js';
import environment from './config/environment.js';
import logger from './utils/logger.util';
import { initCleanupJob } from './scripts/cleanup-revoked-tokens.js';

// Set port from environment or fallback to 5000
const PORT: number = environment.app.port || 5000;

const startServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Initialize background jobs
    await initCleanupJob();
    
    const server: http.Server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server running in ${environment.app.nodeEnv} mode on port ${PORT}`);
    });

    // Graceful shutdown logic for SIGTERM and SIGINT signals
    const exitHandler = async (exitCode: number) => {
      try {
        logger.info('Closing HTTP server.');
        await new Promise((resolve, reject) => {
          server.close((err) => {
            if (err) {
              logger.error('Error closing HTTP server:', err);
              return reject(err);
            }
            resolve(true);
          });
        });

        logger.info('Closing MongoDB connection.');
        await mongoose.connection.close();

        logger.info('Exiting process.');
        process.exit(exitCode);
      } catch (error) {
        logger.error('Error during graceful shutdown:', error);
        process.exit(1);
      }
    };

    // Global error handler for uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
      process.exit(1);
    });

    // Global error handler for unhandled promise rejections
    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      logger.error('Unhandled Rejection', { reason, promise });
      process.exit(1);
    });

    // Graceful shutdown on SIGTERM (e.g., Docker, Heroku)
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received. Shutting down gracefully.');
      exitHandler(0);
    });

    // Graceful shutdown on SIGINT (e.g., Ctrl+C)
    process.on('SIGINT', () => {
      logger.info('SIGINT signal received. Shutting down gracefully.');
      exitHandler(0);
    });

    

  } catch (error) {
    console.error('Failed to start the server:', (error as Error).message);
    process.exit(1);
  }
};

startServer();

// set this up in docker container policy
// eg
// restart: unless-stopped