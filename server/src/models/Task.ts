import mongoose, { Document, Schema } from 'mongoose';
import { ITask, TaskPriority, TaskStatus } from '../types';

// Omit _id from ITask to avoid conflict with Document's _id
export interface TaskDocument extends Omit<ITask, '_id'>, Document {
  // Add any additional methods here
}

// Task schema definition
const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.TODO,
    },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.MEDIUM,
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  },
);

// Create indexes for common queries
taskSchema.index({ createdBy: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });

// Create and export Task model
export const Task = mongoose.model<TaskDocument>('Task', taskSchema);
