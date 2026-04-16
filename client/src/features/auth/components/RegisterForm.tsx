import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../../../shared/components/ui/Input';
import { Button } from '../../../shared/components/ui/Button';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        id="name"
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        id="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        id="password"
        type="password"
        label="Password"
        placeholder="Create a password"
        error={errors.password?.message}
        showPasswordToggle
        {...register('password')}
      />

      <Input
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        error={errors.confirmPassword?.message}
        showPasswordToggle
        {...register('confirmPassword')}
      />

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
};