// src/middleware/error-handler.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message
    });
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: 'Validation Error',
      errors: Object.values((err as any).errors).map((err: any) => err.message)
    });
  }

  // Handle MongoDB duplicate key errors
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    return res.status(409).json({
      status: 'error',
      statusCode: 409,
      message: `An account with that ${field} already exists.`
    });
  }

  // Default to 500 server error
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Internal Server Error'
  });
};