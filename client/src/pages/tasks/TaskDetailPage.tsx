import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Edit, Trash, ArrowLeft, Clock, Flag, Tag } from 'lucide-react';
import { getTaskById, deleteTask } from '../../api/taskApi';
import { Task, TaskPriority, TaskStatus } from '../../types';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch task on component mount
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await getTaskById(id);

        if (response.success && response.data) {
          setTask(response.data.task);
        } else {
          setError(response.error?.toString() || 'Error fetching task');
        }
      } catch (_err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Handle task deletion
  const handleDeleteTask = async () => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await deleteTask(id);

        if (response.success) {
          toast.success('Task deleted successfully');
          navigate('/tasks');
        } else {
          toast.error(response.error?.toString() || 'Error deleting task');
        }
      } catch (_err) {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // Format date to display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get priority color
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

  // Get status color
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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading task...</p>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'Task not found'}</p>
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/tasks"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to tasks
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* Task header */}
        <div className="mb-6">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            <div className="flex space-x-3">
              <Link
                to={`/tasks/${task._id}/edit`}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
              <button
                onClick={handleDeleteTask}
                className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
            >
              {formatStatus(task.status)}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
            >
              {task.priority}
            </span>
          </div>
        </div>

        {/* Task details */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
        </div>

        {/* Task metadata */}
        <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Details</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="text-gray-900">{formatDate(task.dueDate)}</p>
                </div>
              </li>
              <li className="flex items-start">
                <Flag className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Created By</p>
                  <p className="text-gray-900">{task.createdBy.name}</p>
                </div>
              </li>
              {task.assignedTo && (
                <li className="flex items-start">
                  <Tag className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="text-gray-900">{task.assignedTo.name}</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Timeline</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="h-5 w-5 text-gray-500 mr-2 flex items-center justify-center">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="text-gray-900">{formatDate(task.createdAt)}</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="h-5 w-5 text-gray-500 mr-2 flex items-center justify-center">
                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{formatDate(task.updatedAt)}</p>
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
