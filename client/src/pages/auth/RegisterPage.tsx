import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import { isAuthenticated } from '../../api/authApi';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/todo-planner');
    }
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-gradient-to-br from-gray-50 to-indigo-50 pt-17">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
