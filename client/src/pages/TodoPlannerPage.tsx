import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTasks } from '../api/taskApi';
import { Task, TaskStatus } from '../types';

// Helper function to format date as YYYY-MM-DD in local timezone
const formatLocalDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface DayCard {
  date: string;
  displayDate: string;
  fullDate: string;
  isToday: boolean;
  isCurrentWeek: boolean;
  tasks: Task[];
}

const TodoPlannerPage: React.FC = () => {
  const navigate = useNavigate();
  const [dayCards, setDayCards] = useState<DayCard[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [weekOffset, setWeekOffset] = useState<number>(0); // 0 = current week, -1 = last week, 1 = next week
  const [isStatsExpanded, setIsStatsExpanded] = useState<boolean>(false);

  // Generate 7 days starting from today (for current week) or Sunday (for other weeks)
  const generateDays = (offset: number = 0) => {
    const days: DayCard[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Always calculate based on Sunday-to-Sunday weeks for consistency
    const currentSunday = new Date(today);
    const dayOfWeek = currentSunday.getDay(); // 0 = Sunday, 1 = Monday, etc.
    currentSunday.setDate(currentSunday.getDate() - dayOfWeek);

    // Calculate the target week's Sunday based on offset
    const targetSunday = new Date(currentSunday);
    targetSunday.setDate(currentSunday.getDate() + offset * 7);

    // Generate all 7 days of the week (Sunday to Saturday)
    const weekDays: DayCard[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(targetSunday);
      date.setDate(targetSunday.getDate() + i);
      date.setHours(0, 0, 0, 0);

      // Use local date formatting to avoid timezone issues
      const dateString = formatLocalDate(date);
      const isToday = date.getTime() === today.getTime();

      const dayNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      const displayDate = isToday ? 'Today' : dayNames[date.getDay()];

      weekDays.push({
        date: dateString,
        displayDate,
        fullDate: date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        isToday,
        isCurrentWeek: offset === 0,
        tasks: [],
      });
    }

    if (offset === 0) {
      // For current week, reorder to show Today first, then remaining days
      const todayIndex = weekDays.findIndex((day) => day.isToday);
      if (todayIndex !== -1) {
        // Start from today and wrap around
        for (let i = 0; i < 7; i++) {
          const dayIndex = (todayIndex + i) % 7;
          const day = weekDays[dayIndex];

          // Update display names for current week
          if (i === 0) {
            day.displayDate = 'Today';
          }
          // Original day names for all other days

          days.push(day);
        }
      } else {
        // Fallback: if today is not in current week
        days.push(...weekDays);
      }
    } else {
      // For other weeks,Sunday to Saturday normally
      days.push(...weekDays);
    }

    return days;
  };

  useEffect(() => {
    const fetchTasksForPlanner = async () => {
      setIsLoading(true);
      try {
        // Generate days for the current view
        const days = generateDays(weekOffset);

        // Fetch all tasks
        const response = await getTasks({ limit: 1000 });
        if (response.success) {
          const allTasks = response.data?.tasks || [];

          // Distribute tasks to their respective days
          days.forEach((day) => {
            day.tasks = allTasks.filter((task) => {
              if (!task.createdFor) return false;

              // Convert task createdFor date to local date string
              const taskDate = new Date(task.createdFor);
              const taskDateString = formatLocalDate(taskDate);

              return taskDateString === day.date;
            });
          });

          setDayCards(days);
        } else {
          toast.error(response.error?.toString() || 'Failed to fetch tasks.');
        }
      } catch (_err) {
        toast.error('An unexpected error occurred while fetching tasks.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasksForPlanner();
  }, [weekOffset]);

  const handleDayClick = (date: string) => {
    const formattedDate = date.replace(/-/g, ''); // Convert YYYY-MM-DD to YYYYMMDD
    navigate(`/dashboard/${formattedDate}`);
  };

  const handleAddTask = (date: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const formattedDate = date.replace(/-/g, '');
    navigate(`/tasks/create/${formattedDate}`);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setWeekOffset((prevOffset) => prevOffset + (direction === 'next' ? 1 : -1));
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      case TaskStatus.IN_PROGRESS:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
      case TaskStatus.REVIEW:
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-700';
      case TaskStatus.DONE:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-700';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  const getStatusBorder = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.TODO:
        return 'border-l-blue-500 dark:border-l-blue-400';
      case TaskStatus.IN_PROGRESS:
        return 'border-l-yellow-500 dark:border-l-yellow-400';
      case TaskStatus.REVIEW:
        return 'border-l-purple-500 dark:border-l-purple-400';
      case TaskStatus.DONE:
        return 'border-l-green-500 dark:border-l-green-400';
      default:
        return 'border-l-gray-500 dark:border-l-gray-400';
    }
  };

  const getStatusText = (status: TaskStatus) => {
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
        return 'Unknown';
    }
  };

  const getFilteredDayCards = () => {
    if (statusFilter === 'all') {
      return dayCards;
    }

    return dayCards.map((card) => ({
      ...card,
      tasks: card.tasks.filter((task) => task.status === statusFilter),
    }));
  };

  const getWeekStatistics = () => {
    const allTasks = dayCards.flatMap((card) => card.tasks);
    const totalTasks = allTasks.length;
    const doneTasks = allTasks.filter((task) => task.status === TaskStatus.DONE).length;
    const inProgressTasks = allTasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS,
    ).length;
    const reviewTasks = allTasks.filter((task) => task.status === TaskStatus.REVIEW).length;

    return {
      totalTasks,
      doneTasks,
      inProgressTasks,
      reviewTasks,
    };
  };

  const filteredDayCards = getFilteredDayCards();
  const weekStats = getWeekStatistics();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-6"></div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading your task planner...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-2">
      <div className="max-w-7xl mx-auto">
        {/* Weekly Task Statistics Bar */}
        <div className="mb-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Always Visible Progress Bar */}
          <div className="px-3 py-1.5">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {weekOffset === 0
                  ? 'This Week'
                  : weekOffset > 0
                    ? `${weekOffset} Week${weekOffset > 1 ? 's' : ''} Ahead`
                    : `${Math.abs(weekOffset)} Week${Math.abs(weekOffset) > 1 ? 's' : ''} Ago`}
              </h2>
              <button
                onClick={() => setIsStatsExpanded(!isStatsExpanded)}
                className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
              >
                <span className="text-xs">{isStatsExpanded ? '▲' : '▼'}</span>
                <span className="hidden sm:inline">{isStatsExpanded ? 'Less' : 'More'}</span>
              </button>
            </div>

            {/* Thin Progress Bar */}
            <div className="space-y-1">
              {(() => {
                const progressPercentage =
                  weekStats.totalTasks > 0 ? (weekStats.doneTasks / weekStats.totalTasks) * 100 : 0;

                return (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        {weekStats.doneTasks} of {weekStats.totalTasks} completed
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-400 h-1 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </>
                );
              })()}
            </div>

            {/* Date Range (only when collapsed) */}
            {!isStatsExpanded && (
              <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                {(() => {
                  // Get the actual week date range from filtered cards
                  const dates = filteredDayCards.map((card) => card.date).sort();
                  if (dates.length === 0) return 'No data';

                  const startDate = new Date(dates[0]);
                  const endDate = new Date(dates[dates.length - 1]);

                  return `${startDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                  })} - ${endDate.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}`;
                })()}
              </div>
            )}
          </div>

          {/* Expanded Statistics */}
          {isStatsExpanded && (
            <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2 bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Statistics</h3>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {(() => {
                    // Get the actual week date range from filtered cards
                    const dates = filteredDayCards.map((card) => card.date).sort();
                    if (dates.length === 0) return 'No data';

                    const startDate = new Date(dates[0]);
                    const endDate = new Date(dates[dates.length - 1]);

                    return `${startDate.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                    })} - ${endDate.toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}`;
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {/* Total Tasks Scheduled */}
                <div className="text-center p-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700 rounded border border-gray-200 dark:border-gray-600 hover:shadow-sm transition-all duration-200">
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-0.5">
                    {weekStats.totalTasks}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Total</div>
                </div>

                {/* In Progress */}
                <div className="text-center p-2 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 rounded border border-yellow-200 dark:border-yellow-700 hover:shadow-sm transition-all duration-200">
                  <div className="text-lg font-bold text-yellow-700 dark:text-yellow-300 mb-0.5">
                    {weekStats.inProgressTasks}
                  </div>
                  <div className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">
                    In Progress
                  </div>
                </div>

                {/* Review */}
                <div className="text-center p-2 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded border border-purple-200 dark:border-purple-700 hover:shadow-sm transition-all duration-200">
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-300 mb-0.5">
                    {weekStats.reviewTasks}
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-400 font-medium">
                    Review
                  </div>
                </div>

                {/* Done */}
                <div className="text-center p-2 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded border border-green-200 dark:border-green-700 hover:shadow-sm transition-all duration-200">
                  <div className="text-lg font-bold text-green-700 dark:text-green-300 mb-0.5">
                    {weekStats.doneTasks}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-400 font-medium">Done</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-0.5">Task Planner</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Organize your tasks by day and status
          </p>
        </div>

        {/* Status Filter */}
        <div className="mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 px-3 py-1.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400 mr-1">
              Filter:
            </span>
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                statusFilter === 'all'
                  ? 'bg-gray-900 dark:bg-gray-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter(TaskStatus.TODO)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                statusFilter === TaskStatus.TODO
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm'
                  : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50'
              }`}
            >
              Todo
            </button>
            <button
              onClick={() => setStatusFilter(TaskStatus.IN_PROGRESS)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                statusFilter === TaskStatus.IN_PROGRESS
                  ? 'bg-yellow-500 dark:bg-yellow-600 text-white shadow-sm'
                  : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setStatusFilter(TaskStatus.REVIEW)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                statusFilter === TaskStatus.REVIEW
                  ? 'bg-purple-600 dark:bg-purple-500 text-white shadow-sm'
                  : 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50'
              }`}
            >
              Review
            </button>
            <button
              onClick={() => setStatusFilter(TaskStatus.DONE)}
              className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                statusFilter === TaskStatus.DONE
                  ? 'bg-green-600 dark:bg-green-500 text-white shadow-sm'
                  : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50'
              }`}
            >
              Done
            </button>
          </div>
        </div>

        {/* Week Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigateWeek('prev')}
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4 mr-1.5" />
            <span className="text-sm font-medium">Previous</span>
          </button>

          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              {(() => {
                // Calculate the target date for the displayed week
                const today = new Date();
                const targetDate = new Date(today);
                targetDate.setDate(targetDate.getDate() + weekOffset * 7);

                return targetDate.toLocaleDateString('en-GB', {
                  month: 'long',
                  year: 'numeric',
                });
              })()}
            </h2>
            {weekOffset === 0 && (
              <p className="text-xs text-gray-600 dark:text-gray-400">Current Week</p>
            )}
            {weekOffset !== 0 && (
              <div className="space-y-0.5">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {weekOffset > 0
                    ? `${weekOffset} week${weekOffset > 1 ? 's' : ''} ahead`
                    : `${Math.abs(weekOffset)} week${Math.abs(weekOffset) > 1 ? 's' : ''} ago`}
                </p>
                <button
                  onClick={() => setWeekOffset(0)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                >
                  Back to Current Week
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => navigateWeek('next')}
            className="flex items-center px-3 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transition-all duration-200"
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="h-4 w-4 ml-1.5" />
          </button>
        </div>

        {/* Task Cards Grid - 7 days in 4+3 layout */}
        <div className="space-y-4">
          {/* Top row - 4 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredDayCards.slice(0, 4).map((card) => (
              <div
                key={card.date}
                onClick={() => handleDayClick(card.date)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden ${
                  card.isToday
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800'
                    : ''
                }`}
              >
                {/* Day Header */}
                <div
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 ${
                    card.isToday
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`font-bold text-base ${
                          card.isToday ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        @{card.displayDate}
                      </h3>
                      <p
                        className={`text-xs ${card.isToday ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {card.fullDate}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleAddTask(card.date, e)}
                      className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                        card.isToday
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70'
                      }`}
                      title="Add task"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="p-3 min-h-[180px]">
                  {card.tasks.length === 0 ? (
                    <div className="text-center py-6">
                      <Calendar className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        No tasks for this day
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {card.tasks.map((task) => (
                        <div
                          key={task._id}
                          className={`border-l-4 ${getStatusBorder(
                            task.status,
                          )} bg-gray-50 dark:bg-gray-700/50 rounded-r-lg p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-sm group/task`}
                        >
                          <div className="flex items-start justify-between mb-1.5">
                            <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover/task:text-blue-700 dark:group-hover/task:text-blue-400 transition-colors">
                              {task.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                                task.status,
                              )}`}
                            >
                              {getStatusText(task.status)}
                            </span>

                            {task.priority && (
                              <span
                                className={`text-xs font-medium ${
                                  task.priority === 'high'
                                    ? 'text-red-600 dark:text-red-400'
                                    : task.priority === 'medium'
                                      ? 'text-yellow-600 dark:text-yellow-400'
                                      : 'text-green-600 dark:text-green-400'
                                }`}
                              >
                                {task.priority?.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {filteredDayCards.slice(4, 7).map((card) => (
              <div
                key={card.date}
                onClick={() => handleDayClick(card.date)}
                className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group overflow-hidden ${
                  card.isToday
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-800'
                    : ''
                }`}
              >
                {/* Day Header */}
                <div
                  className={`p-3 border-b border-gray-100 dark:border-gray-700 ${
                    card.isToday
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white'
                      : 'bg-gray-50 dark:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3
                        className={`font-bold text-base ${
                          card.isToday ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        @{card.displayDate}
                      </h3>
                      <p
                        className={`text-xs ${card.isToday ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}
                      >
                        {card.fullDate}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleAddTask(card.date, e)}
                      className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                        card.isToday
                          ? 'bg-white/20 text-white hover:bg-white/30'
                          : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70'
                      }`}
                      title="Add task"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="p-3 min-h-[180px]">
                  {card.tasks.length === 0 ? (
                    <div className="text-center py-6">
                      <Calendar className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        No tasks for this day
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {card.tasks.map((task) => (
                        <div
                          key={task._id}
                          className={`border-l-4 ${getStatusBorder(
                            task.status,
                          )} bg-gray-50 dark:bg-gray-700/50 rounded-r-lg p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:shadow-sm group/task`}
                        >
                          <div className="flex items-start justify-between mb-1.5">
                            <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover/task:text-blue-700 dark:group-hover/task:text-blue-400 transition-colors">
                              {task.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(
                                task.status,
                              )}`}
                            >
                              {getStatusText(task.status)}
                            </span>

                            {task.priority && (
                              <span
                                className={`text-xs font-medium ${
                                  task.priority === 'high'
                                    ? 'text-red-600 dark:text-red-400'
                                    : task.priority === 'medium'
                                      ? 'text-yellow-600 dark:text-yellow-400'
                                      : 'text-green-600 dark:text-green-400'
                                }`}
                              >
                                {task.priority?.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoPlannerPage;
