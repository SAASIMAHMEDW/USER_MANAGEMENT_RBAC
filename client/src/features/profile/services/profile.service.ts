import { useAuth } from '../../../context/AuthContext';
import { useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

export const useProfileService = () => {
  const { accessToken } = useAuth();

  const getProfile = useCallback(async () => {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to fetch profile' }));
      throw new Error(error.message);
    }

    return response.json();
  }, [accessToken]);

  const updateProfile = useCallback(async (data: { name?: string; currentPassword?: string; newPassword?: string }) => {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to update profile' }));
      throw new Error(error.message);
    }

    return response.json();
  }, [accessToken]);

  return { getProfile, updateProfile };
};
