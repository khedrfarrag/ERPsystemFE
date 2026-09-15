import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../../context/AuthContext';
import { changePasswordSchema, type ChangePasswordFormData } from '../../../lib/validations';
import { changePasswordApi } from '../../../api/client';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  KeyRound,
  Store,
  Clock,
  Fingerprint,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const AccountSecurityTab: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPasswordValue = watch('newPassword') || '';

  // Real-time password strength checks
  const passwordChecks = [
    { label: '8 أحرف على الأقل', valid: newPasswordValue.length >= 8 },
    { label: 'حرف كبير واحد على الأقل (A-Z)', valid: /[A-Z]/.test(newPasswordValue) },
    { label: 'حرف صغير واحد على الأقل (a-z)', valid: /[a-z]/.test(newPasswordValue) },
    { label: 'رقم واحد على الأقل (0-9)', valid: /[0-9]/.test(newPasswordValue) },
    { label: 'رمز خاص واحد على الأقل (!@#$%^&*)', valid: /[^a-zA-Z0-9]/.test(newPasswordValue) },
  ];

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsSubmitting(true);
      const res = await changePasswordApi({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (res.success) {
        toast.success('تم تغيير كلمة المرور بنجاح');
        reset();
      } else {
        toast.error(res.message || 'فشل تغيير كلمة المرور، يرجى التحقق من كلمة المرور الحالية');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'تعذر تغيير كلمة المرور، تأكد من صحة كلمة المرور الحالية');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'Owner':
        return { label: 'مالك النظام', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800' };
      case 'Manager':
        return { label: 'مدير فرع', color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' };
      case 'Merchant':
        return { label: 'تاجر جملة (B2B)', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800' };
      default:
        return { label: 'كاشير مبيعات', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
    }
  };

  const roleInfo = getRoleBadge(user?.role);

  return (
    <div className="space-y-6">
      {/* 1. Profile Overview Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-primary-500/25 shrink-0">
              {user?.firstName ? user.firstName[0] : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {user ? `${user.firstName} ${user.lastName}` : 'المستخدم'}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {user?.email || 'لا يوجد بريد مسجل'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>حساب موثق وآمن</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 text-sm">
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/50 border border-slate-100 dark:border-slate-700/40">
            <Store className="w-5 h-5 text-primary-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">المتجر / الفرع</p>
              <p className="font-bold text-slate-900 dark:text-white truncate">
                {user?.storeName || 'الفرع الرئيسي'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/50 border border-slate-100 dark:border-slate-700/40">
            <Fingerprint className="w-5 h-5 text-indigo-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">معرف الحساب</p>
              <p className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                {user?.id ? user.id.slice(0, 16) + '...' : 'RetailOS-User'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-750/50 border border-slate-100 dark:border-slate-700/40">
            <Clock className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-slate-500 dark:text-slate-400">صلاحية الجلسة</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200">
                تجديد تلقائي (7 أيام)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2. Change Password Form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/60">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                تغيير كلمة المرور
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                قم بتحديث كلمة المرور الخاصة بحسابك لضمان أعلى مستويات الأمان
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Input
                label="كلمة المرور الحالية"
                type={showCurrentPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                error={errors.currentPassword?.message}
                {...register('currentPassword')}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute left-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showCurrentPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="كلمة المرور الجديدة"
                type={showNewPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                error={errors.newPassword?.message}
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute left-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showNewPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Password Strength Checklist */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-750/50 rounded-xl border border-slate-100 dark:border-slate-700/50 space-y-2">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                شروط كلمة المرور القوية:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                {passwordChecks.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    {item.valid ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 shrink-0" />
                    )}
                    <span className={item.valid ? 'text-emerald-700 dark:text-emerald-300 font-semibold' : 'text-slate-500 dark:text-slate-400'}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <Input
                label="تأكيد كلمة المرور الجديدة"
                type={showConfirmPass ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute left-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showConfirmPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="w-full sm:w-auto shadow-md shadow-primary-500/20"
            >
              تحديث كلمة المرور
            </Button>
          </form>
        </div>

        {/* 3. Session & Security Info Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                أمان الجلسة والبيانات
              </h3>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750/50 border border-slate-100 dark:border-slate-700/40">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  🔄 نظام التجديد التلقائي الصامت
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  يقوم النظام بتجديد جلسة عملك باستمرار في الخلفية لضمان عدم توقف عمليات البيع أو إدخال الفواتير.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750/50 border border-slate-100 dark:border-slate-700/40">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  🔐 تشفير متقدم للرموز (JWT)
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  يتم توقيع وتشفير جميع الطلبات عبر بروتوكولات آمنة، ولا يمكن لأي طرف خارجي الوصول لبياناتك.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-750/50 border border-slate-100 dark:border-slate-700/40">
                <p className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                  💡 نصيحة أمنية
                </p>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  لا تشارك بيانات حسابك مع أي شخص. يمكنك إنشاء حسابات كاشيرين منفصلة من تبويب المستخدمين.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>حالة السيرفر: متصل وآمن</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
