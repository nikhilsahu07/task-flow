import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { getTasks, deleteTask, updateTask } from '../api/taskApi';
import { Task, TaskStatus } from '../types';
import TaskColumn from '../components/tasks/TaskColumn';
import ConfirmDialog from '../components/common/ConfirmDialog';

const DashboardPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getTasks({ limit: 10 });

        if (response.success) {
          setTasks(response.data?.tasks || []);
        } else {
          setError(response.error?.toString() || 'Error fetching tasks');
        }
      } catch (_err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Handle opening the delete confirmation dialog
  const handleOpenDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  // Handle canceling task deletion
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  // Handle confirming task deletion
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const response = await deleteTask(taskToDelete);

      if (response.success) {
        // Remove the deleted task from the list
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskToDelete));
        toast.success('Task deleted successfully');
      } else {
        toast.error(response.error?.toString() || 'Error deleting task');
      }
    } catch (_err) {
      toast.error('An unexpected error occurred');
    } finally {
      // Close the dialog and reset state
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Handle task status change via drag and drop
  const handleTaskDrop = async (taskId: string, newStatus: TaskStatus) => {
    // Find the task to update
    const taskToUpdate = tasks.find((task) => task._id === taskId);

    if (!taskToUpdate) return;

    // Skip if the status hasn't changed
    if (taskToUpdate.status === newStatus) return;

    try {
      // Optimistically update the UI
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task)),
      );

      // Update in the backend
      const response = await updateTask(taskId, { status: newStatus });

      if (response.success) {
        toast.success(`Task moved to ${formatStatus(newStatus)}`);
      } else {
        // Revert if the update fails
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: taskToUpdate.status } : task,
          ),
        );
        toast.error(response.error?.toString() || 'Error updating task');
      }
    } catch (_err) {
      // Revert on error
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: taskToUpdate.status } : task,
        ),
      );
      toast.error('An unexpected error occurred');
    }
  };

  // Format status text for display
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
        return status;
    }
  };

  // Group tasks by status
  const todoTasks = tasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const reviewTasks = tasks.filter((task) => task.status === TaskStatus.REVIEW);
  const doneTasks = tasks.filter((task) => task.status === TaskStatus.DONE);

  // Find task title for confirmation dialog
  const taskToDeleteTitle = taskToDelete
    ? tasks.find((task) => task._id === taskToDelete)?.title || 'this task'
    : '';

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/tasks/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            New Task
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* To Do Column */}
            <TaskColumn
              title="To Do"
              status={TaskStatus.TODO}
              tasks={todoTasks}
              onDelete={handleOpenDeleteDialog}
              onTaskDrop={handleTaskDrop}
            />

            {/* In Progress Column */}
            <TaskColumn
              title="In Progress"
              status={TaskStatus.IN_PROGRESS}
              tasks={inProgressTasks}
              onDelete={handleOpenDeleteDialog}
              onTaskDrop={handleTaskDrop}
            />

            {/* Review Column */}
            <TaskColumn
              title="Review"
              status={TaskStatus.REVIEW}
              tasks={reviewTasks}
              onDelete={handleOpenDeleteDialog}
              onTaskDrop={handleTaskDrop}
            />

            {/* Done Column */}
            <TaskColumn
              title="Done"
              status={TaskStatus.DONE}
              tasks={doneTasks}
              onDelete={handleOpenDeleteDialog}
              onTaskDrop={handleTaskDrop}
            />
          </div>
        )}

        <div className="mt-8 text-right">
          <Link to="/tasks" className="text-blue-600 hover:text-blue-800 font-medium">
            View all tasks
          </Link>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Delete Task"
        message={`Are you sure you want to delete "${taskToDeleteTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default DashboardPage;
