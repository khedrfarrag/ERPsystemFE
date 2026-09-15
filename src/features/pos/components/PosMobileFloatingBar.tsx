import React from 'react';
import { ShoppingBag, ChevronUp, CreditCard } from 'lucide-react';
import type { CartTotals } from '../types/pos.types';

export interface PosMobileFloatingBarProps {
  totals: CartTotals;
  onOpenCartSheet: () => void;
  onOpenCheckout: () => void;
}

export const PosMobileFloatingBar: React.FC<PosMobileFloatingBarProps> = ({
  totals,
  onOpenCartSheet,
  onOpenCheckout,
}) => {
  const hasItems = totals.itemCount > 0;

  return (
    <div className="fixed bottom-3 right-3 left-3 z-30 lg:hidden print:hidden animate-in slide-in-from-bottom-3 duration-300">
      <div className="bg-slate-900/95 dark:bg-slate-900/95 text-white backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3">
        {/* Left / Info trigger */}
        <button
          type="button"
          onClick={onOpenCartSheet}
          className="flex-1 flex items-center gap-3 text-right cursor-pointer group min-h-[44px] select-none"
        >
          <div className="relative w-11 h-11 rounded-xl bg-primary-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-primary-600/30 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
            {hasItems && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[11px] font-black flex items-center justify-center ring-2 ring-slate-900 animate-in zoom-in">
                {totals.itemCount}
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
              <span>{hasItems ? `${totals.itemCount} أصناف في الفاتورة` : 'السلة فارغة'}</span>
              <ChevronUp className="w-3.5 h-3.5 text-primary-400 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="font-mono font-black text-emerald-400 text-base leading-tight truncate">
              {totals.grandTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
            </div>
          </div>
        </button>

        {/* Right / Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCartSheet}
            className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition min-h-[44px] flex items-center justify-center cursor-pointer border border-slate-700"
          >
            عرض الفاتورة
          </button>
          <button
            type="button"
            onClick={onOpenCheckout}
            disabled={!hasItems}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-black transition flex items-center gap-1.5 min-h-[44px] shadow-lg shadow-emerald-600/30 active:scale-95 cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>دفع</span>
          </button>
        </div>
      </div>
    </div>
  );
};
