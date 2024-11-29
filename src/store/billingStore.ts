import { create } from 'zustand';
import type { Invoice } from '../types/billing';

interface BillingState {
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    caseId: '1',
    clientId: '1',
    amount: 2500,
    status: 'sent',
    dueDate: '2024-04-15',
    issueDate: '2024-03-15',
    items: [
      {
        id: '1',
        description: 'Initial consultation and case review',
        hours: 3,
        rate: 350,
        amount: 1050,
      },
      {
        id: '2',
        description: 'Document preparation and filing',
        hours: 4,
        rate: 350,
        amount: 1400,
      },
    ],
  },
  {
    id: '2',
    caseId: '2',
    clientId: '2',
    amount: 1750,
    status: 'paid',
    dueDate: '2024-03-30',
    issueDate: '2024-03-01',
    items: [
      {
        id: '3',
        description: 'Estate planning consultation',
        hours: 2.5,
        rate: 400,
        amount: 1000,
      },
      {
        id: '4',
        description: 'Will preparation',
        hours: 1.5,
        rate: 500,
        amount: 750,
      },
    ],
  },
];

const useBillingStore = create<BillingState>((set) => ({
  invoices: mockInvoices,
  addInvoice: (invoice) =>
    set((state) => ({ invoices: [...state.invoices, invoice] })),
  updateInvoice: (invoice) =>
    set((state) => ({
      invoices: state.invoices.map((i) => (i.id === invoice.id ? invoice : i)),
    })),
  deleteInvoice: (id) =>
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
    })),
}));

export default useBillingStore;