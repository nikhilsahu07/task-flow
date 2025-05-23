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

import { Router } from 'express'; // Express Router for defining API routes
import { register, login, getProfile, updatePassword } from '../controllers/auth.controller'; // Import controllers that handle the business logic for each auth endpoint
import { validate } from '../middleware/validation.middleware'; // Middleware for request body validation using Zod schemas
import { registerSchema, loginSchema, passwordUpdateSchema } from '../validators/auth.validator'; // Zod schemas for validating registration, login, and password update request data
import { authenticate } from '../middleware/auth.middleware'; // Middleware to protect routes by requiring JWT authentication

// Create a new router instance
const router = Router(); // Initialize a new Express router for authentication routes

// --- Public Authentication Routes ---
// These routes do not require prior authentication (e.g., a JWT token).

/**
 * POST /api/auth/register
 *
 * Creates a new user account.
 * Validates the request body using registerSchema before processing.
 */
router.post('/register', validate(registerSchema), register); // POST /api/auth/register - Handles new user registration.

/**
 * POST /api/auth/login
 *
 * Authenticates a user and returns a JWT token.
 * Validates the request body using loginSchema before processing.
 */
router.post('/login', validate(loginSchema), login); // POST /api/auth/login - Handles user login and issues a JWT.

// --- Protected Authentication Routes ---
// These routes require a valid JWT token. The `authenticate` middleware handles token verification.

/**
 * GET /api/auth/profile
 *
 * Returns the profile information of the currently logged-in user.
 * Uses the authenticate middleware to ensure the user is logged in.
 */
router.get('/profile', authenticate, getProfile); // GET /api/auth/profile - Fetches the profile of the currently authenticated user.

/**
 * PUT /api/auth/update-password
 *
 * Updates the password for the currently logged-in user.
 * Uses the authenticate middleware to ensure the user is logged in.
 * Validates the request body using passwordUpdateSchema before processing.
 */
router.put(
  '/update-password',
  authenticate, // First, ensure user is authenticated
  validate(passwordUpdateSchema), // Then, validate the incoming password data
  updatePassword, // Finally, call the controller to update the password
); // PUT /api/auth/update-password - Allows an authenticated user to update their password.

export default router; // Export the configured router to be used in the main server setup
