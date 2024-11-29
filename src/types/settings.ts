export interface UserManagement {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'attorney' | 'paralegal' | 'admin';
  status: 'active' | 'inactive';
  lastLogin: string;
}

export interface SystemSettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
  billingRate: number;
  defaultDueDate: number; // days
  emailNotifications: boolean;
  automaticBackups: boolean;
}

export interface PasswordPolicySettings {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  passwordExpiration: number;
  preventReuseCount: number;
  maxAttempts: number;
  lockoutDuration: number;
}

export interface IPRestrictionSettings {
  enabled: boolean;
  allowedIPs: string[];
  allowedRanges: string[];
  blockUnknownIPs: boolean;
}