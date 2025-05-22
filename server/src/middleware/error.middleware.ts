import { Request, Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Global error handling middleware
 */
export const errorHandler = (err: Error, _req: Request, res: Response): void => {
  // Generate a unique error ID for tracking
  const errorId = uuidv4();

  console.error(`Error ID: ${errorId}`, err);

  // Default error response
  let statusCode = 500;
  let message = 'Internal server error';
  let errorDetail = err.message;

  // Handle specific error types
  if (err instanceof MongooseError.ValidationError) {
    // Mongoose validation errors
    statusCode = 400;
    message = 'Validation error';
    errorDetail = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  } else if (err instanceof MongooseError.CastError) {
    // Mongoose cast errors (invalid ID format, etc.)
    statusCode = 400;
    message = 'Invalid data format';
    errorDetail = `Invalid ${err.path}: ${err.value}`;
  } else if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    // Mongoose duplicate key errors
    statusCode = 409;
    message = 'Duplicate entry';
    const field = Object.keys((err as any).keyValue)[0];
    errorDetail = `${field} already exists`;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetail,
    errorId: process.env.NODE_ENV === 'production' ? errorId : undefined,
  });
};

/**
 * Handle 404 errors for routes that don't exist
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
};
