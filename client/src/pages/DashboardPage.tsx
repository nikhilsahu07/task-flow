import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation, e.g., to create task page
import { toast } from 'react-toastify'; // For displaying notifications (success/error messages)
import { PlusCircle, AlertTriangle } from 'lucide-react'; // Icons for UI elements
import { getTasks, deleteTask, updateTask } from '../api/taskApi'; // API functions for task operations
import { Task, TaskStatus } from '../types'; // TypeScript types for Task and TaskStatus
import TaskColumn from '../components/tasks/TaskColumn'; // Component to display tasks in columns
import ConfirmDialog from '../components/common/ConfirmDialog'; // Reusable dialog for confirmations

// DashboardPage serves as the main view for managing tasks, displaying them in status columns.
const DashboardPage: React.FC = () => {
  // State for tasks, loading status, and error messages.
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for managing the delete confirmation dialog.
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null); // ID of the task marked for deletion

  // Fetches tasks when the component mounts.
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch a limited number of tasks for the dashboard view.
        const response = await getTasks({ limit: 100 }); // Increased limit to show more tasks initially
        if (response.success) {
          setTasks(response.data?.tasks || []);
        } else {
          setError(response.error?.toString() || 'Failed to fetch tasks.');
          toast.error(response.error?.toString() || 'Failed to fetch tasks.');
        }
      } catch (_err) {
        setError('An unexpected error occurred while fetching tasks.');
        toast.error('An unexpected error occurred while fetching tasks.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Opens the delete confirmation dialog and sets the task to be deleted.
  const handleOpenDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  // Closes the delete confirmation dialog and clears the task to be deleted.
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  // Handles the actual deletion of a task after confirmation.
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return; // Guard against no task ID selected

    try {
      const response = await deleteTask(taskToDelete);
      if (response.success) {
        // Optimistically remove the task from the local state.
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskToDelete));
        toast.success('Task deleted successfully!');
      } else {
        toast.error(response.error?.toString() || 'Failed to delete task.');
      }
    } catch (_err) {
      toast.error('An unexpected error occurred during task deletion.');
    } finally {
      // Always close the dialog and reset state regardless of outcome.
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Handles dropping a task into a new status column (drag and drop).
  const handleTaskDrop = async (taskId: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) {
      // Do nothing if task not found or status is unchanged.
      return;
    }

    // Store the original status for potential rollback.
    const originalStatus = taskToUpdate.status;

    // Optimistic UI update: Change task status locally first for responsiveness.
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task)),
    );

    try {
      const response = await updateTask(taskId, { status: newStatus }); // API call to update task status
      if (response.success) {
        toast.success(`Task moved to ${formatStatus(newStatus)}.`);
      } else {
        // Revert UI update if API call fails.
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: originalStatus } : task,
          ),
        );
        toast.error(response.error?.toString() || 'Failed to update task status.');
      }
    } catch (_err) {
      // Revert UI update on unexpected error.
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? { ...task, status: originalStatus } : task)),
      );
      toast.error('An unexpected error occurred while updating task status.');
    }
  };

  // Helper function to convert TaskStatus enum to a human-readable string.
  const formatStatus = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.REVIEW:
        return 'Review';
      case TaskStatus.DONE:
        return 'Done';
      default:
        return status; // Fallback for any unhandled status
    }
  };

  // Filter tasks into separate arrays based on their status for column display.
  const todoTasks = tasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const reviewTasks = tasks.filter((task) => task.status === TaskStatus.REVIEW);
  const doneTasks = tasks.filter((task) => task.status === TaskStatus.DONE);

  // Get the title of the task being considered for deletion for display in the confirmation dialog.
  const taskToDeleteTitle = taskToDelete
    ? tasks.find((task) => task._id === taskToDelete)?.title || 'this task' // Default if title not found
    : '';

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
          <Link
            to="/tasks/create" // Link to the page for creating new tasks
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create New Task
          </Link>
        </div>

        {/* Display error message if any error occurred during data fetching. */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Display loading spinner while tasks are being fetched. */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks, please wait...</p>
          </div>
        ) : (
          // Render task columns once data is loaded.
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <TaskColumn
              title="To Do"
              status={TaskStatus.TODO}
              tasks={todoTasks}
              onDelete={handleOpenDeleteDialog} // Pass delete handler to each column
              onTaskDrop={handleTaskDrop} // Pass drop handler for status updates
            />
            <TaskColumn
              title="In Progress"
              status={TaskStatus.IN_PROGRESS}
              tasks={inProgressTasks}
              onDelete={handleOpenDeleteDialog}
              onTaskDrop={handleTaskDrop}
            />
            <TaskColumn
              title="Review"
              status={TaskStatus.REVIEW}
              tasks={reviewTasks}
              onDelete={handleOpenDeleteDialog}
              onTaskDrop={handleTaskDrop}
            />
            <TaskColumn
              title="Done"
              status={TaskStatus.DONE}
              tasks={doneTasks}
              onDelete={handleOpenDeleteDialog}
              onTaskDrop={handleTaskDrop}
            />
          </div>
        )}

        {/* Link to view all tasks, useful if dashboard shows a subset. */}
        {!isLoading && tasks.length > 0 && (
          <div className="mt-8 text-right">
            <Link to="/tasks" className="text-blue-600 hover:text-blue-800 font-medium">
              View All Tasks
            </Link>
          </div>
        )}
      </div>

      {/* Confirmation dialog for deleting tasks. */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Confirm Task Deletion"
        message={`Are you sure you want to permanently delete "${taskToDeleteTitle}"? This action cannot be undone.`}
        confirmText="Delete Task"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default DashboardPage;
