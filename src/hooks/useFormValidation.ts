import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

export function useFormValidation<T extends z.ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = useCallback((data: any) => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce(
          (acc, err) => ({
            ...acc,
            [err.path[0]]: err.message
          }),
          {}
        );
        setErrors(newErrors);
        
        // Show toast for first error
        const firstError = error.errors[0];
        if (firstError) {
          toast.error(firstError.message);
        }
      }
      return false;
    }
  }, [schema]);

  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearTouched = useCallback(() => {
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validate,
    handleBlur,
    clearErrors,
    clearTouched,
    setErrors
  };
}