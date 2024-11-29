import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-hot-toast';
import type { AuthState, User, SignUpFormData } from '../types/auth';

const DEFAULT_ADMIN = {
  email: 'admin@test.com',
  password: '123456'
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      pendingUsers: [],
      pendingApproval: false,

      login: async (email: string, password: string) => {
        try {
          // Check for default admin credentials
          if (email === DEFAULT_ADMIN.email && password === DEFAULT_ADMIN.password) {
            const adminUser: User = {
              id: 'admin-1',
              email: DEFAULT_ADMIN.email,
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              status: 'approved',
              createdAt: new Date().toISOString(),
            };
            set({ user: adminUser, isAuthenticated: true, pendingApproval: false });
            toast.success('Welcome back, Admin!');
            return;
          }

          // Check if user exists in pending users
          const pendingUser = get().pendingUsers.find(u => u.email === email);
          if (pendingUser) {
            if (pendingUser.status === 'pending') {
              set({ pendingApproval: true });
              setTimeout(() => {
                set({ pendingApproval: false });
              }, 5000);
              throw new Error('Account pending approval');
            }
            if (pendingUser.status === 'rejected') {
              toast.error(`Account rejected: ${pendingUser.rejectionReason || 'No reason provided'}`);
              throw new Error('Account rejected');
            }
            if (pendingUser.status === 'approved') {
              set({ user: pendingUser, isAuthenticated: true, pendingApproval: false });
              toast.success('Welcome back!');
              return;
            }
          }

          toast.error('Invalid email or password');
          throw new Error('Invalid credentials');
        } catch (error) {
          throw error;
        }
      },

      signUp: async (data: SignUpFormData) => {
        try {
          const existingUser = get().pendingUsers.find(u => u.email === data.email);
          if (existingUser) {
            toast.error('An account with this email already exists');
            throw new Error('Email already exists');
          }

          const newUser: User = {
            id: Date.now().toString(),
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'attorney',
            status: 'pending',
            createdAt: new Date().toISOString(),
          };

          set(state => ({
            pendingUsers: [...state.pendingUsers, newUser],
            pendingApproval: true
          }));

          // Auto-hide pending approval message after 5 seconds
          setTimeout(() => {
            set({ pendingApproval: false });
          }, 5000);

          toast.success('Account created successfully. Waiting for admin approval.');
          return newUser;
        } catch (error) {
          throw error;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, pendingApproval: false });
        toast.success('Logged out successfully');
      },

      approveUser: async (userId: string) => {
        const adminUser = get().user;
        if (!adminUser || adminUser.role !== 'admin') {
          toast.error('Only admins can approve users');
          throw new Error('Unauthorized');
        }

        set(state => ({
          pendingUsers: state.pendingUsers.map(user => 
            user.id === userId
              ? {
                  ...user,
                  status: 'approved',
                  approvedAt: new Date().toISOString(),
                  approvedBy: adminUser.id
                }
              : user
          )
        }));

        toast.success('User approved successfully');
      },

      rejectUser: async (userId: string, reason: string) => {
        const adminUser = get().user;
        if (!adminUser || adminUser.role !== 'admin') {
          toast.error('Only admins can reject users');
          throw new Error('Unauthorized');
        }

        set(state => ({
          pendingUsers: state.pendingUsers.map(user => 
            user.id === userId
              ? {
                  ...user,
                  status: 'rejected',
                  rejectionReason: reason
                }
              : user
          )
        }));

        toast.success('User rejected successfully');
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        pendingUsers: state.pendingUsers
      })
    }
  )
);

export default useAuthStore;