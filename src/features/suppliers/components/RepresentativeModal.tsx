import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, X, Loader2, Plus } from 'lucide-react';
import { representativeFormSchema, type RepresentativeFormData } from '../types/suppliers.schemas';
import { useAddRepresentativeMutation } from '../api/useSuppliersMutations';
import type { Supplier } from '../types/suppliers.types';

interface RepresentativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export const RepresentativeModal: React.FC<RepresentativeModalProps> = ({
  isOpen,
  onClose,
  supplier,
}) => {
  const addRepMutation = useAddRepresentativeMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RepresentativeFormData>({
    resolver: zodResolver(representativeFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      notes: '',
    },
  });

  if (!isOpen || !supplier) return null;

  const onSubmit = async (data: RepresentativeFormData) => {
    await addRepMutation.mutateAsync({
      supplierId: supplier.id,
      payload: {
        name: data.name,
        phone: data.phone,
        notes: data.notes || null,
      },
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                إضافة مندوب مبيعات
              </h3>
              <p className="text-[10px] text-slate-400">للمورد: {supplier.name}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم المندوب *
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="مثال: أحمد محمود"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            {errors.name && <p className="text-[10px] text-rose-500 mt-0.5">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              رقم هاتف المندوب *
            </label>
            <input
              type="text"
              {...register('phone')}
              placeholder="01123456789"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            {errors.phone && <p className="text-[10px] text-rose-500 mt-0.5">{errors.phone.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات
            </label>
            <input
              type="text"
              {...register('notes')}
              placeholder="مثال: مندوب منطقة المعادي"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={addRepMutation.isPending}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-40"
            >
              {addRepMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              <span>إضافة المندوب</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
