import mongoose, { Document, Schema } from 'mongoose';
import { ITask, TaskPriority, TaskStatus } from '../types';

export interface TaskDocument extends Omit<ITask, '_id'>, Document {}

// Mongoose schema for the Task model.

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Task title is mandatory.'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters.'],
    },
    description: {
      type: String,
      required: [true, 'Task description is mandatory.'],
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
    createdFor: {
      type: Date,
      required: [true, 'Task must be associated with a specific date.'],
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

taskSchema.index({ createdBy: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ createdFor: 1 });

export const Task = mongoose.model<TaskDocument>('Task', taskSchema);
