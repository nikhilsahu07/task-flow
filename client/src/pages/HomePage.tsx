import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Users2,
  Zap,
  Calendar,
  Bell,
  Shield,
  Target,
  Kanban,
  LineChart as ChartLine,
  ChevronDown,
} from 'lucide-react';

const HomePage: React.FC = () => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('core-features');
    if (featuresSection) {
      featuresSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section - Exactly one window height */}
      <section className="h-screen flex items-center justify-center px-4 relative">
        <div className="max-w-7xl mx-auto text-center">
          {/* Enhanced Boost Your Productivity Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full mb-8 hover:shadow-2xl transition-all duration-500 ease-out transform hover:scale-105 cursor-pointer group relative overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
            {/* Background filling animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-[1500ms] ease-linear origin-left"></div>

            <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400 group-hover:text-white mr-3 relative z-10 transition-all duration-300 group-hover:animate-pulse group-hover:drop-shadow-lg" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-white relative z-10 transition-all duration-300 group-hover:drop-shadow-sm">
              Boost your productivity
            </span>

            {/* Glowing sparkles effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-[1500ms]">
              <div className="absolute top-2 left-4 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-white rounded-full animate-pulse delay-150"></div>
              <div className="absolute bottom-3 left-10 w-1 h-1 bg-white rounded-full animate-ping delay-300"></div>
              <div className="absolute bottom-2 right-8 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-75"></div>
              <div className="absolute top-1 right-4 w-0.5 h-0.5 bg-white rounded-full animate-ping delay-200"></div>
              <div className="absolute bottom-1 left-6 w-0.5 h-0.5 bg-white rounded-full animate-pulse delay-100"></div>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Transform your workflow with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
              TaskFlow
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            The intelligent task management platform that helps teams collaborate, organize, and
            achieve more together.
          </p>

          {/* Enhanced Button Group */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-500 dark:to-purple-500 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 dark:hover:from-indigo-600 dark:hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/25 flex items-center justify-center font-semibold"
            >
              <span className="relative z-10 flex items-center">
                Schedule your day
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <button
              onClick={scrollToFeatures}
              className="group px-8 py-4 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm flex items-center justify-center font-semibold"
            >
              Learn More
              <ChevronDown className="ml-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="core-features" className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Powerful features to help you manage tasks efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<CheckCircle2 className="h-6 w-6" />}
              title="Smart Task Management"
              description="Organize tasks with intelligent categorization and priority management"
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title="Time Tracking"
              description="Monitor project progress and team productivity with built-in time tracking"
            />
            <FeatureCard
              icon={<Users2 className="h-6 w-6" />}
              title="Team Collaboration"
              description="Work together seamlessly with real-time updates and shared workspaces"
            />
          </div>
        </div>
      </section>

      {/* Advanced Features Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Discover powerful tools designed to enhance your workflow
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <AdvancedFeatureCard
              icon={<Calendar className="h-5 w-5" />}
              title="Calendar Integration"
              description="Sync with your favorite calendar apps"
            />
            <AdvancedFeatureCard
              icon={<Bell className="h-5 w-5" />}
              title="Smart Notifications"
              description="Stay updated with customizable alerts"
            />
            <AdvancedFeatureCard
              icon={<Shield className="h-5 w-5" />}
              title="Advanced Security"
              description="Enterprise-grade security features"
            />
            <AdvancedFeatureCard
              icon={<Target className="h-5 w-5" />}
              title="Goal Tracking"
              description="Set and monitor team objectives"
            />
            <AdvancedFeatureCard
              icon={<Kanban className="h-5 w-5" />}
              title="Kanban Boards"
              description="Visual task management tools"
            />
            <AdvancedFeatureCard
              icon={<ChartLine className="h-5 w-5" />}
              title="Analytics Dashboard"
              description="Detailed insights and reports"
            />
            <AdvancedFeatureCard
              icon={<Zap className="h-5 w-5" />}
              title="Automation"
              description="Automate routine tasks and workflows"
            />
            <AdvancedFeatureCard
              icon={<Users2 className="h-5 w-5" />}
              title="Team Insights"
              description="Track team performance metrics"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="10k+" label="Active Users" />
            <StatCard number="1M+" label="Tasks Completed" />
            <StatCard number="99.9%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of teams already using TaskFlow to achieve their goals
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Get started for free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

const AdvancedFeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700">
    <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-lg mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
  </div>
);

const StatCard: React.FC<{ number: string; label: string }> = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">{number}</div>
    <div className="text-gray-600 dark:text-gray-300">{label}</div>
  </div>
);

export default HomePage;
