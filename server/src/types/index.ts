import mongoose from 'mongoose';

// Common TypeScript types used throughout the application

// Utility type for API responses
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

// User roles enum
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// Base user interface
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

// User without sensitive data for return values
export type UserWithoutPassword = Omit<IUser, 'password'>;

// Task priority enum
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// Task status enum
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

// Base task interface
export interface ITask {
  _id?: string | mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | Date;
  createdBy: string | mongoose.Types.ObjectId | Record<string, any>;
  assignedTo?: string | mongoose.Types.ObjectId | Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

// Request with authenticated user
export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// JWT payload type
export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
