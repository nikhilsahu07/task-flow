import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { ITEM_TYPE } from './TaskColumn';

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

// TaskCard -> displays individual task information and makes it draggable
const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);

  // `useDrag` hook from react-dnd to make the card draggable
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  // Attach the drag source to the card element's ref
  drag(cardRef);

  // Prevent tooltip from showing while the card is being dragged
  if (isDragging && showTooltip) {
    setShowTooltip(false);
  }

  // Formats a date string (ISO format) into a more readable local date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Tailwind CSS classes for styling the priority badge based on task priority
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case TaskPriority.HIGH:
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Tailwind CSS classes for styling the status badge based on task status
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
      case TaskStatus.IN_PROGRESS:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case TaskStatus.REVIEW:
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case TaskStatus.DONE:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Converts a task status enum value
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
    <div className="relative group">
      {/* Tooltip */}
      <div
        className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-200 px-3 py-2 rounded-lg shadow-lg text-sm z-10 whitespace-nowrap pointer-events-none transition-all duration-200 ${
          showTooltip && !isDragging ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {task.title}
        {/* Small triangle pointer */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45"></div>
      </div>

      {/* Task Card */}
      <div
        ref={cardRef}
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-105 transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-105 shadow-2xl rotate-3' : 'opacity-100'
        } cursor-grab active:cursor-grabbing group-hover:shadow-xl`}
        // Show tooltip only if not dragging
        onMouseEnter={() => !isDragging && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Drag Indicator */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 pr-8">
              {task.title}
            </h3>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm line-clamp-3 leading-relaxed">
            {task.description}
          </p>

          {/* Badges - priority and status */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                task.priority,
              )}`}
            >
              {task.priority?.toUpperCase()}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                task.status,
              )}`}
            >
              {formatStatus(task.status)}
            </span>
          </div>

          {/* Task Info - due date and assigned to */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>

            {task.assignedTo && (
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Tag className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                <span>Assigned to: {task.assignedTo.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-b-xl flex justify-between items-center">
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-semibold transition-colors duration-200 hover:bg-red-50 dark:hover:bg-red-900/30 px-3 py-1 rounded-lg"
          >
            Delete
          </button>

          <Link
            to={`/tasks/${task._id}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-semibold transition-all duration-200 hover:bg-blue-50 dark:hover:bg-blue-900/30 px-3 py-1 rounded-lg"
          >
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
