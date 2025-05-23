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
      className={`bg-gray-50 rounded-lg p-4 transition-colors ${isOver ? 'bg-gray-100' : ''}`}
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-sm py-4 text-center">No tasks</p>
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
