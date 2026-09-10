import api from '../../../api/client';
import React, { useState } from 'react';
import { FileText, Printer, X, ArrowDownLeft, ArrowUpRight, ChevronDown, ChevronUp, Eye, Loader2 } from 'lucide-react';
import { useSupplierStatementQuery } from '../api/useSuppliersQueries';
import type { Supplier } from '../types/suppliers.types';

interface SupplierStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export const SupplierStatementModal: React.FC<SupplierStatementModalProps> = ({
  isOpen,
  onClose,
  supplier,
}) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [expandedPurchaseId, setExpandedPurchaseId] = useState<string | null>(null);
  const [purchaseDetails, setPurchaseDetails] = useState<Record<string, any>>({});
  const [loadingPurchaseId, setLoadingPurchaseId] = useState<string | null>(null);

  const togglePurchaseDetails = async (purchaseId: string) => {
    if (expandedPurchaseId === purchaseId) {
      setExpandedPurchaseId(null);
      return;
    }
    setExpandedPurchaseId(purchaseId);
    if (!purchaseDetails[purchaseId]) {
      setLoadingPurchaseId(purchaseId);
      try {
        const res = await api.get(`/purchases/${purchaseId}`);
        if (res.data?.data) {
          setPurchaseDetails(prev => ({ ...prev, [purchaseId]: res.data.data }));
        }
      } catch (err) {
        console.error('Failed to load purchase details', err);
      } finally {
        setLoadingPurchaseId(null);
      }
    }
  };

  const { data: statement, isLoading } = useSupplierStatementQuery(
    supplier?.id,
    fromDate || undefined,
    toDate || undefined
  );

  if (!isOpen || !supplier) return null;

  const handlePrint = () => {
    window.print();
  };

  const transactions = statement?.transactions || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in no-print">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                كشف حساب المورد: {supplier.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                سجل فواتير التوريد وسندات الصرف والرصيد التراكمي
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

        {/* Date Filters & Overview */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">من:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">إلى:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>

          <div className="p-1.5 px-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold text-xs">
            <span>المستحقات الحالية: </span>
            <span className="font-mono">{supplier.currentBalance.toFixed(2)} ج.م</span>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="flex-1 overflow-y-auto p-4" id="supplier-statement-print">
          {isLoading ? (
            <div className="text-center py-12 text-slate-600 dark:text-slate-300 text-xs font-bold">
              جاري جلب كشف الحساب...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-600 dark:text-slate-300 text-xs font-bold">
              لا توجد حركات مسجلة في هذه الفترة
            </div>
          ) : (
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3">نوع الحركة</th>
                  <th className="py-2.5 px-3 text-center">المبلغ</th>
                  <th className="py-2.5 px-3 text-center">الرصيد التراكمي</th>
                  <th className="py-2.5 px-3">ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono">
                {transactions.map((t) => {
                  const dateFormatted = new Date(t.date).toLocaleDateString('ar-EG');
                  const isPayment = t.type === 'Payment';

                                    const isExpanded = t.referenceId && expandedPurchaseId === t.referenceId;
                  const purchaseData = t.referenceId ? purchaseDetails[t.referenceId] : null;

                  return (
                    <React.Fragment key={t.id}>
                      <tr className="hover:bg-slate-100/70 dark:hover:bg-slate-700/60 transition-colors border-b border-slate-100 dark:border-slate-800">
                        <td className="py-2.5 px-3">{dateFormatted}</td>
                        <td className="py-2.5 px-3 font-sans font-semibold">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                              isPayment
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40'
                            }`}
                          >
                            {isPayment ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                            <span>{t.type === 'Purchase' ? 'فاتورة مشتريات' : t.type === 'Payment' ? 'سند صرف' : t.type}</span>
                          </span>
                        </td>
                        <td
                          className={`py-2.5 px-3 text-center font-bold ${
                            isPayment ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {isPayment ? `-${t.amount.toFixed(2)}` : `+${t.amount.toFixed(2)}`}
                        </td>
                        <td className="py-2.5 px-3 text-center font-black text-slate-800 dark:text-white">
                          {t.runningBalance.toFixed(2)} ج.م
                        </td>
                        <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                          <div className="flex items-center justify-between gap-2">
                            <span>{t.notes || t.referenceId || '-'}</span>
                            {t.type === 'Purchase' && t.referenceId && (
                              <button
                                type="button"
                                onClick={() => t.referenceId && togglePurchaseDetails(t.referenceId)}
                                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                {loadingPurchaseId === t.referenceId ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : isExpanded ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <Eye className="w-3 h-3" />
                                )}
                                <span>{isExpanded ? 'إخفاء' : 'تفاصيل الفاتورة'}</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Detailed Purchase Breakdown Accordion */}
                      {isExpanded && (
                        <tr className="bg-blue-50/40 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/40 animate-fadeIn">
                          <td colSpan={5} className="p-3">
                            <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-blue-200 dark:border-blue-800 shadow-inner">
                              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
                                <span>📦 تفاصيل بنود الفاتورة ({purchaseData?.purchaseNumber || t.notes}):</span>
                                <span className="text-[11px] text-slate-500 font-mono">
                                  الحالة: {purchaseData?.status === 2 || purchaseData?.status === 'Confirmed' ? 'مؤكدة' : 'مسودة'}
                                </span>
                              </div>

                              {loadingPurchaseId === t.referenceId ? (
                                <div className="text-center py-4 text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
                                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                  <span>جاري تحميل تفاصيل الأصناف...</span>
                                </div>
                              ) : purchaseData?.items?.length ? (
                                <table className="w-full text-right text-[11px]">
                                  <thead>
                                    <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                                      <th className="py-1 px-2">الصنف</th>
                                      <th className="py-1 px-2 text-center">الكمية المستلمة</th>
                                      <th className="py-1 px-2 text-center">سعر الشراء (التكلفة)</th>
                                      <th className="py-1 px-2 text-left">الإجمالي</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                                    {purchaseData.items.map((item: any, idx: number) => (
                                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                        <td className="py-1.5 px-2 font-sans font-medium text-slate-800 dark:text-slate-200">
                                          {item.productName || item.productId}
                                        </td>
                                        <td className="py-1.5 px-2 text-center font-bold text-slate-700 dark:text-slate-300">
                                          {item.quantity}
                                        </td>
                                        <td className="py-1.5 px-2 text-center text-slate-600 dark:text-slate-400">
                                          {item.unitCost?.toFixed(2)} ج.م
                                        </td>
                                        <td className="py-1.5 px-2 text-left font-bold text-emerald-600 dark:text-emerald-400">
                                          {item.subTotal?.toFixed(2)} ج.م
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <div className="text-center py-3 text-xs text-slate-400">
                                  لا توجد بنود مسجلة لهذه الفاتورة
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-extrabold text-white bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 rounded-xl shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة كشف الحساب</span>
          </button>
        </div>
      </div>
    </div>
  );
};
