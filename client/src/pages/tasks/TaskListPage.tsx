import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PlusCircle, AlertTriangle, Search, ArrowDown, ArrowUp } from 'lucide-react';
import { getTasks, deleteTask } from '../../api/taskApi';
import { Task, TaskFilterOptions, TaskPriority, TaskStatus } from '../../types';
import TaskCard from '../../components/tasks/TaskCard';

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | ''>('');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | ''>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Fetch tasks with filters
  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Build filter options
      const filterOptions: TaskFilterOptions = {
        page,
        limit: 9,
        sortBy,
        sortDir,
      };

      if (search) {
        filterOptions.search = search;
      }

      if (statusFilter) {
        filterOptions.status = statusFilter as TaskStatus;
      }

      if (priorityFilter) {
        filterOptions.priority = priorityFilter as TaskPriority;
      }

      const response = await getTasks(filterOptions);

      if (response.success && response.data) {
        setTasks(response.data.tasks);
        setTotalPages(response.data.pagination.pages);
      } else {
        setError(response.error?.toString() || 'Error fetching tasks');
      }
    } catch (_err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks on mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter, priorityFilter, sortBy, sortDir]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page
    fetchTasks();
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await deleteTask(taskId);

        if (response.success) {
          // Remove the deleted task from the list
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
          toast.success('Task deleted successfully');
        } else {
          toast.error(response.error?.toString() || 'Error deleting task');
        }
      } catch (_err) {
        toast.error('An unexpected error occurred');
      }
    }
  };

  // Toggle sort direction
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setStatusFilter('');
    setPriorityFilter('');
    setSortBy('createdAt');
    setSortDir('desc');
    setPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
        <Link
          to="/tasks/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          New Task
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                placeholder="Search tasks..."
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as TaskStatus | '');
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value={TaskStatus.TODO}>To Do</option>
              <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
              <option value={TaskStatus.REVIEW}>Review</option>
              <option value={TaskStatus.DONE}>Done</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value as TaskPriority | '');
                setPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value={TaskPriority.LOW}>Low</option>
              <option value={TaskPriority.MEDIUM}>Medium</option>
              <option value={TaskPriority.HIGH}>High</option>
            </select>

            <button
              onClick={() => toggleSort('dueDate')}
              className="inline-flex items-center justify-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 rounded-md transition-colors"
            >
              Due Date
              {sortBy === 'dueDate' &&
                (sortDir === 'asc' ? (
                  <ArrowUp className="h-4 w-4 ml-1" />
                ) : (
                  <ArrowDown className="h-4 w-4 ml-1" />
                ))}
            </button>

            <button
              onClick={resetFilters}
              className="px-3 py-2 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-md transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">No tasks found</p>
          <Link
            to="/tasks/create"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Create your first task
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard key={task._id} task={task} onDelete={handleDeleteTask} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-2 border-t border-b border-gray-300 ${
                      page === i + 1
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
