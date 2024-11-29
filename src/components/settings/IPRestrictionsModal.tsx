import { useState } from 'react';
import { X, Shield, Plus, Trash } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface IPRestrictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: IPRestrictionSettings) => void;
}

interface IPRestrictionSettings {
  enabled: boolean;
  allowedIPs: string[];
  allowedRanges: string[];
  blockUnknownIPs: boolean;
}

export default function IPRestrictionsModal({
  isOpen,
  onClose,
  onSave,
}: IPRestrictionsModalProps) {
  const [settings, setSettings] = useState<IPRestrictionSettings>({
    enabled: false,
    allowedIPs: [],
    allowedRanges: [],
    blockUnknownIPs: true,
  });

  const [newIP, setNewIP] = useState('');
  const [newRange, setNewRange] = useState('');

  const handleAddIP = () => {
    if (newIP && !settings.allowedIPs.includes(newIP)) {
      setSettings({
        ...settings,
        allowedIPs: [...settings.allowedIPs, newIP],
      });
      setNewIP('');
    }
  };

  const handleAddRange = () => {
    if (newRange && !settings.allowedRanges.includes(newRange)) {
      setSettings({
        ...settings,
        allowedRanges: [...settings.allowedRanges, newRange],
      });
      setNewRange('');
    }
  };

  const handleRemoveIP = (ip: string) => {
    setSettings({
      ...settings,
      allowedIPs: settings.allowedIPs.filter((item) => item !== ip),
    });
  };

  const handleRemoveRange = (range: string) => {
    setSettings({
      ...settings,
      allowedRanges: settings.allowedRanges.filter((item) => item !== range),
    });
  };

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
            <Shield className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold">IP Restrictions</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enabled"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
              Enable IP Restrictions
            </label>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed IP Addresses
              </label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                  placeholder="Enter IP address (e.g., 192.168.1.1)"
                />
                <Button type="button" onClick={handleAddIP}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {settings.allowedIPs.map((ip) => (
                  <div key={ip} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{ip}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveIP(ip)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed IP Ranges
              </label>
              <div className="flex space-x-2 mb-2">
                <Input
                  value={newRange}
                  onChange={(e) => setNewRange(e.target.value)}
                  placeholder="Enter IP range (e.g., 192.168.1.0/24)"
                />
                <Button type="button" onClick={handleAddRange}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {settings.allowedRanges.map((range) => (
                  <div key={range} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm text-gray-700">{range}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRange(range)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="blockUnknown"
              checked={settings.blockUnknownIPs}
              onChange={(e) => setSettings({ ...settings, blockUnknownIPs: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="blockUnknown" className="text-sm font-medium text-gray-700">
              Block access from unknown IP addresses
            </label>
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