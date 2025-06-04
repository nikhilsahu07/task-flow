"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = exports.validate = void 0;
const zod_1 = require("zod");
// Middleware to validate request data against a Zod schema
const validate = (schema) => {
    return (req, res, next) => {
        try {
            // Validate the request body against the schema
            const result = schema.safeParse(req.body);
            if (!result.success) {
                // Format error messages
                const formattedErrors = result.error.errors.map((err) => ({
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
            req.body = result.data; // Use the parsed/transformed data
            next();
        }
        catch (error) {
            console.error('Validation middleware error:', error);
            next(error);
        }
    };
};
exports.validate = validate;
// Middleware to validate request query parameters against a Zod schema
const validateQuery = (schema) => {
    return (req, res, next) => {
        try {
            // Validate the request query against the schema
            schema.parse(req.query);
            next();
        }
        catch (error) {
            // Handle Zod validation errors
            if (error instanceof zod_1.ZodError) {
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
exports.validateQuery = validateQuery;
//# sourceMappingURL=validation.middleware.js.map