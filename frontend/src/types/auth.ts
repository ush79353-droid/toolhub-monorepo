export type AdminRole = 'super_admin' | 'admin';
export type AdminStatus = 'active' | 'disabled';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  lastLoginAt?: string;
  passwordChangedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthLoginResponse {
  user: AdminUser;
  sessionId: string;
  expiresAt: string;
}

