import { useQuery } from '@tanstack/react-query';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type { Product, Category, Unit, ProductListResponse, ProductFilterParams } from '../types/products.types';

// 1. Paginated & Filtered Products Query
export function useProductsQuery(params: ProductFilterParams) {
  return useQuery({
    queryKey: ['products', 'list', params],
    queryFn: async () => {
      const q = new URLSearchParams();
      q.append('page', (params.page || 1).toString());
      q.append('pageSize', (params.pageSize || 25).toString());
      if (params.search) q.append('search', params.search);
      if (params.categoryId && params.categoryId !== 'all') q.append('categoryId', params.categoryId);
      if (typeof params.isActive === 'boolean') q.append('isActive', params.isActive.toString());
      if (typeof params.inStock === 'boolean') q.append('inStock', params.inStock.toString());

      const response = await api.get<ApiResponse<ProductListResponse>>(`/products?${q.toString()}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return { items: [], totalCount: 0, pageNumber: 1, pageSize: 25 };
    },
    staleTime: 1000 * 60 * 2,
  });
}

// 2. Categories Query (Safely extract items array from ApiResponse)
export function useCategoriesQuery() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Category[] | { items: Category[] }>>('/categories?pageSize=1000');
      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
        if (response.data.data && Array.isArray((response.data.data as any).items)) {
          return (response.data.data as any).items as Category[];
        }
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
  });
}

// 3. Units Query (Safely extract items array from ApiResponse)
export function useUnitsQuery() {
  return useQuery<Unit[]>({
    queryKey: ['units'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Unit[] | { items: Unit[] }>>('/units?pageSize=1000');
      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
        if (response.data.data && Array.isArray((response.data.data as any).items)) {
          return (response.data.data as any).items as Unit[];
        }
      }
      return [];
    },
    staleTime: 1000 * 60 * 10,
  });
}

// 4. Single Product By ID Query
export function useProductByIdQuery(id?: string) {
  return useQuery({
    queryKey: ['products', 'detail', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    },
    enabled: !!id,
  });
}
