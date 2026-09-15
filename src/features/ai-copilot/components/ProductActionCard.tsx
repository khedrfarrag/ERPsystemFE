import React, { useState } from 'react';
import { PlusCircle, CheckCircle, ShieldAlert, Loader2, Tag, Layers, DollarSign, Package } from 'lucide-react';
import { ProductConfirmAction } from '../types';
import { useAuth } from '../../../context/AuthContext';
import { useCategoriesQuery, useUnitsQuery } from '../../products/api/useProductsQueries';
import { useCreateProductMutation } from '../../products/api/useProductsMutations';
import toast from 'react-hot-toast';

interface Props {
  action: ProductConfirmAction;
}

export const ProductActionCard: React.FC<Props> = ({ action }) => {
  const { isOwnerOrManager } = useAuth();
  const { data: categories = [] } = useCategoriesQuery();
  const { data: units = [] } = useUnitsQuery();
  const createProductMutation = useCreateProductMutation();
  const [created, setCreated] = useState(false);

  const product = action.product;

  const handleConfirm = async () => {
    if (!isOwnerOrManager) {
      toast.error('عذراً، هذا الإجراء يتطلب صلاحية المالك أو المدير.');
      return;
    }

    // Resolve Category ID
    let categoryId = categories.find((c) =>
      c.name.toLowerCase().includes(product.categoryName?.toLowerCase() || '')
    )?.id;
    if (!categoryId && categories.length > 0) {
      categoryId = categories[0].id;
    }

    // Resolve Unit ID
    let unitId = units.find((u) =>
      u.name.toLowerCase().includes(product.unitName?.toLowerCase() || '') ||
      u.symbol?.toLowerCase().includes(product.unitName?.toLowerCase() || '')
    )?.id;
    if (!unitId && units.length > 0) {
      unitId = units[0].id;
    }

    if (!categoryId || !unitId) {
      toast.error('يرجى التأكد من وجود فئات ووحدات مسجلة في المتجر أولاً');
      return;
    }

    try {
      await createProductMutation.mutateAsync({
        name: product.name,
        barcode: product.barcode || undefined,
        categoryId,
        unitId,
        sellingPrice: Number(product.sellingPrice) || 0,
        purchaseCost: Number(product.purchaseCost) || 0,
        minStockLevel: Number(product.minStockLevel) || 5,
        initialStock: product.initialStock !== undefined ? Number(product.initialStock) : undefined,
        wholesalePrice: product.wholesalePrice !== undefined ? Number(product.wholesalePrice) : undefined,
        isWholesaleAvailable: product.isWholesaleAvailable || false
      });

      setCreated(true);
    } catch (err) {
      // Error handled by mutation hook toast
    }
  };

  return (
    <div className="mt-3 p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-slate-800 dark:to-slate-800/90 rounded-xl border border-blue-200 dark:border-blue-800/50 shadow-sm text-right" dir="rtl">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <PlusCircle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-tight">
              بطاقة تأكيد إضافة صنف جديد
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              راجع البيانات واضغط تأكيد لحفظ الصنف ورصيده الافتتاحي
            </span>
          </div>
        </div>
      </div>

      {/* Product Details Grid */}
      <div className="bg-white dark:bg-slate-700/60 rounded-lg p-2.5 border border-slate-200/80 dark:border-slate-600/80 space-y-2 mb-3 text-xs">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-600">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-blue-500" />
            اسم الصنف:
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-100">{product.name}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              القسم:
            </span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{product.categoryName}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Package className="w-3 h-3 text-slate-400" />
              الكمية الافتتاحية:
            </span>
            <span className="font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {product.initialStock ?? 0} {product.unitName || 'وحدة'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              سعر البيع:
            </span>
            <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400">
              {product.sellingPrice} ج.م
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">سعر الشراء:</span>
            <span className="font-mono text-slate-600 dark:text-slate-300">
              {product.purchaseCost ?? 0} ج.م
            </span>
          </div>
        </div>
      </div>

      {/* Action Guard & Confirm Button */}
      {created ? (
        <div className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-700">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>تم تسجيل وحفظ الصنف ورصيده بنجاح!</span>
        </div>
      ) : (
        <div className="relative group">
          <button
            onClick={handleConfirm}
            disabled={!isOwnerOrManager || createProductMutation.isPending}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            {createProductMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري الحفظ في المتجر...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>تأكيد وحفظ في المتجر</span>
              </>
            )}
          </button>

          {!isOwnerOrManager && (
            <div className="mt-1.5 flex items-center justify-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-medium bg-amber-50 dark:bg-amber-950/30 p-1.5 rounded border border-amber-200/60 dark:border-amber-800/40">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>يتطلب صلاحية مالك أو مدير لتأكيد الحفظ في المتجر</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
