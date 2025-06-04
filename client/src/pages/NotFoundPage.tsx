import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// NotFoundPage - displayed when a user navigates to a route that doesn't exist
const NotFoundPage: React.FC = () => {
  return (
    // Basic styling to center the content on the page.
    <div className="min-h-[70vh] flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">Page not found</p>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md text-center">
        Oops! The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>
      {/* Link component to navigate the user back to the homepage. */}
      <Link
        to="/" // Target route for the link
        className="inline-flex items-center px-4 py-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-medium rounded-md transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
