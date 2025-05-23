import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { createTask, TaskFormData } from '../../api/taskApi';
import TaskForm from '../../components/tasks/TaskForm';

// CreateTaskPage provides a form for users to create new tasks.
const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handles the submission of the new task data.
  const handleSubmit = async (data: TaskFormData) => {
    setIsLoading(true);

    try {
      const response = await createTask(data);
      if (response.success && response.data?.task._id) {
        toast.success('Task created successfully!');
        navigate(`/tasks/${response.data.task._id}`);
      } else {
        toast.error(response.error?.toString() || 'Failed to create task.');
      }
    } catch (_err) {
      toast.error('An unexpected error occurred while creating the task.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back navigation link to the main task list */}
      <div className="mb-6">
        <Link
          to="/tasks"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Cancel & Back to Task List
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Create New Task</h1>
        <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default CreateTaskPage;
