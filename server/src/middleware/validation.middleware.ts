import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType } from 'zod';

/**
 * Middleware to validate request data against a Zod schema
 */
export const validate = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate the request body against the schema
      schema.parse(req.body);
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        // Format error messages
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation error',
          error: formattedErrors,
        });
        return;
      }

      next(error);
    }
  };
};

/**
 * Middleware to validate request query parameters against a Zod schema
 */
export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate the request query against the schema
      schema.parse(req.query);
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof ZodError) {
        // Format error messages
        const formattedErrors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: 'Validation error in query parameters',
          error: formattedErrors,
        });
        return;
      }

      next(error);
    }
  };
};
