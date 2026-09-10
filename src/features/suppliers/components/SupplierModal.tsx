import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Truck, X, Loader2, CheckCircle2 } from 'lucide-react';
import { supplierFormSchema, type SupplierFormData } from '../types/suppliers.schemas';
import { useCreateSupplierMutation, useUpdateSupplierMutation } from '../api/useSuppliersMutations';
import type { Supplier } from '../types/suppliers.types';

interface SupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplierToEdit?: Supplier | null;
}

export const SupplierModal: React.FC<SupplierModalProps> = ({
  isOpen,
  onClose,
  supplierToEdit,
}) => {
  const createMutation = useCreateSupplierMutation();
  const updateMutation = useUpdateSupplierMutation();

  const isEditing = !!supplierToEdit;
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      openingBalance: 0,
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (supplierToEdit) {
        reset({
          name: supplierToEdit.name,
          phone: supplierToEdit.phone,
          address: supplierToEdit.address || '',
          openingBalance: supplierToEdit.currentBalance || 0,
          notes: supplierToEdit.notes || '',
        });
      } else {
        reset({
          name: '',
          phone: '',
          address: '',
          openingBalance: 0,
          notes: '',
        });
      }
    }
  }, [isOpen, supplierToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: SupplierFormData) => {
    if (isEditing && supplierToEdit) {
      await updateMutation.mutateAsync({
        id: supplierToEdit.id,
        payload: {
          name: data.name,
          phone: data.phone,
          address: data.address || null,
          notes: data.notes || null,
        },
      });
    } else {
      await createMutation.mutateAsync({
        name: data.name,
        phone: data.phone,
        address: data.address || null,
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
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                {isEditing ? 'تعديل بيانات المورد' : 'إضافة شركة موردة جديدة'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {isEditing ? 'تحديث الهاتف والعنوان والملاحظات' : 'تسجيل مورد جديد لمتابعة المشتريات والمستحقات'}
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
                اسم المورد أو الشركة *
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="مثال: شركة الدلتا للتجارة"
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
              العنوان / المقر الرئيسي
            </label>
            <input
              type="text"
              {...register('address')}
              placeholder="مثال: 6 أكتوبر - المنطقة الصناعية الثالثة"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Opening Balance (New only) */}
          {!isEditing && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                الرصيد الافتتاحي للمستحقات السابقة (ج.م)
              </label>
              <input
                type="number"
                min="0"
                step="50"
                {...register('openingBalance', { valueAsNumber: true })}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">المستحقات السابقة للمورد عند بدء الاستخدام</span>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات إضافية
            </label>
            <input
              type="text"
              {...register('notes')}
              placeholder="مثال: شروط الدفع، فترة التوريد..."
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
              <span>{isEditing ? 'حفظ التعديلات' : 'تسجيل المورد'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
