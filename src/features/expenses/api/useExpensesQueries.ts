import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type {
  ExpenseCategory,
  ExpenseListResponse,
  ExpenseFilterParams,
  CashRegisterSummary,
  CashRegisterTransaction,
} from '../types/expenses.types';

// 1. List Expense Categories
export function useExpenseCategoriesQuery(isActive?: boolean) {
  return useQuery<ExpenseCategory[]>({
    queryKey: ['expense-categories', { isActive }],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (typeof isActive === 'boolean') q.append('isActive', isActive.toString());
      const response = await api.get<ApiResponse<ExpenseCategory[] | { items: ExpenseCategory[] }>>(
        `/expenses/categories?${q.toString()}`
      );
      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray((response.data.data as any).items)) return (response.data.data as any).items;
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
  });
}

// 2. Paginated Expenses Query
export function useExpensesListQuery(params: ExpenseFilterParams) {
  return useQuery<ExpenseListResponse>({
    queryKey: ['expenses', 'list', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      q.append('pageNumber', (params.pageNumber || 1).toString());
      q.append('pageSize', (params.pageSize || 20).toString());
      if (params.categoryId && params.categoryId !== 'all') q.append('categoryId', params.categoryId);
      if (params.from) q.append('from', params.from);
      if (params.to) q.append('to', params.to);

      const response = await api.get<ApiResponse<ExpenseListResponse>>(`/expenses?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 20 };
    },
    staleTime: 1000 * 60 * 2,
  });
}

// 3. Live Cash Register Summary Query
export function useCashRegisterSummaryQuery() {
  return useQuery<CashRegisterSummary | null>({
    queryKey: ['cash-register', 'summary'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CashRegisterSummary>>('/cash-register/current');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 30,
  });
}

// 4. Cash Register Transactions History Query
export function useCashRegisterTransactionsQuery(from?: string, to?: string) {
  return useQuery<CashRegisterTransaction[]>({
    queryKey: ['cash-register', 'transactions', { from, to }],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (from) q.append('from', from);
      if (to) q.append('to', to);
      const response = await api.get<ApiResponse<CashRegisterTransaction[] | { items: CashRegisterTransaction[] }>>(
        `/cash-register/transactions?${q.toString()}`
      );
      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) return response.data.data;
        if (Array.isArray((response.data.data as any).items)) return (response.data.data as any).items;
      }
      return [];
    },
    staleTime: 1000 * 60 * 2,
  });
}
