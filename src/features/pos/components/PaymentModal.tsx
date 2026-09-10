import React, { useState, useEffect, useMemo } from 'react';
import { Banknote, CreditCard, Split, AlertTriangle, CheckCircle2, Loader2, X, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCreateSaleMutation } from '../api/usePosMutations';
import type { CartItem, CartTotals, CustomerCreditInfo, PaymentMethod, SaleResponseData } from '../types/pos.types';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totals: CartTotals;
  items: CartItem[];
  customer: CustomerCreditInfo | null;
  onSaleSuccess: (sale: SaleResponseData) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  totals,
  items,
  customer,
  onSaleSuccess,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [cashGiven, setCashGiven] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const createSaleMutation = useCreateSaleMutation();

  // Reset/sync cash given when modal opens
  useEffect(() => {
    if (isOpen) {
      setCashGiven(totals.grandTotal.toString());
      setPaymentMethod('Cash');
      setNotes('');
    }
  }, [isOpen, totals.grandTotal]);

  const cashAmountNum = parseFloat(cashGiven) || 0;

  // Change computation
  const changeDue = useMemo(() => {
    if (paymentMethod === 'Cash') {
      return Math.max(0, cashAmountNum - totals.grandTotal);
    }
    return 0;
  }, [paymentMethod, cashAmountNum, totals.grandTotal]);

  // Credit feasibility validation
  const creditValidation = useMemo(() => {
    if (paymentMethod === 'Credit' || paymentMethod === 'Mixed') {
      if (!customer) {
        return {
          valid: false,
          error: 'يجب اختيار عميل مسجل لإتمام البيع الآجل أو المختلط',
        };
      }

      const creditPortion =
        paymentMethod === 'Credit'
          ? totals.grandTotal
          : Math.max(0, totals.grandTotal - cashAmountNum);

      const futureDebt = (customer.currentBalance || 0) + creditPortion;
      const creditLimit = customer.creditLimit || 0;

      if (futureDebt > creditLimit) {
        return {
          valid: false,
          error: `هذه الفاتورة تتجاوز سقف الائتمان للعميل (${creditLimit.toFixed(2)} ج.م). الرصيد القادم: ${futureDebt.toFixed(2)} ج.م`,
        };
      }
    }

    if (paymentMethod === 'Cash' && cashAmountNum < totals.grandTotal) {
      return {
        valid: false,
        error: 'المبلغ المدفوع نقداً أقل من إجمالي الفاتورة المطلوبة',
      };
    }

    if (paymentMethod === 'Mixed') {
      if (cashAmountNum <= 0) {
        return { valid: false, error: 'في الدفع المختلط، يجب دفع جزء نقدي أكبر من 0' };
      }
      if (cashAmountNum >= totals.grandTotal) {
        return { valid: false, error: 'المبلغ النقدي يغطي الفاتورة كاملة، يرجى اختيار الدفع النقدي' };
      }
    }

    return { valid: true, error: null };
  }, [paymentMethod, cashAmountNum, totals.grandTotal, customer]);

  if (!isOpen) return null;

  const handleQuickCash = (amount: number) => {
    setCashGiven(amount.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!creditValidation.valid) {
      toast.error(creditValidation.error || 'يرجى مراجعة بيانات الدفع');
      return;
    }

    const payload = {
      customerId: customer?.id || null,
      paymentMethod,
      cashAmount: paymentMethod === 'Credit' ? 0 : cashAmountNum,
      notes: notes.trim() || null,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
      })),
    };

    try {
      const saleResult = await createSaleMutation.mutateAsync(payload);
      onSaleSuccess(saleResult);
    } catch {
      // Error handled inside usePosMutations onError
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">
                إتمام عملية الدفع
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                اختر طريقة السداد واستكمل إصدار الفاتورة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Total Amount Box */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-inner">
            <div>
              <span className="text-xs text-slate-300 font-semibold block">إجمالي المبلغ المستحق</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {totals.grandTotal.toFixed(2)}
              </span>
              <span className="text-xs text-slate-300 mr-1 font-bold">ج.م</span>
            </div>

            {customer && (
              <div className="text-left border-r border-slate-700 pr-4">
                <span className="text-xs text-slate-300 block font-medium">العميل</span>
                <span className="text-sm font-bold text-white block truncate max-w-[140px]">
                  {customer.name}
                </span>
                <span className="text-[11px] text-amber-400 font-mono">
                  المديونية: {customer.currentBalance.toFixed(2)} ج.م
                </span>
              </div>
            )}
          </div>

          {/* Payment Method Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              طريقة الدفع
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Cash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Cash')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'Cash'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                <Banknote className="w-5 h-5 mb-1" />
                <span className="text-xs">نقدي (Cash)</span>
              </button>

              {/* Credit */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Credit')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'Credit'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                <span className="text-xs">آجل (شكك)</span>
              </button>

              {/* Mixed */}
              <button
                type="button"
                onClick={() => setPaymentMethod('Mixed')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                  paymentMethod === 'Mixed'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-400 bg-slate-50/50 dark:bg-slate-800/50'
                }`}
              >
                <Split className="w-5 h-5 mb-1" />
                <span className="text-xs">دفع مختلط</span>
              </button>
            </div>
          </div>

          {/* Cash Input & Quick Amounts (for Cash / Mixed) */}
          {paymentMethod !== 'Credit' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {paymentMethod === 'Cash' ? 'المبلغ المستلم من العميل' : 'الجزء المدفوع نقداً'}
              </label>

              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0"
                  value={cashGiven}
                  onChange={(e) => setCashGiven(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-xl font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  placeholder="0.00"
                  autoFocus
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-bold text-slate-500 dark:text-slate-400">
                  ج.م
                </span>
              </div>

              {/* Quick Cash Buttons */}
              {paymentMethod === 'Cash' && (
                <div className="flex items-center gap-1.5 pt-1 overflow-x-auto">
                  <span className="text-[11px] text-slate-600 dark:text-slate-300 font-bold ml-1">مبالغ سريعة:</span>
                  {[50, 100, 200, 500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handleQuickCash(amt)}
                      className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-400 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 transition-colors"
                    >
                      {amt}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleQuickCash(totals.grandTotal)}
                    className="px-2.5 py-1 text-xs font-bold font-mono rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 transition-colors"
                  >
                    المبلغ بالكامل
                  </button>
                </div>
              )}

              {/* Change Indicator */}
              {paymentMethod === 'Cash' && cashAmountNum >= totals.grandTotal && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                    المبلغ المتبقي للعميل (الباقي / الفكة):
                  </span>
                  <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 font-mono">
                    {changeDue.toFixed(2)} ج.م
                  </span>
                </div>
              )}

              {/* Mixed remaining indicator */}
              {paymentMethod === 'Mixed' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-800 dark:text-amber-300">
                    المبلغ المحول لحساب العميل (آجل):
                  </span>
                  <span className="text-base font-black text-amber-700 dark:text-amber-300 font-mono">
                    {Math.max(0, totals.grandTotal - cashAmountNum).toFixed(2)} ج.م
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Validation Error Alert */}
          {!creditValidation.valid && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{creditValidation.error}</span>
            </div>
          )}

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              ملاحظات إضافية على الفاتورة (اختياري)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="مثال: خصم خاص، توصيل مع مندوب، الخ..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!creditValidation.valid || createSaleMutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base shadow-lg shadow-emerald-600/30 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-200"
            >
              {createSaleMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>جاري معالجة وحفظ الفاتورة...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>تأكيد وإصدار الفاتورة</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
