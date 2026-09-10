import React from 'react';
import { Receipt, Calendar, CreditCard, Tag, ArrowLeft, ArrowRight, FileText } from 'lucide-react';
import type { ExpenseItem } from '../types/expenses.types';

interface ExpensesTableProps {
  expenses: ExpenseItem[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const ExpensesTable: React.FC<ExpensesTableProps> = ({
  expenses,
  isLoading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (isLoading) {
    return (
      <div className="card text-center py-16">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-500">جاري تحميل سجل المصروفات...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="card text-center py-16 space-y-3">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
          <Receipt className="w-8 h-8" />
        </div>
        <h3 className="text-base font-black text-slate-800 dark:text-white">لا توجد مصروفات مسجلة</h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-sm mx-auto">
          لم يتم العثور على أي مصروفات تطابق معايير البحث المحددة. يمكنك تسجيل مصروف جديد بالضغط على الزر بالأعلى.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="card overflow-hidden p-0 border border-slate-200/80 dark:border-slate-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-extrabold">
              <tr>
                <th className="py-3.5 px-4">التاريخ والوقت</th>
                <th className="py-3.5 px-4">قسم / تصنيف المصروف</th>
                <th className="py-3.5 px-4">البيان / الوصف</th>
                <th className="py-3.5 px-4">طريقة الدفع</th>
                <th className="py-3.5 px-4 text-left">المبلغ (ج.م)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="hover:bg-slate-100/70 dark:hover:bg-slate-700/60 transition-colors"
                >
                  {/* Date */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <div>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 block">
                          {new Date(exp.expenseDate).toLocaleDateString('ar-EG', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold">
                          {new Date(exp.createdAt).toLocaleTimeString('ar-EG', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 font-bold rounded-lg border border-rose-100 dark:border-rose-900/40">
                      <Tag className="w-3 h-3 text-rose-500" />
                      {exp.categoryName}
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 max-w-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{exp.description || '— لا يوجد بيان إضافي —'}</span>
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                        exp.paymentMethod === 'Cash'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200'
                          : exp.paymentMethod === 'BankTransfer'
                          ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300 border border-sky-200'
                          : 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200'
                      }`}
                    >
                      <CreditCard className="w-3 h-3" />
                      {exp.paymentMethod === 'Cash'
                        ? 'نقدي (من الدرج)'
                        : exp.paymentMethod === 'BankTransfer'
                        ? 'تحويل بنكي / محفظة'
                        : 'شيك بنكي'}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3.5 px-4 text-left">
                    <span className="font-mono font-black text-sm text-rose-600 dark:text-rose-400">
                      {exp.amount.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 text-xs text-slate-700 dark:text-slate-200 font-bold">
          <span>
            إجمالي السجلات: <strong className="text-slate-800 dark:text-white font-mono">{totalCount}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="p-2 border rounded-xl disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <span className="font-bold">
              صفحة {currentPage} من {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="p-2 border rounded-xl disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
