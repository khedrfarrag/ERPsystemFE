import React from 'react';
import { X, History, Calendar, ArrowDownRight, ArrowUpRight, Lock, Unlock, FileText } from 'lucide-react';
import { useCashRegisterTransactionsQuery } from '../api/useExpensesQueries';

interface CashDrawerHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CashDrawerHistoryModal: React.FC<CashDrawerHistoryModalProps> = ({ isOpen, onClose }) => {
  const { data: transactions = [], isLoading } = useCashRegisterTransactionsQuery();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-right flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">سجل حركات وتسويات درج الكاشير</h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">تتبع التدفقات النقدية والعهد والجرد</p>
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-slate-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400">جاري تحميل سجل الحركات...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-600 dark:text-slate-300 text-xs font-bold">
              لا توجد حركات مسجلة للدرج حتى الآن.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        tx.type === 'OPENING_FLOAT'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60'
                          : tx.type === 'SALE' || tx.type === 'CUSTOMER_PAYMENT'
                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-950/60'
                          : tx.type === 'CLOSE'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60'
                      }`}
                    >
                      {tx.type === 'OPENING_FLOAT' ? (
                        <Unlock className="w-4 h-4" />
                      ) : tx.type === 'CLOSE' ? (
                        <Lock className="w-4 h-4" />
                      ) : tx.type === 'SALE' || tx.type === 'CUSTOMER_PAYMENT' ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {tx.type === 'OPENING_FLOAT'
                          ? 'عهدة افتتاحية'
                          : tx.type === 'SALE'
                          ? 'مبيعات نقدية (POS)'
                          : tx.type === 'CUSTOMER_PAYMENT'
                          ? 'تحصيل دين عميل'
                          : tx.type === 'EXPENSE'
                          ? 'مصروف تشغيلي'
                          : tx.type === 'SUPPLIER_PAYMENT'
                          ? 'سداد مورد نقدي'
                          : 'تقفيل الوردية'}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-300 font-semibold mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(tx.date).toLocaleDateString('ar-EG', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          •{' '}
                          {new Date(tx.date).toLocaleTimeString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {tx.notes && <span>• {tx.notes}</span>}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-mono font-bold text-xs ${
                      tx.type === 'EXPENSE' || tx.type === 'SUPPLIER_PAYMENT'
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {tx.type === 'EXPENSE' || tx.type === 'SUPPLIER_PAYMENT' ? '-' : '+'}
                    {tx.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 font-bold text-xs rounded-xl"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
