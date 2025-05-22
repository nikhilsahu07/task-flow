"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskFilterSchema = exports.updateTaskSchema = exports.createTaskSchema = void 0;
const zod_1 = require("zod");
const types_1 = require("../types");
// Task creation validation schema
exports.createTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters'),
    description: zod_1.z
        .string()
        .min(5, 'Description must be at least 5 characters')
        .max(1000, 'Description cannot exceed 1000 characters'),
    priority: zod_1.z
        .enum([types_1.TaskPriority.LOW, types_1.TaskPriority.MEDIUM, types_1.TaskPriority.HIGH])
        .default(types_1.TaskPriority.MEDIUM),
    status: zod_1.z
        .enum([types_1.TaskStatus.TODO, types_1.TaskStatus.IN_PROGRESS, types_1.TaskStatus.REVIEW, types_1.TaskStatus.DONE])
        .default(types_1.TaskStatus.TODO),
    dueDate: zod_1.z.string().optional().nullable(),
    assignedTo: zod_1.z.string().optional().nullable(),
});
// Task update validation schema
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(3, 'Title must be at least 3 characters')
        .max(100, 'Title cannot exceed 100 characters')
        .optional(),
    description: zod_1.z
        .string()
        .min(5, 'Description must be at least 5 characters')
        .max(1000, 'Description cannot exceed 1000 characters')
        .optional(),
    priority: zod_1.z.enum([types_1.TaskPriority.LOW, types_1.TaskPriority.MEDIUM, types_1.TaskPriority.HIGH]).optional(),
    status: zod_1.z
        .enum([types_1.TaskStatus.TODO, types_1.TaskStatus.IN_PROGRESS, types_1.TaskStatus.REVIEW, types_1.TaskStatus.DONE])
        .optional(),
    dueDate: zod_1.z.string().optional().nullable(),
    assignedTo: zod_1.z.string().optional().nullable(),
});
// Task filter validation schema
exports.taskFilterSchema = zod_1.z.object({
    status: zod_1.z
        .enum([types_1.TaskStatus.TODO, types_1.TaskStatus.IN_PROGRESS, types_1.TaskStatus.REVIEW, types_1.TaskStatus.DONE])
        .optional(),
    priority: zod_1.z.enum([types_1.TaskPriority.LOW, types_1.TaskPriority.MEDIUM, types_1.TaskPriority.HIGH]).optional(),
    createdBy: zod_1.z.string().optional(),
    assignedTo: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    page: zod_1.z.string().optional(),
    limit: zod_1.z.string().optional(),
    sortBy: zod_1.z.string().optional(),
    sortDir: zod_1.z.enum(['asc', 'desc']).optional(),
});
//# sourceMappingURL=task.validator.js.map