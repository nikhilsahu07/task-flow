import React from 'react';
import { useDrop } from 'react-dnd';
import { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';

// Props for the TaskColumn component

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onTaskDrop: (taskId: string, newStatus: TaskStatus) => void;
}

// Used by react-dnd
export const ITEM_TYPE = 'TASK';

// Get the appropriate pastel styling for each task status
const getColumnStyling = (status: TaskStatus, isOver: boolean) => {
  const baseStyles =
    'rounded-xl p-6 transition-all duration-300 min-h-[400px] border-2 border-dashed';

  switch (status) {
    case TaskStatus.TODO:
      return `${baseStyles} ${
        isOver
          ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 shadow-lg scale-105'
          : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 hover:bg-blue-75 dark:hover:bg-blue-900/25 hover:border-blue-250 dark:hover:border-blue-600'
      }`;
    case TaskStatus.IN_PROGRESS:
      return `${baseStyles} ${
        isOver
          ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-600 shadow-lg scale-105'
          : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700 hover:bg-yellow-75 dark:hover:bg-yellow-900/25 hover:border-yellow-250 dark:hover:border-yellow-600'
      }`;
    case TaskStatus.REVIEW:
      return `${baseStyles} ${
        isOver
          ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-600 shadow-lg scale-105'
          : 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700 hover:bg-purple-75 dark:hover:bg-purple-900/25 hover:border-purple-250 dark:hover:border-purple-600'
      }`;
    case TaskStatus.DONE:
      return `${baseStyles} ${
        isOver
          ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-600 shadow-lg scale-105'
          : 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-75 dark:hover:bg-green-900/25 hover:border-green-250 dark:hover:border-green-600'
      }`;
    default:
      return `${baseStyles} ${
        isOver
          ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 shadow-lg scale-105'
          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-75 dark:hover:bg-gray-700 hover:border-gray-250 dark:hover:border-gray-600'
      }`;
  }
};

// Get the header styling for each status
const getHeaderStyling = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'text-blue-800 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700';
    case TaskStatus.IN_PROGRESS:
      return 'text-yellow-800 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/50 border-yellow-200 dark:border-yellow-700';
    case TaskStatus.REVIEW:
      return 'text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50 border-purple-200 dark:border-purple-700';
    case TaskStatus.DONE:
      return 'text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/50 border-green-200 dark:border-green-700';
    default:
      return 'text-gray-800 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600';
  }
};

// Get the task count badge styling for each status
const getCountBadgeStyling = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200';
    case TaskStatus.IN_PROGRESS:
      return 'bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200';
    case TaskStatus.REVIEW:
      return 'bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200';
    case TaskStatus.DONE:
      return 'bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200';
    default:
      return 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200';
  }
};

// TaskColumn component displays a column of tasks (e.g., "To Do", "In Progress", "Done")
const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onDelete, onTaskDrop }) => {
  // const dropRef = useRef<HTMLDivElement>(null);
  // useDrop hook from react-dnd makes this component a drop target for draggable items
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => {
      onTaskDrop(item.id, status);
    },
    // `collect` is about the drag state
    // `isOver` is true if a draggable item is currently hovering over this column
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop as any} // bypass strict type checks.
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
        <div className="mb-4 p-4 border-2 border-current rounded-lg bg-white/50 dark:bg-gray-800/50 text-center">
          <p className="text-sm font-medium opacity-75">Drop task here to move to {title}</p>
        </div>
      )}

      {/* Tasks */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3 opacity-40">📋</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            No tasks in {title}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Drag tasks here to change status
          </p>
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
