import mongoose from 'mongoose';

// This file defines common TypeScript types and enums used across the server-side application.

// Generic type for standardizing API responses.
// Provides a consistent structure for success/error messages and data payloads.
export type ApiResponse<T> = {
  success: boolean; // Indicates if the operation was successful
  message: string; // A human-readable message about the outcome
  data?: T; // The actual data returned by the API (if any)
  error?: string; // Error message if the operation failed
};

// UserRole defines the possible roles a user can have.
export enum UserRole {
  ADMIN = 'admin', // Administrator with elevated privileges
  USER = 'user', // Standard user
}

// IUser defines the complete structure of a user object, including sensitive data (password).
// This is typically used for database models or internal representations.
export interface IUser {
  _id?: string; // Optional: Database-generated unique identifier (e.g., MongoDB ObjectId as string)
  name: string;
  email: string;
  password: string; // Hashed password
  role: UserRole;
  createdAt?: Date; // Optional: Timestamp of user creation
  updatedAt?: Date; // Optional: Timestamp of last user update
}

// UserWithoutPassword is a utility type that omits the password field from IUser.
// Useful for returning user data in API responses without exposing the hashed password.
export type UserWithoutPassword = Omit<IUser, 'password'>;

// TaskPriority defines the different priority levels a task can have.
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// TaskStatus defines the various stages or states a task can be in.
export enum TaskStatus {
  TODO = 'todo', // Task is pending
  IN_PROGRESS = 'in_progress', // Task is actively being worked on
  REVIEW = 'review', // Task is completed and awaiting review
  DONE = 'done', // Task is fully completed
}

// ITask defines the structure of a task object.
export interface ITask {
  _id?: string | mongoose.Types.ObjectId; // Optional: Database ID (string or ObjectId)
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | Date; // Optional: Due date, can be a string (e.g., ISO) or Date object
  // createdBy and assignedTo can be ObjectIds or populated user objects (Record<string, any>).
  createdBy: string | mongoose.Types.ObjectId | Record<string, any>;
  assignedTo?: string | mongoose.Types.ObjectId | Record<string, any>;
  createdAt?: Date; // Optional: Timestamp of task creation
  updatedAt?: Date; // Optional: Timestamp of last task update
}

// AuthRequest extends the Express Request type to include an optional 'user' object.
// This 'user' object is typically populated by authentication middleware with JWT payload data.
export interface AuthRequest extends Express.Request {
  user?: {
    id: string; // ID of the authenticated user
    email: string; // Email of the authenticated user
    role: UserRole; // Role of the authenticated user
  };
}

// JwtPayload defines the structure of the data embedded within a JWT.
export interface JwtPayload {
  id: string; // User ID
  email: string; // User email
  role: UserRole; // User role
}
