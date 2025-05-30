import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ArrowRight, Tag } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { ITEM_TYPE } from './TaskColumn';

interface TaskCardProps {
  task: Task; // The task data to display
  onDelete: (taskId: string) => void; // Callback fired when the delete button is clicked
}

// TaskCard displays individual task information and makes it draggable.
const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete }) => {
  const cardRef = useRef<HTMLDivElement>(null); // Ref for the draggable card element
  const [showTooltip, setShowTooltip] = useState(false); // Controls visibility of the title tooltip on hover

  // `useDrag` hook from react-dnd to make the card draggable.
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE, // Defines the type of the draggable item, matching TaskColumn's accept type
    item: { id: task._id }, // Data associated with the drag operation (typically the item's ID)
    collect: (monitor) => ({
      // `collect` function gathers dragging state information
      isDragging: !!monitor.isDragging(), // True if the card is currently being dragged
    }),
  });

  // Attach the drag source to the card element's ref.
  drag(cardRef);

  // Prevent tooltip from showing while the card is being dragged.
  if (isDragging && showTooltip) {
    setShowTooltip(false);
  }

  // Formats a date string (ISO format) into a more readable local date string.
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Returns Tailwind CSS classes for styling the priority badge based on task priority.
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

  // Returns Tailwind CSS classes for styling the status badge based on task status.
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

  // Converts a task status enum value (e.g., TaskStatus.IN_PROGRESS) to a display-friendly string (e.g., "In Progress").
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
        className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg text-sm z-10 whitespace-nowrap pointer-events-none transition-all duration-200 ${
          showTooltip && !isDragging ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}
      >
        {task.title}
        {/* Small triangle pointer for the tooltip */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
      </div>

      {/* Task Card */}
      <div
        ref={cardRef} // Assign the ref for react-dnd to make this div draggable
        className={`bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-200 ${
          isDragging ? 'opacity-50 scale-105 shadow-2xl rotate-3' : 'opacity-100'
        } cursor-grab active:cursor-grabbing group-hover:shadow-xl`}
        // Show tooltip only if not dragging.
        onMouseEnter={() => !isDragging && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Drag Indicator */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex flex-col space-y-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 pr-8">{task.title}</h3>
          </div>

          <p className="text-gray-600 mb-6 text-sm line-clamp-3 leading-relaxed">
            {task.description}
          </p>

          {/* Badges */}
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

          {/* Task Info */}
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2 text-gray-400" />
              <span>Due: {formatDate(task.dueDate)}</span>
            </div>

            {task.assignedTo && (
              <div className="flex items-center text-sm text-gray-500">
                <Tag className="h-4 w-4 mr-2 text-gray-400" />
                <span>Assigned to: {task.assignedTo.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-xl flex justify-between items-center">
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-700 text-sm font-semibold transition-colors duration-200 hover:bg-red-50 px-3 py-1 rounded-lg"
          >
            Delete
          </button>

          <Link
            to={`/tasks/${task._id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-semibold transition-all duration-200 hover:bg-blue-50 px-3 py-1 rounded-lg"
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
