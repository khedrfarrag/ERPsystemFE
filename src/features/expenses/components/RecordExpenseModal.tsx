import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Receipt, Plus, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { createExpenseSchema, type CreateExpenseFormValues } from '../types/expenses.schemas';
import { useCreateExpenseMutation } from '../api/useExpensesMutations';
import type { ExpenseCategory } from '../types/expenses.types';

interface RecordExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ExpenseCategory[];
  onOpenAddCategory: () => void;
}

export const RecordExpenseModal: React.FC<RecordExpenseModalProps> = ({
  isOpen,
  onClose,
  categories,
  onOpenAddCategory,
}) => {
  const createExpenseMutation = useCreateExpenseMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateExpenseFormValues>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      amount: 0,
      categoryId: '',
      paymentMethod: 'Cash',
      expenseDate: new Date().toISOString().split('T')[0],
      description: '',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  if (!isOpen) return null;

  const onSubmit = async (data: CreateExpenseFormValues) => {
    await createExpenseMutation.mutateAsync({
      categoryId: data.categoryId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      expenseDate: new Date(data.expenseDate).toISOString(),
      description: data.description || null,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-600 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">تسجيل مصروف تشغيلي</h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">إدخال مصروف جديد وتحديد طريقة الدفع</p>
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
          {/* Category Select with Add Category Shortcut */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                قسم / تصنيف المصروف *
              </label>
              <button
                type="button"
                onClick={onOpenAddCategory}
                className="text-[11px] text-rose-600 dark:text-rose-400 font-bold hover:underline flex items-center gap-0.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>قسم جديد</span>
              </button>
            </div>
            <select
              {...register('categoryId')}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="">اختر القسم (مثل: فواتير، إيجار، بوفيه، صيانة)...</option>
              {(Array.isArray(categories) ? categories : []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                قيمة المصروف (ج.م) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                {...register('amount', { valueAsNumber: true })}
                className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-rose-500"
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-[10px] text-rose-500 mt-1">{errors.amount.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                تاريخ المصروف *
              </label>
              <input
                type="date"
                {...register('expenseDate')}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
              />
              {errors.expenseDate && (
                <p className="text-[10px] text-rose-500 mt-1">{errors.expenseDate.message}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              طريقة السداد والخصم *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs font-bold">
                <input
                  type="radio"
                  value="Cash"
                  {...register('paymentMethod')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>نقدي (الدرج)</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs font-bold">
                <input
                  type="radio"
                  value="BankTransfer"
                  {...register('paymentMethod')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>تحويل / محفظة</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer text-xs font-bold">
                <input
                  type="radio"
                  value="Cheque"
                  {...register('paymentMethod')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <span>شيك بنكي</span>
              </label>
            </div>

            {selectedPaymentMethod === 'Cash' ? (
              <div className="mt-2.5 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>سيتم خصم هذا المبلغ فوراً وتلقائياً من رصيد درج الكاشير الفعلي.</span>
              </div>
            ) : (
              <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 text-slate-600 dark:text-slate-400 text-xs">
                <span>سيتم تسجيل المصروف في التقارير ولن يؤثر على رصيد النقدية الفعلي في الدرج.</span>
              </div>
            )}
          </div>

          {/* Description / Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              البيان وملاحظات الصرف (اختياري)
            </label>
            <textarea
              rows={2}
              {...register('description')}
              placeholder="مثال: فاتورة كهرباء شهر 9، أو شراء أدوات نظافة..."
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
              disabled={isSubmitting || createExpenseMutation.isPending}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md disabled:opacity-40"
            >
              {createExpenseMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>تأكيد تسجيل المصروف</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
