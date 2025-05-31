import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ArrowRight } from 'lucide-react';

const CreateFutureTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      const formattedDate = selectedDate.replace(/-/g, ''); // Convert YYYY-MM-DD to YYYYMMDD
      navigate(`/tasks/create/${formattedDate}`);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back navigation link */}
      <div className="mb-6">
        <Link
          to="/todo-planner"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Todo Planner
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="bg-blue-100 dark:bg-blue-900/30 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Plan a Future Task
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Choose the date for which you want to create a task
          </p>
        </div>

        <form onSubmit={handleDateSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="taskDate"
              className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-3"
            >
              Select Date
            </label>
            <input
              id="taskDate"
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]} // Don't allow past dates
              className="w-full px-4 py-3 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-3 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Select the date you want to plan this task for
            </p>
          </div>

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={!selectedDate}
              className="inline-flex items-center px-8 py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
            >
              Continue to Create Task
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>

          {selectedDate && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
              <p className="text-blue-800 dark:text-blue-300 font-medium text-center">
                📅 Creating task for:{' '}
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateFutureTaskPage;
