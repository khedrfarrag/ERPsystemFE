export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  currentBalance: number; // In EGP
  notes?: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomerListResponse {
  items: Customer[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  notes?: string | null;
  openingBalance?: number | null;
}

export interface UpdateCustomerRequest {
  name: string;
  phone: string;
  address?: string | null;
  creditLimit?: number | null;
  notes?: string | null;
}

export interface CreatePaymentRequest {
  partyType: 'Customer' | 'Supplier';
  customerId?: string | null;
  supplierId?: string | null;
  amount: number;
  paymentMethod: 'Cash' | 'BankTransfer' | 'Cheque';
  referenceNumber?: string | null;
  notes?: string | null;
}

export interface PaymentResponse {
  id: string;
  partyType: string;
  customerId?: string | null;
  customerName?: string | null;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  referenceNumber?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface AccountStatementItemResponse {
  id: string;
  date: string;
  type: string;
  amount: number;
  runningBalance: number;
  referenceId?: string | null;
  notes?: string | null;
}

export interface AccountStatementResponse {
  partyId: string;
  partyName: string;
  currentBalance: number;
  transactions: AccountStatementItemResponse[];
}

export interface CustomerFilterParams {
  search?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  debtFilter?: 'all' | 'debtors' | 'overLimit' | 'zeroDebt';
}
