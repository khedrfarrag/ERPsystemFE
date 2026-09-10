import React from 'react';
import { Edit, Trash2, FileText, Banknote, Phone, MapPin, ChevronRight, ChevronLeft, ShieldAlert } from 'lucide-react';
import type { Customer } from '../types/customers.types';

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onOpenStatement: (customer: Customer) => void;
  onOpenPayment: (customer: Customer) => void;
  canManage: boolean;
}

export const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  isLoading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onOpenStatement,
  onOpenPayment,
  canManage,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-8 text-center">
        <div className="space-y-3 max-w-lg mx-auto">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-slate-100 dark:bg-slate-700/50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (customers.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center text-slate-400">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">لا يوجد عملاء مطابقون للبحث</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">جرب تغيير معايير البحث أو إضافة عميل جديد</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-extrabold text-slate-800 dark:text-slate-100">
              <th className="py-3.5 px-4">اسم العميل والاتصال</th>
              <th className="py-3.5 px-3">العنوان والملاحظات</th>
              <th className="py-3.5 px-3 text-center">الرصيد / المديونية</th>
              <th className="py-3.5 px-3 text-center">سقف الائتمان</th>
              <th className="py-3.5 px-3">مؤشر استهلاك الائتمان</th>
              <th className="py-3.5 px-4 text-left">إجراءات سريعة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {customers.map((c) => {
              const balance = c.currentBalance || 0;
              const limit = c.creditLimit || 0;
              const hasDebt = balance > 0;
              const isOverLimit = limit > 0 && balance >= limit;
              const isNearLimit = limit > 0 && balance >= limit * 0.85;
              const consumptionPercent = limit > 0 ? Math.min(100, (balance / limit) * 100) : 0;

              return (
                <tr
                  key={c.id}
                  className="hover:bg-slate-100/70 dark:hover:bg-slate-700/60 transition-colors"
                >
                  {/* Name & Phone */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {c.name}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-mono font-semibold mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{c.phone}</span>
                    </div>
                  </td>

                  {/* Address & Notes */}
                  <td className="py-3.5 px-3">
                    {c.address ? (
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate max-w-xs">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{c.address}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">غير محدد</span>
                    )}
                    {c.notes && (
                      <span className="block text-[10px] text-slate-600 dark:text-slate-300 truncate max-w-xs mt-0.5 font-sans font-medium">
                        {c.notes}
                      </span>
                    )}
                  </td>

                  {/* Balance / Debt */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                        isOverLimit
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : hasDebt
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {balance.toFixed(2)} ج.م
                    </span>
                  </td>

                  {/* Credit Limit */}
                  <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                    {limit > 0 ? `${limit.toFixed(2)} ج.م` : 'نقدي فقط (0)'}
                  </td>

                  {/* Credit Consumption Bar */}
                  <td className="py-3.5 px-3 min-w-[130px]">
                    {limit > 0 ? (
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono font-bold text-slate-600 dark:text-slate-300">
                          <span>{consumptionPercent.toFixed(0)}%</span>
                          {isNearLimit && (
                            <span className="text-rose-500 font-bold flex items-center gap-0.5">
                              <ShieldAlert className="w-2.5 h-2.5" />
                              خطر
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              isOverLimit
                                ? 'bg-rose-600'
                                : isNearLimit
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${consumptionPercent}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">غير مفعل</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-left">
                    <div className="flex items-center justify-end gap-1">
                      {/* Receive Payment Button */}
                      <button
                        type="button"
                        onClick={() => onOpenPayment(c)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                        title="تسجيل سند قبض / سداد دفعة"
                      >
                        <Banknote className="w-3.5 h-3.5" />
                        <span>سداد</span>
                      </button>

                      {/* Statement Button */}
                      <button
                        type="button"
                        onClick={() => onOpenStatement(c)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-[11px] transition-colors"
                        title="عرض كشف الحساب التراكمي"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>كشف حساب</span>
                      </button>

                      {canManage && (
                        <>
                          <button
                            type="button"
                            onClick={() => onEdit(c)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 dark:hover:text-emerald-400 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="تعديل بيانات العميل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(c)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 dark:hover:text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف العميل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/50 dark:bg-slate-850/50 flex items-center justify-between">
          <span className="text-xs text-slate-700 dark:text-slate-200 font-bold">
            صفحة <b className="text-slate-800 dark:text-white">{currentPage}</b> من{' '}
            <b className="text-slate-800 dark:text-white">{totalPages}</b> (إجمالي {totalCount} عميل)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
