import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { settingsApi } from '../api/settingsApi';
import { StoreUser, CreateUserRequest, UpdateUserRequest } from '../types/settings.types';

export const useUsers = () => {
  const [users, setUsers] = useState<StoreUser[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await settingsApi.getUsers(page, pageSize);
      setUsers(data.items || []);
      setTotalCount(data.totalCount || 0);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'فشل في تحميل قائمة المستخدمين';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users;
    const term = search.trim().toLowerCase();
    return users.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      const email = u.email.toLowerCase();
      const role = u.role.toLowerCase();
      return fullName.includes(term) || email.includes(term) || role.includes(term);
    });
  }, [users, search]);

  const createUser = async (data: CreateUserRequest): Promise<StoreUser> => {
    try {
      const created = await settingsApi.createUser(data);
      toast.success(`تم إنشاء حساب ${created.firstName} ${created.lastName} بنجاح`);
      await fetchUsers();
      return created;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'حدث خطأ أثناء إنشاء المستخدم';
      toast.error(msg);
      throw err;
    }
  };

  const updateUser = async (id: string, data: UpdateUserRequest): Promise<StoreUser> => {
    try {
      const updated = await settingsApi.updateUser(id, data);
      toast.success(`تم تحديث بيانات ${updated.firstName} بنجاح`);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      return updated;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'حدث خطأ أثناء تحديث المستخدم';
      toast.error(msg);
      throw err;
    }
  };

  const toggleUserStatus = async (id: string, currentActive: boolean): Promise<boolean> => {
    const nextActive = !currentActive;
    try {
      const updated = await settingsApi.updateUserStatus(id, nextActive);
      setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
      toast.success(
        nextActive
          ? `تم تفعيل حساب ${updated.firstName}`
          : `تم تعطيل حساب ${updated.firstName}`
      );
      return true;
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'فشل في تغيير حالة المستخدم';
      toast.error(msg);
      return false;
    }
  };

  return {
    users: filteredUsers,
    rawUsers: users,
    totalCount,
    page,
    pageSize,
    isLoading,
    search,
    setSearch,
    setPage,
    setPageSize,
    refetchUsers: fetchUsers,
    createUser,
    updateUser,
    toggleUserStatus,
  };
};
