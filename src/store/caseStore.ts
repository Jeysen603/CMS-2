import { create } from 'zustand';
import type { Case } from '../types/case';

interface CaseState {
  cases: Case[];
  addCase: (caseData: Case) => Promise<void>;
  updateCase: (caseData: Case) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  getCaseById: (id: string) => Case | undefined;
}

const mockCases: Case[] = [
  {
    id: '1',
    title: 'Smith v. Johnson',
    caseNumber: 'CV-2024-001',
    clientName: 'John Smith',
    status: 'active',
    practiceArea: 'Civil Litigation',
    assignedAttorney: 'Jane Doe',
    openDate: '2024-01-15',
    description: 'Contract dispute case',
    priority: 'high',
    dueDate: '2024-06-15',
    type: 'civil'
  },
  {
    id: '2',
    title: 'Estate of Williams',
    caseNumber: 'PR-2024-003',
    clientName: 'Sarah Williams',
    status: 'pending',
    practiceArea: 'Probate',
    assignedAttorney: 'John Doe',
    openDate: '2024-02-01',
    description: 'Estate administration',
    priority: 'medium',
    dueDate: '2024-07-01',
    type: 'estate'
  },
];

const useCaseStore = create<CaseState>((set, get) => ({
  cases: mockCases,
  addCase: async (caseData) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    set((state) => ({ cases: [...state.cases, caseData] }));
  },
  updateCase: async (caseData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    set((state) => ({
      cases: state.cases.map((c) => (c.id === caseData.id ? caseData : c)),
    }));
  },
  deleteCase: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    set((state) => ({
      cases: state.cases.filter((c) => c.id !== id),
    }));
  },
  getCaseById: (id) => get().cases.find((c) => c.id === id),
}));

export default useCaseStore;