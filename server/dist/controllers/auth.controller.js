"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.getProfile = exports.login = exports.register = void 0;
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
/**
 * Register a new user
 */
const register = async (req, res) => {
    // Cast request body to RegisterRequest type
    const { name, email, password, role } = req.body;
    try {
        // Check if user with this email already exists
        const existingUser = await User_1.User.findOne({ email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: 'User already exists',
                error: 'Email is already registered',
            });
            return;
        }
        // Create a new user
        const user = await User_1.User.create({
            name,
            email,
            password,
            role,
        });
        // Generate JWT token
        const token = (0, jwt_1.generateToken)(user._id?.toString() || user.id, user.email, user.role);
        // Return success with user data (exclude password)
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message,
        });
    }
};
exports.register = register;
/**
 * Login a user
 */
const login = async (req, res) => {
    // Cast request body to LoginRequest type
    const { email, password } = req.body;
    try {
        // Find user by email
        const user = await User_1.User.findOne({ email });
        // Check if user exists and password is correct
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed',
                error: 'Invalid email or password',
            });
            return;
        }
        // Generate JWT token
        const token = (0, jwt_1.generateToken)(user._id?.toString() || user.id, user.email, user.role);
        // Return success with user data
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message,
        });
    }
};
exports.login = login;
/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
    try {
        const { id } = req.user;
        // Find user by ID
        const user = await User_1.User.findById(id).select('-password');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
                error: 'User does not exist',
            });
            return;
        }
        // Return user data
        res.status(200).json({
            success: true,
            message: 'Profile retrieved successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message,
        });
    }
};
exports.getProfile = getProfile;
/**
 * Update user password
 */
const updatePassword = async (req, res) => {
    try {
        const { id } = req.user;
        const { currentPassword, newPassword } = req.body;
        // Find user by ID
        const user = await User_1.User.findById(id);
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found',
                error: 'User does not exist',
            });
            return;
        }
        // Check if current password is correct
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Password update failed',
                error: 'Current password is incorrect',
            });
            return;
        }
        // Update password
        user.password = newPassword;
        await user.save();
        // Return success
        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update password',
            error: error.message,
        });
    }
};
exports.updatePassword = updatePassword;
//# sourceMappingURL=auth.controller.js.map