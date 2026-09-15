import React from 'react';
import { Layers, ChevronLeft, PackageCheck } from 'lucide-react';
import { ProductDisambiguationAction } from '../types';

interface Props {
  action: ProductDisambiguationAction;
  onSelectVariant: (variantName: string) => void;
}

export const ProductDisambiguationCard: React.FC<Props> = ({ action, onSelectVariant }) => {
  const variants = action.variants || [];

  return (
    <div className="mt-3 p-3 bg-gradient-to-br from-amber-50 to-orange-50/60 dark:from-slate-800 dark:to-slate-800/90 rounded-xl border border-amber-200 dark:border-amber-800/50 shadow-sm text-right" dir="rtl">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-tight">
            تعدد الأصناف المتطابقة ({action.query})
          </h4>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            انقر على الصنف المطلوب لعرض تفاصيل حركته وأدائه المالي بدقة:
          </span>
        </div>
      </div>

      <div className="space-y-1.5 mt-2.5">
        {variants.map((v) => (
          <button
            key={v.id}
            onClick={() => onSelectVariant(`ما هو تاريخ وأداء صنف ${v.name}؟`)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-700/80 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 transition-all text-xs group text-right active:scale-[0.99]"
          >
            <div className="flex items-center gap-2 min-w-0">
              <PackageCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div className="truncate">
                <span className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                  {v.name}
                </span>
                {v.categoryName && (
                  <span className="text-[10px] text-slate-400 mr-2">({v.categoryName})</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 mr-2 text-[11px]">
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                {v.sellingPrice} ج.م
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                رصيد: {v.currentStock}
              </span>
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-colors rtl:rotate-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
