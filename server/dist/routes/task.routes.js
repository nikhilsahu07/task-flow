"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express"); // Express Router for defining API routes
// Import controller functions that handle the business logic for task operations
const task_controller_1 = require("../controllers/task.controller");
// Import authentication and authorization middleware
// `authenticate`: Verifies JWT to ensure user is logged in.
// `authorize`: Checks if the authenticated user has specific roles (e.g., ADMIN).
const auth_middleware_1 = require("../middleware/auth.middleware");
// Import validation middleware for request body and query parameters
const validation_middleware_1 = require("../middleware/validation.middleware");
// Zod schemas for validating task creation, update, and filter data
const task_validator_1 = require("../validators/task.validator");
const types_1 = require("../types"); // UserRole enum for role-based authorization
const router = (0, express_1.Router)(); // Initialize a new Express router for task-related routes
// --- Global Middleware for Task Routes ---
// Apply JWT authentication to all routes defined in this file.
// This means a user must be logged in to access any task endpoints.
router.use(auth_middleware_1.authenticate);
// --- Date-Specific Routes (New Implementation) ---
// GET /api/tasks/dashboard/:date - Get tasks for specific date (YYYYMMDD format)
router.get('/dashboard/:date', task_controller_1.getTasksByDate);
// POST /api/tasks/create/:date - Create a task for specific date (YYYYMMDD format)
router.post('/create/:date', (0, validation_middleware_1.validate)(task_validator_1.createTaskSchema), task_controller_1.createTaskForDate);
// --- Standard Task Routes (Authenticated Users) ---
// Note: General task creation without a date is no longer supported
// All tasks must be created for a specific date using /create/:date
// GET /api/tasks - Retrieve a list of tasks.
// - `validateQuery(taskFilterSchema)`: Validates query parameters (for filtering, sorting, pagination) against `taskFilterSchema`.
// - `getTasks`: Controller to fetch and return tasks based on validated query params.
router.get('/', (0, validation_middleware_1.validateQuery)(task_validator_1.taskFilterSchema), task_controller_1.getTasks);
// GET /api/tasks/:id - Retrieve a specific task by its ID.
// - `getTaskById`: Controller to fetch and return a single task.
router.get('/:id', task_controller_1.getTaskById);
// PUT /api/tasks/:id - Update an existing task by its ID.
// - `validate(updateTaskSchema)`: Validates the request body (fields to update) against `updateTaskSchema`.
// - `updateTask`: Controller to handle task update logic.
router.put('/:id', (0, validation_middleware_1.validate)(task_validator_1.updateTaskSchema), task_controller_1.updateTask);
// DELETE /api/tasks/:id - Delete a task by its ID.
// - `deleteTask`: Controller to handle task deletion logic.
router.delete('/:id', task_controller_1.deleteTask);
// --- Admin-Only Task Routes ---
// These routes are restricted to users with the ADMIN role.
// GET /api/tasks/admin/all - Retrieve all tasks (potentially with different default filters for admins).
// - `authorize([UserRole.ADMIN])`: Middleware to ensure only users with ADMIN role can access.
// - `validateQuery(taskFilterSchema)`: Validates admin-specific query parameters.
// - `getTasks`: Reuses the getTasks controller, which might behave differently for admins (e.g., broader scope).
router.get('/admin/all', (0, auth_middleware_1.authorize)([types_1.UserRole.ADMIN]), (0, validation_middleware_1.validateQuery)(task_validator_1.taskFilterSchema), task_controller_1.getTasks);
exports.default = router; // Export the configured router
//# sourceMappingURL=task.routes.js.map