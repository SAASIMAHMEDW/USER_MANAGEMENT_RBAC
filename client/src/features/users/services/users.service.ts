import { useAuth } from '../../../context/AuthContext';
import { useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useUsersService = () => {
  const { accessToken } = useAuth();

  const request = useCallback(async (
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    data?: any
  ) => {
    const response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: 'include',
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message);
    }

    return response.json();
  }, [accessToken]);

  const getUsers = useCallback(async (params: Record<string, any> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request('GET', `/users${queryString ? `?${queryString}` : ''}`);
  }, [request]);

  const getUserById = useCallback(async (id: string) => {
    return request('GET', `/users/${id}`);
  }, [request]);

  const createUser = useCallback(async (data: any) => {
    return request('POST', '/users', data);
  }, [request]);

  const updateUser = useCallback(async (id: string, data: any) => {
    return request('PUT', `/users/${id}`, data);
  }, [request]);

  const deleteUser = useCallback(async (id: string) => {
    return request('DELETE', `/users/${id}`);
  }, [request]);

  const getProfile = useCallback(async () => {
    return request('GET', '/users/me');
  }, [request]);

  const updateProfile = useCallback(async (data: any) => {
    return request('PUT', '/users/me', data);
  }, [request]);

  const getStats = useCallback(async () => {
    return request('GET', '/users/stats');
  }, [request]);

  return {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getProfile,
    updateProfile,
    getStats,
  };
};
