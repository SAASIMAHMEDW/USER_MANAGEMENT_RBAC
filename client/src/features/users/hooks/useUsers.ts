import { useState, useEffect, useCallback, useRef } from 'react';
import { usersService } from '../services/users.service';
import { User, UsersResponse } from '../types';
import { useAuth } from '../../../context/AuthContext';

interface UseUsersParams {
  page?: number;
  limit?: number;
  role?: string;
  status?: string;
  search?: string;
}

interface UseUsersReturn {
  users: User[];
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUsers = (params: UseUsersParams = {}): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(params.page || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useAuth();
  const paramsRef = useRef(params);

  useEffect(() => {
    paramsRef.current = params;
    if (params.page !== undefined) {
      setCurrentPage(params.page);
    }
  }, [params.page]);

  const fetchUsers = useCallback(async () => {
    if (!accessToken) return;

    setIsLoading(true);
    setError(null);

    try {
      const currentParams = paramsRef.current;
      const queryParams: Record<string, unknown> = {
        page: currentParams.page || currentPage,
        limit: 10,
      };

      if (currentParams.role) queryParams.role = currentParams.role;
      if (currentParams.status) queryParams.status = currentParams.status;
      if (currentParams.search) queryParams.search = currentParams.search;

      const response: UsersResponse = await usersService.getUsers(queryParams as Record<string, string>);
      setUsers(response.data.users);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setError(errorObj.response?.data?.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    total,
    totalPages,
    currentPage,
    isLoading,
    error,
    refetch: fetchUsers,
  };
};
