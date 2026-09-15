import React from 'react';
import { Edit, Trash2, Tag, AlertTriangle, XCircle, CheckCircle, Store, Power } from 'lucide-react';
import type { Product } from '../types/products.types';

export interface ProductMobileCardProps {
  product: Product;
  canManage: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
}

export const ProductMobileCard: React.FC<ProductMobileCardProps> = ({
  product,
  canManage,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const cost = product.purchaseCost || 0;
  const price = product.sellingPrice || 0;
  const profit = price - cost;
  const marginPercent = price > 0 ? (profit / price) * 100 : 0;
  const stock = product.currentStock || 0;
  const minStock = product.minStockLevel || 0;
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= minStock;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700 shadow-sm transition-all text-right space-y-3">
      {/* Header: Title, Barcode & Status Badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
            {product.name}
          </h4>
          <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {product.categoryName && (
              <span className="truncate max-w-[120px]">{product.categoryName}</span>
            )}
            {product.barcode && (
              <span className="font-mono bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 rounded text-[11px]">
                {product.barcode}
              </span>
            )}
          </div>
        </div>

        {/* Stock status badge */}
        <div className="shrink-0">
          {isOutOfStock ? (
            <span className="badge badge-danger text-[11px]">
              <XCircle className="w-3 h-3 shrink-0" />
              <span>نفد</span>
            </span>
          ) : isLowStock ? (
            <span className="badge badge-warning text-[11px]">
              <AlertTriangle className="w-3 h-3 shrink-0" />
              <span>نواقص</span>
            </span>
          ) : (
            <span className="badge badge-success text-[11px]">
              <CheckCircle className="w-3 h-3 shrink-0" />
              <span>متوفر</span>
            </span>
          )}
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl text-xs">
        <div>
          <span className="text-slate-600 dark:text-slate-300 block text-[11px]">سعر البيع قطاعي</span>
          <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">
            {price.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
          </span>
        </div>
        <div>
          <span className="text-slate-600 dark:text-slate-300 block text-[11px]">المخزون الحالي</span>
          <span className={`font-bold font-mono text-sm ${isOutOfStock ? 'text-rose-600' : isLowStock ? 'text-amber-600' : 'text-slate-800 dark:text-slate-200'}`}>
            {stock} {product.unitName || 'قطعة'}
          </span>
        </div>
        {product.wholesalePrice !== undefined && product.wholesalePrice > 0 && (
          <div>
            <span className="text-slate-600 dark:text-slate-300 block text-[11px] flex items-center gap-1">
              <Store className="w-3 h-3 text-emerald-500" />
              <span>سعر الجملة B2B</span>
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              {product.wholesalePrice.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </span>
          </div>
        )}
        {cost > 0 && (
          <div>
            <span className="text-slate-600 dark:text-slate-300 block text-[11px]">هامش الربح</span>
            <span className="font-bold text-emerald-600 font-mono">
              {marginPercent.toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      {/* Actions footer */}
      {canManage && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
          {/* Status Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleStatus(product)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
              product.isActive
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{product.isActive ? 'مفعل للبيع' : 'معطل مؤقتاً'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onEdit(product)}
              className="p-2.5 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/50 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center border border-primary-200/60 dark:border-primary-800/60 cursor-pointer"
              aria-label="تعديل الصنف"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(product)}
              className="p-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center border border-rose-200/60 dark:border-rose-800/60 cursor-pointer"
              aria-label="حذف الصنف"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
