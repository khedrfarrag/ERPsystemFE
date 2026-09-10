import React, { useState } from 'react';
import {
  Search,
  UserPlus,
  Shield,
  Edit2,
  CheckCircle2,
  XCircle,
  Users,
} from 'lucide-react';
import { StoreUser, UpdateUserRequest, CreateUserRequest } from '../types/settings.types';
import { CreateUserModal } from './CreateUserModal';
import { EditUserModal } from './EditUserModal';
import { useAuth } from '../../../context/AuthContext';

interface UsersTabProps {
  users: StoreUser[];
  isLoading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  onCreateUser: (data: CreateUserRequest) => Promise<any>;
  onUpdateUser: (id: string, data: UpdateUserRequest) => Promise<any>;
  onToggleStatus: (id: string, currentActive: boolean) => Promise<any>;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  users,
  isLoading,
  search,
  onSearchChange,
  onCreateUser,
  onUpdateUser,
  onToggleStatus,
}) => {
  const { user: currentUser } = useAuth();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StoreUser | null>(null);

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return isoStr;
    }
  };

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case 'Owner':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            <Shield className="w-3.5 h-3.5" />
            مالك المتجر
          </span>
        );
      case 'Manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
            مدير فرع
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            كاشير
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Bar: Search and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث بالاسم، البريد، أو الصلاحية..."
            className="w-full pr-10 pl-3 py-2.5 bg-white dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-primary-500 transition shadow-sm"
          />
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-600/30 transition flex-shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>إضافة مستخدم جديد</span>
        </button>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
          <div className="inline-block animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            جاري تحميل قائمة المستخدمين...
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            لا يوجد مستخدمون مطابقون
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            لم يتم العثور على أي موظف وفق معايير البحث الحالية.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/80 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-sm">
              <thead>
                <tr className="table-header border-b border-slate-200 dark:border-slate-700 font-bold">
                  <th className="py-3.5 px-4">الموظف</th>
                  <th className="py-3.5 px-4">البريد الإلكتروني</th>
                  <th className="py-3.5 px-4 text-center">الدور والصلاحية</th>
                  <th className="py-3.5 px-4 text-center">تاريخ التسجيل</th>
                  <th className="py-3.5 px-4 text-center">الحالة والتفعيل</th>
                  <th className="py-3.5 px-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                {users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  const isOwner = u.role === 'Owner';
                  const canToggle = !isSelf && !isOwner;

                  return (
                    <tr key={u.id} className="table-row-hover transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {u.firstName} {u.lastName}
                          {isSelf && (
                            <span className="mr-2 text-[10px] font-black px-2 py-0.5 rounded-md bg-primary-100 text-primary-800 dark:bg-primary-950/80 dark:text-primary-300">
                              أنت (الحساب الحالي)
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-xs text-slate-600 dark:text-slate-300">
                        {u.email}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {renderRoleBadge(u.role)}
                      </td>

                      <td className="py-3.5 px-4 text-center text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(u.createdAt)}
                      </td>

                      {/* Status and Single-Click Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span
                            className={
                              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold " +
                              (u.isActive
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                                : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300')
                            }
                          >
                            {u.isActive ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                نشط
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-slate-500" />
                                معطل
                              </>
                            )}
                          </span>

                          {/* Toggle Switch */}
                          <button
                            type="button"
                            disabled={!canToggle}
                            onClick={() => onToggleStatus(u.id, u.isActive)}
                            title={
                              isSelf
                                ? 'لا يمكن تعطيل الحساب الشخصي الحالي'
                                : isOwner
                                ? 'لا يمكن تعطيل حساب المالك الرئيسي'
                                : u.isActive
                                ? 'انقر لتعطيل الحساب'
                                : 'انقر لتفعيل الحساب'
                            }
                            className={
                              "relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 " +
                              (u.isActive ? 'bg-emerald-600' : 'bg-slate-400 dark:bg-slate-600')
                            }
                          >
                            <span
                              className={
                                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out " +
                                (u.isActive ? '-translate-x-4' : 'translate-x-0')
                              }
                            />
                          </button>
                        </div>
                      </td>

                      {/* Edit Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setEditingUser(u)}
                          className="p-1.5 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40 rounded-lg transition"
                          title="تعديل بيانات المستخدم"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={onCreateUser}
      />

      <EditUserModal
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onSubmit={onUpdateUser}
      />
    </div>
  );
};
