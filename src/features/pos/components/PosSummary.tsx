import React from 'react';
import { CreditCard, Trash2, User, UserCheck, Percent, Receipt } from 'lucide-react';
import type { CartTotals, CustomerCreditInfo } from '../types/pos.types';

interface PosSummaryProps {
  totals: CartTotals;
  customer: CustomerCreditInfo | null;
  onOpenCustomerModal: () => void;
  onOpenPaymentModal: () => void;
  onClearCart: () => void;
  overallDiscount: number;
  onSetOverallDiscount: (discount: number) => void;
}

export const PosSummary: React.FC<PosSummaryProps> = ({
  totals,
  customer,
  onOpenCustomerModal,
  onOpenPaymentModal,
  onClearCart,
  overallDiscount,
  onSetOverallDiscount,
}) => {
  const hasItems = totals.itemCount > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm p-4 space-y-4">
      {/* Customer Header Badge */}
      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            {customer ? <UserCheck className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <span className="text-xs text-slate-600 dark:text-slate-300 font-bold block">العميل المحدد</span>
            <span className="text-sm font-bold text-slate-800 dark:text-white">
              {customer ? customer.name : 'عميل نقدي عام (افتراضي)'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCustomerModal}
          className="px-3 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg transition-colors border border-emerald-200 dark:border-emerald-800"
        >
          {customer ? 'تغيير العميل' : 'اختيار عميل'}
        </button>
      </div>

      {/* Financial Calculation Breakdown */}
      <div className="space-y-2 text-sm pt-1 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex justify-between text-slate-700 dark:text-slate-200">
          <span>عدد الأصناف ({totals.itemCount}) - الوحدات ({totals.totalUnits})</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono">
            {totals.subtotal.toFixed(2)} ج.م
          </span>
        </div>

        {/* Global Discount Row */}
        <div className="flex items-center justify-between text-slate-700 dark:text-slate-200">
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
            <Percent className="w-3.5 h-3.5" />
            خصم إضافي على الفاتورة:
          </span>
          <div className="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max={totals.subtotal}
              value={overallDiscount || ''}
              onChange={(e) => onSetOverallDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
              placeholder="0.00"
              className="w-20 px-2 py-0.5 text-right font-mono text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded focus:outline-none focus:border-amber-500 font-bold"
            />
            <span className="text-xs">ج.م</span>
          </div>
        </div>

        {totals.totalDiscount > 0 && (
          <div className="flex justify-between text-rose-500 text-xs font-semibold">
            <span>إجمالي الخصومات</span>
            <span className="font-mono">-{totals.totalDiscount.toFixed(2)}

        {totals.taxAmount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <span>ضريبة القيمة المضافة (14% VAT):</span>
            <span className="font-mono">+{totals.taxAmount.toFixed(2)} ج.م</span>
          </div>
        )} ج.م</span>
          </div>
        )}

        {/* Grand Total Highlight */}
        <div className="flex justify-between items-baseline pt-2 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
          <span className="text-base font-extrabold text-slate-900 dark:text-white">
            المبلغ الصافي المطلوب:
          </span>
          <div className="text-left">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
              {totals.grandTotal.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-1">ج.م</span>
          </div>
        </div>
      </div>

      {/* Action Triggers */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        <button
          type="button"
          onClick={onClearCart}
          disabled={!hasItems}
          className="col-span-1 flex items-center justify-center p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          title="تفريغ السلة (مسح الكل)"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={onOpenPaymentModal}
          disabled={!hasItems}
          className="col-span-3 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200 transform active:scale-[0.98]"
        >
          <CreditCard className="w-5 h-5" />
          <span>إتمام الدفع والفاتورة (F9)</span>
        </button>
      </div>
    </div>
  );
};
