import api from './axiosConfig';
import { ApiResponse, User } from '../types';
import { z } from 'zod';

// Zod schema for registration form validation
export const registerSchema = z
  .object({
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
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Zod schema for login form validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

// Type definitions
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;

// Auth response type
interface AuthResponse {
  user: User;
  token: string;
}

// Register a new user

export const register = async (userData: RegisterFormData): Promise<ApiResponse<AuthResponse>> => {
  try {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', userData);

    // Store token and user data in local storage if successful
    if (data.success && data.data) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Registration failed',
      error: error.response?.data?.error || error.message,
    };
  }
};

// Login a user

export const login = async (credentials: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
  try {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);

    // Store token and user data in local storage if successful
    if (data.success && data.data) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Login failed',
      error: error.response?.data?.error || error.message,
    };
  }
};

// Get current user profile

export const getProfile = async (): Promise<ApiResponse<{ user: User }>> => {
  try {
    const { data } = await api.get<ApiResponse<{ user: User }>>('/auth/profile');
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to fetch profile',
      error: error.response?.data?.error || error.message,
    };
  }
};

// Logout user by removing token from local storage

export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token');
};

// Get current user from local storage

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('user');
  return userJson ? JSON.parse(userJson) : null;
};
