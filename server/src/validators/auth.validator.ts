import { z } from 'zod';
import { UserRole } from '../types';

// Registration request validation schema
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email cannot exceed 100 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password cannot exceed 100 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    ),
  role: z.enum([UserRole.ADMIN, UserRole.USER]).optional().default(UserRole.USER),
});

// Login request validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Password update validation schema
export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters')
      .max(100, 'New password cannot exceed 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Types inferred from the schemas
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type PasswordUpdateRequest = z.infer<typeof passwordUpdateSchema>;
