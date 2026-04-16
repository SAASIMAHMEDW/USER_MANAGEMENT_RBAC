import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../../../shared/components/ui/Modal';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().optional(),
  role: z.enum(['admin', 'manager', 'user']),
  status: z.enum(['active', 'inactive']),
  autoGenerate: z.boolean().default(true),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; password?: string; role: string; status: string }) => Promise<{ generatedPassword?: string }>;
  isLoading: boolean;
}

export const UserCreateModal: React.FC<UserCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: 'user',
      status: 'active',
      autoGenerate: true,
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      setAutoGenerate(true);
      setGeneratedPassword(null);
    }
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: CreateUserFormData) => {
    try {
      const submitData = {
        name: data.name,
        email: data.email,
        password: data.autoGenerate ? undefined : data.password,
        role: data.role,
        status: data.status,
      };
      const result = await onSubmit(submitData);
      if (result.generatedPassword) {
        setGeneratedPassword(result.generatedPassword);
      } else {
        onClose();
      }
    } catch {
      // Error handled by parent
    }
  };

  const handleClose = () => {
    if (generatedPassword) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create User" size="md">
      {generatedPassword ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium mb-2">User created successfully!</p>
            <p className="text-green-700 text-sm mb-3">
              Since you chose to auto-generate the password, here it is:
            </p>
            <div className="bg-white border border-green-300 rounded p-2 font-mono text-sm">
              {generatedPassword}
            </div>
            <p className="text-green-600 text-xs mt-2">
              Please share this password with the user securely.
            </p>
          </div>
          <Button onClick={handleClose} className="w-full">
            Done
          </Button>
        </div>
      ) : (
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

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="flex items-center gap-4 mb-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoGenerate}
                  onChange={(e) => setAutoGenerate(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500"
                />
                <span className="text-sm text-slate-600">Auto-generate password</span>
              </label>
            </div>
            {!autoGenerate && (
              <Input
                type="password"
                placeholder="Enter password (min 6 characters)"
                error={errors.password?.message}
                showPasswordToggle
                {...register('password')}
              />
            )}
          </div>

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
              Create User
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
