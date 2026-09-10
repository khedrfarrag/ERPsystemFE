import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, X, Loader2, CheckCircle2 } from 'lucide-react';
import { customerFormSchema, type CustomerFormData } from '../types/customers.schemas';
import { useCreateCustomerMutation, useUpdateCustomerMutation } from '../api/useCustomersMutations';
import type { Customer } from '../types/customers.types';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: Customer | null;
}

export const CustomerModal: React.FC<CustomerModalProps> = ({
  isOpen,
  onClose,
  customerToEdit,
}) => {
  const createMutation = useCreateCustomerMutation();
  const updateMutation = useUpdateCustomerMutation();

  const isEditing = !!customerToEdit;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      creditLimit: 0,
      openingBalance: 0,
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (customerToEdit) {
        reset({
          name: customerToEdit.name,
          phone: customerToEdit.phone,
          address: customerToEdit.address || '',
          creditLimit: customerToEdit.creditLimit || 0,
          openingBalance: customerToEdit.currentBalance || 0,
          notes: customerToEdit.notes || '',
        });
      } else {
        reset({
          name: '',
          phone: '',
          address: '',
          creditLimit: 1000,
          openingBalance: 0,
          notes: '',
        });
      }
    }
  }, [isOpen, customerToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: CustomerFormData) => {
    if (isEditing && customerToEdit) {
      await updateMutation.mutateAsync({
        id: customerToEdit.id,
        payload: {
          name: data.name,
          phone: data.phone,
          address: data.address || null,
          creditLimit: data.creditLimit ? Number(data.creditLimit) : null,
          notes: data.notes || null,
        },
      });
    } else {
      await createMutation.mutateAsync({
        name: data.name,
        phone: data.phone,
        address: data.address || null,
        creditLimit: data.creditLimit ? Number(data.creditLimit) : null,
        openingBalance: data.openingBalance ? Number(data.openingBalance) : null,
        notes: data.notes || null,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                {isEditing ? 'تعديل بيانات العميل' : 'تسجيل عميل جديد'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isEditing ? 'تحديث الهاتف وسقف الائتمان' : 'إضافة ملف عميل ومتابعة مديونياته وسقف الشراء'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                اسم العميل أو المنشأة *
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="مثال: شركة الأمل للتجارة"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-bold"
                autoFocus
              />
              {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                رقم الهاتف المحمول *
              </label>
              <input
                type="text"
                {...register('phone')}
                placeholder="01012345678"
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              {errors.phone && <p className="text-[10px] text-rose-500 mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              العنوان / المنطقة
            </label>
            <input
              type="text"
              {...register('address')}
              placeholder="مثال: القاهرة - المعادي شارع النصر"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Credit Limit & Opening Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                سقف الائتمان المسموح (ج.م)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                {...register('creditLimit', { valueAsNumber: true })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">أقصى مديونية يمكن للعميل الوصول إليها</span>
            </div>

            {!isEditing && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  الرصيد الافتتاحي المستحق (ج.م)
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  {...register('openingBalance', { valueAsNumber: true })}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block">المديونية السابقة للعميل عند التسجيل</span>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات إضافية
            </label>
            <input
              type="text"
              {...register('notes')}
              placeholder="مثال: عميل جملة، تسديد كل أسبوعين..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-40"
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>{isEditing ? 'حفظ التعديلات' : 'تسجيل العميل'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
