import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { getTaskById, updateTask, TaskFormData } from '../../api/taskApi';
import { Task } from '../../types';
import TaskForm from '../../components/tasks/TaskForm';

const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
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

  // Handle form submission
  const handleSubmit = async (data: TaskFormData) => {
    if (!id) return;

    setIsSaving(true);

    try {
      const response = await updateTask(id, data);

      if (response.success) {
        toast.success('Task updated successfully');
        navigate(`/tasks/${id}`);
      } else {
        toast.error(response.error?.toString() || 'Error updating task');
      }
    } catch (_err) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
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
          to={`/tasks/${id}`}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to task
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Task</h1>
        <TaskForm onSubmit={handleSubmit} initialData={task} isLoading={isSaving} />
      </div>
    </div>
  );
};

export default EditTaskPage;
