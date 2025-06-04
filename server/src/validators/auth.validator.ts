import { z } from 'zod';
import { UserRole } from '../types';

// Schema for validation
// Ensures name, email, and password meet specific criteria
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name cannot exceed 50 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .min(5, 'Email must be at least 5 characters long')
    .max(100, 'Email cannot exceed 100 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password cannot exceed 100 characters')

    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password requires an uppercase letter, a lowercase letter, and a number',
    ),
  // Role is optional & default user
  role: z.enum([UserRole.ADMIN, UserRole.USER]).optional().default(UserRole.USER),
});

// Schema for validating user login requests.

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'), // Simple check for presence
});

// Schema for validating password update requests.
export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters long')
      .max(100, 'New password cannot exceed 100 characters')
      // Same complexity rules as registration password.
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'New password requires an uppercase letter, a lowercase letter, and a number',
      ),
    confirmPassword: z.string().min(1, 'Please confirm your new password'),
  })
  // Custom refinement to check if newPassword and confirmPassword match.
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

// TypeScript types inferred from the Zod schemas for use in controllers and services
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type PasswordUpdateRequest = z.infer<typeof passwordUpdateSchema>;
