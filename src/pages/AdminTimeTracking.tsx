import { useState } from 'react';
import { Users, Clock, FileText, Settings, Filter, Download, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import useTimeTrackingStore from '../store/timeTrackingStore';
import useAuthStore from '../store/authStore';
import TimeTrackingSettingsModal from '../components/timeTracking/TimeTrackingSettingsModal';

export default function AdminTimeTracking() {
  const [selectedView, setSelectedView] = useState<'entries' | 'reports'>('entries');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const { user } = useAuthStore();
  const { entries, timeSheets, calculateTotals } = useTimeTrackingStore();

  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You need administrator privileges to view this page.</p>
        </div>
      </div>
    );
  }

  const departments = ['Legal', 'Paralegal', 'Administrative'];
  const allTotals = calculateTotals(entries);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Time Tracking Administration</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setIsSettingsModalOpen(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* View Selection */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={selectedView === 'entries' ? 'primary' : 'outline'}
          onClick={() => setSelectedView('entries')}
        >
          <Clock className="h-4 w-4 mr-2" />
          Time Entries
        </Button>
        <Button
          variant={selectedView === 'reports' ? 'primary' : 'outline'}
          onClick={() => setSelectedView('reports')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Reports
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept.toLowerCase()}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>
          <div className="flex items-end space-x-2">
            <Button variant="outline" className="flex-1">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Total Hours</div>
          <div className="mt-1 text-2xl font-semibold">{allTotals.totalHours.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Billable Hours</div>
          <div className="mt-1 text-2xl font-semibold">{allTotals.billableHours.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Non-Billable Hours</div>
          <div className="mt-1 text-2xl font-semibold">{allTotals.nonBillableHours.toFixed(2)}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm font-medium text-gray-500">Pending Approvals</div>
          <div className="mt-1 text-2xl font-semibold">
            {timeSheets.filter(ts => ts.status === 'submitted').length}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow">
        {selectedView === 'entries' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {entry.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(entry.duration / 60).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {entry.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        entry.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : entry.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Time Tracking Reports</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="p-4 h-auto text-left flex items-start">
                <div>
                  <div className="font-medium">Department Utilization</div>
                  <div className="text-sm text-gray-500 mt-1">
                    View billable hours and utilization rates by department
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="p-4 h-auto text-left flex items-start">
                <div>
                  <div className="font-medium">Employee Performance</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Analyze individual employee time tracking metrics
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="p-4 h-auto text-left flex items-start">
                <div>
                  <div className="font-medium">Overtime Analysis</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Review overtime patterns and costs
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="p-4 h-auto text-left flex items-start">
                <div>
                  <div className="font-medium">Billing Summary</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Generate billing reports based on time entries
                  </div>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>

      <TimeTrackingSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}