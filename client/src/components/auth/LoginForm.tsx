// LoginForm Component

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { login, loginSchema, LoginFormData } from '../../api/authApi';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  // State management for loading indicator, error messages, and password visibility
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

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

  const onSubmit = async (data: LoginFormData) => {
    // Start loading state and clear any previous errors
    setIsLoading(true);
    setError(null);

    try {
      const response = await login(data);

      if (response.success && response.data) {
        authLogin(response.data.user);

        navigate('/todo-planner');
      } else {
        setError(response.error?.toString() || 'Login failed. Please try again.');
      }
    } catch (_err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 w-full max-w-md">
      {/* Login icon header */}
      <div className="flex justify-center mb-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 p-3 rounded-xl shadow-lg">
          <LogIn className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Form title */}
      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Welcome Back
      </h2>

      {/* Error message display */}
      {error && (
        <div className="bg-red-50/80 dark:bg-red-900/40 backdrop-blur-sm border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Login form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email input field */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              id="email"
              type="email"
              {...register('email')}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-base text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="chiku@ex.com"
            />
          </div>
          {/* Display validation errors for email */}
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password input field */}
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full pl-11 pr-12 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-base text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {/* Display validation errors for password */}
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit button with loading state */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl mt-6"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      {/* Registration link */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Don&apos;t have an account?{' '}
          <a
            href="/register"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors hover:underline"
          >
            Create account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
