import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type {
  Product,
  Category,
  Unit,
  CreateProductRequest,
  UpdateProductRequest,
  ImportPreviewResponse,
  ImportCommitResponse,
} from '../types/products.types';

export function useCreateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductRequest) => {
      const response = await api.post<ApiResponse<Product>>('/products', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشلت إضافة الصنف');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تمت إضافة الصنف "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء إضافة الصنف');
    },
  });
}

export function useUpdateProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateProductRequest }) => {
      const response = await api.put<ApiResponse<Product>>(`/products/${id}`, payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشل تعديل الصنف');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم تحديث الصنف "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء تعديل الصنف');
    },
  });
}

export function useToggleProductStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await api.patch<ApiResponse<Product>>(`/products/${id}/status`, { isActive });
      if (!response.data.success) {
        throw new Error(response.data.message || 'فشل تغيير حالة الصنف');
      }
      return { id, isActive };
    },
    onSuccess: ({ isActive }) => {
      toast.success(isActive ? 'تم تفعيل الصنف بنجاح' : 'تم تعطيل الصنف');
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء تغيير الحالة');
    },
  });
}

export function useDeleteProductMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/products/${id}`);
      return id;
    },
    onSuccess: () => {
      toast.success('تم حذف الصنف بنجاح');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(
        err.response?.data?.message ||
        'لا يمكن حذف الصنف لوجود حركات مبيعات أو مشتريات مرتبطة به. يرجى تعطيله بدلاً من ذلك.'
      );
    },
  });
}

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; description?: string | null }) => {
      const response = await api.post<ApiResponse<Category>>('/categories', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشل إنشاء القسم');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم إنشاء القسم "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء إنشاء القسم');
    },
  });
}

export function useCreateUnitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { name: string; symbol: string }) => {
      const response = await api.post<ApiResponse<Unit>>('/units', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشل إنشاء الوحدة');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تمت إضافة وحدة القياس "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['units'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء إنشاء الوحدة');
    },
  });
}

export function useImportPreviewMutation() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<ApiResponse<ImportPreviewResponse>>('/products/import/preview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشلت قراءة ملف الاستيراد');
      }
      return response.data.data;
    },
  });
}

export function useImportCommitMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post<ApiResponse<ImportCommitResponse>>('/products/import/commit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشلت معالجة الاستيراد');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم استيراد ${data.importedCount} صنف بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err.response?.data?.message || err.message || 'حدث خطأ أثناء استيراد الملف');
    },
  });
}
