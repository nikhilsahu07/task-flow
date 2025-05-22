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
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
// Create a new router instance
const router = (0, express_1.Router)();
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
router.post('/register', (0, validation_middleware_1.validate)(auth_validator_1.registerSchema), auth_controller_1.register);
/**
 * POST /api/auth/login
 *
 * Authenticates a user and returns a JWT token.
 * Validates the request body using loginSchema before processing.
 */
router.post('/login', (0, validation_middleware_1.validate)(auth_validator_1.loginSchema), auth_controller_1.login);
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
router.get('/profile', auth_middleware_1.authenticate, auth_controller_1.getProfile);
/**
 * PUT /api/auth/update-password
 *
 * Updates the password for the currently logged-in user.
 * Uses the authenticate middleware to ensure the user is logged in.
 * Validates the request body using passwordUpdateSchema before processing.
 */
router.put('/update-password', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(auth_validator_1.passwordUpdateSchema), auth_controller_1.updatePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map