import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthForm from '../../components/forms/AuthForm';
import Header from '../../components/layout/Header';

const Register: React.FC = () => {
  const { register, state } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [state.isAuthenticated, navigate]);

  const handleSubmit = async (data: { name?: string; email: string; password: string }) => {
    if (data.name) {
      await register(data.name, data.email, data.password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <ShoppingBag className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Start organizing your shopping lists for free
            </p>
          </div>
          
          <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <AuthForm
              type="register"
              onSubmit={handleSubmit}
              isLoading={state.isLoading}
              error={state.error}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
