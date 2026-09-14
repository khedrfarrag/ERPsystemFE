export type UserRole = 'Owner' | 'Manager' | 'Cashier';

export interface StoreUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  storeId: string;
  createdAt: string;
}

export interface UserListResponse {
  items: StoreUser[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface StoreProfile {
  id: string;
  name: string;
  businessType: string;
  phone?: string | null;
  address?: string | null;
  currency: string;
  timezone: string;
  taxEnabled: boolean;
  allowNegativeStock: boolean;
  enableInvoiceArchiving?: boolean;
  invoicePrefix?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface UpdateStoreRequest {
  name: string;
  phone?: string | null;
  address?: string | null;
  taxEnabled: boolean;
  allowNegativeStock: boolean;
  invoicePrefix?: string | null;
  currency?: string;
  timezone?: string;
}
