import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { api } from '../../../api/client';
import type {
  InvoiceScanPreviewResponse,
  CommitAiInvoiceRequest,
  CommitAiInvoiceResponse,
  AiInvoiceSettings,
} from '../types/ai-invoice.types';

export const useAiInvoiceSettingsQuery = () => {
  return useQuery<AiInvoiceSettings>({
    queryKey: ['ai-invoice-settings'],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: AiInvoiceSettings }>('/ai/invoices/settings');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useScanInvoiceMutation = () => {
  return useMutation<
    InvoiceScanPreviewResponse,
    any,
    { file: File; markupPercent?: number }
  >({
    mutationFn: async ({ file, markupPercent = 25 }) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{ success: boolean; data: InvoiceScanPreviewResponse }>(
        `/ai/invoices/scan?markupPercent=${markupPercent}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data.data;
    },
  });
};

export const useCommitInvoiceMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<CommitAiInvoiceResponse, any, CommitAiInvoiceRequest>({
    mutationFn: async (request) => {
      const response = await api.post<{ success: boolean; data: CommitAiInvoiceResponse }>(
        '/ai/invoices/commit',
        request
      );
      return response.data.data;
    },
    onSuccess: (data) => {
      // Invalidate relevant caches to trigger immediate UI refresh
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });

      toast.success(data.message || 'تم حفظ ومعالجة الفاتورة بنجاح!');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || 'حدث خطأ أثناء حفظ الفاتورة.';
      toast.error(msg);
    },
  });
};
