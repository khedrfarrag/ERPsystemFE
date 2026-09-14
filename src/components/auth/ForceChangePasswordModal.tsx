import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { changePasswordApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'يرجى إدخال كلمة المرور الحالية (الافتراضية)'),
  newPassword: z.string()
    .min(8, 'يجب أن لا تقل كلمة المرور عن 8 أحرف')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل (A-Z)')
    .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل (a-z)')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل (0-9)'),
  confirmPassword: z.string().min(1, 'يرجى تأكيد كلمة المرور الجديدة'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['confirmPassword'],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

interface ForceChangePasswordModalProps {
  isOpen: boolean;
}

export const ForceChangePasswordModal: React.FC<ForceChangePasswordModalProps> = ({ isOpen }) => {
  const { clearMustChangePassword } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setLoading(true);
      await changePasswordApi({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      clearMustChangePassword();
      toast.success('تم تحديث كلمة المرور بنجاح! تم تأمين حسابك.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'فشل تحديث كلمة المرور. يرجى التأكد من كلمة المرور الحالية.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200" dir="rtl">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 border border-amber-300 dark:border-amber-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-950/60 rounded-2xl text-amber-600 dark:text-amber-400">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">تحديث كلمة المرور الإلزامية</h2>
            <p className="text-xs text-amber-700 dark:text-amber-300 font-medium mt-0.5">
              لحماية متجرك، يجب تغيير كلمة المرور الافتراضية قبل المتابعة
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="كلمة المرور الحالية (المؤقتة)"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <Input
            label="كلمة المرور الجديدة"
            type="password"
            placeholder="••••••••"
            icon={<Lock className="w-4 h-4" />}
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <Input
            label="تأكيد كلمة المرور الجديدة"
            type="password"
            placeholder="••••••••"
            icon={<CheckCircle2 className="w-4 h-4" />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 space-y-1 border border-slate-200 dark:border-slate-700">
            <p className="font-bold text-slate-700 dark:text-slate-200">شروط الأمان المطلوبة:</p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-500 dark:text-slate-400">
              <li>8 أحرف على الأقل</li>
              <li>حرف كبير (A-Z) وحرف صغير (a-z)</li>
              <li>رقم واحد على الأقل (0-9)</li>
            </ul>
          </div>

          <Button
            type="submit"
            size="lg"
            isLoading={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25 mt-2"
          >
            حفظ وتأكيد كلمة المرور
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForceChangePasswordModal;
