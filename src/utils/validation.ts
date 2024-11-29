import { z } from 'zod';

const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const clientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(phoneRegex, 'Invalid phone format: (XXX) XXX-XXXX'),
  address: z.string().min(1, 'Address is required'),
  status: z.enum(['active', 'inactive'])
});

export const validateClientData = (data: Record<string, any>): Record<string, string> => {
  try {
    clientSchema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.reduce((acc, err) => ({
        ...acc,
        [err.path[0]]: err.message
      }), {});
    }
    return { form: 'Invalid form data' };
  }
};

export const formatPhoneNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
  return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
};