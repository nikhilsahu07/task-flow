"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Library for creating and verifying JSON Web Tokens (JWTs)
// Retrieve JWT secret from environment variables. Fallback to a default for development.
// IMPORTANT: For production, JWT_SECRET *must* be a strong, unique secret stored securely in environment variables.
const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-jwt-secret-replace-in-prod';
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
const generateToken = (id, email, role) => {
    // Construct the payload to be embedded in the JWT.
    const payload = {
        id, // User's unique identifier
        email, // User's email address
        role, // User's role (e.g., admin, user)
    };
    // Sign the payload with the JWT_SECRET to create the token.
    // The token is set to expire in 1 day ('1d').
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: '1d', // Standard time format string (e.g., '1h', '7d')
    });
};
exports.generateToken = generateToken;
/**
 * Verify and decode a JWT token
 */
const verifyToken = (token) => {
    try {
        // jwt.verify checks the token's signature against the JWT_SECRET and decodes it.
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        // Handle specific JWT errors or re-throw a generic error.
        // For example, JsonWebTokenError for malformed tokens, TokenExpiredError for expired tokens.
        console.error('JWT verification failed:', error);
        throw new Error('Invalid or expired token.'); // Or handle specific error types
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map