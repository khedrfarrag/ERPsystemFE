import React, { useState, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePosCart } from '../features/pos/hooks/usePosCart';
import { usePosShortcuts } from '../features/pos/hooks/usePosShortcuts';
import { BarcodeScannerInput } from '../features/pos/components/BarcodeScannerInput';
import { ProductCatalogGrid } from '../features/pos/components/ProductCatalogGrid';
import { PosCart } from '../features/pos/components/PosCart';
import { PosSummary } from '../features/pos/components/PosSummary';
import { CustomerSelectModal } from '../features/pos/components/CustomerSelectModal';
import { PaymentModal } from '../features/pos/components/PaymentModal';
import { ReceiptModal } from '../features/pos/components/ReceiptModal';
import type { PosProduct, SaleResponseData } from '../features/pos/types/pos.types';

export const Pos: React.FC = () => {
  const { user } = useAuth();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [completedSale, setCompletedSale] = useState<SaleResponseData | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState<boolean>(false);

  // Cart Hook
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateItemDiscount,
    clearCart,
    totals,
    overallDiscount,
    setOverallDiscount,
    selectedCustomer,
    setSelectedCustomer,
  } = usePosCart();

  // Focus Search Shortcut Handler
  const handleFocusSearch = useCallback(() => {
    searchInputRef.current?.focus();
    searchInputRef.current?.select();
  }, []);

  // Open Checkout Handler
  const handleOpenCheckout = useCallback(() => {
    if (totals.itemCount > 0) {
      setIsPaymentModalOpen(true);
    }
  }, [totals.itemCount]);

  // Close All Modals Handler
  const handleCloseModals = useCallback(() => {
    setIsCustomerModalOpen(false);
    setIsPaymentModalOpen(false);
    setIsReceiptModalOpen(false);
  }, []);

  // Register Global Keyboard Shortcuts
  usePosShortcuts({
    onFocusSearch: handleFocusSearch,
    onOpenCheckout: handleOpenCheckout,
    onCloseModals: handleCloseModals,
    canCheckout: totals.itemCount > 0,
  });

  // Handle Barcode/Product Click Addition
  const handleProductSelect = useCallback(
    (product: PosProduct) => {
      addItem(product, 1);
      // Auto-refocus scanner input for continuous rapid scanning
      searchInputRef.current?.focus();
    },
    [addItem]
  );

  // Handle Successful Checkout
  const handleSaleSuccess = useCallback(
    (sale: SaleResponseData) => {
      setIsPaymentModalOpen(false);
      clearCart();
      setCompletedSale(sale);
      setIsReceiptModalOpen(true);
    },
    [clearCart]
  );

  return (
    <div className="h-[calc(100vh-5rem)] flex flex-col gap-3">
      {/* Top Header Bar */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm shrink-0">
        <BarcodeScannerInput
          onProductFound={handleProductSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          inputRef={searchInputRef}
        />
      </div>

      {/* Main Interactive Screen Grid: Catalog vs Cart */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0 overflow-hidden">
        {/* Left/Main Column: Visual Catalog Grid */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col min-h-0">
          <ProductCatalogGrid
            onSelectProduct={handleProductSelect}
            searchQuery={searchQuery}
          />
        </div>

        {/* Right Column: Live Cart & Memoized Summary */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-3 min-h-0">
          <PosCart
            items={items}
            onUpdateQuantity={updateQuantity}
            onUpdateDiscount={updateItemDiscount}
            onRemoveItem={removeItem}
          />

          <PosSummary
            totals={totals}
            customer={selectedCustomer}
            onOpenCustomerModal={() => setIsCustomerModalOpen(true)}
            onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
            onClearCart={clearCart}
            overallDiscount={overallDiscount}
            onSetOverallDiscount={setOverallDiscount}
          />
        </div>
      </div>

      {/* Modals */}
      <CustomerSelectModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        selectedCustomer={selectedCustomer}
        onSelectCustomer={setSelectedCustomer}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totals={totals}
        items={items}
        customer={selectedCustomer}
        onSaleSuccess={handleSaleSuccess}
      />

      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        sale={completedSale}
        storeName={user?.storeName || 'مؤسسة ريتيل أو إس التجارية'}
        cashierName={`${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'الكاشير'}
      />
    </div>
  );
};

export const PosPage = Pos;
export default Pos;
