import { Request, Response } from 'express';
import { Task } from '../models/Task';
import { AuthRequest } from '../types';
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskFilterRequest,
} from '../validators/task.validator';
import mongoose from 'mongoose';

/**
 * Create a new task
 */
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: userId } = (req as AuthRequest).user!;
    const taskData = req.body as CreateTaskRequest;

    // Create the task with the current user as creator
    const task = await Task.create({
      ...taskData,
      createdBy: userId,
      // Convert string date to Date object if it exists
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      // Handle empty assignedTo strings to avoid ObjectId casting errors
      assignedTo: taskData.assignedTo ? taskData.assignedTo : undefined,
    });

    // Return the created task
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: { task },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create task',
      error: (error as Error).message,
    });
  }
};

/**
 * Get all tasks with filtering and pagination
 */
export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: userId, role } = (req as AuthRequest).user!;
    const filterOptions = req.query as unknown as TaskFilterRequest;

    // Build the filter query
    const filter: Record<string, any> = {};

    // Apply status filter if provided
    if (filterOptions.status) {
      filter.status = filterOptions.status;
    }

    // Apply priority filter if provided
    if (filterOptions.priority) {
      filter.priority = filterOptions.priority;
    }

    // Apply creator filter if provided and user is admin
    if (filterOptions.createdBy && role === 'admin') {
      filter.createdBy = filterOptions.createdBy;
    } else {
      // Regular users can only see tasks they created or are assigned to
      filter.$or = [{ createdBy: userId }, { assignedTo: userId }];
    }

    // Apply assignee filter if provided and user is admin
    if (filterOptions.assignedTo && role === 'admin') {
      filter.assignedTo = filterOptions.assignedTo;
    }

    // Apply text search if provided
    if (filterOptions.search) {
      filter.$or = [
        { title: { $regex: filterOptions.search, $options: 'i' } },
        { description: { $regex: filterOptions.search, $options: 'i' } },
      ];
    }

    // Set up pagination
    const page = parseInt(filterOptions.page || '1', 10);
    const limit = parseInt(filterOptions.limit || '10', 10);
    const skip = (page - 1) * limit;

    // Set up sorting
    const sortBy = filterOptions.sortBy || 'createdAt';
    const sortDir = filterOptions.sortDir || 'desc';
    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortDir === 'asc' ? 1 : -1,
    };

    // Query tasks with pagination and sorting
    const tasks = await Task.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    // Get total count for pagination
    const total = await Task.countDocuments(filter);

    // Return tasks with pagination info
    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tasks',
      error: (error as Error).message,
    });
  }
};

/**
 * Get a single task by ID
 */
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: taskId } = req.params;
    const { id: userId, role } = (req as AuthRequest).user!;

    // Validate task ID format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid task ID',
        error: 'Task ID is not valid',
      });
      return;
    }

    // Find the task
    const task = await Task.findById(taskId)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    // Check if task exists
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
        error: 'Task does not exist',
      });
      return;
    }

    // Check if user has access to the task
    const createdById =
      typeof task.createdBy === 'object' && task.createdBy !== null
        ? task.createdBy._id?.toString() || task.createdBy.toString()
        : task.createdBy.toString();

    const isOwner = createdById === userId;

    let assignedToId = '';
    if (task.assignedTo) {
      assignedToId =
        typeof task.assignedTo === 'object' && task.assignedTo !== null
          ? task.assignedTo._id?.toString() || task.assignedTo.toString()
          : task.assignedTo.toString();
    }

    const isAssignee = task.assignedTo && assignedToId === userId;

    if (role !== 'admin' && !isOwner && !isAssignee) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
        error: 'You do not have permission to view this task',
      });
      return;
    }

    // Return the task
    res.status(200).json({
      success: true,
      message: 'Task retrieved successfully',
      data: { task },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve task',
      error: (error as Error).message,
    });
  }
};

/**
 * Update a task
 */
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: taskId } = req.params;
    const { id: userId, role } = (req as AuthRequest).user!;
    const updateData = req.body as UpdateTaskRequest;

    // Validate task ID format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid task ID',
        error: 'Task ID is not valid',
      });
      return;
    }

    // Find the task
    const task = await Task.findById(taskId);

    // Check if task exists
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
        error: 'Task does not exist',
      });
      return;
    }

    // Check if user has permission to update the task
    const createdById =
      typeof task.createdBy === 'object' && task.createdBy !== null
        ? task.createdBy._id?.toString() || task.createdBy.toString()
        : task.createdBy.toString();

    const isOwner = createdById === userId;

    let assignedToId = '';
    if (task.assignedTo) {
      assignedToId =
        typeof task.assignedTo === 'object' && task.assignedTo !== null
          ? task.assignedTo._id?.toString() || task.assignedTo.toString()
          : task.assignedTo.toString();
    }

    const isAssignee = task.assignedTo && assignedToId === userId;

    if (role !== 'admin' && !isOwner && !isAssignee) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
        error: 'You do not have permission to update this task',
      });
      return;
    }

    // Prepare update data
    const taskUpdate: any = { ...updateData };

    // Convert string date to Date object if it exists
    if (updateData.dueDate) {
      taskUpdate.dueDate = new Date(updateData.dueDate);
    }

    // Handle empty assignedTo strings to avoid ObjectId casting errors
    if (updateData.assignedTo === '') {
      taskUpdate.assignedTo = undefined;
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { $set: taskUpdate },
      { new: true, runValidators: true },
    )
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email');

    // Return the updated task
    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: { task: updatedTask },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update task',
      error: (error as Error).message,
    });
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id: taskId } = req.params;
    const { id: userId, role } = (req as AuthRequest).user!;

    // Validate task ID format
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid task ID',
        error: 'Task ID is not valid',
      });
      return;
    }

    // Find the task
    const task = await Task.findById(taskId);

    // Check if task exists
    if (!task) {
      res.status(404).json({
        success: false,
        message: 'Task not found',
        error: 'Task does not exist',
      });
      return;
    }

    // Check if user has permission to delete the task
    const createdById =
      typeof task.createdBy === 'object' && task.createdBy !== null
        ? task.createdBy._id?.toString() || task.createdBy.toString()
        : task.createdBy.toString();

    const isOwner = createdById === userId;

    let assignedToId = '';
    if (task.assignedTo) {
      assignedToId =
        typeof task.assignedTo === 'object' && task.assignedTo !== null
          ? task.assignedTo._id?.toString() || task.assignedTo.toString()
          : task.assignedTo.toString();
    }

    const isAssignee = task.assignedTo && assignedToId === userId;

    if (role !== 'admin' && !isOwner && !isAssignee) {
      res.status(403).json({
        success: false,
        message: 'Access denied',
        error: 'You do not have permission to delete this task',
      });
      return;
    }

    // Delete the task
    await Task.findByIdAndDelete(taskId);

    // Return success
    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete task',
      error: (error as Error).message,
    });
  }
};
