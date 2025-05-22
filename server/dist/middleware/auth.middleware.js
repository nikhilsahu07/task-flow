"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
/**
 * Middleware to authenticate users by verifying JWT token
 */
const authenticate = (req, res, next) => {
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
        const decoded = (0, jwt_1.verifyToken)(token);
        // Add the user information to the request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };
        next();
    }
    catch {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired token',
            error: 'Authentication failed',
        });
    }
};
exports.authenticate = authenticate;
/**
 * Middleware to authorize users based on role
 */
const authorize = (roles) => {
    return (req, res, next) => {
        const authReq = req;
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
exports.authorize = authorize;
//# sourceMappingURL=auth.middleware.js.map