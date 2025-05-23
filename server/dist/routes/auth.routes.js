"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Express Router for defining API routes
const auth_controller_1 = require("../controllers/auth.controller"); // Import controllers that handle the business logic for each auth endpoint
const validation_middleware_1 = require("../middleware/validation.middleware"); // Middleware for request body validation using Zod schemas
const auth_validator_1 = require("../validators/auth.validator"); // Zod schemas for validating registration, login, and password update request data
const auth_middleware_1 = require("../middleware/auth.middleware"); // Middleware to protect routes by requiring JWT authentication
// Create a new router instance
const router = (0, express_1.Router)(); // Initialize a new Express router for authentication routes
// --- Public Authentication Routes ---
// These routes do not require prior authentication (e.g., a JWT token).
/**
 * POST /api/auth/register
 *
 * Creates a new user account.
 * Validates the request body using registerSchema before processing.
 */
router.post('/register', (0, validation_middleware_1.validate)(auth_validator_1.registerSchema), auth_controller_1.register); // POST /api/auth/register - Handles new user registration.
/**
 * POST /api/auth/login
 *
 * Authenticates a user and returns a JWT token.
 * Validates the request body using loginSchema before processing.
 */
router.post('/login', (0, validation_middleware_1.validate)(auth_validator_1.loginSchema), auth_controller_1.login); // POST /api/auth/login - Handles user login and issues a JWT.
// --- Protected Authentication Routes ---
// These routes require a valid JWT token. The `authenticate` middleware handles token verification.
/**
 * GET /api/auth/profile
 *
 * Returns the profile information of the currently logged-in user.
 * Uses the authenticate middleware to ensure the user is logged in.
 */
router.get('/profile', auth_middleware_1.authenticate, auth_controller_1.getProfile); // GET /api/auth/profile - Fetches the profile of the currently authenticated user.
/**
 * PUT /api/auth/update-password
 *
 * Updates the password for the currently logged-in user.
 * Uses the authenticate middleware to ensure the user is logged in.
 * Validates the request body using passwordUpdateSchema before processing.
 */
router.put('/update-password', auth_middleware_1.authenticate, // First, ensure user is authenticated
(0, validation_middleware_1.validate)(auth_validator_1.passwordUpdateSchema), // Then, validate the incoming password data
auth_controller_1.updatePassword); // PUT /api/auth/update-password - Allows an authenticated user to update their password.
exports.default = router; // Export the configured router to be used in the main server setup
//# sourceMappingURL=auth.routes.js.map