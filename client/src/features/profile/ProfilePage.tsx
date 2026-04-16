import React from 'react';
import { useProfile } from './hooks/useProfile';
import { ProfileForm } from './components/ProfileForm';
import { Badge } from '../../shared/components/ui/Badge';
import { Avatar } from '../../shared/components/ui/Avatar';
import { Spinner } from '../../shared/components/ui/Spinner';
import { formatDate } from '../../shared/utils/format.utils';
import toast from 'react-hot-toast';

export const ProfilePage: React.FC = () => {
  const { profile, isLoading, isUpdating, updateProfile } = useProfile();

  const handleSubmit = async (data: any) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="font-body text-silver-mist">Failed to load profile. Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      <div>
        <h1 className="font-display text-display text-white mb-3">
          MY PROFILE
        </h1>
        <p className="font-body text-body text-silver-mist">
          Manage your account information
        </p>
      </div>

      <div className="border border-silver-mist p-6">
        <div className="flex items-center gap-4 pb-6 border-b border-silver-mist/30">
          <Avatar name={profile.name} size="lg" />
          <div>
            <h2 className="font-display text-body text-white">{profile.name}</h2>
            <p className="font-body text-compact text-silver-mist">{profile.email}</p>
            <div className="flex gap-2 mt-3">
              <Badge variant={profile.role as 'admin' | 'manager' | 'user'}>
                {profile.role}
              </Badge>
              <Badge variant={profile.status === 'active' ? 'active' : 'inactive'}>
                {profile.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="py-8 space-y-4">
          <h3 className="font-mono text-caption uppercase tracking-widest text-silver-mist">
            Account Information
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-mono text-micro uppercase tracking-widest text-silver-mist mb-1">Email</p>
              <p className="font-body text-body text-white">{profile.email}</p>
            </div>
            <div>
              <p className="font-mono text-micro uppercase tracking-widest text-silver-mist mb-1">Role</p>
              <p className="font-body text-body text-white capitalize">{profile.role}</p>
            </div>
            <div>
              <p className="font-mono text-micro uppercase tracking-widest text-silver-mist mb-1">Status</p>
              <p className="font-body text-body text-white capitalize">{profile.status}</p>
            </div>
            <div>
              <p className="font-mono text-micro uppercase tracking-widest text-silver-mist mb-1">Member Since</p>
              <p className="font-body text-body text-white">
                {profile.createdAt ? formatDate(profile.createdAt) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-silver-mist p-6">
        <h3 className="font-display text-body text-white uppercase mb-6">Edit Profile</h3>
        <ProfileForm
          name={profile.name}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
        />
      </div>
    </div>
  );
};
