import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profile.service';
import { User } from '../../users/types';

interface UseProfileReturn {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateProfile: (data: { name?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
  isUpdating: boolean;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await profileService.getProfile();
      setProfile(response.data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (data: { name?: string; currentPassword?: string; newPassword?: string }) => {
    setIsUpdating(true);
    setError(null);

    try {
      await profileService.updateProfile(data);
      await fetchProfile();
    } catch (err: any) {
      const message = err.response?.data?.message || 'Failed to update profile';
      setError(message);
      throw new Error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profile,
    isLoading,
    error,
    refetch: fetchProfile,
    updateProfile,
    isUpdating,
  };
};
