import { useState, useEffect, useCallback } from 'react';
import { useUsersService } from '../services/users.service';
import { User } from '../types';

interface UseUserDetailReturn {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUserDetail = (userId: string): UseUserDetailReturn => {
  const { getUserById } = useUsersService();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getUserById(userId);
      setUser(response.data.user);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user');
    } finally {
      setIsLoading(false);
    }
  }, [userId, getUserById]);

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
