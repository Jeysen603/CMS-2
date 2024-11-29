import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { ClientService } from '../services/clientService';
import type { Client } from '../types/client';

export const useClientChanges = (onSuccess?: () => void) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveChanges = async (
    clientId: string,
    changes: Partial<Client>,
    userId: string
  ): Promise<Client> => {
    if (Object.keys(changes).length === 0) {
      toast.info('No changes to save');
      return Promise.reject(new Error('No changes to save'));
    }

    try {
      setIsSaving(true);
      setError(null);

      const update = {
        id: clientId,
        changes,
        updatedBy: userId
      };

      const updatedClient = await ClientService.saveClientChanges(update);
      
      toast.success('Changes saved successfully');
      onSuccess?.();
      
      return updatedClient;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save changes';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    saveChanges,
    isSaving,
    error,
    clearError: () => setError(null)
  };
};