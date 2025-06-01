import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-jwt-secret-replace-in-prod';

// Generate a JWT token for a user
export const generateToken = (id: string, email: string, role: UserRole): string => {
  const payload: JwtPayload = {
    id,
    email,
    role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d',
  });
};

// Verify and decode a JWT token
export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('JWT verification failed:', error);
    throw new Error('Invalid or expired token.');
  }
};
