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
} from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-full mb-8">
            <Sparkles className="h-4 w-4 text-indigo-600 mr-2" />
            <span className="text-sm font-medium text-indigo-600">Boost your productivity</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transform your workflow with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              TaskFlow
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            The intelligent task management platform that helps teams collaborate, organize, and
            achieve more together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              Start for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/demo"
              className="px-8 py-4 bg-white text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Watch demo
            </Link>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to stay organized
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you manage tasks efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-600">
              Discover powerful tools designed to enhance your workflow
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
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
      <section className="py-20 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <StatCard number="10k+" label="Active Users" />
            <StatCard number="1M+" label="Tasks Completed" />
            <StatCard number="99.9%" label="Uptime" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to transform your workflow?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of teams already using TaskFlow to achieve their goals
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
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
  <div className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const AdvancedFeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-105 border border-gray-100">
    <div className="flex items-center mb-4">
      <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mr-3">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const StatCard: React.FC<{ number: string; label: string }> = ({ number, label }) => (
  <div className="p-8">
    <div className="text-4xl font-bold text-indigo-600 mb-2">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default HomePage;
