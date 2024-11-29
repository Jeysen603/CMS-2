import { create } from 'zustand';
import type { SystemSettings, UserManagement } from '../types/settings';

interface SettingsState {
  systemSettings: SystemSettings;
  users: UserManagement[];
  updateSystemSettings: (settings: Partial<SystemSettings>) => void;
  addUser: (user: UserManagement) => void;
  updateUser: (user: UserManagement) => void;
  deleteUser: (userId: string) => void;
}

const mockUsers: UserManagement[] = [
  {
    id: '1',
    email: 'john.doe@lawfirm.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-03-15T10:30:00',
  },
  {
    id: '2',
    email: 'jane.smith@lawfirm.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'attorney',
    status: 'active',
    lastLogin: '2024-03-14T15:45:00',
  },
];

const defaultSettings: SystemSettings = {
  companyName: 'Law Firm CMS',
  address: '123 Legal Street, Suite 100',
  phone: '(555) 123-4567',
  email: 'contact@lawfirm.com',
  billingRate: 350,
  defaultDueDate: 30,
  emailNotifications: true,
  automaticBackups: true,
};

const useSettingsStore = create<SettingsState>((set) => ({
  systemSettings: defaultSettings,
  users: mockUsers,
  updateSystemSettings: (settings) =>
    set((state) => ({
      systemSettings: { ...state.systemSettings, ...settings },
    })),
  addUser: (user) =>
    set((state) => ({ users: [...state.users, user] })),
  updateUser: (user) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === user.id ? user : u)),
    })),
  deleteUser: (userId) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== userId),
    })),
}));

export default useSettingsStore;