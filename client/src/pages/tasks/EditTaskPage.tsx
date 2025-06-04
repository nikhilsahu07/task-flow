import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { getTaskById, updateTask, TaskFormData, taskSchema } from '../../api/taskApi';
import { Task } from '../../types';
import TaskForm from '../../components/tasks/TaskForm';

// EditTaskPage -> to modify an existing task
const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // States for task data, loading status, and any errors
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect hook to fetch the task data when the component mounts or the ID changes
  useEffect(() => {
    const fetchTask = async () => {
      if (!id) {
        setError('Task ID is missing.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getTaskById(id);
        if (response.success && response.data) {
          setTask(response.data.task);
        } else {
          setError(response.error?.toString() || 'Error fetching task details for editing.');
          toast.error(response.error?.toString() || 'Error fetching task details.');
        }
      } catch (_err) {
        setError('An unexpected error occurred while fetching the task for editing.');
        toast.error('An unexpected error occurred while fetching the task.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]); // Re-fetch if the task ID changes

  // Handles the submission of the edited task data.
  const handleSubmit = async (data: TaskFormData) => {
    if (!id) return; // !if task is loaded

    setIsSaving(true); // saving is in progress

    // Process the data through the client-side schema
    let taskData: Partial<TaskFormData>;
    try {
      // Import the schema and process the data
      taskData = taskSchema.parse(data);
    } catch (validationError) {
      console.error('Client-side validation failed:', validationError);
      toast.error('Please check your form data and try again.');
      setIsSaving(false);
      return;
    }

    try {
      const response = await updateTask(id, taskData);
      if (response.success) {
        toast.success('Task updated successfully!');
        navigate(`/tasks/${id}`);
      } else {
        toast.error(response.error?.toString() || 'Failed to update task.');
      }
    } catch (_err) {
      toast.error('An unexpected error occurred while updating the task.');
    } finally {
      setIsSaving(false);
    }
  };

  // Display loading spinner while initial task data is being fetched
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading task for editing...</p>
      </div>
    );
  }

  // error message if fetching failed or task is not found
  if (error || !task) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'Task not found or could not be loaded for editing.'}
          </p>
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Return to Task List
          </Link>
        </div>
      </div>
    );
  }

  // task form with initial data for editing
  return (
    <div className="max-w-3xl mx-auto">
      {/* Back navigation link to the task detail page */}
      <div className="mb-6">
        <Link
          to={`/tasks/${id}`}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Cancel Edit & Back to Task
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Edit Task
        </h1>
        {/* task form */}
        <TaskForm onSubmit={handleSubmit} initialData={task} isLoading={isSaving} />
      </div>
    </div>
  );
};

export default EditTaskPage;
