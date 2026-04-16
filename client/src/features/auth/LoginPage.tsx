import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LoginForm } from './components/LoginForm';
import { useLogin } from './hooks/useLogin';
import toast from 'react-hot-toast';

const TEST_USERS = {
  admin: { email: 'admin@purplemerit.com', password: 'Admin@123' },
  manager: { email: 'manager@purplemerit.com', password: 'Manager@123' },
  user: { email: 'user1@example.com', password: 'User@123' },
};

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [filledCredentials, setFilledCredentials] = useState<{ email: string; password: string } | null>(null);
  const { login } = useLogin();
  const navigate = useNavigate();

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (role: keyof typeof TEST_USERS) => {
    setFilledCredentials(TEST_USERS[role]);
    toast('Credentials filled - click Sign In to login');
  };

  return (
    <div className="min-h-screen bg-velvet-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <h1 className="font-display text-section text-showroom-white mb-3">
            PURPLE MERIT
          </h1>
          <p className="font-body text-body text-silver-mist">
            User Management System
          </p>
        </div>

        <div className="border border-silver-mist rounded-sm p-8 bg-black">
          <h2 className="font-display text-display text-showroom-white mb-2 text-center">
            SIGN IN
          </h2>
          <p className="font-body text-body text-silver-mist mb-8 text-center">
            Access your account
          </p>

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} filledCredentials={filledCredentials} />

          <div className="mt-6 pt-6 border-t border-silver-mist/30">
            <p className="font-mono text-micro text-silver-mist text-center mb-4 uppercase tracking-widest">
              Quick Fill (Testing)
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="font-mono text-button-sm uppercase tracking-widest border border-white text-white px-4 py-2 rounded-pill hover:bg-white hover:text-black transition-all"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('manager')}
                className="font-mono text-button-sm uppercase tracking-widest border border-white text-white px-4 py-2 rounded-pill hover:bg-white hover:text-black transition-all"
              >
                Manager
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('user')}
                className="font-mono text-button-sm uppercase tracking-widest border border-white text-white px-4 py-2 rounded-pill hover:bg-white hover:text-black transition-all"
              >
                User
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 font-mono text-caption text-silver-mist">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:opacity-75 transition-opacity uppercase">
            Register
          </Link>
        </p>

        <p className="text-center text-xs text-silver-mist mt-6 font-mono tracking-widest uppercase">
          Purple Merit Technologies
        </p>
      </div>
    </div>
  );
};
