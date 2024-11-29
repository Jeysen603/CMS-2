import { X, Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface SystemMetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemMetricsModal({ isOpen, onClose }: SystemMetricsModalProps) {
  if (!isOpen) return null;

  const mockMetrics = {
    performance: {
      cpu: '45%',
      memory: '62%',
      storage: '78%',
      responseTime: '120ms'
    },
    usage: {
      activeUsers: 42,
      totalCases: 156,
      documentsStored: 1234,
      apiCalls: 45678
    },
    availability: {
      uptime: '99.9%',
      lastDowntime: '2024-02-15T03:24:00',
      plannedMaintenance: '2024-04-01T02:00:00'
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">System Metrics</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Performance Metrics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">CPU Usage</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{mockMetrics.performance.cpu}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Memory Usage</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{mockMetrics.performance.memory}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Storage Usage</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{mockMetrics.performance.storage}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Avg Response Time</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{mockMetrics.performance.responseTime}</div>
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Active Users</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{mockMetrics.usage.activeUsers}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Total Cases</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{mockMetrics.usage.totalCases}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">Documents Stored</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{mockMetrics.usage.documentsStored}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-500">API Calls (24h)</div>
                <div className="mt-1 text-2xl font-semibold text-gray-900">{mockMetrics.usage.apiCalls}</div>
              </div>
            </div>
          </div>

          {/* System Availability */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Availability</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">System Uptime</div>
                <div className="text-sm font-medium text-gray-900">{mockMetrics.availability.uptime}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Last Downtime</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(mockMetrics.availability.lastDowntime).toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-sm font-medium text-gray-500">Next Planned Maintenance</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(mockMetrics.availability.plannedMaintenance).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-2">
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}