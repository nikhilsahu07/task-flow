import jwt from 'jsonwebtoken';
import { JwtPayload, UserRole } from '../types';

// Get JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

/**
 * Generate a JWT token for a user
 * JSON Web Tokens (JWT) are an open, industry standard RFC 7519 method for representing
 * claims securely between two parties. It consists of three parts: header, payload, and signature.
 * - Header: Contains the token type and the signing algorithm being used
 * - Payload: Contains the claims or assertions about an entity (typically the user) and additional data
 * - Signature: Used to verify the message wasn't changed along the way
 *
 * The token is created by base64-encoding the header and payload,
 * then creating a signature by hashing them with a secret key
 */
export const generateToken = (id: string, email: string, role: UserRole): string => {
  // Create payload with user information
  const payload: JwtPayload = {
    id,
    email,
    role,
  };

  // Sign the token with the secret key and set expiration
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JwtPayload => {
  // Verify token signature and return decoded payload
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
};
