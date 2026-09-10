import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type { PosProduct, CustomerCreditInfo } from '../types/pos.types';

interface ProductListResponse {
  items: PosProduct[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

interface CustomerListResponse {
  items: CustomerCreditInfo[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  description?: string;
}

// 1. Fetch Product Catalog
export function useProductsCatalogQuery(search?: string, categoryId?: string) {
  return useQuery({
    queryKey: ['products', 'catalog', { search, categoryId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', '1');
      params.append('pageSize', '100');
      params.append('isActive', 'true');
      if (search) params.append('search', search);
      if (categoryId) params.append('categoryId', categoryId);

      const response = await api.get<ApiResponse<ProductListResponse>>(`/products?${params.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data.items || [];
      }
      return [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// 2. Fetch Categories (Safely extract array)
export function useCategoriesQuery() {
  return useQuery<CategoryItem[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<CategoryItem[] | { items: CategoryItem[] }>>('/categories?pageSize=1000');
      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
        if (response.data.data && Array.isArray((response.data.data as any).items)) {
          return (response.data.data as any).items as CategoryItem[];
        }
      }
      return [];
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

// 3. Fetch Customers with Credit Info
export function useCustomersQuery(search?: string) {
  return useQuery({
    queryKey: ['customers', { search }],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('pageNumber', '1');
      params.append('pageSize', '50');
      params.append('isActive', 'true');
      if (search) params.append('search', search);

      const response = await api.get<ApiResponse<CustomerListResponse>>(`/customers?${params.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data.items || [];
      }
      return [];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

// 4. Fetch Product by Barcode Lookup
export async function fetchProductByBarcode(barcode: string): Promise<PosProduct | null> {
  try {
    const response = await api.get<ApiResponse<PosProduct>>(`/products/barcode/${encodeURIComponent(barcode)}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    console.error('Barcode lookup failed', error);
    return null;
  }
}
