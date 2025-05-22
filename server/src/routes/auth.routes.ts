/**
 * Authentication Routes
 *
 * This file defines all authentication-related API endpoints for:
 * - User registration
 * - User login
 * - Getting user profile
 * - Updating user password
 *
 * Each route uses appropriate middleware for:
 * - Request validation (using Zod schemas)
 * - Authentication checks
 * - Controller functions to handle business logic
 */

import { Router } from 'express';
import { register, login, getProfile, updatePassword } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { registerSchema, loginSchema, passwordUpdateSchema } from '../validators/auth.validator';
import { authenticate } from '../middleware/auth.middleware';

// Create a new router instance
const router = Router();

/**
 * Public Routes (No Authentication Required)
 * These routes are accessible to anyone, even without being logged in
 */

/**
 * POST /api/auth/register
 *
 * Creates a new user account.
 * Validates the request body using registerSchema before processing.
 */
router.post('/register', validate(registerSchema), register);

/**
 * POST /api/auth/login
 *
 * Authenticates a user and returns a JWT token.
 * Validates the request body using loginSchema before processing.
 */
router.post('/login', validate(loginSchema), login);

/**
 * Protected Routes (Authentication Required)
 * These routes require a valid JWT token in the Authorization header
 * The authenticate middleware verifies the token before proceeding
 */

/**
 * GET /api/auth/profile
 *
 * Returns the profile information of the currently logged-in user.
 * Uses the authenticate middleware to ensure the user is logged in.
 */
router.get('/profile', authenticate, getProfile);

/**
 * PUT /api/auth/update-password
 *
 * Updates the password for the currently logged-in user.
 * Uses the authenticate middleware to ensure the user is logged in.
 * Validates the request body using passwordUpdateSchema before processing.
 */
router.put('/update-password', authenticate, validate(passwordUpdateSchema), updatePassword);

export default router;
