import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CaseMenu } from '../components/cases/CaseMenu';
import NewCaseModal from '../components/cases/NewCaseModal';
import CaseDetailsModal from '../components/cases/CaseDetailsModal';
import EditCaseModal from '../components/cases/EditCaseModal';
import ClientDetailsModal from '../components/clients/ClientDetailsModal';
import CreateInvoiceModal from '../components/billing/CreateInvoiceModal';
import { useSearch } from '../hooks/useSearch';
import useCaseStore from '../store/caseStore';
import useClientStore from '../store/clientStore';
import useBillingStore from '../store/billingStore';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import type { Case } from '../types/case';
import type { Client } from '../types/client';

export default function Cases() {
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] = useState(false);
  const [invoiceCase, setInvoiceCase] = useState<Case | null>(null);
  
  const navigate = useNavigate();
  const { cases, addCase, updateCase, deleteCase } = useCaseStore();
  const { clients } = useClientStore();
  const { addInvoice } = useBillingStore();

  const { searchQuery, filteredItems: filteredCases, handleSearch } = useSearch({
    items: cases,
    searchFields: ['title', 'caseNumber', 'clientName', 'assignedAttorney']
  });

  const handleEditCase = (caseItem: Case) => {
    setEditingCase(caseItem);
  };

  const handleSaveEdit = (updatedCase: Case) => {
    updateCase(updatedCase);
    setEditingCase(null);
  };

  const handleDeleteCase = (caseId: string) => {
    if (confirm('Are you sure you want to delete this case?')) {
      deleteCase(caseId);
    }
  };

  const handleViewDetails = (caseItem: Case) => {
    setSelectedCase(caseItem);
  };

  const handleViewClientDetails = (clientName: string) => {
    const client = clients.find(c => `${c.firstName} ${c.lastName}` === clientName);
    if (client) {
      setSelectedClient(client);
    }
  };

  const handleCreateInvoice = (caseItem: Case) => {
    setInvoiceCase(caseItem);
    setIsCreateInvoiceModalOpen(true);
  };

  const handleSaveInvoice = (invoiceData: any) => {
    const newInvoice = {
      ...invoiceData,
      id: Date.now().toString(),
    };
    addInvoice(newInvoice);
    navigate('/dashboard/billing');
  };

  const handleUpdateStatus = (caseItem: Case) => {
    console.log('Update case status:', caseItem);
  };

  const handleSaveNewCase = async (caseData: Omit<Case, 'id'>) => {
    try {
      const newCase: Case = {
        ...caseData,
        id: Date.now().toString(),
      };
      await addCase(newCase);
      setIsNewCaseModalOpen(false);
    } catch (error) {
      console.error('Error creating case:', error);
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Cases</h1>
        <Button onClick={() => setIsNewCaseModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Case
        </Button>
      </div>

      <div className="mt-4">
        <Input
          type="text"
          placeholder="Search cases by title, number, client, or attorney..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      <div className="mt-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Case Title</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Case Number</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Client</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Attorney</th>
                <th className="relative py-3.5 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCases.map((caseItem) => (
                <tr key={caseItem.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3">
                    <button
                      onClick={() => handleViewDetails(caseItem)}
                      className="text-left hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
                    >
                      <div className="font-medium text-gray-900">
                        {caseItem.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {caseItem.practiceArea}
                      </div>
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{caseItem.caseNumber}</td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <button
                      onClick={() => handleViewClientDetails(caseItem.clientName)}
                      className="text-gray-500 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
                    >
                      {caseItem.clientName}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      caseItem.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : caseItem.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {caseItem.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{caseItem.assignedAttorney}</td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <CaseMenu
                      case={caseItem}
                      onEdit={handleEditCase}
                      onDelete={handleDeleteCase}
                      onViewDetails={handleViewDetails}
                      onCreateInvoice={handleCreateInvoice}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onSave={handleSaveNewCase}
      />

      {selectedCase && (
        <CaseDetailsModal
          isOpen={true}
          onClose={() => setSelectedCase(null)}
          caseItem={selectedCase}
          onCreateInvoice={handleCreateInvoice}
        />
      )}

      {editingCase && (
        <EditCaseModal
          isOpen={true}
          onClose={() => setEditingCase(null)}
          onSave={handleSaveEdit}
          caseItem={editingCase}
        />
      )}

      {selectedClient && (
        <ClientDetailsModal
          isOpen={true}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
        />
      )}

      {isCreateInvoiceModalOpen && invoiceCase && (
        <CreateInvoiceModal
          isOpen={true}
          onClose={() => {
            setIsCreateInvoiceModalOpen(false);
            setInvoiceCase(null);
          }}
          onSave={handleSaveInvoice}
          caseData={invoiceCase}
        />
      )}
    </div>
  );
}