import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, FolderPlus, CheckCircle2, Loader2 } from 'lucide-react';
import {
  createExpenseCategorySchema,
  type CreateExpenseCategoryFormValues,
} from '../types/expenses.schemas';
import { useCreateExpenseCategoryMutation } from '../api/useExpensesMutations';

interface ExpenseCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExpenseCategoryModal: React.FC<ExpenseCategoryModalProps> = ({ isOpen, onClose }) => {
  const createCategoryMutation = useCreateExpenseCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpenseCategoryFormValues>({
    resolver: zodResolver(createExpenseCategorySchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: CreateExpenseCategoryFormValues) => {
    await createCategoryMutation.mutateAsync({
      name: data.name.trim(),
      description: data.description?.trim() || null,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-xl">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">إضافة قسم مصروفات جديد</h2>
              <p className="text-[11px] text-slate-400">إنشاء تصنيف لتنظيم ومتابعة المصروفات</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              اسم القسم / التصنيف *
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="مثال: صيانة وأعطال، إيجار ومرافق، بوفيه..."
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
            />
            {errors.name && <p className="text-[10px] text-rose-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              وصف إضافي (اختياري)
            </label>
            <textarea
              rows={2}
              {...register('description')}
              placeholder="ملاحظات توضيحية حول بنود هذا القسم..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting || createCategoryMutation.isPending}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md disabled:opacity-40"
            >
              {createCategoryMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>حفظ القسم</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
