import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AuthRequest, UserRole } from '../types';

/**
 * Middleware to authenticate users by verifying JWT token
 */
export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if header exists and follows Bearer token format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'No token provided',
      });
      return;
    }

    // Extract the token from the header
    const token = authHeader.split(' ')[1];

    // Verify the token and decode its payload
    const decoded = verifyToken(token);

    // Add the user information to the request object
    (req as AuthRequest).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      error: 'Authentication failed',
    });
  }
};

/**
 * Middleware to authorize users based on role
 */
export const authorize = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;

    // Check if user exists and has a role in the allowed roles
    if (!authReq.user || !roles.includes(authReq.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'Access denied',
      });
      return;
    }

    next();
  };
};
