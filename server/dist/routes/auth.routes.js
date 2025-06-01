"use strict";
// Authentication Routes
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_validator_1 = require("../validators/auth.validator");
const auth_middleware_1 = require("../middleware/auth.middleware");
// Create a new router instance
const router = (0, express_1.Router)();
// --- Public Authentication Routes ---
router.post('/register', (0, validation_middleware_1.validate)(auth_validator_1.registerSchema), auth_controller_1.register); // POST /api/auth/register - Handles new user registration.
router.post('/login', (0, validation_middleware_1.validate)(auth_validator_1.loginSchema), auth_controller_1.login); // POST /api/auth/login - Handles user login and issues a JWT.
// --- Protected Authentication Routes ---
router.get('/profile', auth_middleware_1.authenticate, auth_controller_1.getProfile);
router.put('/update-password', auth_middleware_1.authenticate, (0, validation_middleware_1.validate)(auth_validator_1.passwordUpdateSchema), auth_controller_1.updatePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map