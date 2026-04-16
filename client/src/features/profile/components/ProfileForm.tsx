import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required when setting a new password',
  path: ['currentPassword'],
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  name: string;
  onSubmit: (data: { name?: string; currentPassword?: string; newPassword?: string }) => Promise<void>;
  isLoading: boolean;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  name,
  onSubmit,
  isLoading,
}) => {
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name },
  });

  const handleFormSubmit = async (data: ProfileFormData) => {
    await onSubmit({
      name: data.name,
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    setShowPasswordSection(false);
    reset({ name: data.name });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Input
        label="Name"
        placeholder="Enter your name"
        error={errors.name?.message}
        {...register('name')}
      />

      {!showPasswordSection ? (
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowPasswordSection(true)}
        >
          Change Password
        </Button>
      ) : (
        <div className="space-y-6 p-6 border border-silver-mist rounded-sm">
          <h4 className="font-display text-body text-white uppercase">Change Password</h4>
          
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            error={errors.currentPassword?.message}
            showPasswordToggle
            {...register('currentPassword')}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password (min 6 characters)"
            error={errors.newPassword?.message}
            showPasswordToggle
            {...register('newPassword')}
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            showPasswordToggle
            {...register('confirmPassword')}
          />

          <div className="flex gap-4">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowPasswordSection(false);
                reset({ name });
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <Button type="submit" isLoading={isLoading} disabled={isLoading}>
        Save Changes
      </Button>
    </form>
  );
};
