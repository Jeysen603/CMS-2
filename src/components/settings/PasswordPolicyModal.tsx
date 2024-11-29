import { useState } from 'react';
import { X, Key } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import type { PasswordPolicySettings } from '../../types/settings';

interface PasswordPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: PasswordPolicySettings) => void;
}

export default function PasswordPolicyModal({
  isOpen,
  onClose,
  onSave,
}: PasswordPolicyModalProps) {
  const [settings, setSettings] = useState<PasswordPolicySettings>({
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    passwordExpiration: 90,
    preventReuseCount: 5,
    maxAttempts: 5,
    lockoutDuration: 30,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Key className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Password Policy</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Minimum Password Length"
              value={settings.minLength}
              onChange={(e) => setSettings({ ...settings, minLength: parseInt(e.target.value) })}
              min="8"
              required
            />

            <Input
              type="number"
              label="Password Expiration (days)"
              value={settings.passwordExpiration}
              onChange={(e) => setSettings({ ...settings, passwordExpiration: parseInt(e.target.value) })}
              min="0"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Previous Passwords to Prevent Reuse"
              value={settings.preventReuseCount}
              onChange={(e) => setSettings({ ...settings, preventReuseCount: parseInt(e.target.value) })}
              min="0"
              required
            />

            <Input
              type="number"
              label="Maximum Failed Attempts"
              value={settings.maxAttempts}
              onChange={(e) => setSettings({ ...settings, maxAttempts: parseInt(e.target.value) })}
              min="1"
              required
            />
          </div>

          <Input
            type="number"
            label="Account Lockout Duration (minutes)"
            value={settings.lockoutDuration}
            onChange={(e) => setSettings({ ...settings, lockoutDuration: parseInt(e.target.value) })}
            min="1"
            required
          />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requireUppercase"
                checked={settings.requireUppercase}
                onChange={(e) => setSettings({ ...settings, requireUppercase: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="requireUppercase" className="text-sm font-medium text-gray-700">
                Require uppercase letters
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requireLowercase"
                checked={settings.requireLowercase}
                onChange={(e) => setSettings({ ...settings, requireLowercase: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="requireLowercase" className="text-sm font-medium text-gray-700">
                Require lowercase letters
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requireNumbers"
                checked={settings.requireNumbers}
                onChange={(e) => setSettings({ ...settings, requireNumbers: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="requireNumbers" className="text-sm font-medium text-gray-700">
                Require numbers
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="requireSpecialChars"
                checked={settings.requireSpecialChars}
                onChange={(e) => setSettings({ ...settings, requireSpecialChars: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="requireSpecialChars" className="text-sm font-medium text-gray-700">
                Require special characters
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}