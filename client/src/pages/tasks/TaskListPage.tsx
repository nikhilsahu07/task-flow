import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // For navigation (e.g., to create or view task details)
import { toast } from 'react-toastify'; // For displaying notifications
import { PlusCircle, AlertTriangle, Search, ArrowDown, ArrowUp, Trash2, Edit } from 'lucide-react'; // Icons for UI elements
import { getTasks, deleteTask } from '../../api/taskApi'; // API functions for fetching and deleting tasks
import { Task, TaskFilterOptions, TaskPriority, TaskStatus } from '../../types'; // TypeScript types for tasks and filters
import ConfirmDialog from '../../components/common/ConfirmDialog'; // ConfirmDialog component

// TaskListPage displays a list of all tasks with filtering, sorting, and pagination.
const TaskListPage: React.FC = () => {
  const navigate = useNavigate();
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
  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Helper function to get the left border color based on task status
  const getStatusBorderColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'border-l-blue-400 dark:border-l-blue-500';
      case TaskStatus.IN_PROGRESS:
        return 'border-l-yellow-400 dark:border-l-yellow-500';
      case TaskStatus.REVIEW:
        return 'border-l-purple-400 dark:border-l-purple-500';
      case TaskStatus.DONE:
        return 'border-l-green-400 dark:border-l-green-500';
      default:
        return 'border-l-gray-400 dark:border-l-gray-500';
    }
  };

  // Helper function to get status badge colors using pastel colors
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case TaskStatus.IN_PROGRESS:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case TaskStatus.REVIEW:
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
      case TaskStatus.DONE:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Helper function to get priority badge colors using pastel colors
  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case TaskPriority.MEDIUM:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300';
      case TaskPriority.HIGH:
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  // Helper function to format status enum values into human-readable strings
  const formatStatus = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.REVIEW:
        return 'Review';
      case TaskStatus.DONE:
        return 'Done';
      default:
        return status;
    }
  };

  // Helper function to format date strings for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper function to format createdFor date to YYYYMMDD format for dashboard navigation
  const formatDateForDashboard = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  };

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

  // Opens the delete confirmation dialog
  const handleOpenDeleteDialog = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  // Cancels the delete operation
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  // Handles the deletion of a task after confirmation
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;

    try {
      const response = await deleteTask(taskToDelete);
      if (response.success) {
        // Optimistically remove the task from the local state for a faster UI update.
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskToDelete));
        toast.success('Task deleted successfully!');
      } else {
        toast.error(response.error?.toString() || 'Failed to delete task.');
      }
    } catch (_err) {
      toast.error('An unexpected error occurred during task deletion.');
    } finally {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  // Handles clicking on a task bar to navigate to its dashboard
  const handleTaskBarClick = (task: Task) => {
    const dashboardDate = formatDateForDashboard(task.createdFor);
    if (dashboardDate) {
      navigate(`/dashboard/${dashboardDate}`);
    } else {
      toast.error('Cannot navigate to dashboard - task has no scheduled date');
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

  // Get the title of the task to be deleted for the confirmation dialog
  const taskToDeleteTitle = taskToDelete
    ? tasks.find((task) => task._id === taskToDelete)?.title || 'this task'
    : '';

  return (
    <>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">All Tasks</h1>
          <Link
            to="/tasks/create-future" // Link to the page for creating future tasks with date selection
            className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create New Task
          </Link>
        </div>

        {/* Search and filter controls section */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4">
            {/* Search input form */}
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex">
                <input
                  type="text"
                  placeholder="Search tasks by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md transition-colors"
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
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm md:text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Priorities</option>
                <option value={TaskPriority.LOW}>Low</option>
                <option value={TaskPriority.MEDIUM}>Medium</option>
                <option value={TaskPriority.HIGH}>High</option>
              </select>

              {/* Sort by Due Date button */}
              <button
                onClick={() => toggleSort('dueDate')}
                className="inline-flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md transition-colors text-sm md:text-base whitespace-nowrap"
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
                className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-md transition-colors text-sm md:text-base"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>

        {/* Display error message if an error occurred */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-md mb-6 flex items-center border border-red-200 dark:border-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Display loading spinner or no tasks message or task bars */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading tasks, please wait...</p>
          </div>
        ) : tasks.length === 0 ? (
          // Message displayed when no tasks match the current filters or if there are no tasks at all.
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No tasks found matching your criteria.
            </p>
            <Link
              to="/tasks/create-future"
              className="inline-flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
            >
              <PlusCircle className="h-5 w-5 mr-2" />
              Create a New Task
            </Link>
          </div>
        ) : (
          // Display task bars in a vertical list layout.
          <>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  onClick={() => handleTaskBarClick(task)}
                  className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border-l-4 ${getStatusBorderColor(task.status)} border-r border-t border-b border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50`}
                >
                  <div className="p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left section: Task title and description */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 lg:line-clamp-1">
                          {task.description}
                        </p>
                      )}
                    </div>

                    {/* Middle section: Status and priority badges */}
                    <div className="flex flex-wrap gap-2 lg:flex-shrink-0 lg:mx-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                      >
                        {formatStatus(task.status)}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                    </div>

                    {/* Right section: Due date and actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium">Due:</span> {formatDate(task.dueDate)}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          to={`/tasks/${task._id}`}
                          onClick={(e) => e.stopPropagation()} // Prevent task bar click
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          <span className="hidden sm:inline">Edit Task</span>
                          <span className="sm:hidden">Edit</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent task bar click
                            handleOpenDeleteDialog(task._id);
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination controls for more than one page */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow-sm">
                  {/* Previous page button */}
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))} // Ensure page doesn't go below 1
                    disabled={page === 1} // Disable if on the first page
                    className="px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  {/* Page number buttons */}
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-2 border-t border-b border-gray-300 dark:border-gray-600 ${
                        page === i + 1
                          ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-medium' // Highlight current page
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } transition-colors`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  {/* Next page button */}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))} // Ensure page doesn't exceed totalPages
                    disabled={page === totalPages} // Disable if on the last page
                    className="px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Confirm Task Deletion"
        message={`Are you sure you want to permanently delete "${taskToDeleteTitle}"?`}
        confirmText="Delete Task"
        variant="primary"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default TaskListPage;
