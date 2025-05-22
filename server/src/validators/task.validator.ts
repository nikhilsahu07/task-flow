import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../types';

// Task creation validation schema
export const createTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(1000, 'Description cannot exceed 1000 characters'),
  priority: z
    .enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH])
    .default(TaskPriority.MEDIUM),
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE])
    .default(TaskStatus.TODO),
  dueDate: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

// Task update validation schema
export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .optional(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters')
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),
  priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]).optional(),
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE])
    .optional(),
  dueDate: z.string().optional().nullable(),
  assignedTo: z.string().optional().nullable(),
});

// Task filter validation schema
export const taskFilterSchema = z.object({
  status: z
    .enum([TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.REVIEW, TaskStatus.DONE])
    .optional(),
  priority: z.enum([TaskPriority.LOW, TaskPriority.MEDIUM, TaskPriority.HIGH]).optional(),
  createdBy: z.string().optional(),
  assignedTo: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortDir: z.enum(['asc', 'desc']).optional(),
});

// Types inferred from the schemas
export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
export type TaskFilterRequest = z.infer<typeof taskFilterSchema>;
