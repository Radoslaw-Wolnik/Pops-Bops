// src/utils/logger.util.ts
import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import path from 'path';

// Extend the Logger interface to include our custom method
interface CustomLogger extends winston.Logger {
  logRequest(req: Request, res: Response, next: NextFunction): void;
}

const logDir = path.join(__dirname, '..', '..', 'logs');


const logger: CustomLogger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'pops-and-bops-backend' },
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.join(logDir, 'combined.log') }),
  ],
}) as CustomLogger;

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }));
}


// Add a method to log request details
logger.logRequest = (req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: (req as any).user?.id, // Assuming you attach user to req in auth middleware
    userAgent: req.get('User-Agent'),
  });
  next();
};

export default logger;