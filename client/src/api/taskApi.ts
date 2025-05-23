import api from './axiosConfig';
import { ApiResponse, Task, TaskFilterOptions, TaskPriority, TaskStatus } from '../types';
import { z } from 'zod';

// Zod schema for task creation/update form validation
export const taskSchema = z.object({
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
  dueDate: z
    .preprocess(
      (arg) => {
        if (typeof arg === 'string' && arg.trim() === '') {
          return null; // Convert empty string to null
        }
        if (typeof arg === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(arg)) {
          return `${arg}T00:00:00.000Z`; // Convert YYYY-MM-DD to ISO datetime
        }
        return arg; // Pass through other values (like actual ISO strings or null/undefined)
      },
      z
        .string()
        .datetime({ message: 'Invalid date format for due date. Please use ISO 8601 format.' }),
    )
    .optional()
    .nullable(),
  assignedTo: z.string().optional().nullable(),
});

// Type definition
export type TaskFormData = z.infer<typeof taskSchema>;

// Response type for task list
interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Create a new task
 */
export const createTask = async (taskData: TaskFormData): Promise<ApiResponse<{ task: Task }>> => {
  try {
    const { data } = await api.post<ApiResponse<{ task: Task }>>('/tasks', taskData);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to create task',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get all tasks with filtering and pagination
 */
export const getTasks = async (
  filterOptions: TaskFilterOptions = {},
): Promise<ApiResponse<TaskListResponse>> => {
  try {
    // Convert filter options to query parameters
    const params = new URLSearchParams();

    if (filterOptions.status) {
      params.append('status', filterOptions.status);
    }

    if (filterOptions.priority) {
      params.append('priority', filterOptions.priority);
    }

    if (filterOptions.search) {
      params.append('search', filterOptions.search);
    }

    if (filterOptions.page) {
      params.append('page', filterOptions.page.toString());
    }

    if (filterOptions.limit) {
      params.append('limit', filterOptions.limit.toString());
    }

    if (filterOptions.sortBy) {
      params.append('sortBy', filterOptions.sortBy);
    }

    if (filterOptions.sortDir) {
      params.append('sortDir', filterOptions.sortDir);
    }

    const { data } = await api.get<ApiResponse<TaskListResponse>>('/tasks', { params });

    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to fetch tasks',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Get a task by ID
 */
export const getTaskById = async (taskId: string): Promise<ApiResponse<{ task: Task }>> => {
  try {
    const { data } = await api.get<ApiResponse<{ task: Task }>>(`/tasks/${taskId}`);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to fetch task',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Update a task
 */
export const updateTask = async (
  taskId: string,
  taskData: Partial<TaskFormData>,
): Promise<ApiResponse<{ task: Task }>> => {
  try {
    const { data } = await api.put<ApiResponse<{ task: Task }>>(`/tasks/${taskId}`, taskData);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to update task',
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * Delete a task
 */
export const deleteTask = async (taskId: string): Promise<ApiResponse<null>> => {
  try {
    const { data } = await api.delete<ApiResponse<null>>(`/tasks/${taskId}`);
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Failed to delete task',
      error: error.response?.data?.error || error.message,
    };
  }
};
