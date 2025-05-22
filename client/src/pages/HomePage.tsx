import React from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, ArrowRight, Check } from 'lucide-react';
import { isAuthenticated } from '../api/authApi';

const HomePage: React.FC = () => {
  const isLoggedIn = isAuthenticated();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero section */}
      <section className="py-12 md:py-20">
        <div className="text-center">
          <div className="flex justify-center">
            <CheckSquare className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold text-gray-900">
            Manage your tasks with ease
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            A simple, powerful task management system built with TypeScript, React, and Node.js.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="h-5 w-5 ml-2 inline-block" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors"
                >
                  Get Started
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

      {/* Features section */}
      <section className="py-12 bg-white rounded-lg shadow-md">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Task Organization</h3>
              <p className="text-gray-600">
                Create, update, and organize your tasks with ease using our intuitive interface.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Priority Management</h3>
              <p className="text-gray-600">
                Set priorities and deadlines to ensure you focus on what matters most.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-4">
                <Check className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Assign tasks to team members and track progress together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology stack section */}
      <section className="py-12 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Built with Modern Technologies
          </h2>
          <p className="text-center text-gray-600 mb-8">
            This project showcases TypeScript with a full stack of powerful technologies
          </p>
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
              <h3 className="font-semibold text-gray-900">Express</h3>
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
              <h3 className="font-semibold text-gray-900">TailwindCSS</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
