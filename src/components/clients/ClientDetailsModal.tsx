import { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Briefcase, 
  DollarSign, 
  Clock, 
  AlertCircle,
  Settings,
  Building,
  Tag,
  Users
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { Client } from '../../types/client';

interface ClientDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

export default function ClientDetailsModal({
  isOpen,
  onClose,
  client,
}: ClientDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'billing' | 'documents' | 'contacts' | 'preferences'>('overview');

  if (!isOpen) return null;

  const mockCases = [
    { id: '1', title: 'Contract Dispute', status: 'active', date: '2024-03-01', attorney: 'Jane Smith' },
    { id: '2', title: 'Property Settlement', status: 'closed', date: '2024-02-15', attorney: 'John Doe' },
  ];

  const mockBilling = [
    { id: '1', amount: 2500, status: 'paid', date: '2024-03-01', description: 'Legal consultation and document review' },
    { id: '2', amount: 1800, status: 'pending', date: '2024-02-15', description: 'Court filing fees and preparation' },
  ];

  const mockDocuments = [
    { id: '1', title: 'Contract Agreement', type: 'PDF', date: '2024-03-01', size: '2.4 MB' },
    { id: '2', title: 'Court Filing', type: 'DOC', date: '2024-02-15', size: '1.8 MB' },
  ];

  const mockContacts = [
    { id: '1', name: 'Sarah Johnson', role: 'Primary Contact', phone: '(555) 123-4567', email: 'sarah@example.com' },
    { id: '2', name: 'Michael Brown', role: 'Accountant', phone: '(555) 987-6543', email: 'michael@example.com' },
  ];

  const mockPreferences = {
    communicationPreferences: {
      emailUpdates: true,
      textNotifications: false,
      mailingList: true
    },
    billingPreferences: {
      paymentMethod: 'Credit Card',
      billingCycle: 'Monthly',
      autoPayEnabled: true
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'cases', label: 'Cases', icon: Briefcase },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'documents', label: 'Documents', icon: Clock },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'preferences', label: 'Preferences', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {client.firstName} {client.lastName}
            </h2>
            <p className="text-sm text-gray-500">Client ID: {client.id}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex space-x-4 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium border-b-2 
                    ${activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg ${
                client.status === 'active' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center">
                  <AlertCircle className={`h-5 w-5 ${
                    client.status === 'active' ? 'text-green-400' : 'text-gray-400'
                  } mr-2`} />
                  <span className={`text-sm font-medium ${
                    client.status === 'active' ? 'text-green-800' : 'text-gray-800'
                  }`}>
                    {client.status === 'active' ? 'Active Client' : 'Inactive Client'}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email</label>
                    <div className="mt-1 text-sm text-gray-900">{client.email}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Phone</label>
                    <div className="mt-1 text-sm text-gray-900">{client.phone}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Address</label>
                    <div className="mt-1 text-sm text-gray-900">{client.address}</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Client Since</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {new Date(client.dateAdded).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Active Cases</div>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">3</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Total Billing</div>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">$12,500</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Documents</div>
                  <div className="mt-1 text-2xl font-semibold text-gray-900">15</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Last Activity</div>
                  <div className="mt-1 text-sm font-semibold text-gray-900">2 days ago</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">Document Uploaded</div>
                    <div className="text-sm text-gray-500">Contract revision uploaded by Jane Smith</div>
                    <div className="text-xs text-gray-400 mt-1">Today at 2:30 PM</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm font-medium text-gray-900">Meeting Scheduled</div>
                    <div className="text-sm text-gray-500">Case review meeting scheduled for next week</div>
                    <div className="text-xs text-gray-400 mt-1">Yesterday at 11:15 AM</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-4">
              {mockCases.map((caseItem) => (
                <div key={caseItem.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{caseItem.title}</div>
                    <div className="text-sm text-gray-500">
                      <span className="mr-2">Attorney: {caseItem.attorney}</span>
                      <span>Filed: {caseItem.date}</span>
                    </div>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                    caseItem.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {caseItem.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-4">
              {mockBilling.map((bill) => (
                <div key={bill.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">${bill.amount.toFixed(2)}</div>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      bill.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">{bill.description}</div>
                  <div className="text-xs text-gray-400 mt-1">{bill.date}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {mockDocuments.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{doc.title}</div>
                    <div className="text-sm text-gray-500">
                      <span className="mr-2">Added: {doc.date}</span>
                      <span>Size: {doc.size}</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded">
                    {doc.type}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="space-y-4">
              {mockContacts.map((contact) => (
                <div key={contact.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">{contact.name}</div>
                    <span className="text-sm text-gray-500">{contact.role}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {contact.phone}
                    </div>
                    <div className="flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {contact.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Communication Preferences</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email Updates</span>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      mockPreferences.communicationPreferences.emailUpdates
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {mockPreferences.communicationPreferences.emailUpdates ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Text Notifications</span>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      mockPreferences.communicationPreferences.textNotifications
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {mockPreferences.communicationPreferences.textNotifications ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Preferences</h3>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Payment Method</span>
                    <span className="text-sm font-medium text-gray-900">
                      {mockPreferences.billingPreferences.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Billing Cycle</span>
                    <span className="text-sm font-medium text-gray-900">
                      {mockPreferences.billingPreferences.billingCycle}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Auto-Pay</span>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      mockPreferences.billingPreferences.autoPayEnabled
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {mockPreferences.billingPreferences.autoPayEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}