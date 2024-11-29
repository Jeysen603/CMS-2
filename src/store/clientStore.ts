import { create } from 'zustand';
import { toast } from 'react-hot-toast';
import type { Client } from '../types/client';

interface ClientState {
  clients: Client[];
  addClient: (client: Client) => Promise<void>;
  updateClient: (client: Client) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
}

const mockClients: Client[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, City, State 12345',
    dateAdded: '2024-01-15',
    status: 'active',
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@example.com',
    phone: '(555) 987-6543',
    address: '456 Oak Ave, City, State 12345',
    dateAdded: '2024-02-01',
    status: 'active',
  },
];

const useClientStore = create<ClientState>((set, get) => ({
  clients: mockClients,
  addClient: async (client) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({ clients: [...state.clients, client] }));
      toast.success('Client added successfully');
    } catch (error) {
      toast.error('Failed to add client');
      throw error;
    }
  },
  updateClient: async (client) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({
        clients: state.clients.map((c) => (c.id === client.id ? client : c)),
      }));
      toast.success('Client updated successfully');
    } catch (error) {
      toast.error('Failed to update client');
      throw error;
    }
  },
  deleteClient: async (id) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set((state) => ({
        clients: state.clients.filter((c) => c.id !== id),
      }));
      toast.success('Client deleted successfully');
    } catch (error) {
      toast.error('Failed to delete client');
      throw error;
    }
  },
  getClientById: (id) => get().clients.find((client) => client.id === id),
}));

export default useClientStore;