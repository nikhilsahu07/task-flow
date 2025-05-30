import React, { useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import { createTask, createTaskForDate, TaskFormData, taskSchema } from '../../api/taskApi';
import TaskForm from '../../components/tasks/TaskForm';

// CreateTaskPage provides a form for users to create new tasks.
const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Parse the date parameter (YYYYMMDD format) and convert to YYYY-MM-DD
  const parsedDate = React.useMemo(() => {
    if (!date || date.length !== 8) return null;

    const year = parseInt(date.substring(0, 4), 10);
    const month = parseInt(date.substring(4, 6), 10);
    const day = parseInt(date.substring(6, 8), 10);

    try {
      // Validate date components
      if (year < 1900 || year > 3000 || month < 1 || month > 12 || day < 1 || day > 31) {
        return null;
      }

      // Create the date string in YYYY-MM-DD format
      const monthStr = String(month).padStart(2, '0');
      const dayStr = String(day).padStart(2, '0');
      return `${year}-${monthStr}-${dayStr}`;
    } catch {
      return null;
    }
  }, [date]);

  const defaultCreatedFor = parsedDate || '';
  const isDateSpecific = !!parsedDate;

  // Handles the submission of the new task data.
  const handleSubmit = async (data: TaskFormData) => {
    setIsLoading(true);

    // Automatically set createdFor if we have a date from URL
    const rawTaskData = {
      ...data,
      createdFor: isDateSpecific ? parsedDate : data.createdFor,
    };

    // Process the data through the client-side schema to ensure proper formatting
    let taskData: TaskFormData;
    try {
      taskData = taskSchema.parse(rawTaskData);
    } catch (validationError) {
      console.error('Client-side validation failed:', validationError);
      toast.error('Please check your form data and try again.');
      setIsLoading(false);
      return;
    }

    try {
      let response;

      if (isDateSpecific && date) {
        // Use the date-specific API endpoint
        response = await createTaskForDate(date, taskData);
      } else {
        // Use the general API endpoint (though this should be rare now)
        response = await createTask(taskData);
      }

      if (response.success) {
        toast.success('Task created successfully!');
        // If we came from a specific date, redirect back to that date's dashboard
        if (isDateSpecific) {
          navigate(`/dashboard/${date}`);
        } else {
          const taskId =
            'task' in response.data! ? response.data.task._id : response.data!.task._id;
          navigate(`/tasks/${taskId}`);
        }
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
      {/* Back navigation link */}
      <div className="mb-6">
        <Link
          to={isDateSpecific ? `/dashboard/${date}` : '/tasks'}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {isDateSpecific ? 'Cancel & Back to Dashboard' : 'Cancel & Back to Task List'}
        </Link>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {isDateSpecific
            ? `Plan Task for ${(() => {
                const date = new Date(parsedDate!);
                const dayNames = [
                  'Sunday',
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ];
                const dayName = dayNames[date.getDay()];
                const formattedDate = date.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                });
                return `${dayName} - ${formattedDate}`;
              })()}`
            : 'Create New Task'}
        </h1>
        <TaskForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          defaultCreatedFor={defaultCreatedFor}
          hideCreatedFor={isDateSpecific} // Hide the createdFor field when date is from URL
        />
      </div>
    </div>
  );
};

export default CreateTaskPage;
