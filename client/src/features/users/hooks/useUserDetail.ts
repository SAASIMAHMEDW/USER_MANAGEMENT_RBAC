import { useState, useEffect, useCallback } from 'react';
import { usersService } from '../services/users.service';
import { User } from '../types';
import { useAuth } from '../../../context/AuthContext';

interface UseUserDetailReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserDetail = (userId: string): UseUserDetailReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();

  const fetchUser = useCallback(async () => {
    if (!accessToken || !userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await usersService.getUserById(userId);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch user');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    isLoading,
    error,
    refetch: fetchUser,
  };
};
