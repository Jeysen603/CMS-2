import { useState } from 'react';
import { X, Shield, Key } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { UserManagement } from '../../types/settings';

interface AdminPrivilegesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserManagement;
  onSave: (privileges: string[]) => void;
}

export default function AdminPrivilegesModal({
  isOpen,
  onClose,
  user,
  onSave,
}: AdminPrivilegesModalProps) {
  const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>([]);

  const privileges = [
    { id: 'user_management', label: 'User Management', description: 'Create, edit, and delete user accounts' },
    { id: 'billing_access', label: 'Billing Access', description: 'View and manage billing information' },
    { id: 'case_management', label: 'Case Management', description: 'Full access to all case information' },
    { id: 'client_management', label: 'Client Management', description: 'Manage client information and relationships' },
    { id: 'system_settings', label: 'System Settings', description: 'Configure system-wide settings' },
    { id: 'reports_access', label: 'Reports Access', description: 'Generate and view system reports' },
    { id: 'audit_logs', label: 'Audit Logs', description: 'View security and system logs' },
    { id: 'api_access', label: 'API Access', description: 'Access to system APIs' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(selectedPrivileges);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">
              {user ? `Manage Privileges: ${user.firstName} ${user.lastName}` : 'Configure User Privileges'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {privileges.map((privilege) => (
              <label key={privilege.id} className="flex items-start p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={selectedPrivileges.includes(privilege.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPrivileges([...selectedPrivileges, privilege.id]);
                    } else {
                      setSelectedPrivileges(selectedPrivileges.filter(id => id !== privilege.id));
                    }
                  }}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{privilege.label}</div>
                  <div className="text-sm text-gray-500">{privilege.description}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Privileges
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}