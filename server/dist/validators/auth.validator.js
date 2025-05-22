"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordUpdateSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
// Registration request validation schema
exports.registerSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name cannot exceed 50 characters'),
    email: zod_1.z
        .string()
        .email('Invalid email format')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email cannot exceed 100 characters'),
    password: zod_1.z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .max(100, 'Password cannot exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    role: zod_1.z.enum([types_1.UserRole.ADMIN, types_1.UserRole.USER]).optional().default(types_1.UserRole.USER),
});
// Login request validation schema
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Invalid email format'),
    password: zod_1.z.string().min(1, 'Password is required'),
});
// Password update validation schema
exports.passwordUpdateSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: zod_1.z
        .string()
        .min(6, 'New password must be at least 6 characters')
        .max(100, 'New password cannot exceed 100 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: zod_1.z.string().min(1, 'Confirm password is required'),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});
//# sourceMappingURL=auth.validator.js.map