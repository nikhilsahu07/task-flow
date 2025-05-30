import React from 'react';
import { useDrop } from 'react-dnd';
import { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';

/**
 * Props for the TaskColumn component.
 */
interface TaskColumnProps {
  /** The title of the task column (e.g., "To Do", "In Progress"). */
  title: string;
  /** The status represented by this column (e.g., "todo", "inProgress"). */
  status: TaskStatus;
  /** An array of tasks that belong to this column. */
  tasks: Task[];
  /** Callback function to handle task deletion. */
  onDelete: (taskId: string) => void;
  /** Callback function to handle dropping a task into this column. */
  onTaskDrop: (taskId: string, newStatus: TaskStatus) => void;
}

// Defines the type of item that can be dropped into this column.
// Used by react-dnd to ensure compatibility between draggable items and droppable areas.
export const ITEM_TYPE = 'TASK';

/**
 * Get the appropriate pastel background color and styling for each task status
 */
const getColumnStyling = (status: TaskStatus, isOver: boolean) => {
  const baseStyles =
    'rounded-xl p-6 transition-all duration-300 min-h-[400px] border-2 border-dashed';

  switch (status) {
    case TaskStatus.TODO:
      return `${baseStyles} ${
        isOver
          ? 'bg-blue-100 border-blue-300 shadow-lg scale-105'
          : 'bg-blue-50 border-blue-200 hover:bg-blue-75 hover:border-blue-250'
      }`;
    case TaskStatus.IN_PROGRESS:
      return `${baseStyles} ${
        isOver
          ? 'bg-yellow-100 border-yellow-300 shadow-lg scale-105'
          : 'bg-yellow-50 border-yellow-200 hover:bg-yellow-75 hover:border-yellow-250'
      }`;
    case TaskStatus.REVIEW:
      return `${baseStyles} ${
        isOver
          ? 'bg-purple-100 border-purple-300 shadow-lg scale-105'
          : 'bg-purple-50 border-purple-200 hover:bg-purple-75 hover:border-purple-250'
      }`;
    case TaskStatus.DONE:
      return `${baseStyles} ${
        isOver
          ? 'bg-green-100 border-green-300 shadow-lg scale-105'
          : 'bg-green-50 border-green-200 hover:bg-green-75 hover:border-green-250'
      }`;
    default:
      return `${baseStyles} ${
        isOver
          ? 'bg-gray-100 border-gray-300 shadow-lg scale-105'
          : 'bg-gray-50 border-gray-200 hover:bg-gray-75 hover:border-gray-250'
      }`;
  }
};

/**
 * Get the header styling for each status
 */
const getHeaderStyling = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'text-blue-800 bg-blue-100 border-blue-200';
    case TaskStatus.IN_PROGRESS:
      return 'text-yellow-800 bg-yellow-100 border-yellow-200';
    case TaskStatus.REVIEW:
      return 'text-purple-800 bg-purple-100 border-purple-200';
    case TaskStatus.DONE:
      return 'text-green-800 bg-green-100 border-green-200';
    default:
      return 'text-gray-800 bg-gray-100 border-gray-200';
  }
};

/**
 * Get the task count badge styling for each status
 */
const getCountBadgeStyling = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'bg-blue-200 text-blue-800';
    case TaskStatus.IN_PROGRESS:
      return 'bg-yellow-200 text-yellow-800';
    case TaskStatus.REVIEW:
      return 'bg-purple-200 text-purple-800';
    case TaskStatus.DONE:
      return 'bg-green-200 text-green-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

/**
 * TaskColumn component displays a column of tasks (e.g., "To Do", "In Progress", "Done").
 * It allows tasks to be dragged and dropped into it, changing their status.
 */
const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onDelete, onTaskDrop }) => {
  // const dropRef = useRef<HTMLDivElement>(null);
  // useDrop hook from react-dnd makes this component a drop target for draggable items.
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE, // Only accepts items of type 'TASK'
    // When an item is dropped, call onTaskDrop with the item's ID and this column's status.
    drop: (item: { id: string }) => {
      onTaskDrop(item.id, status);
    },
    // `collect` is used to gather information about the drag state.
    // `isOver` is true if a draggable item is currently hovering over this column.
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as any} // Attach the drop ref to the div, `as any` to bypass strict type checks.
      className={getColumnStyling(status, isOver)}
    >
      {/* Column Header */}
      <div className={`rounded-lg p-4 mb-6 border ${getHeaderStyling(status)}`}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${getCountBadgeStyling(status)}`}
          >
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Drop Zone Indicator */}
      {isOver && (
        <div className="mb-4 p-4 border-2 border-current rounded-lg bg-white/50 text-center">
          <p className="text-sm font-medium opacity-75">Drop task here to move to {title}</p>
        </div>
      )}

      {/* Tasks */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3 opacity-40">📋</div>
          <p className="text-gray-500 text-sm font-medium">No tasks in {title}</p>
          <p className="text-gray-400 text-xs mt-1">Drag tasks here to change status</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskColumn;
