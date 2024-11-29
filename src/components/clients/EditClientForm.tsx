import { useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useClientForm } from '../../hooks/useClientForm';
import type { Client } from '../../types/client';

interface EditClientFormProps {
  client: Client;
  onSave: (updatedClient: Client) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function EditClientForm({
  client,
  onSave,
  onCancel,
  isSaving = false
}: EditClientFormProps) {
  const {
    formData,
    errors,
    isDirty,
    isValid,
    handleChange,
    handleBlur,
    validateForm,
    getChangedFields,
    resetForm
  } = useClientForm(client);

  useEffect(() => {
    resetForm();
  }, [client, resetForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const changes = getChangedFields();
    if (Object.keys(changes).length === 0) {
      return;
    }

    const updatedClient = {
      ...client,
      ...changes
    };

    onSave(updatedClient);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          onBlur={() => handleBlur('firstName')}
          error={errors.firstName}
          required
        />

        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          onBlur={() => handleBlur('lastName')}
          error={errors.lastName}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          error={errors.email}
          required
        />

        <Input
          label="Phone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          error={errors.phone}
          placeholder="(XXX) XXX-XXXX"
          required
        />
      </div>

      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        onBlur={() => handleBlur('address')}
        error={errors.address}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) => handleChange('status', e.target.value as Client['status'])}
          onBlur={() => handleBlur('status')}
          className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={!isDirty || !isValid || isSaving}
          isLoading={isSaving}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </form>
  );
}