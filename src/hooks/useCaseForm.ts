import { useState, useCallback } from 'react';
import { validateCaseData } from '../utils/caseValidation';
import type { Case } from '../types/case';

interface CaseFormData extends Omit<Case, 'id'> {
  priority: string;
  type: string;
  dueDate: string;
}

export const useCaseForm = () => {
  const [formData, setFormData] = useState<CaseFormData>({
    title: '',
    caseNumber: '',
    clientName: '',
    status: 'active',
    priority: '',
    type: '',
    practiceArea: '',
    assignedAttorney: '',
    openDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    description: ''
  });

  const [touched, setTouched] = useState<Record<keyof CaseFormData, boolean>>({
    title: false,
    caseNumber: false,
    clientName: false,
    status: false,
    priority: false,
    type: false,
    practiceArea: false,
    assignedAttorney: false,
    openDate: false,
    dueDate: false,
    description: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = useCallback((name: keyof CaseFormData, value: string) => {
    const fieldErrors = validateCaseData({
      ...formData,
      [name]: value
    });

    setErrors(prev => ({
      ...prev,
      [name]: fieldErrors[name] || ''
    }));

    return !fieldErrors[name];
  }, [formData]);

  const handleChange = useCallback((field: keyof CaseFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (touched[field]) {
      validateField(field, value);
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: keyof CaseFormData) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
    validateField(field, formData[field]);
  }, [formData, validateField]);

  const validateForm = useCallback(() => {
    const fieldErrors = validateCaseData(formData);
    setErrors(fieldErrors);
    return Object.keys(fieldErrors).length === 0;
  }, [formData]);

  const isValid = Object.keys(errors).length === 0 && 
    Object.values(formData).every(value => value !== '');

  return {
    formData,
    errors,
    isValid,
    handleChange,
    handleBlur,
    validateForm
  };
};