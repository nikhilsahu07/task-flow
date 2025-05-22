"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
const generateToken = (id, email, role) => {
    // Create payload with user information
    const payload = {
        id,
        email,
        role,
    };
    // Sign the token with the secret key and set expiration
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: '1d', // Token expires in 1 day
    });
};
exports.generateToken = generateToken;
/**
 * Verify and decode a JWT token
 */
const verifyToken = (token) => {
    // Verify token signature and return decoded payload
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map