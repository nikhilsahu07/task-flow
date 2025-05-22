/**
 * LoginForm Component
 *
 * This component renders a login form with email and password inputs.
 * It handles form validation, form submission, and authentication logic.
 *
 * Features:
 * - Form validation using React Hook Form and Zod
 * - Error handling and display
 * - Loading state management
 * - Redirect to dashboard on successful login
 */

import React from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation after login
import { useForm } from 'react-hook-form'; // Form handling library
import { zodResolver } from '@hookform/resolvers/zod'; // Zod integration for form validation
import { login, loginSchema, LoginFormData } from '../../api/authApi'; // Authentication API and schema
import { LogIn } from 'lucide-react'; // Icon for visual enhancement
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  // React Router's navigation hook
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  // State management for loading indicator and error messages
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  /**
   * Form setup with React Hook Form
   *
   * - register: Registers input fields with validation
   * - handleSubmit: Handles form submission with validation
   * - errors: Contains validation errors for display
   * - resolver: Connects Zod schema to React Hook Form
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Form submission handler
   *
   * This function is called when the form is submitted and validation passes.
   * It sends login credentials to the server and handles the response.
   *
   * @param data - The validated form data (email and password)
   */
  const onSubmit = async (data: LoginFormData) => {
    // Start loading state and clear any previous errors
    setIsLoading(true);
    setError(null);

    try {
      // Call the login API function with form data
      const response = await login(data);

      if (response.success && response.data) {
        // Update auth context with user data
        authLogin(response.data.user);

        // Redirect to dashboard on successful login
        navigate('/dashboard');
      } else {
        // Display error message from the server
        setError(response.error?.toString() || 'Login failed. Please try again.');
      }
    } catch (_err) {
      // Handle unexpected errors (like network issues)
      setError('An unexpected error occurred. Please try again.');
    } finally {
      // Reset loading state whether login succeeds or fails
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      {/* Login icon header */}
      <div className="flex justify-center mb-6">
        <LogIn className="h-12 w-12 text-blue-500" />
      </div>

      {/* Form title */}
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Log in to your account</h2>

      {/* Error message display */}
      {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4">{error}</div>}

      {/* Login form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email input field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@example.com"
          />
          {/* Display validation errors for email */}
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>

        {/* Password input field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
          />
          {/* Display validation errors for password */}
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Submit button with loading state */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      {/* Registration link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <a href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
