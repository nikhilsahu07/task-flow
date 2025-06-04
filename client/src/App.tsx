import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/layout/Layout';

import PrivateRoute from './components/auth/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

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
    <ThemeProvider>
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
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={true}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable
              pauseOnHover
              theme="colored"
              toastClassName="font-medium"
              bodyClassName="text-sm"
              limit={4}
              enableMultiContainer={false}
            />
          </Router>
        </DndProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
