import React, { useState } from 'react';
import { FileText, Printer, X, Calendar, DollarSign, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { useCustomerStatementQuery } from '../api/useCustomersQueries';
import type { Customer } from '../types/customers.types';

interface CustomerStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const CustomerStatementModal: React.FC<CustomerStatementModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const { data: statement, isLoading } = useCustomerStatementQuery(
    customer?.id,
    fromDate || undefined,
    toDate || undefined
  );

  if (!isOpen || !customer) return null;

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
                كشف حساب تفصيلي: {customer.name}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                سجل المبيعات والمدفوعات والرصيد التراكمي
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

          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-600 dark:text-slate-300 font-bold ml-1">سقف الائتمان:</span>
              <span className="font-mono font-bold">{(customer.creditLimit || 0).toFixed(2)} ج.م</span>
            </div>
            <div className="p-1.5 px-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold">
              <span>الرصيد الحالي: </span>
              <span className="font-mono">{customer.currentBalance.toFixed(2)} ج.م</span>
            </div>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="flex-1 overflow-y-auto p-4" id="customer-statement-print">
          {isLoading ? (
            <div className="text-center py-12 text-slate-600 dark:text-slate-300 text-xs font-bold">
              جاري جلب كشف الحساب التراكمي...
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-600 dark:text-slate-300 text-xs font-bold">
              لا توجد حركات مالية مسجلة في هذه الفترة
            </div>
          ) : (
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">التاريخ</th>
                  <th className="py-2.5 px-3">نوع الحركة</th>
                  <th className="py-2.5 px-3 text-center">المبلغ</th>
                  <th className="py-2.5 px-3 text-center">الرصيد التراكمي</th>
                  <th className="py-2.5 px-3">المرجع / ملاحظات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono">
                {transactions.map((t) => {
                  const dateFormatted = new Date(t.date).toLocaleDateString('ar-EG');
                  const isPayment = t.type === 'Payment';

                  return (
                    <tr key={t.id} className="hover:bg-slate-100/70 dark:hover:bg-slate-700/60 transition-colors">
                      <td className="py-2.5 px-3">{dateFormatted}</td>
                      <td className="py-2.5 px-3 font-sans font-semibold">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                            isPayment
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}
                        >
                          {isPayment ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                          <span>{t.type === 'Sale' ? 'فاتورة بيع' : t.type === 'Payment' ? 'سند قبض / سداد' : t.type}</span>
                        </span>
                      </td>
                      <td
                        className={`py-2.5 px-3 text-center font-bold ${
                          isPayment ? 'text-emerald-600' : 'text-amber-600'
                        }`}
                      >
                        {isPayment ? `-${t.amount.toFixed(2)}` : `+${t.amount.toFixed(2)}`}
                      </td>
                      <td className="py-2.5 px-3 text-center font-black text-slate-800 dark:text-white">
                        {t.runningBalance.toFixed(2)} ج.م
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-700 dark:text-slate-300 text-[11px] font-medium">
                        {t.notes || t.referenceId || '-'}
                      </td>
                    </tr>
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
            إغلاق
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
