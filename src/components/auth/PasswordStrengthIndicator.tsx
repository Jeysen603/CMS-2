import { useMemo } from 'react';
import { clsx } from 'clsx';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Character variety
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return Math.min(score, 5);
  }, [password]);

  const getStrengthText = () => {
    if (!password) return '';
    if (strength <= 2) return 'Weak';
    if (strength <= 3) return 'Fair';
    if (strength <= 4) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (!password) return 'bg-gray-200';
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    if (strength <= 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex h-2 overflow-hidden rounded bg-gray-200">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={clsx(
              'flex-1 transition-all duration-300',
              index < strength ? getStrengthColor() : 'bg-gray-200',
              index > 0 && 'ml-1'
            )}
          />
        ))}
      </div>
      <p className={clsx(
        'mt-1 text-sm',
        strength <= 2 ? 'text-red-600' :
        strength <= 3 ? 'text-yellow-600' :
        'text-green-600'
      )}>
        {getStrengthText()}
      </p>
    </div>
  );
}