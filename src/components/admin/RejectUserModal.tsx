import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import type { User } from '../../types/auth';

interface RejectUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  user: User | null;
}

export function RejectUserModal({
  isOpen,
  onClose,
  onConfirm,
  user
}: RejectUserModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason);
    setReason('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">
            Reject User Registration
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">
              You are about to reject the registration request for:
            </p>
            <p className="font-medium text-gray-900">
              {user.firstName} {user.lastName} ({user.email})
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 border-gray-300"
              rows={3}
              required
              placeholder="Please provide a reason for rejecting this registration request..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={!reason.trim()}
            >
              Confirm Rejection
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}