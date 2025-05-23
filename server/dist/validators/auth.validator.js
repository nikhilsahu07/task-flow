"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordUpdateSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod"); // Zod is a TypeScript-first schema declaration and validation library
const types_1 = require("../types"); // Import UserRole enum for role validation
// Schema for validating user registration requests.
// Ensures name, email, and password meet specific criteria.
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters long')
        .max(50, 'Name cannot exceed 50 characters'),
    email: zod_1.z
        .string()
        .email('Please enter a valid email address')
        .min(5, 'Email must be at least 5 characters long')
        .max(100, 'Email cannot exceed 100 characters'),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .max(100, 'Password cannot exceed 100 characters')
        // Enforce password complexity: at least one lowercase, one uppercase, and one digit.
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password requires an uppercase letter, a lowercase letter, and a number'),
    // Role is optional and defaults to USER if not provided.
    role: zod_1.z.enum([types_1.UserRole.ADMIN, types_1.UserRole.USER]).optional().default(types_1.UserRole.USER),
});
// Schema for validating user login requests.
// Requires email and a non-empty password.
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
    password: zod_1.z.string().min(1, 'Password is required'), // Simple check for presence
});
// Schema for validating password update requests.
// Ensures current password is provided, new password meets complexity, and new passwords match.
exports.passwordUpdateSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z
        .string()
        .min(6, 'New password must be at least 6 characters long')
        .max(100, 'New password cannot exceed 100 characters')
        // Same complexity rules as registration password.
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'New password requires an uppercase letter, a lowercase letter, and a number'),
    confirmPassword: zod_1.z.string().min(1, 'Please confirm your new password'),
})
    // Custom refinement to check if newPassword and confirmPassword match.
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'], // Associates the error with the confirmPassword field
});
//# sourceMappingURL=auth.validator.js.map