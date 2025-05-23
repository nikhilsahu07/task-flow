// Common TypeScript types and enums used throughout the client-side application.

// UserRole defines the possible roles a user can have within the system.
export enum UserRole {
  ADMIN = 'admin', // Administrator with full access
  USER = 'user', // Standard user with limited access
}

// User interface represents the structure of a user object.
export interface User {
  id: string; // Unique identifier for the user (often from auth provider)
  _id?: string; // Database-specific unique identifier (e.g., MongoDB ObjectId)
  name: string; // Full name of the user
  email: string; // Email address of the user (typically used for login)
  role: UserRole; // Role assigned to the user
}

// AuthState defines the shape of the authentication context state.
export interface AuthState {
  user: User | null; // The currently authenticated user object, or null if not authenticated
  token: string | null; // JWT or other authentication token
  isAuthenticated: boolean; // True if the user is currently authenticated
  isLoading: boolean; // True if an authentication operation (e.g., login, signup) is in progress
  error: string | null; // Stores any error message related to authentication
}

// TaskPriority defines the possible priority levels for a task.
export enum TaskPriority {
  LOW = 'low', // Low priority task
  MEDIUM = 'medium', // Medium priority task (default)
  HIGH = 'high', // High priority task
}

// TaskStatus defines the different stages a task can be in.
export enum TaskStatus {
  TODO = 'todo', // Task is yet to be started
  IN_PROGRESS = 'in_progress', // Task is currently being worked on
  REVIEW = 'review', // Task is completed and pending review
  DONE = 'done', // Task is completed
}

// Task interface represents the structure of a task object.
export interface Task {
  _id: string; // Unique identifier for the task (typically database ID)
  title: string; // Title or name of the task
  description: string; // Detailed description of the task
  status: TaskStatus; // Current status of the task
  priority: TaskPriority; // Priority level of the task
  dueDate?: string; // Optional due date for the task (ISO string format)
  createdBy: User; // User who created the task
  assignedTo?: User; // Optional user to whom the task is assigned
  createdAt: string; // Timestamp of when the task was created (ISO string format)
  updatedAt: string; // Timestamp of when the task was last updated (ISO string format)
}

// TaskFilterOptions defines the available parameters for filtering and paginating tasks.
export interface TaskFilterOptions {
  status?: TaskStatus; // Filter tasks by status
  priority?: TaskPriority; // Filter tasks by priority
  search?: string; // Search term to filter tasks by title or description
  page?: number; // Page number for pagination
  limit?: number; // Number of tasks per page
  sortBy?: string; // Field to sort tasks by (e.g., "createdAt", "dueDate")
  sortDir?: 'asc' | 'desc'; // Sort direction: 'asc' for ascending, 'desc' for descending
}

// Pagination interface describes the structure of pagination metadata returned by the API.
export interface Pagination {
  page: number; // Current page number
  limit: number; // Number of items per page
  total: number; // Total number of items across all pages
  pages: number; // Total number of pages
}

// ApiResponse is a generic interface for standardizing API responses.
// It helps in consistently handling success and error states from backend calls.
export interface ApiResponse<T> {
  success: boolean; // Indicates if the API request was successful
  message: string; // A human-readable message accompanying the response
  data?: T; // The actual data payload of the response (generic type T)
  error?: string | any; // Error message or details if the request failed
}
