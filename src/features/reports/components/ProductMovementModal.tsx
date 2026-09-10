import React from 'react';
import { X, History, Calendar, ArrowDownRight, ArrowUpRight, Boxes } from 'lucide-react';
import { useProductStockMovementQuery } from '../api/useReportsQueries';

interface ProductMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  productName: string | null;
}

export const ProductMovementModal: React.FC<ProductMovementModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
}) => {
  const { data, isLoading } = useProductStockMovementQuery(productId);

  if (!isOpen) return null;

  const movements = data?.movements || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-right flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-xl">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                كشف حركة الصنف: {productName}
              </h2>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                الرصيد الحالي بالمخزن:{' '}
                <strong className="text-indigo-600 font-mono">{data?.currentStock ?? 0} قطعة</strong>
              </p>
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
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-400">جاري تحميل كشف الحركة...</p>
            </div>
          ) : movements.length === 0 ? (
            <div className="text-center py-12 text-slate-600 dark:text-slate-300 text-xs font-bold">
              لا توجد حركات مسجلة لهذا الصنف في المخزن حتى الآن.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {movements.map((m) => (
                <div key={m.transactionId} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                        m.quantityChange > 0
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {m.quantityChange > 0 ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {m.reason}
                      </h4>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 block mt-0.5 font-semibold">
                        {new Date(m.date).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        •{' '}
                        {new Date(m.date).toLocaleTimeString('ar-EG', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {m.notes && ` • ${m.notes}`}
                      </span>
                    </div>
                  </div>

                  <div className="text-left">
                    <span
                      className={`font-mono font-bold text-xs block ${
                        m.quantityChange > 0 ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange} قطعة
                    </span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 font-mono font-semibold">
                      الرصيد بعد الحركة: {m.resultingBalance}
                    </span>
                  </div>
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
