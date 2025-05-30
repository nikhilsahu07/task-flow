import { Router } from 'express'; // Express Router for defining API routes
// Import controller functions that handle the business logic for task operations
import {
  getTasks, // Controller to retrieve multiple tasks (with filtering/pagination)
  getTaskById, // Controller to retrieve a single task by its ID
  updateTask, // Controller to update an existing task
  deleteTask, // Controller to delete a task
  getTasksByDate, // New controller for date-specific tasks
  createTaskForDate, // New controller for date-specific task creation
} from '../controllers/task.controller';
// Import authentication and authorization middleware
// `authenticate`: Verifies JWT to ensure user is logged in.
// `authorize`: Checks if the authenticated user has specific roles (e.g., ADMIN).
import { authenticate, authorize } from '../middleware/auth.middleware';
// Import validation middleware for request body and query parameters
import { validate, validateQuery } from '../middleware/validation.middleware';
// Zod schemas for validating task creation, update, and filter data
import { createTaskSchema, updateTaskSchema, taskFilterSchema } from '../validators/task.validator';
import { UserRole } from '../types'; // UserRole enum for role-based authorization

const router = Router(); // Initialize a new Express router for task-related routes

// --- Global Middleware for Task Routes ---
// Apply JWT authentication to all routes defined in this file.
// This means a user must be logged in to access any task endpoints.
router.use(authenticate);

// --- Date-Specific Routes (New Implementation) ---

// GET /api/tasks/dashboard/:date - Get tasks for specific date (YYYYMMDD format)
router.get('/dashboard/:date', getTasksByDate);

// POST /api/tasks/create/:date - Create a task for specific date (YYYYMMDD format)
router.post('/create/:date', validate(createTaskSchema), createTaskForDate);

// --- Standard Task Routes (Authenticated Users) ---

// Note: General task creation without a date is no longer supported
// All tasks must be created for a specific date using /create/:date

// GET /api/tasks - Retrieve a list of tasks.
// - `validateQuery(taskFilterSchema)`: Validates query parameters (for filtering, sorting, pagination) against `taskFilterSchema`.
// - `getTasks`: Controller to fetch and return tasks based on validated query params.
router.get('/', validateQuery(taskFilterSchema), getTasks);

// GET /api/tasks/:id - Retrieve a specific task by its ID.
// - `getTaskById`: Controller to fetch and return a single task.
router.get('/:id', getTaskById);

// PUT /api/tasks/:id - Update an existing task by its ID.
// - `validate(updateTaskSchema)`: Validates the request body (fields to update) against `updateTaskSchema`.
// - `updateTask`: Controller to handle task update logic.
router.put('/:id', validate(updateTaskSchema), updateTask);

// DELETE /api/tasks/:id - Delete a task by its ID.
// - `deleteTask`: Controller to handle task deletion logic.
router.delete('/:id', deleteTask);

// --- Admin-Only Task Routes ---
// These routes are restricted to users with the ADMIN role.

// GET /api/tasks/admin/all - Retrieve all tasks (potentially with different default filters for admins).
// - `authorize([UserRole.ADMIN])`: Middleware to ensure only users with ADMIN role can access.
// - `validateQuery(taskFilterSchema)`: Validates admin-specific query parameters.
// - `getTasks`: Reuses the getTasks controller, which might behave differently for admins (e.g., broader scope).
router.get('/admin/all', authorize([UserRole.ADMIN]), validateQuery(taskFilterSchema), getTasks);

export default router; // Export the configured router
