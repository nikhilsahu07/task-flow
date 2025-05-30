import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Hook for programmatic navigation
import LoginForm from '../../components/auth/LoginForm'; // The actual login form component
import { isAuthenticated } from '../../api/authApi'; // Utility to check authentication status

// LoginPage provides the UI for user login.
// It redirects to the dashboard if the user is already authenticated.
const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // Used to redirect the user after login or if already logged in

  // useEffect hook to check authentication status when the component mounts.
  // If the user is already authenticated, they are redirected to the todo planner.
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/todo-planner'); // Redirect to todo planner if already logged in
    }
  }, [navigate]); // Dependency array includes navigate to ensure it\'s stable

  // Render the login page layout and the LoginForm component.
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Welcome Back</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
