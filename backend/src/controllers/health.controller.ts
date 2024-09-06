import { Request, Response } from 'express';
import { checkDBHealth } from '../utils/db-connection.util';
import logger from '../utils/logger.util'; 


// Basic health check logic
export const getBasicHealth = (req: Request, res: Response): void => {
  res.status(200).json({ status: 'OK' });
};

// Detailed health check logic
export const getDetailedHealth = async (req: Request, res: Response): Promise<void> => {
  const healthcheck: {
    uptime: number;
    message: string;
    timestamp: number;
    database: string;
    error?: string;
  } = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    database: 'Unknown', // Default value
  };

  try {
    // Check database connection state
    healthcheck.database = checkDBHealth();

    // Add more checks if needed (e.g., Redis, external services)
    res.status(200).json(healthcheck);
  } catch (error) {
    healthcheck.message = 'ERROR';
    healthcheck.error = (error as Error).message;
    logger.error('Detailed health check failed', { error: (error as Error).message });
    res.status(503).json(healthcheck);
  }
};

