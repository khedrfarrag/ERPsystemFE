import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type {
  Supplier,
  SupplierListResponse,
  PurchaseListResponse,
  AccountStatementResponse,
  SupplierFilterParams,
} from '../types/suppliers.types';

// 1. Paginated Suppliers Query
export function useSuppliersListQuery(params: SupplierFilterParams) {
  return useQuery({
    queryKey: ['suppliers', 'list', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      q.append('pageNumber', (params.pageNumber || 1).toString());
      q.append('pageSize', (params.pageSize || 25).toString());
      if (params.search) q.append('search', params.search);

      const response = await api.get<ApiResponse<SupplierListResponse>>(`/suppliers?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 25 };
    },
    staleTime: 1000 * 60 * 2,
  });
}

// 2. Supplier Statement Query
export function useSupplierStatementQuery(supplierId?: string | null, fromDate?: string, toDate?: string) {
  return useQuery({
    queryKey: ['suppliers', 'statement', supplierId, fromDate, toDate],
    queryFn: async () => {
      if (!supplierId) return null;
      const q = new URLSearchParams();
      if (fromDate) q.append('from', fromDate);
      if (toDate) q.append('to', toDate);

      const response = await api.get<ApiResponse<AccountStatementResponse>>(
        `/suppliers/${supplierId}/statement?${q.toString()}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    enabled: !!supplierId,
    staleTime: 1000 * 60 * 1,
  });
}

// 3. Supplier Purchases List Query
export function usePurchasesListQuery(supplierId?: string) {
  return useQuery({
    queryKey: ['purchases', 'list', supplierId],
    queryFn: async () => {
      const q = new URLSearchParams();
      q.append('pageNumber', '1');
      q.append('pageSize', '50');
      if (supplierId) q.append('supplierId', supplierId);

      const response = await api.get<ApiResponse<PurchaseListResponse>>(`/purchases?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data.items || [];
      }
      return [];
    },
    staleTime: 1000 * 60 * 2,
  });
}
