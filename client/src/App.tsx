import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-toastify/dist/ReactToastify.css'; // Styles for toast notifications

import Layout from './components/layout/Layout'; // Provides a consistent layout (header, footer, etc.) across pages.

import PrivateRoute from './components/auth/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';

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
import NotFoundPage from './pages/NotFoundPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

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

              <Route path="/tasks" element={<Navigate to="/dashboard" replace />} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>

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
      </DndProvider>
    </AuthProvider>
  );
};

export default App;
