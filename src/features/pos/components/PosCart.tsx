import React from 'react';
import { Plus, Minus, Trash2, ShoppingCart, Tag, AlertCircle } from 'lucide-react';
import type { CartItem } from '../types/pos.types';

interface PosCartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onUpdateDiscount: (productId: string, discount: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const PosCart: React.FC<PosCartProps> = ({
  items,
  onUpdateQuantity,
  onUpdateDiscount,
  onRemoveItem,
}) => {
  if (items.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400">
          <ShoppingCart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
          سلة المبيعات فارغة
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xs">
          امسح باركود المنتج أو اختر من قائمة الأصناف لإضافته إلى الفاتورة الحالية
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300">
        <span className="col-span-5">الصنف</span>
        <span className="col-span-2 text-center">السعر</span>
        <span className="col-span-3 text-center">الكمية</span>
        <span className="col-span-2 text-left">الإجمالي</span>
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 p-2 space-y-1">
        {items.map((item) => {
          const isAtMaxStock = item.quantity >= item.maxStock;

          return (
            <div
              key={item.productId}
              className="grid grid-cols-12 gap-2 items-center p-3 rounded-xl hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors"
            >
              {/* Product Info */}
              <div className="col-span-5 pr-1">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate" title={item.productName}>
                  {item.productName}
                </h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                  {item.barcode && <span className="font-mono">{item.barcode}</span>}
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    متاح: {item.maxStock}
                  </span>
                </div>
              </div>

              {/* Unit Price */}
              <div className="col-span-2 text-center font-bold text-slate-800 dark:text-slate-200 text-sm">
                {item.unitPrice.toFixed(2)}
              </div>

              {/* Quantity Controls */}
              <div className="col-span-3 flex items-center justify-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  type="number"
                  min="1"
                  max={item.maxStock}
                  value={item.quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) onUpdateQuantity(item.productId, val);
                  }}
                  className="w-11 text-center py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />

                <button
                  type="button"
                  onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                  disabled={isAtMaxStock}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  title={isAtMaxStock ? 'تم الوصول للحد الأقصى للمخزون' : 'زيادة'}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Line Total & Remove */}
              <div className="col-span-2 flex items-center justify-between pl-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">
                  {item.total.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.productId)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  title="حذف من الفاتورة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
