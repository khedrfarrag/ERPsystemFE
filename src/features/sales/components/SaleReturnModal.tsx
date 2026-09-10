import React, { useState, useMemo } from 'react';
import {
  X,
  RotateCcw,
  AlertTriangle,
  Banknote,
  CreditCard,
  CheckCircle2,
  Package,
} from 'lucide-react';
import {
  Sale,
  CreateSaleReturnRequest,
  RefundMethod,
  ReturnFormItemState,
} from '../types/sales.types';
import { CurrentDrawerResponse } from '../api/salesApi';

interface SaleReturnModalProps {
  sale: Sale | null;
  isOpen: boolean;
  currentDrawer: CurrentDrawerResponse | null;
  onClose: () => void;
  onSubmitReturn: (saleId: string, data: CreateSaleReturnRequest) => Promise<void>;
}

export const SaleReturnModal: React.FC<SaleReturnModalProps> = ({
  sale,
  isOpen,
  currentDrawer,
  onClose,
  onSubmitReturn,
}) => {
  if (!isOpen || !sale) return null;

  // Compute initial item states
  const initialItems: ReturnFormItemState[] = useMemo(() => {
    const priorReturns = sale.returns || [];
    return sale.items.map((item) => {
      const previouslyReturned = priorReturns.reduce((sum, r) => {
        const matchingReturnItem = r.items.find((ri) => ri.productId === item.productId);
        return sum + (matchingReturnItem ? matchingReturnItem.quantity : 0);
      }, 0);

      const returnable = Math.max(0, item.quantity - previouslyReturned);

      return {
        productId: item.productId,
        productName: item.productName,
        unitPrice: item.unitPrice,
        purchasedQty: item.quantity,
        previouslyReturnedQty: previouslyReturned,
        returnableQty: returnable,
        selectedQty: returnable > 0 ? 1 : 0,
        isSelected: false,
      };
    });
  }, [sale]);

  const [itemsState, setItemsState] = useState<ReturnFormItemState[]>(initialItems);
  const [reason, setReason] = useState<string>('منتج معيب أو تالف');
  const [customReason, setCustomReason] = useState<string>('');
  const [refundMethod, setRefundMethod] = useState<RefundMethod>('Cash');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const predefinedReasons = [
    'منتج معيب أو تالف',
    'طلب العميل استرجاع السلعة',
    'استبدال بمقاس أو صنف آخر',
    'خطأ في تسجيل الطلب بالـ POS',
    'سبب آخر',
  ];

  const handleToggleItem = (index: number) => {
    setItemsState((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newSelected = !item.isSelected;
        return {
          ...item,
          isSelected: newSelected,
          selectedQty: newSelected && item.selectedQty === 0 ? Math.min(1, item.returnableQty) : item.selectedQty,
        };
      })
    );
  };

  const handleQtyChange = (index: number, qty: number) => {
    setItemsState((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const boundedQty = Math.max(1, Math.min(qty, item.returnableQty));
        return { ...item, selectedQty: boundedQty };
      })
    );
  };

  // Selected items to return
  const selectedItems = useMemo(
    () => itemsState.filter((i) => i.isSelected && i.selectedQty > 0),
    [itemsState]
  );

  const totalRefundAmount = useMemo(
    () => selectedItems.reduce((sum, i) => sum + i.selectedQty * i.unitPrice, 0),
    [selectedItems]
  );

  const isDrawerOpen = !!currentDrawer && currentDrawer.lastFloatDate !== null;
  const drawerBalance = currentDrawer?.currentBalance ?? 0;

  // Validation warnings
  const isCashRefundBlocked =
    refundMethod === 'Cash' &&
    (!isDrawerOpen || (isDrawerOpen && drawerBalance < totalRefundAmount));

  const isAnonymousCreditBlocked = refundMethod === 'Credit' && !sale.customerId;

  const canSubmit =
    selectedItems.length > 0 &&
    !isSubmitting &&
    (refundMethod === 'Credit' ? !!sale.customerId : isDrawerOpen && drawerBalance >= totalRefundAmount) &&
    (reason !== 'سبب آخر' || customReason.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    try {
      const finalReason = reason === 'سبب آخر' ? customReason.trim() : reason;
      const payload: CreateSaleReturnRequest = {
        reason: finalReason,
        refundMethod,
        items: selectedItems.map((i) => ({
          productId: i.productId,
          quantity: i.selectedQty,
        })),
      };

      await onSubmitReturn(sale.id, payload);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                إجراء مرتجع مبيعات
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                الفاتورة: <span className="font-bold text-slate-700 dark:text-slate-200">{sale.invoiceNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Items to return selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-primary-500" />
              الأصناف المتاحة للإرجاع:
            </h3>

            <div className="space-y-2 border border-slate-200 dark:border-slate-700/80 rounded-xl p-3 bg-slate-50/50 dark:bg-slate-900/30">
              {itemsState.map((item, idx) => {
                const isReturnable = item.returnableQty > 0;
                return (
                  <div
                    key={item.productId}
                    className={
                      "p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 " +
                      (!isReturnable
                        ? 'opacity-50 bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                        : item.isSelected
                        ? 'bg-primary-50/70 dark:bg-primary-950/40 border-primary-300 dark:border-primary-700'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700')
                    }
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.isSelected}
                        disabled={!isReturnable}
                        onChange={() => handleToggleItem(idx)}
                        className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 cursor-pointer disabled:cursor-not-allowed"
                      />
                      <div>
                        <div className="font-bold text-sm text-slate-900 dark:text-white">
                          {item.productName}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          السعر: {item.unitPrice.toFixed(2)} ج.م | تم الشراء: {item.purchasedQty} | تم إرجاعه: {item.previouslyReturnedQty} | المتاح:{' '}
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {item.returnableQty}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isReturnable && item.isSelected && (
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          الكمية المرتجعة:
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={item.returnableQty}
                          value={item.selectedQty}
                          onChange={(e) => handleQtyChange(idx, parseInt(e.target.value) || 1)}
                          className="w-20 px-2.5 py-1 text-center font-bold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Refund Method */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              طريقة استرداد المبلغ:
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRefundMethod('Cash')}
                className={
                  "p-3.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition " +
                  (refundMethod === 'Cash'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700')
                }
              >
                <Banknote className="w-4 h-4" />
                <span>نقداً (من الخزينة)</span>
              </button>

              <button
                type="button"
                disabled={!sale.customerId}
                onClick={() => setRefundMethod('Credit')}
                title={!sale.customerId ? 'لا يمكن اختيار الرصيد الآجل لعميل نقدي غير مسجل' : ''}
                className={
                  "p-3.5 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition " +
                  (!sale.customerId
                    ? 'opacity-40 cursor-not-allowed border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-400'
                    : refundMethod === 'Credit'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700')
                }
              >
                <CreditCard className="w-4 h-4" />
                <span>رصيد آجل (بحساب العميل)</span>
              </button>
            </div>

            {/* Warnings */}
            {refundMethod === 'Cash' && !isDrawerOpen && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">تنبيه:</span> الخزينة النقدية مغلقة حالياً. يلزم فتح وردية الخزينة من شاشة "المصروفات والخزينة" لإتمام الاسترداد النقدي.
                </div>
              </div>
            )}

            {refundMethod === 'Cash' && isDrawerOpen && drawerBalance < totalRefundAmount && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">تنبيه رصيد الخزينة:</span> رصيد الخزينة الحالي ({drawerBalance.toFixed(2)} ج.م) غير كافٍ لصرف قيمة المرتجع ({totalRefundAmount.toFixed(2)} ج.م).
                </div>
              </div>
            )}

            {isAnonymousCreditBlocked && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                * هذه الفاتورة لعميل نقدي عام، لذلك يقتصر الاسترداد على النقدية فقط.
              </p>
            )}
          </div>

          {/* Return Reason */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-900 dark:text-white">
              سبب المرتجع:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
            >
              {predefinedReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            {reason === 'سبب آخر' && (
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="اكتب سبب المرتجع بالتفصيل..."
                className="w-full mt-2 py-2 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            )}
          </div>

          {/* Refund Summary Card */}
          <div className="p-4 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>عدد الأصناف المحددة:</span>
              <span className="font-bold text-slate-800 dark:text-white">{selectedItems.length} صنف</span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>إجمالي قيمة المرتجع المستردة:</span>
              <span className="text-base text-primary-600 dark:text-primary-400">
                {totalRefundAmount.toFixed(2)} ج.م
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-md shadow-primary-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>جاري تسجيل المرتجع...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تأكيد تسجيل المرتجع</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
