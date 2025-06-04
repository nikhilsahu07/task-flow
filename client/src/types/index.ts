// UserRole
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// User interface - user object
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
}

// AuthState - authentication context state
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// TaskPriority - priority levels for a task
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// TaskStatus - different stages a task can be in
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
}

// Task interface - task object
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  createdFor?: string;
  createdBy: User;
  assignedTo?: User;
  createdAt: string;
  updatedAt: string;
}

// TaskFilterOptions - available parameters for filtering and paginating tasks
export interface TaskFilterOptions {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

// Pagination interface - pagination metadata returned by the API
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// ApiResponse - generic interface for standardizing API responses
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | any;
}
