import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';
import { User } from '../types';

const editUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'manager', 'user']).optional(),
  status: z.enum(['active', 'inactive']),
});

type EditUserFormData = z.infer<typeof editUserSchema>;

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSubmit: (data: { name: string; email: string; role?: string; status?: string }) => Promise<void>;
  isLoading: boolean;
  currentUserRole: string;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSubmit,
  isLoading,
  currentUserRole,
}) => {
  const isAdmin = currentUserRole === 'admin';
  const isTargetAdmin = user?.role === 'admin';
  const canEditRole = isAdmin && !isTargetAdmin;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, isOpen, reset]);

  const handleFormSubmit = async (data: EditUserFormData) => {
    await onSubmit({
      name: data.name,
      email: data.email,
      role: canEditRole ? data.role : undefined,
      status: data.status,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" size="md">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter user name"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="Enter user email"
          error={errors.email?.message}
          {...register('email')}
        />

        {canEditRole ? (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Role
            </label>
            <select
              {...register('role')}
              className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>
        ) : (
          <Input
            label="Role"
            value={user?.role || ''}
            disabled
            helperText={
              !canEditRole && user?.role === 'admin'
                ? 'Only admins can change admin roles'
                : 'Only admins can change roles'
            }
          />
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full h-10 px-3 rounded-lg border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-500">{errors.status.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
