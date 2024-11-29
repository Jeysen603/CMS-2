import { useState } from 'react';
import { 
  Shield, 
  Users, 
  Building, 
  Mail, 
  Phone, 
  DollarSign, 
  Bell, 
  Database,
  Plus,
  Lock,
  Activity,
  Settings as SettingsIcon,
  AlertTriangle,
  FileText,
  BarChart,
  Key,
  Globe,
  UserPlus,
  UserMinus,
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import UserManagementModal from '../components/settings/UserManagementModal';
import SecurityLogModal from '../components/settings/SecurityLogModal';
import SystemMetricsModal from '../components/settings/SystemMetricsModal';
import IPRestrictionsModal from '../components/settings/IPRestrictionsModal';
import PasswordPolicyModal from '../components/settings/PasswordPolicyModal';
import PendingApprovals from '../components/admin/PendingApprovals';
import useSettingsStore from '../store/settingsStore';
import useAuthStore from '../store/authStore';
import type { UserManagement } from '../types/settings';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [isUserManagementModalOpen, setIsUserManagementModalOpen] = useState(false);
  const [isSecurityLogModalOpen, setIsSecurityLogModalOpen] = useState(false);
  const [isSystemMetricsModalOpen, setIsSystemMetricsModalOpen] = useState(false);
  const [isIPRestrictionsModalOpen, setIsIPRestrictionsModalOpen] = useState(false);
  const [isPasswordPolicyModalOpen, setIsPasswordPolicyModalOpen] = useState(false);
  const { systemSettings, users, updateSystemSettings, addUser, updateUser, deleteUser } = useSettingsStore();
  const { user, pendingUsers } = useAuthStore();

  const isAdmin = user?.role === 'admin';
  const pendingCount = pendingUsers.filter(u => u.status === 'pending').length;

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'users', label: 'Users', icon: Users, badge: pendingCount },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
  ];

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Access Denied</h2>
          <p className="mt-2 text-gray-600">You need administrator privileges to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

      <div className="mt-4">
        <div className="sm:hidden">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden sm:block">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center py-4 px-1 border-b-2 font-medium text-sm
                      ${activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                    {tab.badge ? (
                      <span className="ml-2 bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Company Information</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Company Name"
                  value={systemSettings.companyName}
                  onChange={(e) => updateSystemSettings({ companyName: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={systemSettings.email}
                  onChange={(e) => updateSystemSettings({ email: e.target.value })}
                />
                <Input
                  label="Phone"
                  type="tel"
                  value={systemSettings.phone}
                  onChange={(e) => updateSystemSettings({ phone: e.target.value })}
                />
                <Input
                  label="Address"
                  value={systemSettings.address}
                  onChange={(e) => updateSystemSettings({ address: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Settings</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <Input
                  label="Default Hourly Rate"
                  type="number"
                  value={systemSettings.billingRate}
                  onChange={(e) => updateSystemSettings({ billingRate: parseFloat(e.target.value) })}
                />
                <Input
                  label="Default Due Date (days)"
                  type="number"
                  value={systemSettings.defaultDueDate}
                  onChange={(e) => updateSystemSettings({ defaultDueDate: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-medium text-gray-900">New Registration Requests</h2>
                </div>
              </div>

              <PendingApprovals />
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">User Management</h2>
                <Button onClick={() => setIsUserManagementModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 bg-gray-50"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            user.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(user.lastLogin).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="outline" onClick={() => console.log('Edit user:', user)}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">Require 2FA for all admin users</p>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">IP Restrictions</h3>
                    <p className="text-sm text-gray-500">Limit access to specific IP ranges</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsIPRestrictionsModalOpen(true)}
                  >
                    Configure
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Password Policy</h3>
                    <p className="text-sm text-gray-500">Set password requirements</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPasswordPolicyModalOpen(true)}
                  >
                    Configure
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">Security Logs</h2>
                <Button onClick={() => setIsSecurityLogModalOpen(true)}>
                  View Logs
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'monitoring' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">System Metrics</h2>
                <Button onClick={() => setIsSystemMetricsModalOpen(true)}>
                  View Metrics
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <UserManagementModal
        isOpen={isUserManagementModalOpen}
        onClose={() => setIsUserManagementModalOpen(false)}
        onSave={(userData) => {
          addUser({
            ...userData,
            id: Date.now().toString(),
            lastLogin: new Date().toISOString(),
          });
        }}
      />

      <SecurityLogModal
        isOpen={isSecurityLogModalOpen}
        onClose={() => setIsSecurityLogModalOpen(false)}
      />

      <SystemMetricsModal
        isOpen={isSystemMetricsModalOpen}
        onClose={() => setIsSystemMetricsModalOpen(false)}
      />

      <IPRestrictionsModal
        isOpen={isIPRestrictionsModalOpen}
        onClose={() => setIsIPRestrictionsModalOpen(false)}
        onSave={(settings) => {
          console.log('IP Restrictions settings:', settings);
          setIsIPRestrictionsModalOpen(false);
        }}
      />

      <PasswordPolicyModal
        isOpen={isPasswordPolicyModalOpen}
        onClose={() => setIsPasswordPolicyModalOpen(false)}
        onSave={(settings) => {
          console.log('Password Policy settings:', settings);
          setIsPasswordPolicyModalOpen(false);
        }}
      />
    </div>
  );
}