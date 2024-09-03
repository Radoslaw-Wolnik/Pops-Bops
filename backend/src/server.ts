import * as http from 'http';
import app from './app.js';
import connectDB from './config/database';
import env from './config/environment';

const PORT: number = env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    const server: http.Server = http.createServer(app);
    server.listen(PORT, () => {
      console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to start the server:', (error as Error).message);
    process.exit(1);
  }
};

startServer();