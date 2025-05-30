import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
// react-dnd is used for drag and drop functionality, HTML5Backend provides the input mechanism.
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-toastify/dist/ReactToastify.css'; // Styles for toast notifications

// App.tsx: Main application component.
// This file sets up the application's routing, global context providers, and overall layout.

import Layout from './components/layout/Layout'; // Provides a consistent layout (header, footer, etc.) across pages.

// Authentication components and context.
import PrivateRoute from './components/auth/PrivateRoute'; // Protects routes that require authentication.
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { AuthProvider } from './contexts/AuthContext'; // Provides authentication state to the application.

// Application pages.
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DashboardDatePage from './pages/DashboardDatePage';
import TodoPlannerPage from './pages/TodoPlannerPage';
import TaskListPage from './pages/tasks/TaskListPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import CreateTaskPage from './pages/tasks/CreateTaskPage';
import CreateFutureTaskPage from './pages/tasks/CreateFutureTaskPage';
import EditTaskPage from './pages/tasks/EditTaskPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage'; // Fallback page for unmatched routes.

// The main App component.
// Configures the application router and defines all available routes.
const App: React.FC = () => {
  return (
    // AuthProvider makes authentication status available throughout the app.
    <AuthProvider>
      {/* DndProvider enables drag-and-drop functionality using the HTML5 backend. */}
      <DndProvider backend={HTML5Backend}>
        <Router>
          {/* Layout component wraps all page content for a consistent look and feel. */}
          <Layout>
            <Routes>
              {/* Publicly accessible routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected routes - require user to be logged in. */}
              {/* PrivateRoute handles the authentication check. */}
              <Route
                path="/todo-planner"
                element={
                  <PrivateRoute>
                    <TodoPlannerPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard/:date"
                element={
                  <PrivateRoute>
                    <DashboardDatePage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/tasks"
                element={
                  <PrivateRoute>
                    <TaskListPage />
                  </PrivateRoute>
                }
              />

              {/* Note: General task creation without a date is no longer supported */}
              {/* All tasks must be created for a specific date using /tasks/create/:date */}

              <Route
                path="/tasks/create-future"
                element={
                  <PrivateRoute>
                    <CreateFutureTaskPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/tasks/create/:date"
                element={
                  <PrivateRoute>
                    <CreateTaskPage />
                  </PrivateRoute>
                }
              />

              {/* Route for viewing a specific task, :id is a URL parameter for the task ID. */}
              <Route
                path="/tasks/:id"
                element={
                  <PrivateRoute>
                    <TaskDetailPage />
                  </PrivateRoute>
                }
              />

              {/* Route for editing a specific task. */}
              <Route
                path="/tasks/:id/edit"
                element={
                  <PrivateRoute>
                    <EditTaskPage />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />

              {/* Redirect from /tasks (if directly navigated to) to /dashboard for a better UX. */}
              {/* This rule might be superseded by the /tasks route above if it has more specific children. */}
              {/* Consider if this redirect is still necessary or if /tasks should be the primary view. */}
              <Route path="/tasks" element={<Navigate to="/dashboard" replace />} />

              {/* Catch-all route for any undefined paths, displays a 404 page. */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>

          {/* ToastContainer is used to display global notifications (toasts). */}
          <ToastContainer
            position="top-right" // Position of toasts on the screen
            autoClose={3000} // Duration toasts are visible (in milliseconds)
            hideProgressBar={false} // Show or hide the progress bar
            newestOnTop // New toasts appear on top of older ones
            closeOnClick // Close toast when clicked
            rtl={false} // Right-to-left layout (false for LTR)
            pauseOnFocusLoss // Pause toast timer when window loses focus
            draggable // Allow toasts to be dragged
            pauseOnHover // Pause toast timer when hovered
          />
        </Router>
      </DndProvider>
    </AuthProvider>
  );
};

export default App;
