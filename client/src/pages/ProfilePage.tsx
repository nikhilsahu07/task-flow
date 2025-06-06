import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { User, Shield } from 'lucide-react';
import { getProfile } from '../api/authApi';
import { User as UserType } from '../types';

const ProfilePage: React.FC = () => {
  // States for user data, loading status, and any errors
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetches the user's profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getProfile();
        if (response.success && response.data) {
          setUser(response.data.user);
        } else {
          // Use error from response or a default message.
          setError(response.error?.toString() || 'Error fetching profile');
          toast.error(response.error?.toString() || 'Error fetching profile'); // Show error toast
        }
      } catch (_err) {
        // Catch any unexpected errors during the API call.
        setError('An unexpected error occurred while fetching your profile.');
        toast.error('An unexpected error occurred while fetching your profile.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []); // Empty dependency array means this effect runs once on mount.

  // Display a loading spinner while data is being fetched.
  if (isLoading) {
    return (
      <div className="text-center py-12">
        {/* Simple loading spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  // Display an error message if fetching failed/user data is not available
  if (error || !user) {
    return (
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <p className="text-red-600 dark:text-red-400 mb-4">
            {error || 'User profile could not be loaded.'}
          </p>
        </div>
      </div>
    );
  }

  // user's profile information
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Profile</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-8">
          <div className="bg-indigo-100 dark:bg-indigo-900 p-4 rounded-full">
            <User className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user.name}</h2>
            <div className="flex items-center mt-1">
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
              {/* User role - small badge */}
              <span className="inline-flex items-center ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200">
                <Shield className="h-3 w-3 mr-1" />
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Account Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Name</p>
              <p className="text-gray-900 dark:text-white">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
              <p className="text-gray-900 dark:text-white">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Role</p>
              {/* Capitalize the first letter of the role for display */}
              <p className="text-gray-900 dark:text-white capitalize">{user.role}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Account ID</p>
              <p className="text-gray-900 dark:text-white">{user.id}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          {/* future goals hai jii */}
          <button
            onClick={() => toast.info('Editing your profile will be available soon!')}
            className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium rounded-md transition-colors"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
