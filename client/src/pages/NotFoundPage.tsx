import React from 'react';
import { Link } from 'react-router-dom'; // For navigation back to home or other pages
import { ArrowLeft } from 'lucide-react'; // Icon for the back button

// NotFoundPage is displayed when a user navigates to a route that doesn't exist.
const NotFoundPage: React.FC = () => {
  return (
    // Basic styling to center the content on the page.
    <div className="min-h-[70vh] flex flex-col justify-center items-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page not found</p>
      <p className="text-gray-500 mb-8 max-w-md text-center">
        Oops! The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>
      {/* Link component to navigate the user back to the homepage. */}
      <Link
        to="/" // Target route for the link
        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Go Back to Homepage
      </Link>
    </div>
  );
};

export default NotFoundPage;
