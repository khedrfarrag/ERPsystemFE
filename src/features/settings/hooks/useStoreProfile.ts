import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { settingsApi } from '../api/settingsApi';
import { StoreProfile, UpdateStoreRequest } from '../types/settings.types';

export const useStoreProfile = () => {
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchStore = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await settingsApi.getStoreProfile();
      setStore(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'فشل في تحميل بيانات المتجر';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  const updateStore = async (data: UpdateStoreRequest): Promise<StoreProfile> => {
    setIsSaving(true);
    try {
      const updated = await settingsApi.updateStoreProfile(data);
      setStore(updated);
      toast.success('تم حفظ إعدادات وبيانات المتجر بنجاح');

      // Synchronize branding in localStorage if user cached
      try {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
          const userObj = JSON.parse(rawUser);
          userObj.storeName = updated.name;
          localStorage.setItem('user', JSON.stringify(userObj));
          // Dispatch custom event to notify Sidebar/Header
          window.dispatchEvent(new CustomEvent('retailos:store-updated', { detail: updated }));
        }
      } catch {
        // ignore
      }

      return updated;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'فشل في حفظ إعدادات المتجر';
      toast.error(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    store,
    isLoading,
    isSaving,
    refetchStore: fetchStore,
    updateStore,
  };
};
