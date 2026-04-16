import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RegisterForm } from './components/RegisterForm';
import { useRegister } from './hooks/useRegister';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useRegister();
  const navigate = useNavigate();

  const handleRegister = async (data: { name: string; email: string; password: string; confirmPassword: string }) => {
    setIsLoading(true);
    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
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
            REGISTER
          </h2>
          <p className="font-body text-body text-silver-mist mb-8 text-center">
            Create your account
          </p>

          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </div>

        <p className="text-center mt-8 font-mono text-caption text-silver-mist">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:opacity-75 transition-opacity uppercase">
            Sign In
          </Link>
        </p>

        <p className="text-center text-xs text-silver-mist mt-6 font-mono tracking-widest uppercase">
          Purple Merit Technologies
        </p>
      </div>
    </div>
  );
};