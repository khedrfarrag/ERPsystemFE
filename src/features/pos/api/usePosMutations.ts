import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type { CreateSaleRequestPayload, SaleResponseData } from '../types/pos.types';

export function useCreateSaleMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSaleRequestPayload) => {
      const response = await api.post<ApiResponse<SaleResponseData>>('/sales', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشلت عملية حفظ الفاتورة');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم إصدار الفاتورة رقم ${data.invoiceNumber} بنجاح`, {
        duration: 4000,
        position: 'top-center',
      });

      // Invalidate related server state caches immediately
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['sales'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string; errors?: string[] } }; message?: string };
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        err.message ||
        'حدث خطأ أثناء معالجة الفاتورة';

      toast.error(errorMsg, {
        duration: 5000,
        position: 'top-center',
      });
    },
  });
}
