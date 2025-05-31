import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// DashboardPage now simply redirects to today's date-specific dashboard
const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get today's date in YYYYMMDD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayFormatted = `${year}${month}${day}`;

    // Redirect to today's dashboard
    navigate(`/dashboard/${todayFormatted}`, { replace: true });
  }, [navigate]);

  // Show a brief loading state during redirect
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Redirecting to today&apos;s dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardPage;
