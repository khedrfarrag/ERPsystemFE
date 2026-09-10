import toast from 'react-hot-toast';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Lock, CheckCircle2, AlertTriangle, AlertCircle, Loader2, Calculator } from 'lucide-react';
import { closeRegisterSchema, type CloseRegisterFormValues } from '../types/expenses.schemas';
import { useCloseRegisterMutation } from '../api/useExpensesMutations';

interface CloseRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedBalance: number;
}

export const CloseRegisterModal: React.FC<CloseRegisterModalProps> = ({
  isOpen,
  onClose,
  expectedBalance,
}) => {
  const closeRegisterMutation = useCloseRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CloseRegisterFormValues>({
    resolver: zodResolver(closeRegisterSchema),
    defaultValues: {
      countedAmount: expectedBalance,
      notes: '',
    },
  });

  const countedAmount = watch('countedAmount') || 0;

  // Real-time discrepancy calculation
  const discrepancy = useMemo(() => {
    return Number((countedAmount - expectedBalance).toFixed(2));
  }, [countedAmount, expectedBalance]);

  if (!isOpen) return null;

  const onSubmit = async (data: CloseRegisterFormValues) => {
    await closeRegisterMutation.mutateAsync({
      countedAmount: data.countedAmount,
      notes: data.notes?.trim() || null,
    });
    toast.success('تم إغلاق الوردية وتوريد النقدية وتصفير الدرج بنجاح!');
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-right">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-xl">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">تقفيل الوردية وجرد الدرج</h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">مقارنة النقدية الفعلية بالرصيد الدفتري المسجل بالسيستم</p>
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
          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">الرصيد الدفتري المتوقع</span>
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {expectedBalance.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">المبلغ الفعلي المدخل</span>
              <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                {countedAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
              </span>
            </div>
          </div>

          {/* Counted Cash Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              المبلغ الفعلي المعدود بالدرج (ج.م) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              {...register('countedAmount', { valueAsNumber: true })}
              className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
            />
            {errors.countedAmount && (
              <p className="text-[10px] text-rose-500 mt-1">{errors.countedAmount.message}</p>
            )}
          </div>

          {/* Live Discrepancy Indicator */}
          <div
            className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between ${
              discrepancy === 0
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                : discrepancy < 0
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 text-amber-800 dark:text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2">
              {discrepancy === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-5 h-5" />
              )}
              <div>
                <span className="block">
                  {discrepancy === 0
                    ? 'النقدية مطابقة تماماً (لا يوجد عجز أو زيادة)'
                    : discrepancy < 0
                    ? 'يوجد عجز نقدي في الدرج'
                    : 'توجد زيادة نقدية في الدرج'}
                </span>
                <span className="text-[10px] font-normal opacity-80">
                  {discrepancy < 0 ? 'مطلوب تدوين سبب العجز في الملاحظات' : 'سيتم تسجيل التسوية تلقائياً'}
                </span>
              </div>
            </div>

            <span className="font-mono text-sm font-black">
              {discrepancy > 0 ? `+${discrepancy}` : discrepancy} ج.م
            </span>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات تقفيل الوردية والتسوية {discrepancy !== 0 && <span className="text-rose-500">*</span>}
            </label>
            <textarea
              rows={2}
              {...register('notes')}
              placeholder="مثال: تم جرد الدرج ووجد عجز بقيمة 20 ج.م فكة لم تسجل..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-amber-500"
            />
            {errors.notes && <p className="text-[10px] text-rose-500 mt-1">{errors.notes.message}</p>}
          </div>

          {/* Cash Drawer Sweep Info */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-2xl text-[11px] text-blue-800 dark:text-blue-300 flex items-start gap-2">
            <span className="font-bold">ℹ️ تنبيه التوريد:</span>
            <span>عند تأكيد الإغلاق، سيتم تسوية الفارق، وتوريد كامل المبلغ الفعلي ({countedAmount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م) للخزينة وتصفير الدرج ليصبح (0.00 ج.م) لبدء الوردية القادمة.</span>
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
              disabled={isSubmitting || closeRegisterMutation.isPending}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md disabled:opacity-40"
            >
              {closeRegisterMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>تأكيد تقفيل الوردية والجرد</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
