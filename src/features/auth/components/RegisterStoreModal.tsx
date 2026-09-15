import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerStoreSchema, type RegisterStoreFormData } from '../../../lib/validations';
import { registerStoreApi } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import {
  Store,
  X,
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  MapPin,
  Sparkles,
  Eye,
  EyeOff,
  Building2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RegisterStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BUSINESS_TYPES = [
  'سوبرماركت ومواد غذائية',
  'منظفات وكيماويات منزلية',
  'أدوات منزلية ومكتبية',
  'أزياء وملابس وأحذية',
  'إلكترونيات وهواتف',
  'عطارة ومستحضرات تجميل',
  'تجزئة عامة ومتنوعة',
];

export const RegisterStoreModal: React.FC<RegisterStoreModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterStoreFormData>({
    resolver: zodResolver(registerStoreSchema),
    defaultValues: {
      storeName: '',
      businessType: BUSINESS_TYPES[0],
      ownerFirstName: '',
      ownerLastName: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: RegisterStoreFormData) => {
    try {
      setIsSubmitting(true);
      const res = await registerStoreApi(data);

      if (res.success && res.data) {
        toast.success('تم إنشاء المتجر بنجاح! جاري الدخول...');
        login(res.data);
        reset();
        onClose();
        navigate('/', { replace: true });
      } else {
        toast.error(res.message || 'تعذر تسجيل المتجر، يرجى مراجعة البيانات');
      }
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error('البريد الإلكتروني مسجل بالفعل لمستخدم آخر');
      } else {
        toast.error(err.response?.data?.message || 'فشل التسجيل، يرجى التحقق من صحة البيانات');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl max-h-[90dvh] flex flex-col overflow-hidden text-slate-900 dark:text-white">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-primary-600 to-indigo-600 text-white rounded-2xl shadow-md shadow-primary-500/25">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white">
                تسجيل متجر جديد
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ابدأ رحلة إدارة مبيعاتك ومخزونك السحابي مع RetailOS
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="اسم المتجر / النشاط التجاري"
              type="text"
              placeholder="مثال: متجر البركة للتجارة"
              icon={<Store className="w-4 h-4" />}
              error={errors.storeName?.message}
              {...register('storeName')}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-primary-500" />
                <span>نوع النشاط التجاري</span>
              </label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
                {...register('businessType')}
              >
                {BUSINESS_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.businessType && (
                <p className="text-xs text-rose-500 mt-1">{errors.businessType.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="الاسم الأول للمالك"
              type="text"
              placeholder="محمد"
              icon={<UserIcon className="w-4 h-4" />}
              error={errors.ownerFirstName?.message}
              {...register('ownerFirstName')}
            />

            <Input
              label="اسم العائلة"
              type="text"
              placeholder="علي"
              icon={<UserIcon className="w-4 h-4" />}
              error={errors.ownerLastName?.message}
              {...register('ownerLastName')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="البريد الإلكتروني (لتسجيل الدخول)"
              type="email"
              placeholder="owner@myretail.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="relative">
              <Input
                label="كلمة المرور (8 أحرف وأرقام)"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                error={errors.password?.message}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-9 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="رقم الهاتف (اختياري)"
              type="tel"
              placeholder="01012345678"
              icon={<Phone className="w-4 h-4" />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="العنوان / المدينة (اختياري)"
              type="text"
              placeholder="القاهرة - مدينة نصر"
              icon={<MapPin className="w-4 h-4" />}
              error={errors.address?.message}
              {...register('address')}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              className="shadow-lg shadow-primary-500/25"
            >
              إنشاء المتجر والبدء فوراً
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
