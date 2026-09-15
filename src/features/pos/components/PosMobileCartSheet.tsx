import React, { useEffect } from 'react';
import { X, ShoppingBag } from 'lucide-react';
import { PosCart } from './PosCart';
import { PosSummary } from './PosSummary';
import type { CartItem, CartTotals, CustomerCreditInfo } from '../types/pos.types';

export interface PosMobileCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totals: CartTotals;
  customer: CustomerCreditInfo | null;
  overallDiscount: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onUpdateDiscount: (productId: string, discount: number) => void;
  onRemoveItem: (productId: string) => void;
  onOpenCustomerModal: () => void;
  onOpenPaymentModal: () => void;
  onClearCart: () => void;
  onSetOverallDiscount: (discount: number) => void;
}

export const PosMobileCartSheet: React.FC<PosMobileCartSheetProps> = ({
  isOpen,
  onClose,
  items,
  totals,
  customer,
  overallDiscount,
  onUpdateQuantity,
  onUpdateDiscount,
  onRemoveItem,
  onOpenCustomerModal,
  onOpenPaymentModal,
  onClearCart,
  onSetOverallDiscount,
}) => {
  // Lock body scrolling when bottom sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="lg:hidden print:hidden fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* Slide-Up Bottom Sheet */}
      <div className="relative z-10 w-full max-h-[88vh] bg-slate-50 dark:bg-slate-900 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Handle Bar & Header */}
        <div className="p-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                الفاتورة الحالية ({totals.itemCount} صنف)
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                الإجمالي: {totals.grandTotal.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق الفاتورة"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition touch-target flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[160px] max-h-[42vh]">
          <PosCart
            items={items}
            onUpdateQuantity={onUpdateQuantity}
            onUpdateDiscount={onUpdateDiscount}
            onRemoveItem={onRemoveItem}
          />
        </div>

        {/* Summary & Checkout Sticky Footer */}
        <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 shrink-0 pb-safe">
          <PosSummary
            totals={totals}
            customer={customer}
            onOpenCustomerModal={() => {
              onClose();
              onOpenCustomerModal();
            }}
            onOpenPaymentModal={() => {
              onClose();
              onOpenPaymentModal();
            }}
            onClearCart={onClearCart}
            overallDiscount={overallDiscount}
            onSetOverallDiscount={onSetOverallDiscount}
          />
        </div>
      </div>
    </div>
  );
};
