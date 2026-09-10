import React from 'react';
import {
  X,
  Printer,
  RotateCcw,
  Calendar,
  User,
  CreditCard,
  Banknote,
  Receipt,
  Layers,
  History,
} from 'lucide-react';
import { Sale } from '../types/sales.types';
import { useAuth } from '../../../context/AuthContext';

interface SaleDetailsModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onReprint: () => void;
  onOpenReturn: () => void;
}

export const SaleDetailsModal: React.FC<SaleDetailsModalProps> = ({
  sale,
  isOpen,
  onClose,
  onReprint,
  onOpenReturn,
}) => {
  const { isOwnerOrManager } = useAuth();
  if (!isOpen || !sale) return null;

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoStr;
    }
  };

  const totalPurchasedQty = sale.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalReturnedQty = (sale.returns || []).reduce(
    (acc, r) => acc + r.items.reduce((sum, ri) => sum + ri.quantity, 0),
    0
  );
  const isFullyReturned = totalReturnedQty >= totalPurchasedQty && totalPurchasedQty > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-right">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  تفاصيل الفاتورة: {sale.invoiceNumber}
                </h2>
                {isFullyReturned ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                    مرتجع بالكامل
                  </span>
                ) : totalReturnedQty > 0 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300">
                    مرتجع جزئي
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                    مكتملة
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(sale.saleDate)}
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">العميل:</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                <User className="w-4 h-4 text-primary-500" />
                <span>{sale.customerName || 'عميل نقدي عام'}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">طريقة الدفع:</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white text-sm">
                {sale.paymentMethod === 'Cash' ? (
                  <>
                    <Banknote className="w-4 h-4 text-emerald-500" />
                    <span>نقدي بالكامل</span>
                  </>
                ) : sale.paymentMethod === 'Credit' ? (
                  <>
                    <CreditCard className="w-4 h-4 text-indigo-500" />
                    <span>آجل بحساب العميل</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4 text-violet-500" />
                    <span>مجزء (نقدي + آجل)</span>
                  </>
                )}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-700/80">
              <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">إجمالي الفاتورة:</span>
              <div className="font-black text-slate-900 dark:text-white text-base">
                {sale.totalAmount.toFixed(2)} ج.م
              </div>
            </div>
          </div>

          {/* Line Items Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">الأصناف المشتراة:</h3>
            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="table-header border-b border-slate-200 dark:border-slate-700 font-bold">
                    <th className="py-2.5 px-3">الصنف</th>
                    <th className="py-2.5 px-3 text-center">الكمية</th>
                    <th className="py-2.5 px-3 text-left">سعر الوحدة</th>
                    <th className="py-2.5 px-3 text-left">الخصم</th>
                    <th className="py-2.5 px-3 text-left">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                  {sale.items.map((item) => (
                    <tr key={item.id} className="table-row-hover">
                      <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                        {item.productName}
                      </td>
                      <td className="py-2.5 px-3 text-center text-slate-700 dark:text-slate-300 font-semibold">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-left text-slate-700 dark:text-slate-300">
                        {item.unitPrice.toFixed(2)} ج.م
                      </td>
                      <td className="py-2.5 px-3 text-left text-rose-600 dark:text-rose-400">
                        {item.discount > 0 ? `-${item.discount.toFixed(2)} ج.م` : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-left font-bold text-slate-900 dark:text-white">
                        {item.subTotal.toFixed(2)} ج.م
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs font-medium">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>المجموع الفرعي:</span>
              <span>{sale.subTotal.toFixed(2)} ج.م</span>
            </div>
            {sale.discountAmount > 0 && (
              <div className="flex justify-between text-rose-600 dark:text-rose-400">
                <span>الخصم الإجمالي:</span>
                <span>-{sale.discountAmount.toFixed(2)} ج.م</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>ضريبة القيمة المضافة (14%):</span>
              <span>{sale.taxAmount.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
              <span>الإجمالي الكلي:</span>
              <span>{sale.totalAmount.toFixed(2)} ج.م</span>
            </div>
            <div className="flex justify-between text-emerald-700 dark:text-emerald-400 pt-1">
              <span>المبلغ المسدد نقداً:</span>
              <span>{sale.cashAmount.toFixed(2)} ج.م</span>
            </div>
            {sale.creditAmount > 0 && (
              <div className="flex justify-between text-indigo-600 dark:text-indigo-400">
                <span>المتبقي آجل بحساب العميل:</span>
                <span>{sale.creditAmount.toFixed(2)} ج.م</span>
              </div>
            )}
          </div>

          {/* Notes if any */}
          {sale.notes && (
            <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">ملاحظات الفاتورة: </span>
              {sale.notes}
            </div>
          )}

          {/* Returns History Section (Task T015) */}
          <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-primary-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                سجل المرتجعات السابقة على الفاتورة ({sale.returns?.length || 0}):
              </h3>
            </div>

            {sale.returns && sale.returns.length > 0 ? (
              <div className="space-y-2">
                {sale.returns.map((ret) => (
                  <div
                    key={ret.id}
                    className="p-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 text-xs space-y-1.5"
                  >
                    <div className="flex justify-between font-bold text-amber-950 dark:text-amber-200">
                      <span>إيصال مرتجع: {ret.returnNumber}</span>
                      <span>{ret.totalAmount.toFixed(2)} ج.م ({ret.refundMethod === 'Cash' ? 'نقداً' : 'آجل'})</span>
                    </div>
                    <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                      <span>التاريخ: {formatDate(ret.returnDate)}</span>
                      <span>السبب: {ret.reason}</span>
                    </div>
                    <div className="pt-1 border-t border-amber-200/60 dark:border-amber-900/40 text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">الأصناف المرتجعة: </span>
                      {ret.items.map((ri) => `${ri.productName} (${ri.quantity})`).join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                لا توجد أي عمليات إرجاع مسجلة لهذه الفاتورة حتى الآن.
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReprint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-sm transition shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>طباعة الإيصال الحراري</span>
          </button>

          <div className="flex items-center gap-2">
            {isOwnerOrManager && !isFullyReturned && (
              <button
                type="button"
                onClick={onOpenReturn}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-600/30 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إجراء مرتجع</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-sm transition"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
