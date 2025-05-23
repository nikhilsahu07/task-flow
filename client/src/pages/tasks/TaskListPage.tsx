import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // For navigation (e.g., to create or view task details)
import { toast } from 'react-toastify'; // For displaying notifications
import { PlusCircle, AlertTriangle, Search, ArrowDown, ArrowUp } from 'lucide-react'; // Icons for UI elements
import { getTasks, deleteTask } from '../../api/taskApi'; // API functions for fetching and deleting tasks
import { Task, TaskFilterOptions, TaskPriority, TaskStatus } from '../../types'; // TypeScript types for tasks and filters
import TaskCard from '../../components/tasks/TaskCard'; // Component to display individual task cards

// TaskListPage displays a list of all tasks with filtering, sorting, and pagination.
const TaskListPage: React.FC = () => {
  // State for storing the list of tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  // State for loading indicator
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // State for storing any errors during API calls
  const [error, setError] = useState<string | null>(null);
  // State for current page number (pagination)
  const [page, setPage] = useState<number>(1);
  // State for total number of pages (pagination)
  const [totalPages, setTotalPages] = useState<number>(1);
  // State for search query input
  const [search, setSearch] = useState<string>('');
  // State for filtering tasks by status
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  // State for filtering tasks by priority
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  // State for the field to sort tasks by (e.g., 'createdAt', 'dueDate')
  const [sortBy, setSortBy] = useState<string>('createdAt');
  // State for sort direction ('asc' or 'desc')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Fetches tasks from the API based on current filters, sorting, and pagination settings.
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Construct the filter options object to pass to the API.
      const filterOptions: TaskFilterOptions = {
        page,
        limit: 9, // Display 9 tasks per page
        sortBy,
        sortDir,
      };

      // Add search, status, and priority to filters if they are set.
      if (search) filterOptions.search = search;
      if (statusFilter) filterOptions.status = statusFilter as TaskStatus;
      if (priorityFilter) filterOptions.priority = priorityFilter as TaskPriority;

      const response = await getTasks(filterOptions);

      if (response.success && response.data) {
        setTasks(response.data.tasks);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError(response.error?.toString() || 'Error fetching tasks');
        toast.error(response.error?.toString() || 'Error fetching tasks');
      }
    } catch (_err) {
      setError('An unexpected error occurred while fetching tasks.');
      toast.error('An unexpected error occurred while fetching tasks.');
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect hook to fetch tasks when the component mounts or when dependencies (page, filters, sort) change.
  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, priorityFilter, sortBy, sortDir]); // Re-fetch if these change

  // Handles the submission of the search form.
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    setPage(1); // Reset to the first page when a new search is performed
    fetchTasks(); // Re-fetch tasks with the new search query
  };

  // Handles the deletion of a task.
  const handleDeleteTask = async (taskId: string) => {
    // Confirm with the user before deleting.
    if (window.confirm('Are you sure you want to permanently delete this task?')) {
      try {
        const response = await deleteTask(taskId);
        if (response.success) {
          // Optimistically remove the task from the local state for a faster UI update.
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
          toast.success('Task deleted successfully!');
        } else {
          toast.error(response.error?.toString() || 'Failed to delete task.');
        }
      } catch (_err) {
        toast.error('An unexpected error occurred during task deletion.');
      }
    }
  };

  // Toggles the sort order (asc/desc) for a given field or sets a new sort field.
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      // If already sorting by this field, reverse the direction.
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      // Otherwise, set the new sort field and default to descending order.
      setSortBy(field);
      setSortDir('desc');
    }
    setPage(1); // Reset to first page when sort order changes
  };

  // Resets all filters and sorting to their default values and fetches tasks.
  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('createdAt'); // Default sort field
    setSortDir('desc'); // Default sort direction
    setPage(1); // Go back to the first page
    // fetchTasks() will be called by the useEffect hook due to state changes.
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
        <Link
          to="/tasks/create" // Link to the page for creating new tasks
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Create New Task
        </Link>
      </div>

      {/* Search and filter controls section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          {/* Search input form */}
          <div className="flex-1">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search tasks by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-l-0 border-gray-300 rounded-r-md transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Filter dropdowns and sort/reset buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:flex md:items-center gap-2 md:gap-4">
            {/* Status filter dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as TaskStatus | '');
                setPage(1); // Reset to first page on filter change
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              <option value="">All Statuses</option>
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.REVIEW}>Review</option>
              <option value={TaskStatus.DONE}>Done</option>
            </select>

            {/* Priority filter dropdown */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value as TaskPriority | '');
                setPage(1); // Reset to first page on filter change
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            >
              <option value="">All Priorities</option>
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>

            {/* Sort by Due Date button */}
            <button
              onClick={() => toggleSort('dueDate')}
              className="inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-md transition-colors text-sm md:text-base whitespace-nowrap"
            >
              Due Date
              {sortBy === 'dueDate' &&
                (sortDir === 'asc' ? (
                  <ArrowUp className="h-4 w-4 ml-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 ml-1" />
                ))}
            </button>

            {/* Reset filters button */}
            <button
              onClick={resetFilters}
              className="px-3 py-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors text-sm md:text-base"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Display error message if an error occurred */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {/* Display loading spinner or no tasks message or task cards */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks, please wait...</p>
        </div>
      ) : tasks.length === 0 ? (
        // Message displayed when no tasks match the current filters or if there are no tasks at all.
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">No tasks found matching your criteria.</p>
          <Link
            to="/tasks/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create a New Task
          </Link>
        </div>
      ) : (
        // Display task cards in a grid layout.
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={handleDeleteTask} />
            ))}
          </div>

          {/* Pagination controls, shown only if there is more than one page. */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow-sm">
                {/* Previous page button */}
                <button
                  onClick={() => setPage(Math.max(1, page - 1))} // Ensure page doesn't go below 1
                  disabled={page === 1} // Disable if on the first page
                  className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                {/* Page number buttons */}
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-2 border-t border-b border-gray-300 ${
                      page === i + 1
                        ? 'bg-blue-50 text-blue-600 font-medium' // Highlight current page
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    {i + 1}
                  </button>
                ))}
                {/* Next page button */}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))} // Ensure page doesn't exceed totalPages
                  disabled={page === totalPages} // Disable if on the last page
                  className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskListPage;
