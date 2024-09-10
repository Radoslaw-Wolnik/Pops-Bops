// src/middleware/error-handler.middleware.ts
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { CustomError, FileTypeNotAllowedError, FileSizeTooLargeError, BadRequestError } from '../utils/custom-errors.util';
import logger from '../utils/logger.util';
import environment from '../config/environment';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log the error
  logger.error(`Error: ${err.message}`, { 
    stack: err.stack,
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Handle custom error instances
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

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      statusCode: 401,
      message: 'Token expired'
    });
  }

   // Handle Multer errors
   if (err instanceof FileTypeNotAllowedError || err instanceof FileSizeTooLargeError) {
    return res.status(400).json({
      status: 'error',
      statusCode: 400,
      message: err.message
    });
  }

  // Default to 500 server error
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: environment.app.nodeEnv === 'production' ? 'Internal Server Error' : err.message
  });
};