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
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Create an account</h1>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
