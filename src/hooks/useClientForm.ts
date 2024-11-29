import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { validateClientData, formatPhoneNumber } from '../utils/validation';
import type { Client } from '../types/client';

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
}

interface UseClientFormReturn {
  formData: FormState;
  errors: Record<string, string>;
  isDirty: boolean;
  isValid: boolean;
  handleChange: (field: keyof FormState, value: string) => void;
  handleBlur: (field: keyof FormState) => void;
  resetForm: () => void;
  validateForm: () => boolean;
  getChangedFields: () => Partial<Client>;
}

export const useClientForm = (initialData?: Client): UseClientFormReturn => {
  const [formData, setFormData] = useState<FormState>({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    status: initialData?.status || 'active'
  });

  const [touched, setTouched] = useState<Record<keyof FormState, boolean>>({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    address: false,
    status: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const validateField = useCallback((name: keyof FormState, value: string) => {
    const fieldErrors = validateClientData({
      ...formData,
      [name]: value
    });
    
    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name] || ''
    }));

    return !fieldErrors[name];
  }, [formData]);

  const handleChange = useCallback((field: keyof FormState, value: string) => {
    setIsDirty(true);
    
    let formattedValue = value;
    if (field === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [field]: formattedValue
    }));

    if (touched[field]) {
      validateField(field, formattedValue);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: keyof FormState) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, formData[field]);
  }, [formData, validateField]);

  const validateForm = useCallback(() => {
    const fieldErrors = validateClientData(formData);
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    if (initialData) {
      setFormData({
        firstName: initialData.firstName,
        lastName: initialData.lastName,
        email: initialData.email,
        phone: initialData.phone,
        address: initialData.address,
        status: initialData.status
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        status: 'active'
      });
    }
    setErrors({});
    setIsDirty(false);
    setTouched({
      firstName: false,
      lastName: false,
      email: false,
      phone: false,
      address: false,
      status: false
    });
  }, [initialData]);

  const getChangedFields = useCallback(() => {
    if (!initialData) return formData;

    return Object.entries(formData).reduce((acc, [key, value]) => {
      if (initialData[key as keyof Client] !== value) {
        acc[key as keyof Client] = value;
      }
      return acc;
    }, {} as Partial<Client>);
  }, [formData, initialData]);

  useEffect(() => {
    if (initialData) {
      resetForm();
    }
  }, [initialData, resetForm]);

  return {
    formData,
    errors,
    isDirty,
    isValid: Object.keys(errors).length === 0,
    handleChange,
    handleBlur,
    resetForm,
    validateForm,
    getChangedFields
  };
};