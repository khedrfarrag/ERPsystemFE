import React, { useState, useEffect } from 'react';
import { X, UserCheck, User, ShieldCheck } from 'lucide-react';
import { StoreUser, UpdateUserRequest, UserRole } from '../types/settings.types';
import { useAuth } from '../../../context/AuthContext';

interface EditUserModalProps {
  user: StoreUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateUserRequest) => Promise<any>;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.role === 'Owner';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<UserRole>('Cashier');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setRole(user.role);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const isTargetOwner = user.role === 'Owner';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(user.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: isTargetOwner ? 'Owner' : role,
      });
      onClose();
    } catch {
      // toast is already displayed
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn select-none">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                تعديل بيانات المستخدم
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الاسم الأول
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم العائلة
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              الدور والصلاحية
            </label>
            <div className="relative">
              <ShieldCheck className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <select
                disabled={isTargetOwner || !isOwner}
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isTargetOwner && <option value="Owner">مالك النظام (Owner)</option>}
                <option value="Cashier">كاشير (Cashier)</option>
                <option value="Manager">مدير فرع (Manager)</option>
              </select>
            </div>
            {isTargetOwner && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                * لا يمكن تغيير دور مالك المتجر الرئيسي.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-600/30 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري الحفظ...</span>
                </>
              ) : (
                <span>حفظ التعديلات</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
