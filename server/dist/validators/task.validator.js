"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskFilterSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod"); // Zod for schema declaration and validation
const types_1 = require("../types"); // Enums for task priority and status
// Schema for validating task creation requests.
// Defines rules for title, description, priority, status, dueDate, and assignedTo fields.
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, 'Title must be at least 3 characters long')
        .max(100, 'Title cannot exceed 100 characters'),
    description: zod_1.z
        .string()
        .min(5, 'Description must be at least 5 characters long')
        .max(1000, 'Description cannot exceed 1000 characters'),
    // Priority defaults to MEDIUM if not specified.
    priority: zod_1.z
        .enum([types_1.TaskPriority.LOW, types_1.TaskPriority.MEDIUM, types_1.TaskPriority.HIGH])
        .default(types_1.TaskPriority.MEDIUM),
    // Status defaults to TODO if not specified.
    status: zod_1.z
        .enum([types_1.TaskStatus.TODO, types_1.TaskStatus.IN_PROGRESS, types_1.TaskStatus.REVIEW, types_1.TaskStatus.DONE])
        .default(types_1.TaskStatus.TODO),
    // dueDate is an optional string (e.g., ISO date string), can be null.
    dueDate: zod_1.z
        .string()
        .datetime({ message: 'Invalid date format for due date' })
        .optional()
        .nullable(),
    // assignedTo is an optional string (e.g., user ID), can be null.
    assignedTo: zod_1.z.string().optional().nullable(),
});
// Schema for validating task update requests.
// All fields are optional, allowing partial updates.
// Rules for each field are consistent with createTaskSchema if provided.
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, 'Title must be at least 3 characters long')
        .max(100, 'Title cannot exceed 100 characters')
        .optional(),
    description: zod_1.z
        .string()
        .min(5, 'Description must be at least 5 characters long')
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional(),
    priority: zod_1.z.enum([types_1.TaskPriority.LOW, types_1.TaskPriority.MEDIUM, types_1.TaskPriority.HIGH]).optional(),
    status: zod_1.z
        .enum([types_1.TaskStatus.TODO, types_1.TaskStatus.IN_PROGRESS, types_1.TaskStatus.REVIEW, types_1.TaskStatus.DONE])
        .optional(),
    dueDate: zod_1.z
        .string()
        .datetime({ message: 'Invalid date format for due date' })
        .optional()
        .nullable(),
    assignedTo: zod_1.z.string().optional().nullable(),
});
// Schema for validating task filtering and pagination query parameters.
// All filter fields are optional.
exports.taskFilterSchema = zod_1.z.object({
    status: zod_1.z
        .enum([types_1.TaskStatus.TODO, types_1.TaskStatus.IN_PROGRESS, types_1.TaskStatus.REVIEW, types_1.TaskStatus.DONE])
        .optional(),
    priority: zod_1.z.enum([types_1.TaskPriority.LOW, types_1.TaskPriority.MEDIUM, types_1.TaskPriority.HIGH]).optional(),
    // createdBy and assignedTo would typically be user IDs (strings).
    createdBy: zod_1.z.string().optional(),
    assignedTo: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(), // For text-based search on title/description
    // page and limit are expected as strings from query params, will be parsed to numbers later.
    page: zod_1.z.string().regex(/^\d+$/, { message: 'Page must be a number' }).optional(),
    limit: zod_1.z.string().regex(/^\d+$/, { message: 'Limit must be a number' }).optional(),
    sortBy: zod_1.z.string().optional(), // Field name to sort by (e.g., 'createdAt', 'dueDate')
    sortDir: zod_1.z.enum(['asc', 'desc']).optional(), // Sort direction
});
//# sourceMappingURL=task.validator.js.map