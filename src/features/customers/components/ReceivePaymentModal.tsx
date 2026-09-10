import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Banknote, X, Loader2, CheckCircle2, DollarSign, CreditCard, Building } from 'lucide-react';
import { receivePaymentFormSchema, type ReceivePaymentFormData } from '../types/customers.schemas';
import { useReceivePaymentMutation } from '../api/useCustomersMutations';
import type { Customer } from '../types/customers.types';

interface ReceivePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const ReceivePaymentModal: React.FC<ReceivePaymentModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const receivePaymentMutation = useReceivePaymentMutation();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ReceivePaymentFormData>({
    resolver: zodResolver(receivePaymentFormSchema),
    defaultValues: {
      amount: 0,
      paymentMethod: 'Cash',
      referenceNumber: '',
      notes: '',
    },
  });

  if (!isOpen || !customer) return null;

  const onSubmit = async (data: ReceivePaymentFormData) => {
    await receivePaymentMutation.mutateAsync({
      partyType: 'Customer',
      customerId: customer.id,
      amount: Number(data.amount),
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber || null,
      notes: data.notes || null,
    });
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                سند قبض / تحصيل دفعة
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                تسجيل سداد مديونية للعميل: <b className="text-slate-800 dark:text-white">{customer.name}</b>
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
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Current Debt Highlight */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-inner">
            <div>
              <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold block">المديونية الحالية المستحقة</span>
              <span className="text-xl font-black text-amber-400 font-mono">
                {customer.currentBalance.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 mr-1 font-bold">ج.م</span>
            </div>

            <button
              type="button"
              onClick={() => setValue('amount', customer.currentBalance)}
              className="px-2.5 py-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
            >
              سداد المبلغ بالكامل
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              المبلغ المحصل (ج.م) *
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-lg font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            {errors.amount && <p className="text-[10px] text-rose-500 mt-1">{errors.amount.message}</p>}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              طريقة السداد *
            </label>
            <select
              {...register('paymentMethod')}
              className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="Cash">نقدي (كاش إلى الدرج)</option>
              <option value="BankTransfer">تحويل بنكي / إنستاباي</option>
              <option value="Cheque">شيك بنكي</option>
            </select>
          </div>

          {/* Reference Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              رقم الإيصال / مرجع التحويل (اختياري)
            </label>
            <input
              type="text"
              {...register('referenceNumber')}
              placeholder="مثال: REC-00912 أو رقم الحوالة"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات
            </label>
            <input
              type="text"
              {...register('notes')}
              placeholder="مثال: سداد نقدي جزئي مع الكاشير"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Actions */}
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
              disabled={receivePaymentMutation.isPending}
              className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md disabled:opacity-40"
            >
              {receivePaymentMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              <span>تأكيد سند القبض</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
