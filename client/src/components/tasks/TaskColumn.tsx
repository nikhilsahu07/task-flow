import React from 'react';
import { useDrop } from 'react-dnd';
import { Task, TaskStatus } from '../../types';
import TaskCard from './TaskCard';

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDelete: (taskId: string) => void;
  onTaskDrop: (taskId: string, newStatus: TaskStatus) => void;
}

// Item type for drag and drop
export const ITEM_TYPE = 'TASK';

const TaskColumn: React.FC<TaskColumnProps> = ({ title, status, tasks, onDelete, onTaskDrop }) => {
  // Set up drop target
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { id: string }) => {
      onTaskDrop(item.id, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div
      ref={drop}
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
