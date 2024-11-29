import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { signUpSchema } from '../../utils/validation/authSchemas';
import type { SignUpFormData } from '../../types/auth';

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => Promise<void>;
  isLoading: boolean;
}

export default function SignUpForm({ onSubmit, isLoading }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
      acceptPrivacy: false
    }
  });

  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          error={errors.firstName?.message}
          {...register('firstName')}
          icon={<User className="h-5 w-5 text-gray-400" />}
          autoComplete="given-name"
        />

        <Input
          label="Last Name"
          error={errors.lastName?.message}
          {...register('lastName')}
          icon={<User className="h-5 w-5 text-gray-400" />}
          autoComplete="family-name"
        />
      </div>

      <Input
        type="email"
        label="Email address"
        error={errors.email?.message}
        {...register('email')}
        icon={<Mail className="h-5 w-5 text-gray-400" />}
        autoComplete="email"
      />

      <div>
        <Input
          type={showPassword ? 'text' : 'password'}
          label="Password"
          error={errors.password?.message}
          {...register('password')}
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-500"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          }
        />
        <PasswordStrengthIndicator password={password} />
      </div>

      <Input
        type={showConfirmPassword ? 'text' : 'password'}
        label="Confirm Password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
        icon={<Lock className="h-5 w-5 text-gray-400" />}
        rightElement={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-500"
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        }
      />

      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="accept-terms"
            {...register('acceptTerms')}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">
            I accept the{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="accept-privacy"
            {...register('acceptPrivacy')}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="accept-privacy" className="ml-2 block text-sm text-gray-900">
            I accept the{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={isLoading}
      >
        Create Account
      </Button>
    </form>
  );
}