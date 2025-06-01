// Authentication Routes

import { Router } from 'express';
import { register, login, getProfile, updatePassword } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { registerSchema, loginSchema, passwordUpdateSchema } from '../validators/auth.validator';
import { authenticate } from '../middleware/auth.middleware';

// Create a new router instance
const router = Router();

// --- Public Authentication Routes ---

router.post('/register', validate(registerSchema), register); // POST /api/auth/register - Handles new user registration.

router.post('/login', validate(loginSchema), login); // POST /api/auth/login - Handles user login and issues a JWT.

// --- Protected Authentication Routes ---

router.get('/profile', authenticate, getProfile);

router.put('/update-password', authenticate, validate(passwordUpdateSchema), updatePassword);

export default router;
