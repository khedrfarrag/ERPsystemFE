import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type {
  Customer,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CreatePaymentRequest,
  PaymentResponse,
} from '../types/customers.types';

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateCustomerRequest) => {
      const response = await api.post<ApiResponse<Customer>>('/customers', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشلت إضافة العميل');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تمت إضافة العميل "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء إضافة العميل');
    },
  });
}

export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateCustomerRequest }) => {
      const response = await api.put<ApiResponse<Customer>>(`/customers/${id}`, payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشل تعديل بيانات العميل');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم تحديث بيانات العميل "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء تعديل العميل');
    },
  });
}

export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/customers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('تم حذف العميل بنجاح');
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        err.response?.data?.message ||
        'لا يمكن حذف العميل لوجود مبيعات أو مديونيات مرتبطة بحسابه.'
      );
    },
  });
}

export function useReceivePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePaymentRequest) => {
      const response = await api.post<ApiResponse<PaymentResponse>>('/payments', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشلت عملية تسجيل السداد');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم تسجيل سند القبض بمبلغ ${data.amount.toFixed(2)} ج.م بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء تسجيل السداد');
    },
  });
}
