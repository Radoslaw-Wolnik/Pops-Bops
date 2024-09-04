import * as http from 'http';
import app from './app.js';
import connectDB from './config/database-connection.js';
import environment from './config/environment.js';
import logger from './utils/logger.util';
import { initCleanupJob } from './scripts/cleanup-revoked-tokens.js';

const PORT: number = environment.app.port;

const startServer = async () => {
  try {
    await connectDB();

    await initCleanupJob();
    
    const server: http.Server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server running in ${environment.app.nodeEnv} mode on port ${PORT}`);
    });

    

  } catch (error) {
    console.error('Failed to start the server:', (error as Error).message);
    process.exit(1);
  }
};

startServer();