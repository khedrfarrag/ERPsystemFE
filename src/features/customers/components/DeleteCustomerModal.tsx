import React from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { useDeleteCustomerMutation } from '../api/useCustomersMutations';
import type { Customer } from '../types/customers.types';

interface DeleteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const DeleteCustomerModal: React.FC<DeleteCustomerModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const deleteMutation = useDeleteCustomerMutation();

  if (!isOpen || !customer) return null;

  const hasDebt = (customer.currentBalance || 0) > 0;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(customer.id);
      onClose();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-sm overflow-hidden flex flex-col p-6 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <Trash2 className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            تأكيد حذف العميل
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            هل أنت متأكد من حذف حساب <b className="text-slate-800 dark:text-white font-bold">"{customer.name}"</b>؟
          </p>
        </div>

        {hasDebt ? (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-800 dark:text-rose-300 text-xs text-right font-bold">
            ⚠️ تنبيه: العميل عليه مديونية قائمة قدرها {customer.currentBalance.toFixed(2)} ج.م. لا يمكن حذف العميل قبل تسوية الرصيد بالكامل.
          </div>
        ) : (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-800 dark:text-amber-300 text-[11px] text-right font-medium">
            ⚠️ ملاحظة: إذا كان للعميل حركات سابقة، سيتم رفض الحذف من الخادم للحفاظ على دقة التقارير المالية.
          </div>
        )}

        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={hasDebt || deleteMutation.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span>حذف نهائي</span>
          </button>
        </div>
      </div>
    </div>
  );
};
