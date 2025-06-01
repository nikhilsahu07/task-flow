"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-jwt-secret-replace-in-prod';
// Generate a JWT token for a user
const generateToken = (id, email, role) => {
    const payload = {
        id,
        email,
        role,
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
        expiresIn: '1d',
    });
};
exports.generateToken = generateToken;
// Verify and decode a JWT token
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        console.error('JWT verification failed:', error);
        throw new Error('Invalid or expired token.');
    }
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=jwt.js.map