import { useState } from 'react';
import { X, Database, Clock, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface BackupSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: BackupSettings) => void;
}

interface BackupSettings {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  retentionPeriod: number;
  location: string;
}

export default function BackupSettingsModal({
  isOpen,
  onClose,
  onSave,
}: BackupSettingsModalProps) {
  const [settings, setSettings] = useState<BackupSettings>({
    frequency: 'daily',
    time: '00:00',
    retentionPeriod: 30,
    location: 'backup-storage',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Database className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Backup Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Backup Frequency
            </label>
            <select
              value={settings.frequency}
              onChange={(e) => setSettings({ ...settings, frequency: e.target.value as BackupSettings['frequency'] })}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <Input
            type="time"
            label="Backup Time"
            value={settings.time}
            onChange={(e) => setSettings({ ...settings, time: e.target.value })}
          />

          <Input
            type="number"
            label="Retention Period (days)"
            value={settings.retentionPeriod}
            onChange={(e) => setSettings({ ...settings, retentionPeriod: parseInt(e.target.value) })}
            min="1"
          />

          <Input
            label="Backup Location"
            value={settings.location}
            onChange={(e) => setSettings({ ...settings, location: e.target.value })}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}