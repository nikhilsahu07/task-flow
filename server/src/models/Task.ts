import mongoose, { Document, Schema } from 'mongoose'; // Mongoose for MongoDB object modeling
import { ITask, TaskPriority, TaskStatus } from '../types'; // Import task-related types and enums

// Defines the structure of a Task document in MongoDB, extending Mongoose's Document.
// `Omit<ITask, '_id'>` is used because Mongoose Document already includes `_id`.
export interface TaskDocument extends Omit<ITask, '_id'>, Document {
  // Add any custom methods for the Task model here if needed in the future.
}

// Mongoose schema for the Task model.
// This defines the shape, data types, validation, and defaults for task documents.
const taskSchema = new Schema<TaskDocument>(
  {
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
      enum: Object.values(TaskStatus), // Status must be one of the values from TaskStatus enum.
      default: TaskStatus.TODO, // Default status is 'todo' if not specified.
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority), // Priority must be one of the values from TaskPriority enum.
      default: TaskPriority.MEDIUM, // Default priority is 'medium' if not specified.
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
      type: Schema.Types.ObjectId, // Reference to the User who created the task.
      ref: 'User', // Links this field to the 'User' model.
      required: true, // Every task must have a creator.
    },
    assignedTo: {
      type: Schema.Types.ObjectId, // Reference to the User to whom the task is assigned.
      ref: 'User', // Links this field to the 'User' model.
      // This field is optional, a task might not be assigned to anyone initially.
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields.
  },
);

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
export const Task = mongoose.model<TaskDocument>('Task', taskSchema);
