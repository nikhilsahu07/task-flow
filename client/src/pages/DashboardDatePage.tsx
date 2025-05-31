import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusCircle, AlertTriangle, ArrowLeft, Calendar } from 'lucide-react';
import { getTasksByDate, deleteTask, updateTask } from '../api/taskApi';
import { Task, TaskStatus } from '../types';
import TaskColumn from '../components/tasks/TaskColumn';
import ConfirmDialog from '../components/common/ConfirmDialog';

const DashboardDatePage: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Parse the date parameter (YYYYMMDD format)
  const parsedDate = React.useMemo(() => {
    if (!date || date.length !== 8) return null;

    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(4, 6), 10) - 1; // Month is 0-indexed
    const day = parseInt(date.substring(6, 8), 10);

    try {
      // Use local time to avoid timezone conversion issues
      const dateObj = new Date(year, month, day);

      // Validate the date is actually valid
      if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month ||
        dateObj.getDate() !== day
      ) {
        return null;
      }

      return dateObj;
    } catch {
      return null;
    }
  }, [date]);

  const formattedDate = React.useMemo(() => {
    if (!parsedDate) return 'Invalid Date';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    parsedDate.setHours(0, 0, 0, 0);

    if (parsedDate.getTime() === today.getTime()) {
      return "Today's Tasks";
    }

    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[parsedDate.getDay()];
    const formattedDateStr = parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    return `${dayName} - ${formattedDateStr}`;
  }, [parsedDate]);

  useEffect(() => {
    if (!parsedDate) {
      setError('Invalid date format. Please use YYYYMMDD format.');
      setIsLoading(false);
      return;
    }

    const fetchTasksForDate = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTasksByDate(date!);
        if (response.success) {
          const dateTasks = response.data?.tasks || [];
          setTasks(dateTasks);
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

    fetchTasksForDate();
  }, [date]);

  const handleOpenDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const response = await deleteTask(taskToDelete);
      if (response.success) {
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskToDelete));
        toast.success('Task deleted successfully!');
      } else {
        toast.error(response.error?.toString() || 'Failed to delete task.');
      }
    } catch (_err) {
      toast.error('An unexpected error occurred during task deletion.');
    } finally {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleTaskDrop = async (taskId: string, newStatus: TaskStatus) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) {
      return;
    }

    const originalStatus = taskToUpdate.status;

    // Optimistic UI update
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task._id === taskId ? { ...task, status: newStatus } : task)),
    );

    try {
      const response = await updateTask(taskId, { status: newStatus });
      if (response.success) {
        toast.success(`Task moved to ${formatStatus(newStatus)}.`);
      } else {
        // Revert UI update if API call fails
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, status: originalStatus } : task,
          ),
        );
        toast.error(response.error?.toString() || 'Failed to update task status.');
      }
    } catch (_err) {
      // Revert UI update on unexpected error
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskId ? { ...task, status: originalStatus } : task)),
      );
      toast.error('An unexpected error occurred while updating task status.');
    }
  };

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

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === TaskStatus.TODO);
  const inProgressTasks = tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS);
  const reviewTasks = tasks.filter((task) => task.status === TaskStatus.REVIEW);
  const doneTasks = tasks.filter((task) => task.status === TaskStatus.DONE);

  const taskToDeleteTitle = taskToDelete
    ? tasks.find((task) => task._id === taskToDelete)?.title || 'this task'
    : '';

  if (!parsedDate) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center">
          <Link
            to="/todo-planner"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to Planner
          </Link>
        </div>
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-md border border-red-200 dark:border-red-700">
          <AlertTriangle className="h-5 w-5 mr-2 inline" />
          Invalid date format. Please use YYYYMMDD format.
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center">
              <Link
                to="/todo-planner"
                className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-6 transition-colors duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back to Planner
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  {formattedDate}
                </h1>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {tasks.length} task{tasks.length !== 1 ? 's' : ''} scheduled
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Link
                to={`/tasks/create/${date}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Plan Task for This Date
              </Link>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 flex items-center border border-red-200 dark:border-red-700">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-6"></div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Loading tasks for {formattedDate}...
              </p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 max-w-md mx-auto">
                <Calendar className="h-20 w-20 text-gray-400 dark:text-gray-600 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                  No tasks scheduled
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                  You don&apos;t have any tasks scheduled for this date.
                </p>
                <Link
                  to={`/tasks/create/${date}`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Plan Your First Task
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Task Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <TaskColumn
                  title="To Do"
                  status={TaskStatus.TODO}
                  tasks={todoTasks}
                  onDelete={handleOpenDeleteDialog}
                  onTaskDrop={handleTaskDrop}
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
            </div>
          )}
        </div>
      </div>

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

export default DashboardDatePage;
