export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'attorney' | 'paralegal' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  pendingUsers: User[];
  pendingApproval: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpFormData) => Promise<User>;
  logout: () => void;
  approveUser: (userId: string) => Promise<void>;
  rejectUser: (userId: string, reason: string) => Promise<void>;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}