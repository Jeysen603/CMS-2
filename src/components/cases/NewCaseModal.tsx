import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import NewCaseForm from './NewCaseForm';
import type { Case } from '../../types/case';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (caseData: Omit<Case, 'id'>) => void;
}

export default function NewCaseModal({
  isOpen,
  onClose,
  onSave
}: NewCaseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (caseData: Omit<Case, 'id'>) => {
    try {
      setIsSubmitting(true);
      await onSave(caseData);
      toast.success('Case created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to create case');
      console.error('Error creating case:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Case</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <NewCaseForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}