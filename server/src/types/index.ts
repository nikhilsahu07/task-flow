import mongoose from 'mongoose';

export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

// UserRole defines the possible roles a user can have.
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserWithoutPassword = Omit<IUser, 'password'>;

// TaskPriority defines the different priority levels a task can have.
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// TaskStatus defines the various stages or states a task can be in.
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

// ITask defines the structure of a task object.
export interface ITask {
  _id?: string | mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | Date;
  createdFor?: string | Date;
  createdBy: string | mongoose.Types.ObjectId | Record<string, any>;
  assignedTo?: string | mongoose.Types.ObjectId | Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

// AuthRequest extends the Express Request type to include an optional 'user' object.

export interface AuthRequest extends Express.Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

// JwtPayload defines the structure of the data embedded within a JWT.
export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}
