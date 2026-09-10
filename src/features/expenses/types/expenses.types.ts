export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}

export type PaymentMethod = 'Cash' | 'BankTransfer' | 'Cheque';

export interface ExpenseItem {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  description?: string | null;
  createdAt: string;
}

export interface ExpenseListResponse {
  items: ExpenseItem[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ExpenseFilterParams {
  categoryId?: string;
  from?: string;
  to?: string;
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  paymentMethod?: 'all' | PaymentMethod;
}

export interface CashRegisterSummary {
  currentBalance: number;
  lastFloatDate?: string | null;
  lastFloatAmount?: number | null;
  todayInflows: number;
  todayOutflows: number;
  isShiftOpen?: boolean;
}

export interface CashRegisterCloseResult {
  expectedBalance: number;
  countedAmount: number;
  discrepancy: number;
  notes?: string | null;
  closedAt: string;
}

export interface CashRegisterTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  referenceId?: string | null;
  notes?: string | null;
}

export interface CreateExpenseRequest {
  categoryId: string;
  amount: number;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  description?: string | null;
}

export interface CreateExpenseCategoryRequest {
  name: string;
  description?: string | null;
}

export interface OpenFloatRequest {
  amount: number;
  notes?: string | null;
}

export interface CloseRegisterRequest {
  countedAmount: number;
  notes?: string | null;
}
