import React from 'react';
import { 
  Percent, 
  AlertTriangle, 
  CheckCircle, 
  PlusCircle, 
  Trash2, 
  Sparkles, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import type { InvoiceScanLineItem } from '../types/ai-invoice.types';

interface InvoiceItemsReviewTableProps {
  items: InvoiceScanLineItem[];
  globalMarkup: number;
  onGlobalMarkupChange: (newMarkup: number) => void;
  onApplyGlobalMarkup: () => void;
  onUpdateItem: (index: number, updated: Partial<InvoiceScanLineItem>) => void;
  onDeleteItem: (index: number) => void;
  onAddItem: () => void;
}

export const InvoiceItemsReviewTable: React.FC<InvoiceItemsReviewTableProps> = ({
  items,
  globalMarkup,
  onGlobalMarkupChange,
  onApplyGlobalMarkup,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
}) => {
  return (
    <div className="space-y-3">
      {/* Global Markup Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-sm">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 dark:text-white block">
              هامش الربح العام المقترح للأصناف الجديدة
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              سعر البيع = سعر التكلفة × (1 + نسبة الربح)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center">
            <input
              type="number"
              min="0"
              max="500"
              step="1"
              value={globalMarkup}
              onChange={(e) => onGlobalMarkupChange(parseFloat(e.target.value) || 0)}
              className="w-20 px-2.5 py-1.5 rounded-xl border border-violet-200 dark:border-violet-800 bg-white dark:bg-slate-800 text-xs font-mono font-bold text-center text-violet-700 dark:text-violet-300 focus:ring-2 focus:ring-violet-500 focus:outline-none"
            />
            <span className="mr-1.5 text-xs font-bold text-violet-600 dark:text-violet-400">%</span>
          </div>

          <button
            type="button"
            onClick={onApplyGlobalMarkup}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>تحديث أسعار الجدول</span>
          </button>
        </div>
      </div>

      {/* Grid Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
        <table className="w-full text-right text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 font-bold">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3 min-w-[170px]">اسم الصنف والوصف</th>
              <th className="py-2.5 px-3 min-w-[120px]">حالة المطابقة</th>
              <th className="py-2.5 px-3 min-w-[110px]">الباركود</th>
              <th className="py-2.5 px-3 min-w-[90px]">التصنيف</th>
              <th className="py-2.5 px-3 min-w-[70px]">الوحدة</th>
              <th className="py-2.5 px-3 min-w-[80px]">الكمية</th>
              <th className="py-2.5 px-3 min-w-[95px]">سعر التكلفة</th>
              <th className="py-2.5 px-3 min-w-[95px]">سعر البيع المقترح</th>
              <th className="py-2.5 px-3 min-w-[95px]">الإجمالي</th>
              <th className="py-2.5 px-3 w-12 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-750">
            {items.map((item, idx) => {
              const isCostZero = item.unitCost <= 0;
              const isBelowCost =
                item.sellingPrice !== null &&
                item.sellingPrice !== undefined &&
                item.unitCost > 0 &&
                item.sellingPrice < item.unitCost;

              return (
                <tr
                  key={idx}
                  className={
                    'hover:bg-slate-50/80 dark:hover:bg-slate-750/50 transition-colors ' +
                    (isCostZero
                      ? 'bg-rose-50/40 dark:bg-rose-950/20'
                      : isBelowCost
                      ? 'bg-amber-50/40 dark:bg-amber-950/20'
                      : '')
                  }
                >
                  {/* Line Number */}
                  <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-[11px]">
                    {idx + 1}
                  </td>

                  {/* Name */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.rawItemName}
                      onChange={(e) => onUpdateItem(idx, { rawItemName: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:ring-1 focus:ring-violet-500 focus:outline-none"
                    />
                  </td>

                  {/* Matching Status */}
                  <td className="py-2 px-3">
                    {!item.isNewProduct ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle className="w-3 h-3" />
                          <span>صنف موجود</span>
                        </span>
                        {item.matchedProductName && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[130px]" title={item.matchedProductName}>
                            {item.matchedProductName}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold border border-indigo-200 dark:border-indigo-800">
                        <Sparkles className="w-3 h-3" />
                        <span>صنف جديد</span>
                      </span>
                    )}
                  </td>

                  {/* Barcode */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.barcode || ''}
                      placeholder="بدون باركود"
                      onChange={(e) => onUpdateItem(idx, { barcode: e.target.value || null })}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono focus:ring-1 focus:ring-violet-500 focus:outline-none"
                    />
                  </td>

                  {/* Category */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.categoryName}
                      onChange={(e) => onUpdateItem(idx, { categoryName: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                    />
                  </td>

                  {/* Unit */}
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={item.unitSymbol}
                      onChange={(e) => onUpdateItem(idx, { unitSymbol: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-center focus:ring-1 focus:ring-violet-500 focus:outline-none"
                    />
                  </td>

                  {/* Quantity */}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min="0.01"
                      step="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const qty = parseFloat(e.target.value) || 0;
                        const subTotal = Math.round(qty * item.unitCost * 100) / 100;
                        onUpdateItem(idx, { quantity: qty, subTotal });
                      }}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-center font-bold focus:ring-1 focus:ring-violet-500 focus:outline-none"
                    />
                  </td>

                  {/* Unit Cost */}
                  <td className="py-2 px-3">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitCost}
                        onChange={(e) => {
                          const cost = parseFloat(e.target.value) || 0;
                          const subTotal = Math.round(item.quantity * cost * 100) / 100;
                          let newSell = item.sellingPrice;
                          if (cost > 0 && globalMarkup > 0) {
                            newSell = Math.round(cost * (1 + globalMarkup / 100) * 100) / 100;
                          }
                          onUpdateItem(idx, {
                            unitCost: cost,
                            subTotal,
                            sellingPrice: newSell,
                            isCostMissingOrZero: cost <= 0,
                            isSellingBelowCost: Boolean(newSell && cost > 0 && newSell < cost),
                          });
                        }}
                        className={
                          'w-full px-2 py-1.5 rounded-lg border text-xs font-mono text-center font-bold focus:outline-none ' +
                          (isCostZero
                            ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 ring-1 ring-rose-500'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800')
                        }
                      />
                      {isCostZero && (
                        <span className="block text-[10px] text-rose-600 font-bold mt-0.5 whitespace-nowrap">
                          التكلفة صفر
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Selling Price */}
                  <td className="py-2 px-3">
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="غير محدد"
                        value={item.sellingPrice ?? ''}
                        onChange={(e) => {
                          const val = e.target.value ? parseFloat(e.target.value) : null;
                          onUpdateItem(idx, {
                            sellingPrice: val,
                            isSellingBelowCost: Boolean(val && item.unitCost > 0 && val < item.unitCost),
                          });
                        }}
                        className={
                          'w-full px-2 py-1.5 rounded-lg border text-xs font-mono text-center font-bold focus:outline-none ' +
                          (isBelowCost
                            ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 ring-1 ring-amber-500'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400')
                        }
                      />
                      {isBelowCost && (
                        <div className="flex items-center gap-0.5 text-[10px] text-amber-600 dark:text-amber-400 font-bold mt-0.5">
                          <AlertTriangle className="w-3 h-3 shrink-0" />
                          <span>أقل من التكلفة</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Subtotal */}
                  <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                    {item.subTotal.toFixed(2)}
                  </td>

                  {/* Delete Button */}
                  <td className="py-2 px-3 text-center">
                    <button
                      type="button"
                      title="حذف هذا الصنف"
                      onClick={() => onDeleteItem(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <div className="flex justify-start">
        <button
          type="button"
          onClick={onAddItem}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/30 text-xs font-bold transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>إضافة بند إضافي يدوياً</span>
        </button>
      </div>
    </div>
  );
};
