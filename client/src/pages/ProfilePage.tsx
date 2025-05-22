import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { User, Shield } from 'lucide-react';
import { getProfile } from '../api/authApi';
import { User as UserType } from '../types';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await getProfile();

        if (response.success && response.data) {
          setUser(response.data.user);
        } else {
          setError(response.error?.toString() || 'Error fetching profile');
        }
      } catch (_err) {
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">{error || 'User not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full">
            <User className="h-12 w-12 text-blue-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
            <div className="flex items-center mt-1">
              <p className="text-gray-500">{user.email}</p>
              <span className="inline-flex items-center ml-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <Shield className="h-3 w-3 mr-1" />
                {user.role}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="text-gray-900">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Role</p>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Account ID</p>
              <p className="text-gray-900">{user.id}</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={() => toast.info('This feature is coming soon!')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
