import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * App.tsx - Main application component
 *
 * This file serves as the entry point for the React application's UI structure.
 * It sets up routing and the overall layout of the application.
 */

// Layout component provides consistent structure across all pages
import Layout from './components/layout/Layout';

// Authentication related components
import PrivateRoute from './components/auth/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';

// Application pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import TaskListPage from './pages/tasks/TaskListPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import CreateTaskPage from './pages/tasks/CreateTaskPage';
import EditTaskPage from './pages/tasks/EditTaskPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Main App Component
 *
 * Sets up the router and routes for the entire application
 * Uses React Router v6 for navigation between different pages
 */
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        {/* Layout component wraps all pages for consistent header/footer */}
        <Layout>
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes - require user authentication */}
            {/* The PrivateRoute component checks if user is logged in before rendering */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
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

            <Route
              path="/tasks/create"
              element={
                <PrivateRoute>
                  <CreateTaskPage />
                </PrivateRoute>
              }
            />

            {/* Dynamic routes with URL parameters */}
            {/* :id is a parameter that will be replaced with actual task ID */}
            <Route
              path="/tasks/:id"
              element={
                <PrivateRoute>
                  <TaskDetailPage />
                </PrivateRoute>
              }
            />

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

            {/* Redirect /tasks to dashboard if already at root */}
            <Route path="/tasks" element={<Navigate to="/dashboard" replace />} />

            {/* 404 route - catches all undefined routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>

        {/* Toast notifications configuration */}
        {/* Provides non-intrusive notifications for user feedback */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </AuthProvider>
  );
};

export default App;
