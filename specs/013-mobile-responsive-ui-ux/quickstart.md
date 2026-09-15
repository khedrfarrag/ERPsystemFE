# Quickstart & Verification Guide: Mobile Responsiveness

**Feature**: `013-mobile-responsive-ui-ux`  
**Date**: 2026-09-15  
**Status**: Completed

---

## 1. Prerequisites & Environment

1. Frontend development server running:
   ```bash
   npm run dev
   ```
2. Open Google Chrome or Microsoft Edge DevTools:
   - Press `F12` or `Ctrl+Shift+I`
   - Toggle Device Toolbar (`Ctrl+Shift+M`)
   - Test using standard device presets:
     - **iPhone SE / Small Phone**: `375 × 667`
     - **iPhone 14 / Standard Phone**: `390 × 844`
     - **Samsung Galaxy / Wide Phone**: `412 × 915`
     - **iPad Mini / Tablet**: `768 × 1024`
     - **Laptop / Desktop**: `1280 × 800`

---

## 2. End-to-End Test Scenarios

### Test 1: Navigation Shell & Drawer
1. Set viewport to `375px`.
2. Verify:
   - Content expands to 100% width with no horizontal scroll bar.
   - Desktop sidebar is hidden.
   - Top navbar displays hamburger menu icon on the right.
3. Tap hamburger icon:
   - Off-canvas drawer slides smoothly from the right side.
   - Screen background is dimmed with a backdrop overlay.
4. Tap any navigation link (e.g. "نقطة البيع الكاشير"):
   - Drawer dismisses automatically.
   - The POS page opens.

### Test 2: Mobile Point of Sale (POS)
1. In `375px` viewport on POS:
   - Verify product catalog renders in a readable 2-column touch-friendly grid.
   - Verify barcode scanner input occupies full width.
2. Tap on 2 different products:
   - Sticky floating cart bar appears at the bottom: `🛒 2 أصناف | XXX.XX ج.م`.
3. Tap the floating cart bar:
   - Slide-up bottom sheet opens displaying the cart items, quantity buttons, discounts, and customer selector.
4. Tap "إتمام الدفع":
   - Payment modal opens as a full-screen/adaptive sheet with large numpad buttons.
5. Complete sale:
   - Receipt modal displays clearly with print and close buttons within reach.

### Test 3: Products Management Dual-View
1. Navigate to `/products` in `375px` viewport:
   - Wide 10-column table is replaced by responsive product cards.
   - Each card cleanly displays: Product name, Barcode, Retail Price, B2B Price, Stock status badge.
   - Action buttons (Edit, Delete, Status Toggle) are spacious and easily tapable (>= 44px).
2. Switch viewport to `1280px` (Desktop):
   - Table immediately appears with full multi-column layout.

### Test 4: Form Input Ergonomics & iOS Auto-Zoom Check
1. On mobile viewport, tap "إضافة صنف جديد" or click search input.
2. Inspect input font size in browser DevTools:
   - Computed font size must be `>= 16px` on mobile screens (`text-base`).
   - Modal does not lock or overflow when simulated on-screen keyboard appears.

---

## 3. Automated Validation Commands

```bash
# Verify TypeScript strict typecheck passes with ZERO errors
npm run build
```
Expected output:
```text
✓ built in ...ms
Exit code: 0
```
