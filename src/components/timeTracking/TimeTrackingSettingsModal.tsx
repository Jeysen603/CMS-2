import { useState } from 'react';
import { X, Clock, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface TimeTrackingSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WorkHourSettings {
  regularHoursStart: string;
  regularHoursEnd: string;
  minimumBreakDuration: number;
  overtimeThreshold: number;
  roundingInterval: number;
}

interface ApprovalSettings {
  requireApproval: boolean;
  autoApproveUnder: number;
  approverRoles: string[];
  reminderFrequency: number;
}

export default function TimeTrackingSettingsModal({
  isOpen,
  onClose,
}: TimeTrackingSettingsModalProps) {
  const [workHours, setWorkHours] = useState<WorkHourSettings>({
    regularHoursStart: '09:00',
    regularHoursEnd: '17:00',
    minimumBreakDuration: 30,
    overtimeThreshold: 40,
    roundingInterval: 6,
  });

  const [approvalSettings, setApprovalSettings] = useState<ApprovalSettings>({
    requireApproval: true,
    autoApproveUnder: 8,
    approverRoles: ['admin', 'manager'],
    reminderFrequency: 24,
  });

  const handleSave = () => {
    // Save settings logic here
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Settings className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">Time Tracking Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-8">
          {/* Work Hours Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Work Hours</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Hours Start
                </label>
                <Input
                  type="time"
                  value={workHours.regularHoursStart}
                  onChange={(e) => setWorkHours({ ...workHours, regularHoursStart: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Regular Hours End
                </label>
                <Input
                  type="time"
                  value={workHours.regularHoursEnd}
                  onChange={(e) => setWorkHours({ ...workHours, regularHoursEnd: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Break Duration (minutes)
                </label>
                <Input
                  type="number"
                  value={workHours.minimumBreakDuration}
                  onChange={(e) => setWorkHours({ ...workHours, minimumBreakDuration: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weekly Overtime Threshold (hours)
                </label>
                <Input
                  type="number"
                  value={workHours.overtimeThreshold}
                  onChange={(e) => setWorkHours({ ...workHours, overtimeThreshold: parseInt(e.target.value) })}
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Rounding Interval (minutes)
                </label>
                <Input
                  type="number"
                  value={workHours.roundingInterval}
                  onChange={(e) => setWorkHours({ ...workHours, roundingInterval: parseInt(e.target.value) })}
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Approval Settings */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Workflow</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="requireApproval"
                  checked={approvalSettings.requireApproval}
                  onChange={(e) => setApprovalSettings({ ...approvalSettings, requireApproval: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="requireApproval" className="text-sm font-medium text-gray-700">
                  Require approval for time entries
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-approve entries under (hours)
                </label>
                <Input
                  type="number"
                  value={approvalSettings.autoApproveUnder}
                  onChange={(e) => setApprovalSettings({ ...approvalSettings, autoApproveUnder: parseInt(e.target.value) })}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Frequency (hours)
                </label>
                <Input
                  type="number"
                  value={approvalSettings.reminderFrequency}
                  onChange={(e) => setApprovalSettings({ ...approvalSettings, reminderFrequency: parseInt(e.target.value) })}
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approver Roles
                </label>
                <div className="space-y-2">
                  {['admin', 'manager', 'supervisor'].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`role-${role}`}
                        checked={approvalSettings.approverRoles.includes(role)}
                        onChange={(e) => {
                          const newRoles = e.target.checked
                            ? [...approvalSettings.approverRoles, role]
                            : approvalSettings.approverRoles.filter(r => r !== role);
                          setApprovalSettings({ ...approvalSettings, approverRoles: newRoles });
                        }}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`role-${role}`} className="text-sm text-gray-700 capitalize">
                        {role}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}