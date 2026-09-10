import React from 'react';
import { Edit, Trash2, ShoppingBag, FileText, Banknote, Phone, MapPin, ChevronRight, ChevronLeft, UserPlus, Users } from 'lucide-react';
import type { Supplier } from '../types/suppliers.types';

interface SuppliersTableProps {
  suppliers: Supplier[];
  isLoading: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
  onAddRep: (supplier: Supplier) => void;
  onCreatePurchase: (supplier: Supplier) => void;
  onOpenStatement: (supplier: Supplier) => void;
  onOpenPayment: (supplier: Supplier) => void;
  canManage: boolean;
}

export const SuppliersTable: React.FC<SuppliersTableProps> = ({
  suppliers,
  isLoading,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  onDelete,
  onAddRep,
  onCreatePurchase,
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

  if (suppliers.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-12 text-center text-slate-400">
        <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">لا يوجد موردون مطابقون للبحث</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 font-medium">جرب تغيير معايير البحث أو إضافة مورد جديد</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-extrabold text-slate-800 dark:text-slate-100">
              <th className="py-3.5 px-4">اسم المورد والاتصال</th>
              <th className="py-3.5 px-3">العنوان والملاحظات</th>
              <th className="py-3.5 px-3">المندوبون (Sales Reps)</th>
              <th className="py-3.5 px-3 text-center">المستحقات الحالية</th>
              <th className="py-3.5 px-4 text-left">إجراءات سريعة</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {suppliers.map((s) => {
              const balance = s.currentBalance || 0;
              const hasPayables = balance > 0;
              const reps = s.representatives || [];

              return (
                <tr
                  key={s.id}
                  className="hover:bg-slate-100/70 dark:hover:bg-slate-700/60 transition-colors"
                >
                  {/* Name & Phone */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {s.name}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-700 dark:text-slate-300 font-mono font-semibold mt-0.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{s.phone}</span>
                    </div>
                  </td>

                  {/* Address & Notes */}
                  <td className="py-3.5 px-3">
                    {s.address ? (
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 truncate max-w-xs">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{s.address}</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 dark:text-slate-400 text-[10px] font-medium">غير محدد</span>
                    )}
                    {s.notes && (
                      <span className="block text-[10px] text-slate-600 dark:text-slate-300 truncate max-w-xs mt-0.5 font-medium">
                        {s.notes}
                      </span>
                    )}
                  </td>

                  {/* Representatives list / count */}
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {reps.length === 0 ? (
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">لا يوجد مندوب</span>
                      ) : (
                        reps.slice(0, 2).map((r) => (
                          <span
                            key={r.id}
                            className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium"
                            title={`هاتف: ${r.phone}`}
                          >
                            {r.name}
                          </span>
                        ))
                      )}
                      {canManage && (
                        <button
                          type="button"
                          onClick={() => onAddRep(s)}
                          className="p-1 rounded-md bg-slate-50 dark:bg-slate-750 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition-colors"
                          title="إضافة مندوب جديد"
                        >
                          <UserPlus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Payables Balance */}
                  <td className="py-3.5 px-3 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                        hasPayables
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}
                    >
                      {balance.toFixed(2)} ج.م
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-left">
                    <div className="flex items-center justify-end gap-1">
                      {/* New Purchase Invoice */}
                      {canManage && (
                        <button
                          type="button"
                          onClick={() => onCreatePurchase(s)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-bold text-[11px] transition-colors"
                          title="فاتورة توريد وشراء جديدة"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>شراء</span>
                        </button>
                      )}

                      {/* Disburse Payment */}
                      <button
                        type="button"
                        onClick={() => onOpenPayment(s)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 font-bold text-[11px] transition-colors"
                        title="سداد دفعة للمورد"
                      >
                        <Banknote className="w-3.5 h-3.5" />
                        <span>سداد</span>
                      </button>

                      {/* Statement */}
                      <button
                        type="button"
                        onClick={() => onOpenStatement(s)}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-[11px] transition-colors"
                        title="كشف حساب المورد التراكمي"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>كشف حساب</span>
                      </button>

                      {canManage && (
                        <>
                          <button
                            type="button"
                            onClick={() => onEdit(s)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 dark:hover:text-emerald-400 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="تعديل بيانات المورد"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDelete(s)}
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 dark:hover:text-rose-400 hover:bg-rose-50 rounded-lg transition-colors"
                            title="حذف المورد"
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
            <b className="text-slate-800 dark:text-white">{totalPages}</b> (إجمالي {totalCount} مورد)
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
