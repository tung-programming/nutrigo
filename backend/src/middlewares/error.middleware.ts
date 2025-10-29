import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

interface ErrorResponse {
  message: string;
  stack?: string;
  status?: number;
}

export const errorMiddleware = (
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Default error
  const error: ErrorResponse = {
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Handle specific error types
  switch (true) {
    case err.name === 'ValidationError': // Mongoose validation error
      error.status = 400;
      break;
      
    case err.name === 'CastError': // Mongoose casting error
      error.message = 'Resource not found';
      error.status = 404;
      break;
      
    case err.name === 'JsonWebTokenError': // JWT error
      error.message = 'Invalid token';
      error.status = 401;
      break;
      
    case err.name === 'TokenExpiredError': // JWT expired
      error.message = 'Token expired';
      error.status = 401;
      break;

    default:
      error.status = err.status || 500;
  }

  res.status(error.status).json({
    success: false,
    error: {
      message: error.message,
      ...(error.stack && { stack: error.stack }),
    },
  });
};