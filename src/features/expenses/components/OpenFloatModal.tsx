import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Unlock, CheckCircle2, Loader2, Coins, AlertCircle } from 'lucide-react';
import { openFloatSchema, type OpenFloatFormValues } from '../types/expenses.schemas';
import { useOpenFloatMutation } from '../api/useExpensesMutations';

interface OpenFloatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OpenFloatModal: React.FC<OpenFloatModalProps> = ({ isOpen, onClose }) => {
  const openFloatMutation = useOpenFloatMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OpenFloatFormValues>({
    resolver: zodResolver(openFloatSchema),
    defaultValues: {
      amount: 0,
      notes: 'عهدة افتتاحية لبداية الوردية',
    },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: OpenFloatFormValues) => {
    await openFloatMutation.mutateAsync({
      amount: data.amount,
      notes: data.notes?.trim() || null,
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
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">فتح وردية وتسجيل عهدة البداية</h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">إدخال النقدية المبدئية (الفكة) في درج الكاشير</p>
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
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>سيتم تعيين هذا المبلغ كرصيد افتتاحي للدرج لبدء حركة المبيعات والمصروفات.</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              مبلغ العهدة / الفكة الافتتاحية (ج.م) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
              className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
            {errors.amount && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات الوردية (اختياري)
            </label>
            <textarea
              rows={2}
              {...register('notes')}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
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
              disabled={isSubmitting || openFloatMutation.isPending}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-40"
            >
              {openFloatMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>تأكيد فتح الوردية</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
