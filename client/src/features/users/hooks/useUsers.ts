import { useState, useEffect, useCallback } from 'react';
import { useUsersService } from '../services/users.service';
import { User, UsersResponse } from '../types';

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
  const { getUsers } = useUsersService();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(params.page || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params.page !== undefined) {
      setCurrentPage(params.page);
    }
  }, [params.page]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams: Record<string, unknown> = {
        page: params.page || currentPage,
        limit: 10,
      };

      if (params.role) queryParams.role = params.role;
      if (params.status) queryParams.status = params.status;
      if (params.search) queryParams.search = params.search;

      const response: UsersResponse = await getUsers(queryParams as Record<string, string>);
      setUsers(response.data.users);
      setTotal(response.data.total);
      setTotalPages(response.data.totalPages);
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      setError(errorObj.message || 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  }, [getUsers, currentPage, params.role, params.status, params.search, params.page]);

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
