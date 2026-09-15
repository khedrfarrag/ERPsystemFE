# Data Model & UI State Specifications: Mobile Responsiveness & Adaptive UX

**Feature**: `013-mobile-responsive-ui-ux`  
**Date**: 2026-09-15  
**Status**: Completed

---

## 1. UI State Entities & Interface Definitions

### 1.1 Mobile Navigation State (`MobileNavState`)
Represents the state of the off-canvas navigation drawer and header controls.

```typescript
export interface MobileNavState {
  /** Indicates whether the off-canvas sidebar drawer is currently open on mobile */
  isDrawerOpen: boolean;
  /** Toggles the mobile drawer open/closed state */
  toggleDrawer: () => void;
  /** Explicitly closes the mobile drawer (triggered on navigation, backdrop click, or ESC key) */
  closeDrawer: () => void;
  /** Explicitly opens the mobile drawer */
  openDrawer: () => void;
}
```

**State Transitions**:
- `Closed` → `Open`: User taps hamburger menu button in header.
- `Open` → `Closed`: User taps navigation link, backdrop overlay, close button (`X`), or presses `Escape`.
- `Open` on viewport resize (`width >= 1024px`): Automatically resets to `Closed` to prevent stale overlays when transitioning to desktop.

---

### 1.2 POS Mobile Cart Sheet State (`MobilePosCartState`)
Represents the state of the mobile POS floating summary bar and slide-up cart bottom sheet.

```typescript
export interface MobilePosCartState {
  /** Controls whether the slide-up cart drawer/bottom-sheet is visible */
  isCartSheetOpen: boolean;
  /** Toggles the cart bottom sheet */
  toggleCartSheet: () => void;
  /** Closes the cart sheet (e.g. when opening payment modal or clicking backdrop) */
  closeCartSheet: () => void;
  /** Opens the cart sheet */
  openCartSheet: () => void;
  /** Total number of items in active cart for mobile badge */
  itemCount: number;
  /** Grand total in EGP for sticky bottom bar display */
  totalAmount: number;
}
```

**State Transitions**:
- `FloatingBarOnly`: When items > 0 or user is browsing products on `< lg`.
- `CartSheetOpen`: When user taps floating cart bar or cart action icon.
- `CartSheetClosed`: When user dismisses sheet, clears cart, or proceeds to `PaymentModal`.

---

### 1.3 Adaptive Data View Mode (`ResponsiveViewMode`)
Defines the presentation mode for management listings (Products, Customers, Sales, Expenses, etc.).

```typescript
export type ResponsiveViewMode = 'auto' | 'table' | 'cards';

export interface ResponsiveCardField<T> {
  label: string;
  render: (item: T) => React.ReactNode;
  highlight?: boolean;
  priority?: 'high' | 'medium' | 'low';
}
```

---

## 2. Breakpoint Matrix & Ergonomic Constraints

| Breakpoint | Viewport Width | Navigation Mode | POS Layout Mode | Data Listings Mode |
|---|---|---|---|---|
| **xs (Mobile Small)** | `< 480px` | Off-canvas Drawer | 2-col Catalog + Sticky Floating Cart Bar + Bottom Sheet | Mobile Card List |
| **sm (Mobile Large)** | `480px - 639px` | Off-canvas Drawer | 2-3 col Catalog + Sticky Floating Cart Bar + Bottom Sheet | Mobile Card List |
| **md (Tablet)** | `640px - 1023px` | Off-canvas Drawer | 3-4 col Catalog + Sticky Cart Bar / Split Sheet | Hybrid (Dense Cards or Scrollable Table) |
| **lg (Desktop Small)** | `1024px - 1279px`| Static Sidebar (64) | Side-by-side (7-col Catalog + 5-col Cart) | Full Desktop Data Table |
| **xl (Desktop Large)** | `>= 1280px` | Static Sidebar (64) | Side-by-side (8-col Catalog + 4-col Cart) | Full Desktop Data Table |

---

## 3. Touch Ergonomics & Accessibility Rules

1. **Minimum Touch Target Size**: All interactive elements (buttons, inputs, icons, tabs, chips) MUST have a bounding box of at least `44px × 44px`.
2. **Safe Area Insets**:
   - `padding-bottom: max(1rem, env(safe-area-inset-bottom))` applied to all sticky bottom bars, floating action buttons, and modal footers.
3. **Typography Scaling**:
   - Inputs, selects, and textareas on mobile viewports MUST use `font-size: 16px` (`text-base`) to avoid iOS Safari viewport scaling / auto-zooming.
   - Headers and data badges scale down gracefully (`text-2xl` on desktop → `text-lg`/`text-xl` on mobile) to eliminate text clipping.
