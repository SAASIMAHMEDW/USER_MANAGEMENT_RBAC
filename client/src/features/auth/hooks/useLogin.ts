import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { authService } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';

interface LoginFormData {
  email: string;
  password: string;
}

interface UseLoginReturn {
  login: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const login = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.login(data.email, data.password);
      await authLogin(data.email, data.password);
      navigate('/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed. Please try again.';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
