import { settingsApi } from '../../settings/api/settingsApi';
import { useState, useCallback, useMemo, useEffect } from 'react';
import toast from 'react-hot-toast';
import type { CartItem, CartTotals, CustomerCreditInfo, PosProduct } from '../types/pos.types';

const STORAGE_KEY = 'retailos_pos_cart';

export function usePosCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerCreditInfo | null>(null);
  const [overallDiscount, setOverallDiscount] = useState<number>(0);

  // Sync to sessionStorage for temporary recovery
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('SessionStorage save failed', e);
    }
  }, [items]);

  // Add Item to Cart
  const addItem = useCallback((product: PosProduct, quantity = 1) => {
    if (product.currentStock <= 0) {
      toast.error(`المنتج "${product.name}" غير متوفر في المخزون حالياً`);
      return false;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.productId === product.id);

      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const newQty = existing.quantity + quantity;

        if (newQty > product.currentStock) {
          toast.error(`الكمية المطلوبة تتجاوز المخزون المتاح (${product.currentStock} ${product.unitName || 'قطعة'})`);
          return prevItems;
        }

        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          total: (existing.unitPrice * newQty) - existing.discount,
        };
        toast.success(`تمت زيادة كمية "${product.name}" (${newQty})`, { duration: 1500 });
        return updated;
      }

      // Add fresh item
      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        barcode: product.barcode,
        unitName: product.unitName,
        unitPrice: product.sellingPrice,
        quantity: Math.min(quantity, product.currentStock),
        discount: 0,
        maxStock: product.currentStock,
        total: product.sellingPrice * Math.min(quantity, product.currentStock),
      };

      toast.success(`تمت إضافة "${product.name}" للسلة`, { duration: 1500 });
      return [newItem, ...prevItems];
    });

    return true;
  }, []);

  // Update Quantity
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity < 1) return;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId) {
          if (quantity > item.maxStock) {
            toast.error(`الكمية المطلوبة تتجاوز المخزون المتاح (${item.maxStock})`);
            return item;
          }
          return {
            ...item,
            quantity,
            total: (item.unitPrice * quantity) - item.discount,
          };
        }
        return item;
      })
    );
  }, []);

  // Update Line Discount
  const updateItemDiscount = useCallback((productId: string, discount: number) => {
    if (discount < 0) return;

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.productId === productId) {
          const maxAllowed = item.unitPrice * item.quantity;
          const safeDiscount = Math.min(discount, maxAllowed);
          return {
            ...item,
            discount: safeDiscount,
            total: maxAllowed - safeDiscount,
          };
        }
        return item;
      })
    );
  }, []);

  // Remove Item
  const removeItem = useCallback((productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
    toast.success('تم حذف الصنف من السلة', { duration: 1500 });
  }, []);

  // Clear Cart
  const clearCart = useCallback(() => {
    setItems([]);
    setOverallDiscount(0);
    sessionStorage.removeItem(STORAGE_KEY);
    toast.success('تم تفريغ السلة بنجاح');
  }, []);

    // Check if VAT 14% is enabled for store
  const [isTaxEnabled, setIsTaxEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('retailos_store_tax_enabled') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    settingsApi.getStoreProfile().then((store) => {
      if (store) {
        setIsTaxEnabled(!!store.taxEnabled);
        localStorage.setItem('retailos_store_tax_enabled', String(!!store.taxEnabled));
      }
    }).catch(() => {});
  }, []);

  // Memoized Totals Calculation
  const totals: CartTotals = useMemo(() => {
    let subtotal = 0;
    let lineDiscounts = 0;
    let totalUnits = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      subtotal += item.unitPrice * item.quantity;
      lineDiscounts += item.discount;
      totalUnits += item.quantity;
    }

    const totalDiscount = lineDiscounts + (overallDiscount || 0);
    const taxableSubtotal = Math.max(0, subtotal - totalDiscount);
    const taxAmount = isTaxEnabled ? Number((taxableSubtotal * 0.14).toFixed(2)) : 0;
    const grandTotal = taxableSubtotal + taxAmount;

    return {
      subtotal,
      totalDiscount,
      taxAmount,
      grandTotal,
      itemCount: items.length,
      totalUnits,
    };
  }, [items, overallDiscount, isTaxEnabled]);

  return {
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
  };
}
