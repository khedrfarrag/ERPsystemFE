import React from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';
import { useDeleteProductMutation } from '../api/useProductsMutations';
import type { Product } from '../types/products.types';

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export const DeleteProductModal: React.FC<DeleteProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const deleteMutation = useDeleteProductMutation();

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(product.id);
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
            تأكيد حذف الصنف
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            هل أنت متأكد من حذف <b className="text-slate-800 dark:text-white font-bold">"{product.name}"</b> نهائياً؟
          </p>
        </div>

        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-amber-800 dark:text-amber-300 text-[11px] text-right font-medium">
          ⚠️ ملاحظة: إذا كان الصنف مرتبطاً بمبيعات أو فواتير سابقة، يُنصح بتعطيله بدلاً من الحذف للحفاظ على دقة التقارير المالية.
        </div>

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
            disabled={deleteMutation.isPending}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md disabled:opacity-40"
          >
            {deleteMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            <span>حذف نهائي</span>
          </button>
        </div>
      </div>
    </div>
  );
};
