import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../types';
import { LoginRequest, RegisterRequest, PasswordUpdateRequest } from '../validators/auth.validator';

// Register a new user

export const register = async (req: Request, res: Response): Promise<void> => {
  // Cast request body to RegisterRequest type
  const { name, email, password, role } = req.body as RegisterRequest;

  try {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'User already exists',
        error: 'Email is already registered',
      });
      return;
    }

    // Create a new user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    // Generate JWT token
    const token = generateToken(user._id?.toString() || user.id, user.email, user.role);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: (error as Error).message,
    });
  }
};

// Login a user

export const login = async (req: Request, res: Response): Promise<void> => {
  // Cast request body to LoginRequest type
  const { email, password } = req.body as LoginRequest;

  try {
    // Find user by email
    const user = await User.findOne({ email });

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
    const token = generateToken(user._id?.toString() || user.id, user.email, user.role);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: (error as Error).message,
    });
  }
};

// Get current user profile

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as AuthRequest).user!;

    // Find user by ID
    const user = await User.findById(id).select('-password');

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: (error as Error).message,
    });
  }
};

// Update user password

export const updatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = (req as AuthRequest).user!;
    const { currentPassword, newPassword } = req.body as PasswordUpdateRequest;

    // Find user by ID
    const user = await User.findById(id);

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update password',
      error: (error as Error).message,
    });
  }
};
