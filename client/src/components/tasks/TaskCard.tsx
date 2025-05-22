import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { ITEM_TYPE } from './TaskColumn';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Set up drag source
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Connect the drag ref to the card ref
  drag(cardRef);

  // Format date to display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } cursor-move`}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{task.title}</h3>
          <div className="flex space-x-2">
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                task.priority,
              )}`}
            >
              {task.priority}
            </span>
            <span
              className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                task.status,
              )}`}
            >
              {formatStatus(task.status)}
            </span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{task.description}</p>

        <div className="flex flex-col space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="h-4 w-4 mr-1" />
            <span>Due: {formatDate(task.dueDate)}</span>
          </div>

          {task.assignedTo && (
            <div className="flex items-center text-sm text-gray-500">
              <Tag className="h-4 w-4 mr-1" />
              <span>Assigned to: {task.assignedTo.name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 p-4 bg-gray-50 rounded-b-lg flex justify-between">
        <button
          onClick={() => onDelete(task._id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
        >
          Delete
        </button>

        <Link
          to={`/tasks/${task._id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View Details
          <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default TaskCard;
