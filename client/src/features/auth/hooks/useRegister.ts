import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { authService, RegisterData } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface UseRegisterReturn {
  register: (data: RegisterData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useRegister = (): UseRegisterReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.register(data);
      await authLogin(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
};