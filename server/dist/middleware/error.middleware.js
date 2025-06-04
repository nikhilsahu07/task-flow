"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
// Global error handling middleware
const errorHandler = (err, _req, res) => {
    // Generate a unique error ID for tracking
    const errorId = (0, uuid_1.v4)();
    console.error(`Error ID: ${errorId}`, err);
    // Default error response
    let statusCode = 500;
    let message = 'Internal server error';
    let errorDetail = err.message;
    // Handle specific error types
    if (err instanceof mongoose_1.Error.ValidationError) {
        // Mongoose validation errors
        statusCode = 400;
        message = 'Validation error';
        errorDetail = Object.values(err.errors)
            .map((error) => error.message)
            .join(', ');
    }
    else if (err instanceof mongoose_1.Error.CastError) {
        // Mongoose cast errors (invalid ID format, etc.)
        statusCode = 400;
        message = 'Invalid data format';
        errorDetail = `Invalid ${err.path}: ${err.value}`;
    }
    else if (err.name === 'MongoServerError' && err.code === 11000) {
        // Mongoose duplicate key errors
        statusCode = 409;
        message = 'Duplicate entry';
        const field = Object.keys(err.keyValue)[0];
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
exports.errorHandler = errorHandler;
// Handle 404 errors for routes that don't exist
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found',
        error: `Cannot ${req.method} ${req.originalUrl}`,
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map