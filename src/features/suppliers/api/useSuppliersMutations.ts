import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type {
  Supplier,
  Representative,
  CreateSupplierRequest,
  UpdateSupplierRequest,
  CreateRepresentativeRequest,
  CreatePurchaseRequest,
  PurchaseResponse,
  CreatePaymentRequest,
  PaymentResponse,
} from '../types/suppliers.types';

export function useCreateSupplierMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateSupplierRequest) => {
      const response = await api.post<ApiResponse<Supplier>>('/suppliers', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشلت إضافة المورد');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تمت إضافة المورد "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء إضافة المورد');
    },
  });
}

export function useUpdateSupplierMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateSupplierRequest }) => {
      const response = await api.put<ApiResponse<Supplier>>(`/suppliers/${id}`, payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشل تعديل بيانات المورد');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم تحديث بيانات المورد "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء تعديل المورد');
    },
  });
}

export function useDeleteSupplierMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success('تم حذف المورد بنجاح');
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        err.response?.data?.message ||
        'لا يمكن حذف المورد لوجود فواتير توريد أو مستحقات مرتبطة بحسابه.'
      );
    },
  });
}

export function useAddRepresentativeMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ supplierId, payload }: { supplierId: string; payload: CreateRepresentativeRequest }) => {
      const response = await api.post<ApiResponse<Representative>>(`/suppliers/${supplierId}/representatives`, payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشلت إضافة المندوب');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تمت إضافة المندوب "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء إضافة المندوب');
    },
  });
}

export function useCreatePurchaseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, autoConfirm }: { payload: CreatePurchaseRequest; autoConfirm?: boolean }) => {
      // 1. Create Draft
      const draftRes = await api.post<ApiResponse<PurchaseResponse>>('/purchases', payload);
      if (!draftRes.data.success || !draftRes.data.data) {
        throw new Error(draftRes.data.message || 'فشل إنشاء مسودة الفاتورة');
      }
      const createdPurchase = draftRes.data.data;

      // 2. If autoConfirm requested, call confirm immediately
      if (autoConfirm) {
        const confirmRes = await api.post<ApiResponse<PurchaseResponse>>(`/purchases/${createdPurchase.id}/confirm`);
        if (!confirmRes.data.success || !confirmRes.data.data) {
          throw new Error(confirmRes.data.message || 'فشل تأكيد الفاتورة');
        }
        return confirmRes.data.data;
      }

      return createdPurchase;
    },
    onSuccess: (data) => {
      toast.success(`تم تسجيل فاتورة الشراء رقم ${data.purchaseNumber} بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء تسجيل فاتورة الشراء');
    },
  });
}

export function useDisbursePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePaymentRequest) => {
      const response = await api.post<ApiResponse<PaymentResponse>>('/payments', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشلت عملية صرف الدفعة');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم تسجيل سند الصرف بمبلغ ${data.amount.toFixed(2)} ج.م بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء صرف الدفعة');
    },
  });
}
