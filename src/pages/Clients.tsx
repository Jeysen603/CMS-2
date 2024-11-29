import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ClientMenu } from '../components/clients/ClientMenu';
import NewClientModal from '../components/clients/NewClientModal';
import EditClientModal from '../components/clients/EditClientModal';
import ClientDetailsModal from '../components/clients/ClientDetailsModal';
import { useSearch } from '../hooks/useSearch';
import useClientStore from '../store/clientStore';
import useAuthStore from '../store/authStore';
import { Toaster } from 'react-hot-toast';
import type { Client } from '../types/client';

export default function Clients() {
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const { clients, addClient, updateClient, deleteClient } = useClientStore();
  const { user } = useAuthStore();

  const { searchQuery, filteredItems: filteredClients, handleSearch } = useSearch({
    items: clients,
    searchFields: ['firstName', 'lastName', 'email', 'phone']
  });

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const handleSaveEdit = (updatedClient: Client) => {
    updateClient(updatedClient);
    setEditingClient(null);
  };

  const handleDeleteClient = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client?')) {
      deleteClient(clientId);
    }
  };

  const handleViewDetails = (client: Client) => {
    setSelectedClient(client);
  };

  const handleSaveNewClient = (clientData: Omit<Client, 'id'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
    };
    addClient(newClient);
    setIsNewClientModalOpen(false);
  };

  const handleClientNameClick = (client: Client) => {
    setSelectedClient(client);
  };

  return (
    <div>
      <Toaster position="top-right" />
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
        <Button onClick={() => setIsNewClientModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      <div className="mt-4">
        <Input
          type="text"
          placeholder="Search clients by name, email, or phone..."
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
                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Phone</th>
                <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="relative py-3.5 pl-3 pr-4">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id}>
                  <td className="whitespace-nowrap py-4 pl-4 pr-3">
                    <button
                      onClick={() => handleClientNameClick(client)}
                      className="font-medium text-gray-900 hover:text-indigo-600 focus:outline-none focus:text-indigo-600"
                    >
                      {client.firstName} {client.lastName}
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{client.email}</td>
                  <td className="whitespace-nowrap px-3 py-4 text-gray-500">{client.phone}</td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      client.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    <ClientMenu
                      client={client}
                      onEdit={handleEditClient}
                      onDelete={handleDeleteClient}
                      onViewDetails={handleViewDetails}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <NewClientModal
        isOpen={isNewClientModalOpen}
        onClose={() => setIsNewClientModalOpen(false)}
        onSave={handleSaveNewClient}
      />

      {editingClient && user && (
        <EditClientModal
          isOpen={true}
          onClose={() => setEditingClient(null)}
          onSave={handleSaveEdit}
          client={editingClient}
          currentUserId={user.id}
        />
      )}

      {selectedClient && (
        <ClientDetailsModal
          isOpen={true}
          onClose={() => setSelectedClient(null)}
          client={selectedClient}
        />
      )}
    </div>
  );
}