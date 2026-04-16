import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../../../shared/components/ui/Button';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  isLoading: boolean;
  filledCredentials?: { email: string; password: string } | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, filledCredentials }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {
    formState: { errors },
    setValue,
    trigger,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (filledCredentials) {
      setEmail(filledCredentials.email);
      setPassword(filledCredentials.password);
      setValue('email', filledCredentials.email);
      setValue('password', filledCredentials.password);
    }
  }, [filledCredentials, setValue]);

  const onFormSubmit = async () => {
    const isValid = await trigger();
    if (isValid) {
      onSubmit({ email, password });
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onFormSubmit(); }} className="space-y-6">
      <div>
        <label className="block font-mono text-caption uppercase tracking-widest text-white mb-3">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setValue('email', e.target.value);
          }}
          placeholder="Enter your email"
          className="w-full h-12 px-4 rounded-sm border bg-black text-white placeholder-silver-mist font-body text-body focus:outline-none focus:border-white transition-colors duration-250 border-silver-mist"
        />
        {errors.email && (
          <p className="mt-2 text-sm text-silver-mist font-body">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block font-mono text-caption uppercase tracking-widest text-white mb-3">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setValue('password', e.target.value);
          }}
          placeholder="Enter your password"
          className="w-full h-12 px-4 rounded-sm border bg-black text-white placeholder-silver-mist font-body text-body focus:outline-none focus:border-white transition-colors duration-250 border-silver-mist"
        />
        {errors.password && (
          <p className="mt-2 text-sm text-silver-mist font-body">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isLoading}
        disabled={isLoading}
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};
