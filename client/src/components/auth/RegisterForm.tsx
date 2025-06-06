import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerUser, registerSchema, RegisterFormData } from '../../api/authApi';
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Set up form validation with React Hook Form and Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await registerUser(data);

      if (response.success && response.data) {
        // Update auth context with user data
        login(response.data.user);

        // Redirect to todo planner on successful registration
        navigate('/todo-planner');
      } else {
        // Display error message
        setError(response.error?.toString() || 'Registration failed. Please try again.');
      }
    } catch (_err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 w-full max-w-md">
      <div className="flex justify-center mb-4">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500 p-3 rounded-xl shadow-lg">
          <UserPlus className="h-6 w-6 text-white" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
        Create Account
      </h2>

      {error && (
        <div className="bg-red-50/80 dark:bg-red-900/40 backdrop-blur-sm border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 p-3 rounded-lg mb-4 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              id="name"
              type="text"
              {...register('name')}
              className="w-full pl-11 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-base text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Enter your full name"
            />
          </div>
          {errors.name && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

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
          {errors.email && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

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
          {errors.password && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className="w-full pl-11 pr-12 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-700/50 backdrop-blur-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-base text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl mt-6"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a
            href="/login"
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors hover:underline"
          >
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
