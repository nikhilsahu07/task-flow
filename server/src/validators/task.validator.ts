import { z } from 'zod'; // Zod for schema declaration and validation
import { TaskPriority, TaskStatus } from '../types'; // Enums for task priority and status

// Schema for validating task creation requests.
// Defines rules for title, description, priority, status, dueDate, and assignedTo fields.
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters long')
    .max(1000, 'Description cannot exceed 1000 characters'),
  // Priority defaults to MEDIUM if not specified.
  priority: z
    .enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH])
    .default(TaskPriority.MEDIUM),
  // Status defaults to TODO if not specified.
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE])
    .default(TaskStatus.TODO),
  // dueDate is an optional string (e.g., ISO date string), can be null.
  dueDate: z.preprocess(
    (arg) => (typeof arg === 'string' && arg.trim() === '' ? null : arg),
    z.string().datetime({ message: 'Invalid date format for due date' }).optional().nullable(),
  ),
  // createdFor is now required since all tasks must be associated with a date
  createdFor: z
    .string()
    .datetime({ message: 'Invalid date format for createdFor date. Please use ISO 8601 format.' }),
  // assignedTo is an optional string (e.g., user ID), can be null.
  assignedTo: z.string().optional().nullable(),
});

// Schema for validating task update requests.
// All fields are optional, allowing partial updates.
// Rules for each field are consistent with createTaskSchema if provided.
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters long')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters long')
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]).optional(),
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE])
    .optional(),
  dueDate: z.preprocess(
    (arg) => (typeof arg === 'string' && arg.trim() === '' ? null : arg),
    z.string().datetime({ message: 'Invalid date format for due date' }).optional().nullable(),
  ),
  createdFor: z
    .string()
    .datetime({ message: 'Invalid date format for createdFor date' })
    .optional(),
  assignedTo: z.string().optional().nullable(),
});

// Schema for validating task filtering and pagination query parameters.
// All filter fields are optional.
export const taskFilterSchema = z.object({
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE])
    .optional(),
  priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]).optional(),
  // createdBy and assignedTo would typically be user IDs (strings).
  createdBy: z.string().optional(),
  assignedTo: z.string().optional(),
  search: z.string().optional(), // For text-based search on title/description
  // page and limit are expected as strings from query params, will be parsed to numbers later.
  page: z.string().regex(/^\d+$/, { message: 'Page must be a number' }).optional(),
  limit: z.string().regex(/^\d+$/, { message: 'Limit must be a number' }).optional(),
  sortBy: z.string().optional(), // Field name to sort by (e.g., 'createdAt', 'dueDate')
  sortDir: z.enum(['asc', 'desc']).optional(), // Sort direction
});

// TypeScript types inferred from Zod schemas for request body and query parameter typing.
export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
export type TaskFilterRequest = z.infer<typeof taskFilterSchema>;
