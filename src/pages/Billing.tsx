import { useState } from 'react';
import { Plus, Search, FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { BillingMenu } from '../components/billing/BillingMenu';
import NewInvoiceModal from '../components/billing/NewInvoiceModal';
import useBillingStore from '../store/billingStore';
import type { Invoice } from '../types/billing';

export default function Billing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const { invoices, addInvoice, updateInvoice, deleteInvoice } = useBillingStore();

  const handleEditInvoice = (invoice: Invoice) => {
    console.log('Edit invoice:', invoice);
  };

  const handleDeleteInvoice = (invoiceId: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      deleteInvoice(invoiceId);
    }
  };

  const handleViewDetails = (invoice: Invoice) => {
    console.log('View invoice details:', invoice);
  };

  const handleSendInvoice = (invoice: Invoice) => {
    console.log('Send invoice to client:', invoice);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice PDF:', invoice);
  };

  const handleMarkAsPaid = (invoice: Invoice) => {
    const updatedInvoice = { ...invoice, status: 'paid' as const };
    updateInvoice(updatedInvoice);
  };

  const handleSaveNewInvoice = (invoiceData: Omit<Invoice, 'id'>) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
    };
    addInvoice(newInvoice);
    setIsNewInvoiceModalOpen(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'overdue':
        return <Clock className="h-5 w-5 text-red-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'sent':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Billing & Invoices</h1>
        <Button onClick={() => setIsNewInvoiceModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Invoice
        </Button>
      </div>

      <div className="mt-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search invoices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Invoice</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Due Date</th>
                <th className="relative py-3.5 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="font-medium text-gray-900">#{invoice.id}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(invoice.issueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                    Client #{invoice.clientId}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-900 font-medium">
                    ${invoice.amount.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusStyle(invoice.status)}`}>
                      <span className="mr-1">{getStatusIcon(invoice.status)}</span>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <BillingMenu
                      invoice={invoice}
                      onEdit={handleEditInvoice}
                      onDelete={handleDeleteInvoice}
                      onViewDetails={handleViewDetails}
                      onSend={handleSendInvoice}
                      onDownload={handleDownloadInvoice}
                      onMarkAsPaid={handleMarkAsPaid}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewInvoiceModal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
        onSave={handleSaveNewInvoice}
      />
    </div>
  );
}