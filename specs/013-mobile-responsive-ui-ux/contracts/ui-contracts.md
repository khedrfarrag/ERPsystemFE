# UI Contracts & Component Interfaces: Mobile Responsiveness

**Feature**: `013-mobile-responsive-ui-ux`  
**Date**: 2026-09-15  
**Status**: Completed

---

## 1. Layout & Navigation Contracts

### 1.1 `SidebarProps`
```typescript
export interface SidebarProps {
  /** Indicates whether the off-canvas drawer is open on mobile */
  isOpen?: boolean;
  /** Callback fired when the drawer should close (e.g. backdrop click, navigation, close button) */
  onClose?: () => void;
  /** Optional class name override */
  className?: string;
}
```

### 1.2 `NavbarProps`
```typescript
export interface NavbarProps {
  /** Callback to toggle or open the mobile off-canvas drawer */
  onToggleSidebar?: () => void;
  /** Whether the mobile drawer is currently open */
  isSidebarOpen?: boolean;
}
```

---

## 2. Point of Sale (POS) Mobile Contracts

### 2.1 `PosMobileCartSheetProps`
```typescript
import type { CartItem, PosTotals, Customer } from '../types/pos.types';

export interface PosMobileCartSheetProps {
  /** Whether the slide-up cart sheet is open */
  isOpen: boolean;
  /** Close callback */
  onClose: () => void;
  /** Cart items list */
  items: CartItem[];
  /** Calculated totals object */
  totals: PosTotals;
  /** Selected customer if any */
  customer: Customer | null;
  /** Overall discount percentage or value */
  overallDiscount: number;
  /** Quantity adjustment handler */
  onUpdateQuantity: (productId: string, quantity: number) => void;
  /** Item discount handler */
  onUpdateDiscount: (productId: string, discount: number) => void;
  /** Remove item from cart */
  onRemoveItem: (productId: string) => void;
  /** Open customer selector */
  onOpenCustomerModal: () => void;
  /** Open payment modal */
  onOpenPaymentModal: () => void;
  /** Clear all items from cart */
  onClearCart: () => void;
  /** Update discount handler */
  onSetOverallDiscount: (val: number) => void;
}
```

### 2.2 `PosMobileFloatingBarProps`
```typescript
export interface PosMobileFloatingBarProps {
  /** Total count of items currently in cart */
  itemCount: number;
  /** Total price formatted in EGP */
  totalAmount: number;
  /** Trigger callback when cashier taps the floating bar */
  onOpenCartSheet: () => void;
  /** Trigger callback to directly jump to payment modal if cart is valid */
  onOpenCheckout: () => void;
}
```

---

## 3. Data Cards Mobile Contract

### 3.1 `ProductCardProps`
```typescript
import type { Product } from '../types/products.types';

export interface ProductCardProps {
  product: Product;
  canManage: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onToggleStatus: (product: Product) => void;
}
```

---

## 4. Design System & CSS Token Contracts

### 4.1 Viewport and Safe Areas
- Viewport Meta:
  ```html
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover" />
  ```
- CSS Utilities in `src/index.css`:
  ```css
  /* Mobile Safe Area Padding */
  .pb-safe {
    padding-bottom: max(1rem, env(safe-area-inset-bottom));
  }
  
  /* Touch target utility */
  .touch-target {
    min-height: 44px;
    min-width: 44px;
  }
  ```
