// Common TypeScript types used throughout the client application

// User roles enum
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// User interface
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
}

// Authentication state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

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

// Task interface
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

// Task filter options
export interface TaskFilterOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Pagination interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// API response interface
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | any;
}
