import React, { useState } from 'react';
import { X, UserPlus, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { CreateUserRequest, UserRole } from '../types/settings.types';
import { useAuth } from '../../../context/AuthContext';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => Promise<any>;
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { user: currentUser } = useAuth();
  const isOwner = currentUser?.role === 'Owner';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Cashier');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (password.length < 6) {
      setValidationError('يجب ألا تقل كلمة المرور عن 6 أحرف أو أرقام');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        role,
      });
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setRole('Cashier');
      onClose();
    } catch {
      // toast is already displayed in hook
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
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                إضافة مستخدم جديد
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                تسجيل كاشير أو مدير في طاقم العمل
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
          {validationError && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300">
              {validationError}
            </div>
          )}

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
                  placeholder="مثال: أحمد"
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
                placeholder="مثال: رضوان"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              البريد الإلكتروني (تسجيل الدخول)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cashier@store.com"
                className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              كلمة المرور
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6 أحرف على الأقل"
                className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none"
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
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full pr-9 pl-3 py-2 bg-slate-50 dark:bg-slate-900/90 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary-500 outline-none cursor-pointer"
              >
                <option value="Cashier">كاشير (نقطة البيع، فواتير المبيعات فقط)</option>
                {isOwner && <option value="Manager">مدير فرع (صلاحيات كاملة عدا تعديل بيانات المتجر)</option>}
              </select>
            </div>
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
                  <span>جاري الإنشاء...</span>
                </>
              ) : (
                <span>إنشاء المستخدم</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
