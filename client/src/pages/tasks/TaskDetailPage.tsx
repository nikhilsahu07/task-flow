import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Edit, Trash, ArrowLeft, Clock, Flag, Tag } from 'lucide-react';
import { getTaskById, deleteTask } from '../../api/taskApi';
import { Task, TaskPriority, TaskStatus } from '../../types';

// TaskDetailPage displays detailed information about a single task.
const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // State for storing the fetched task data
  const [task, setTask] = useState<Task | null>(null);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State for storing any errors during API calls
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch the task data when the component mounts or the ID changes.
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) {
        setError('Task ID is missing.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getTaskById(id);
        if (response.success && response.data) {
          setTask(response.data.task);
        } else {
          setError(response.error?.toString() || 'Error fetching task details.');
          toast.error(response.error?.toString() || 'Error fetching task details.');
        }
      } catch (_err) {
        setError('An unexpected error occurred while fetching the task.');
        toast.error('An unexpected error occurred while fetching the task.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Handles the deletion of the current task.
  const handleDeleteTask = async () => {
    if (!id) return;

    // Confirm with the user before proceeding with deletion.
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      try {
        const response = await deleteTask(id);
        if (response.success) {
          toast.success('Task deleted successfully!');
          navigate('/tasks');
        } else {
          toast.error(response.error?.toString() || 'Failed to delete task.');
        }
      } catch (_err) {
        toast.error('An unexpected error occurred during task deletion.');
      }
    }
  };

  // Helper function to format date strings for display.
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function to get Tailwind CSS classes for priority badges.
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'bg-green-100 text-green-800';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case TaskPriority.HIGH:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get Tailwind CSS classes for status badges.
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-100 text-gray-800';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800';
      case TaskStatus.REVIEW:
        return 'bg-purple-100 text-purple-800';
      case TaskStatus.DONE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to format task status enum values into human-readable strings.
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

  // Display loading spinner while task data is being fetched.
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading task details...</p>
      </div>
    );
  }

  // Display error message if fetching failed or task is not found.
  if (error || !task) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Task not found.'}</p>
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Task List
          </Link>
        </div>
      </div>
    );
  }

  // Render the detailed task information.
  return (
    <div className="max-w-3xl mx-auto">
      {/* Back navigation link */}
      <div className="mb-6">
        <Link
          to="/tasks"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Task List
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        {/* Task Header: Title, Edit/Delete buttons, Status and Priority Badges */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-0">
              {task.title}
            </h1>
            {/* Action buttons: Edit and Delete */}
            <div className="flex space-x-2">
              <Link
                to={`/tasks/${task._id}/edit`}
                className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors text-sm"
              >
                <Edit className="h-4 w-4 mr-1.5" />
                Edit Task
              </Link>
              <button
                onClick={handleDeleteTask}
                className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors text-sm"
              >
                <Trash className="h-4 w-4 mr-1.5" />
                Delete Task
              </button>
            </div>
          </div>

          {/* Status and Priority Badges */}
          <div className="flex flex-wrap gap-2 mt-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
            >
              {formatStatus(task.status)}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
            >
              {task.priority.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Task Description Section */}
        {task.description && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        {/* Task Metadata: Due Date, Created By, Assigned To, Timestamps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Left column for details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Details</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-2.5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-500">Due Date</p>
                  <p className="text-gray-900 font-medium">{formatDate(task.dueDate)}</p>
                </div>
              </li>
              <li className="flex items-start">
                <Flag className="h-5 w-5 text-gray-500 mr-2.5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-500">Created By</p>
                  <p className="text-gray-900 font-medium">{task.createdBy.name}</p>
                </div>
              </li>
              {task.assignedTo && (
                <li className="flex items-start">
                  <Tag className="h-5 w-5 text-gray-500 mr-2.5 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-500">Assigned To</p>
                    <p className="text-gray-900 font-medium">{task.assignedTo.name}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Right column for timeline */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                {/* Simple dot indicator for timeline events */}
                <div className="h-5 w-5 text-gray-500 mr-2.5 flex items-center justify-center flex-shrink-0">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                </div>
                <div>
                  <p className="text-gray-500">Created</p>
                  <p className="text-gray-900 font-medium">{formatDate(task.createdAt)}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 text-gray-500 mr-2.5 flex items-center justify-center flex-shrink-0">
                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="text-gray-900 font-medium">{formatDate(task.updatedAt)}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
