import { useState } from 'react';
import { useUsersService } from '../services/users.service';
import { CreateUserData, UpdateUserData } from '../types';

interface UseUserMutationsReturn {
  createUser: (data: CreateUserData) => Promise<{ generatedPassword?: string }>;
  updateUser: (id: string, data: UpdateUserData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateProfile: (data: { name?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useUserMutations = (): UseUserMutationsReturn => {
  const { createUser: createUserApi, updateUser: updateUserApi, deleteUser: deleteUserApi, updateProfile: updateProfileApi } = useUsersService();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = async (data: CreateUserData): Promise<{ generatedPassword?: string }> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createUserApi(data);
      return { generatedPassword: response.data.generatedPassword };
    } catch (err: any) {
      const message = err.message || 'Failed to create user';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (id: string, data: UpdateUserData): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await updateUserApi(id, data);
    } catch (err: any) {
      const message = err.message || 'Failed to update user';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await deleteUserApi(id);
    } catch (err: any) {
      const message = err.message || 'Failed to deactivate user';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: { name?: string; currentPassword?: string; newPassword?: string }): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await updateProfileApi(data);
    } catch (err: any) {
      const message = err.message || 'Failed to update profile';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createUser,
    updateUser,
    deleteUser,
    updateProfile,
    isLoading,
    error,
  };
};
