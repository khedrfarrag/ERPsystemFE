import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { merchantsApi, GetMerchantsParams } from '../api/merchantsApi';
import { CreateMerchantRequest, UpdateMerchantRequest } from '../types/b2b.types';
import toast from 'react-hot-toast';

export const useMerchants = (params: GetMerchantsParams = {}) => {
  return useQuery({
    queryKey: ['merchants', params],
    queryFn: () => merchantsApi.getMerchants(params),
  });
};

export const useMerchant = (id?: string) => {
  return useQuery({
    queryKey: ['merchant', id],
    queryFn: () => merchantsApi.getMerchantById(id!),
    enabled: !!id,
  });
};

export const useCurrentMerchant = () => {
  return useQuery({
    queryKey: ['merchant', 'me'],
    queryFn: () => merchantsApi.getCurrentMerchant(),
    retry: false,
  });
};

export const useMyStatement = (params: { from?: string; to?: string } = {}) => {
  return useQuery({
    queryKey: ['merchant-statement', 'me', params],
    queryFn: () => merchantsApi.getMyStatement(params),
  });
};

export const useMerchantStatement = (id?: string, params: { from?: string; to?: string } = {}) => {
  return useQuery({
    queryKey: ['merchant-statement', id, params],
    queryFn: () => merchantsApi.getStatement(id!, params),
    enabled: !!id,
  });
};

export const useCreateMerchant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMerchantRequest) => merchantsApi.createMerchant(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      toast.success('تم تسجيل تاجر الجملة بنجاح');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'حدث خطأ أثناء إضافة التاجر';
      toast.error(msg);
    },
  });
};

export const useUpdateMerchant = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMerchantRequest }) =>
      merchantsApi.updateMerchant(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      toast.success('تم تحديث بيانات التاجر بنجاح');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'حدث خطأ أثناء تحديث التاجر';
      toast.error(msg);
    },
  });
};

export const useToggleMerchantActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => merchantsApi.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchants'] });
      toast.success('تم تعديل حالة نشاط التاجر');
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || 'تعذر تعديل حالة التاجر';
      toast.error(msg);
    },
  });
};
