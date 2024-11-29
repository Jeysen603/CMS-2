import { useState } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCaseForm } from '../../hooks/useCaseForm';
import type { Case } from '../../types/case';

interface NewCaseFormProps {
  onSubmit: (caseData: Omit<Case, 'id'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function NewCaseForm({
  onSubmit,
  onCancel,
  isSubmitting = false
}: NewCaseFormProps) {
  const {
    formData,
    errors,
    isValid,
    handleChange,
    handleBlur,
    validateForm
  } = useCaseForm();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Case Title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          error={errors.title}
          required
        />

        <Input
          label="Case Number"
          value={formData.caseNumber}
          onChange={(e) => handleChange('caseNumber', e.target.value)}
          onBlur={() => handleBlur('caseNumber')}
          error={errors.caseNumber}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority Level
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            onBlur={() => handleBlur('priority')}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
            required
          >
            <option value="">Select Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-sm text-red-600">{errors.priority}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Case Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            onBlur={() => handleBlur('type')}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
            required
          >
            <option value="">Select Type</option>
            <option value="civil">Civil Litigation</option>
            <option value="criminal">Criminal Defense</option>
            <option value="corporate">Corporate</option>
            <option value="family">Family Law</option>
            <option value="estate">Estate Planning</option>
            <option value="other">Other</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Client Name"
          value={formData.clientName}
          onChange={(e) => handleChange('clientName', e.target.value)}
          onBlur={() => handleBlur('clientName')}
          error={errors.clientName}
          required
        />

        <Input
          label="Assigned Attorney"
          value={formData.assignedAttorney}
          onChange={(e) => handleChange('assignedAttorney', e.target.value)}
          onBlur={() => handleBlur('assignedAttorney')}
          error={errors.assignedAttorney}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="date"
          label="Filing Date"
          value={formData.openDate}
          onChange={(e) => handleChange('openDate', e.target.value)}
          onBlur={() => handleBlur('openDate')}
          error={errors.openDate}
          required
        />

        <Input
          type="date"
          label="Due Date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          onBlur={() => handleBlur('dueDate')}
          error={errors.dueDate}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
          rows={4}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          isLoading={isSubmitting}
        >
          <Save className="h-4 w-4 mr-2" />
          Create Case
        </Button>
      </div>
    </form>
  );
}