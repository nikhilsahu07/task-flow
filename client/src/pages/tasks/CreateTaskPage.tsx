import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { createTask, TaskFormData } from '../../api/taskApi';
import TaskForm from '../../components/tasks/TaskForm';

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle form submission
  const handleSubmit = async (data: TaskFormData) => {
    setIsLoading(true);

    try {
      const response = await createTask(data);

      if (response.success) {
        toast.success('Task created successfully');
        navigate(`/tasks/${response.data?.task._id}`);
      } else {
        toast.error(response.error?.toString() || 'Error creating task');
      }
    } catch (_err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>
        <TaskForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default CreateTaskPage;
