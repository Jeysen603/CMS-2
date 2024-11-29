import { useState } from 'react';
import { X, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { activityCodes, timeEntrySchema } from '../../types/timeTracking';
import type { TimeEntry } from '../../types/timeTracking';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: Omit<TimeEntry, 'id' | 'userId'>) => void;
  entry?: TimeEntry;
}

export default function TimeEntryModal({
  isOpen,
  onClose,
  onSave,
  entry
}: TimeEntryModalProps) {
  const [formData, setFormData] = useState({
    date: entry?.date || new Date().toISOString().split('T')[0],
    startTime: entry?.startTime || '',
    endTime: entry?.endTime || '',
    description: entry?.description || '',
    billable: entry?.billable || true,
    category: entry?.category || 'billable',
    activityCode: entry?.activityCode || '',
    projectId: entry?.projectId || '',
    caseId: entry?.caseId || '',
    clientId: entry?.clientId || '',
    rate: entry?.rate || 350,
    breaks: entry?.breaks || [],
    duration: entry?.duration || 0,
    status: entry?.status || 'draft'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      timeEntrySchema.parse(formData);
      onSave(formData);
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ form: error.message });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">
              {entry ? 'Edit Time Entry' : 'New Time Entry'}
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Activity Type
              </label>
              <select
                value={formData.activityCode}
                onChange={(e) => setFormData({ ...formData, activityCode: e.target.value })}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                required
              >
                <option value="">Select Activity</option>
                {activityCodes.map((activity) => (
                  <option key={activity.code} value={activity.code}>
                    {activity.description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="time"
              label="Start Time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              required
            />

            <Input
              type="time"
              label="End Time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Case ID"
              value={formData.caseId}
              onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
            />

            <Input
              label="Client ID"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TimeEntry['category'] })}
                className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
                required
              >
                <option value="billable">Billable</option>
                <option value="non-billable">Non-Billable</option>
                <option value="administrative">Administrative</option>
              </select>
            </div>

            <Input
              type="number"
              label="Rate ($/hour)"
              value={formData.rate}
              onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="billable"
              checked={formData.billable}
              onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="billable" className="text-sm font-medium text-gray-700">
              Billable Time
            </label>
          </div>

          {errors.form && (
            <div className="text-red-600 text-sm">{errors.form}</div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {entry ? 'Update Entry' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}