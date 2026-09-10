import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type {
  SalesSummaryReport,
  ProfitLossReport,
  InventoryValuationReport,
  ProductStockMovementReport,
  CustomerBalancesReport,
  SupplierBalancesReport,
  CashRegisterAuditReport,
} from '../types/reports.types';

export function useSalesReportQuery(from?: string, to?: string) {
  return useQuery<SalesSummaryReport | null>({
    queryKey: ['reports', 'sales', { from, to }],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (from) q.append('from', from);
      if (to) q.append('to', to);
      const response = await api.get<ApiResponse<SalesSummaryReport>>(`/reports/sales?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    staleTime: 1000 * 60 * 3,
  });
}

export function useProfitLossReportQuery(from?: string, to?: string) {
  return useQuery<ProfitLossReport | null>({
    queryKey: ['reports', 'profit-loss', { from, to }],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (from) q.append('from', from);
      if (to) q.append('to', to);
      const response = await api.get<ApiResponse<ProfitLossReport>>(`/reports/profit-loss?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    staleTime: 1000 * 60 * 3,
  });
}

export function useInventoryValuationQuery(asOfDate?: string, categoryId?: string) {
  return useQuery<InventoryValuationReport | null>({
    queryKey: ['reports', 'inventory-valuation', { asOfDate, categoryId }],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (asOfDate) q.append('asOfDate', asOfDate);
      if (categoryId && categoryId !== 'all') q.append('categoryId', categoryId);
      const response = await api.get<ApiResponse<InventoryValuationReport>>(`/reports/inventory/valuation?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useProductStockMovementQuery(productId?: string | null, from?: string, to?: string) {
  return useQuery<ProductStockMovementReport | null>({
    queryKey: ['reports', 'inventory', 'movement', productId, { from, to }],
    queryFn: async () => {
      if (!productId) return null;
      const q = new URLSearchParams();
      if (from) q.append('from', from);
      if (to) q.append('to', to);
      const response = await api.get<ApiResponse<ProductStockMovementReport>>(`/reports/inventory/movement/${productId}?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    enabled: !!productId,
    staleTime: 1000 * 60 * 3,
  });
}

export function useCustomerBalancesReportQuery(hasBalanceOnly = true) {
  return useQuery<CustomerBalancesReport | null>({
    queryKey: ['reports', 'balances', 'customers', { hasBalanceOnly }],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CustomerBalancesReport>>(`/reports/balances/customers?hasBalanceOnly=${hasBalanceOnly}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    staleTime: 1000 * 60 * 3,
  });
}

export function useSupplierBalancesReportQuery(hasBalanceOnly = true) {
  return useQuery<SupplierBalancesReport | null>({
    queryKey: ['reports', 'balances', 'suppliers', { hasBalanceOnly }],
    queryFn: async () => {
      const response = await api.get<ApiResponse<SupplierBalancesReport>>(`/reports/balances/suppliers?hasBalanceOnly=${hasBalanceOnly}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    staleTime: 1000 * 60 * 3,
  });
}

export function useCashRegisterAuditQuery(from?: string, to?: string) {
  return useQuery<CashRegisterAuditReport | null>({
    queryKey: ['reports', 'cash-register', { from, to }],
    queryFn: async () => {
      const q = new URLSearchParams();
      if (from) q.append('from', from);
      if (to) q.append('to', to);
      const response = await api.get<ApiResponse<CashRegisterAuditReport>>(`/reports/cash-register?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    staleTime: 1000 * 60 * 3,
  });
}
