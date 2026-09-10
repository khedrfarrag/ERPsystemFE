import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import api from '../../../api/client';
import type { ApiResponse } from '../../../types';
import type {
  CreateExpenseRequest,
  ExpenseItem,
  CreateExpenseCategoryRequest,
  ExpenseCategory,
  OpenFloatRequest,
  CloseRegisterRequest,
  CashRegisterCloseResult,
  CashRegisterTransaction,
} from '../types/expenses.types';

export function useCreateExpenseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateExpenseRequest) => {
      const response = await api.post<ApiResponse<ExpenseItem>>('/expenses', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشل تسجيل المصروف');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم تسجيل مصروف بمبلغ ${data.amount.toLocaleString('ar-EG')} ج.م بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['cash-register'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء تسجيل المصروف');
    },
  });
}

export function useCreateExpenseCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateExpenseCategoryRequest) => {
      const response = await api.post<ApiResponse<ExpenseCategory>>('/expenses/categories', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشل إنشاء تصنيف المصروف');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم إضافة قسم "${data.name}" بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['expense-categories'] });
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء إنشاء القسم');
    },
  });
}

export function useOpenFloatMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OpenFloatRequest) => {
      const response = await api.post<ApiResponse<CashRegisterTransaction>>('/cash-register/open', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشل فتح الوردية / تسجيل العهدة');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      toast.success(`تم فتح الوردية بعهدة ${data.amount.toLocaleString('ar-EG')} ج.م بنجاح`);
      queryClient.invalidateQueries({ queryKey: ['cash-register'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء فتح الوردية');
    },
  });
}

export function useCloseRegisterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CloseRegisterRequest) => {
      const response = await api.post<ApiResponse<CashRegisterCloseResult>>('/cash-register/close', payload);
      if (!response.data.success || !response.data.data) {
        throw new Error(response.data.message || 'فشل تقفيل الوردية وتسوية الدرج');
      }
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data.discrepancy === 0) {
        toast.success('تم تقفيل الوردية وتسوية الدرج بنجاح: النقدية مطابقة تماماً (0.00 ج.م)');
      } else if (data.discrepancy < 0) {
        toast.error(`تم تقفيل الوردية مع وجود عجز نقدي بقيمة ${Math.abs(data.discrepancy).toLocaleString('ar-EG')} ج.م`);
      } else {
        toast.success(`تم تقفيل الوردية مع وجود زيادة نقدية بقيمة ${data.discrepancy.toLocaleString('ar-EG')} ج.م`);
      }
      queryClient.invalidateQueries({ queryKey: ['cash-register'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'حدث خطأ أثناء تقفيل الوردية');
    },
  });
}
