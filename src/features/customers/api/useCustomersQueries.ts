import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type {
  Customer,
  CustomerListResponse,
  AccountStatementResponse,
  CustomerFilterParams,
} from '../types/customers.types';

// 1. Paginated Customers List Query
export function useCustomersListQuery(params: CustomerFilterParams) {
  return useQuery({
    queryKey: ['customers', 'list', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      q.append('pageNumber', (params.pageNumber || 1).toString());
      q.append('pageSize', (params.pageSize || 25).toString());
      if (params.search) q.append('search', params.search);
      if (typeof params.isActive === 'boolean') q.append('isActive', params.isActive.toString());

      const response = await api.get<ApiResponse<CustomerListResponse>>(`/customers?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 25 };
    },
    staleTime: 1000 * 60 * 2,
  });
}

// 2. Customer Statement Query
export function useCustomerStatementQuery(customerId?: string | null, fromDate?: string, toDate?: string) {
  return useQuery({
    queryKey: ['customers', 'statement', customerId, fromDate, toDate],
    queryFn: async () => {
      if (!customerId) return null;
      const q = new URLSearchParams();
      if (fromDate) q.append('from', fromDate);
      if (toDate) q.append('to', toDate);

      const response = await api.get<ApiResponse<AccountStatementResponse>>(
        `/customers/${customerId}/statement?${q.toString()}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    enabled: !!customerId,
    staleTime: 1000 * 60 * 1,
  });
}

// 3. Single Customer By ID Query
export function useCustomerByIdQuery(customerId?: string) {
  return useQuery({
    queryKey: ['customers', 'detail', customerId],
    queryFn: async () => {
      if (!customerId) return null;
      const response = await api.get<ApiResponse<Customer>>(`/customers/${customerId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    enabled: !!customerId,
  });
}
