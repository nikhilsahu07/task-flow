import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, Check } from 'lucide-react';
import { isAuthenticated } from '../api/authApi';

// HomePage serves as the landing page for the application.
// It provides an overview of the application and calls to action (CTA) for users.
const HomePage: React.FC = () => {
  // Check if a user is currently authenticated to tailor CTAs.
  const isLoggedIn = isAuthenticated();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero section: Main welcome message and primary CTA. */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <div className="flex justify-center">
            <CheckSquare className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
            Manage your tasks with ease
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            A simple, yet powerful task management application built with modern web technologies.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {/* Display different CTAs based on authentication state. */}
            {isLoggedIn ? (
              // If logged in, direct user to their dashboard.
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5 ml-2 inline-block" />
              </Link>
            ) : (
              // If not logged in, provide options to register or log in.
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-md shadow-sm transition-colors"
                >
                  Log In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features section: Highlights key functionalities of the application. */}
      <section className="py-12 bg-white rounded-lg shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Intuitive Task Organization
              </h3>
              <p className="text-gray-600">
                Easily create, update, and manage your tasks with a clean and user-friendly
                interface.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Priority & Deadline Tracking
              </h3>
              <p className="text-gray-600">
                Set priorities and due dates to stay organized and focused on what matters most.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seamless Collaboration</h3>
              <p className="text-gray-600">
                Assign tasks, share progress, and work together efficiently with your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology stack section: Lists the main technologies used in the project. */}
      <section className="py-12 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Built with Modern Technologies
          </h2>
          <p className="text-center text-gray-600 mb-8">
            This project leverages a full stack of powerful and popular technologies for a robust
            and scalable solution.
          </p>
          {/* Display logos or names of technologies. */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900">TypeScript</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900">React</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900">Node.js</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900">Express.js</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900">MongoDB</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900">Zod</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900">JWT</h3>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900">Tailwind CSS</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
