"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = __importStar(require("mongoose")); // Mongoose for MongoDB object modeling
const types_1 = require("../types"); // Import task-related types and enums
// Mongoose schema for the Task model.
// This defines the shape, data types, validation, and defaults for task documents.
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Task title is mandatory.'], // Title is a required field.
        trim: true, // Remove whitespace from both ends of the string.
        maxlength: [100, 'Title cannot exceed 100 characters.'],
    },
    description: {
        type: String,
        required: [true, 'Task description is mandatory.'], // Description is required.
        trim: true,
    },
    status: {
        type: String,
        enum: Object.values(types_1.TaskStatus), // Status must be one of the values from TaskStatus enum.
        default: types_1.TaskStatus.TODO, // Default status is 'todo' if not specified.
    },
    priority: {
        type: String,
        enum: Object.values(types_1.TaskPriority), // Priority must be one of the values from TaskPriority enum.
        default: types_1.TaskPriority.MEDIUM, // Default priority is 'medium' if not specified.
    },
    dueDate: {
        type: Date, // Due date for the task.
        // Note: Consider adding validation, e.g., dueDate cannot be in the past for new tasks.
    },
    createdFor: {
        type: Date, // Date for which the task was created (chosen by user when creating task).
        required: [true, 'Task must be associated with a specific date.'], // This field is now required
        // This represents the target date/tile the user selected in the todo planner.
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId, // Reference to the User who created the task.
        ref: 'User', // Links this field to the 'User' model.
        required: true, // Every task must have a creator.
    },
    assignedTo: {
        type: mongoose_1.Schema.Types.ObjectId, // Reference to the User to whom the task is assigned.
        ref: 'User', // Links this field to the 'User' model.
        // This field is optional, a task might not be assigned to anyone initially.
    },
}, {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields.
});
// Database indexes to optimize common query performance.
// Indexing `createdBy` can speed up queries for tasks by a specific user.
taskSchema.index({ createdBy: 1 });
// Indexing `assignedTo` can speed up queries for tasks assigned to a specific user.
taskSchema.index({ assignedTo: 1 });
// Indexing `status` can speed up filtering tasks by their current status.
taskSchema.index({ status: 1 });
// Indexing `priority` can speed up filtering or sorting tasks by their priority.
taskSchema.index({ priority: 1 });
// Indexing `createdFor` can speed up filtering tasks by their target date.
taskSchema.index({ createdFor: 1 });
// Create and export the Mongoose model for Tasks.
// This model provides an interface to the 'tasks' collection in MongoDB.
exports.Task = mongoose_1.default.model('Task', taskSchema);
//# sourceMappingURL=Task.js.map