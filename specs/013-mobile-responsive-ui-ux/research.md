# Research & Architectural Decisions: Mobile Responsiveness & Adaptive UI/UX Architecture

**Feature**: `013-mobile-responsive-ui-ux`  
**Date**: 2026-09-15  
**Status**: Completed

---

## 1. Shell Layout & Off-Canvas Mobile Drawer

### Context
In `src/components/layout/Layout.tsx`, line 19 currently hardcodes `mr-64` (margin-right: 16rem = 256px in RTL), and `Sidebar.tsx` has `w-64 fixed right-0 top-0 h-screen z-30`. On mobile viewports (< 1024px, specifically 360px - 480px), this fixed margin consumes 60-70% of the screen width, rendering the layout completely unusable. Furthermore, there is no hamburger toggle button in `Navbar.tsx`.

### Decision
1. **Adaptive Margin**: Update `Layout.tsx` to use responsive right margin: `mr-0 lg:mr-64`.
2. **Off-Canvas Drawer Pattern**:
   - Convert `Sidebar.tsx` into a hybrid component:
     - On desktop (`lg:` and up): Render as a static fixed sidebar (`w-64 fixed right-0 top-0 h-screen`).
     - On mobile/tablet (`< lg`): Render as a sliding off-canvas drawer that opens from the right edge (`translate-x-full` when closed, `translate-x-0` when open) with a dimmed backdrop overlay (`bg-slate-900/60 backdrop-blur-xs`).
3. **Drawer State Management**:
   - Manage mobile open/close state via custom event or lightweight context/state passed to `Navbar` and `Sidebar`. Clicking any navigation link or backdrop overlay immediately closes the mobile drawer.
   - Lock body scrolling (`document.body.style.overflow = 'hidden'`) when drawer is open on mobile to prevent double-scroll friction.
4. **Navbar Adaptation**:
   - Add a prominent, touch-friendly Hamburger Menu toggle button (`w-10 h-10` touch target) on the right side of `Navbar.tsx` visible only on `< lg`.
   - On small screens, collapse secondary stats into a compact summary or dropdown menu to prevent header overflow.

### Rationale
- Pure Tailwind CSS transition classes (`transition-transform duration-300 ease-in-out`) without adding external heavy UI libraries.
- Adheres strictly to **Constitution Principle IV (True RTL & High-Speed POS UX)** and modern touch ergonomics.

### Alternatives Considered
- *Bottom Navigation Bar only*: Rejected as sole navigation because RetailOS has 10+ role-based navigation destinations (POS, Products, Customers, Suppliers, Expenses, Sales, B2B Orders, Reports, Settings). An off-canvas drawer provides full access to all sections cleanly.
- *Third-party drawer library (e.g. headlessui, vaul)*: Rejected to avoid unnecessary dependency overhead and maintain React 19 compatibility.

---

## 2. Point of Sale (POS) Mobile Adaptive Workflow

### Context
`src/pages/Pos.tsx` is built with `h-[calc(100vh-5rem)]`, `overflow-hidden`, and a 2-column grid (`lg:grid-cols-12`). On mobile screens:
- Catalog and cart stack vertically.
- Because the outer container has `overflow-hidden` and fixed height, the cart, summary totals, and checkout buttons are pushed off-screen and become inaccessible.
- Cashiers on smartphones cannot complete a sale.

### Decision
Implement an **Adaptive Floating Cart Sheet Pattern** (industry standard for mobile POS like Shopify POS and Square):
1. **Catalog Priority on Mobile**:
   - On mobile screens (`< lg`), the main view is dedicated to the visual catalog and barcode scanner input with a 2-column grid.
   - Products are touch-optimized with larger touch areas (minimum 44px tap targets).
2. **Floating Bottom Cart Summary Bar**:
   - On `< lg`, render a sticky floating bottom bar displaying:
     - Cart item count badge: `🛒 X أصناف`
     - Live total amount in EGP: `XXX.XX ج.م`
     - Immediate CTA button: `عرض الفاتورة ↗` / `إتمام البيع`
3. **Slide-Up Bottom Sheet Cart Drawer**:
   - Clicking the floating summary bar opens a slide-up bottom sheet containing `PosCart` and `PosSummary`.
   - Cashiers can adjust quantities (`+` / `-`), delete items, select customer, apply discounts, and proceed to payment modal directly from the bottom sheet.
4. **Desktop Preservation**:
   - On desktop (`lg:` and up), retain the side-by-side catalog vs cart layout.

### Rationale
- Cashiers can operate with one hand while on the store floor or popup counter.
- Zero horizontal layout shift (CLS = 0) and immediate access to checkout at all times.

---

## 3. Data Tables vs Mobile Card Views (Dual-View Pattern)

### Context
Management pages (`Products`, `Sales`, `Customers`, `Suppliers`, `Expenses`, `Merchants`, `B2BOrders`) render data tables with 8 to 11 columns inside `overflow-x-auto`. On a 375px phone screen, users must scroll back and forth horizontally to read item names, stocks, and actions.

### Decision
Implement the **Dual-View Pattern**:
1. **Desktop View (`hidden lg:table` or `hidden md:block`)**:
   - Keep the existing high-density data tables for large displays with keyboard shortcuts and table hover effects.
2. **Mobile Card List View (`block lg:hidden` or `block md:hidden`)**:
   - Render responsive cards for each item:
     - **Header**: Item title/name (bold, 14-16px), status badge (e.g., In Stock, Low Stock, Active).
     - **Body**: Key metric pairs in a compact 2-column grid (e.g., Price vs Cost, Current Stock vs Min Stock, Customer Phone vs Debt Balance).
     - **Footer**: Quick touch action buttons (Edit, Delete, Toggle Status) with full touch targets >= 44px.
3. **Filter Bars Adaptation**:
   - Search inputs take full width on mobile (`w-full`).
   - Filter dropdowns and action buttons wrap into clean rows or horizontal scrolling chips (`overflow-x-auto no-scrollbar flex-nowrap`).

---

## 4. Ergonomics, Touch Targets & iOS Auto-Zoom Prevention

### Context
1. iOS Safari automatically zooms in on any `<input>`, `<select>`, or `<textarea>` whose font-size is below 16px (`1rem`), disorienting the user and requiring manual pinch-to-zoom out.
2. Small action icons (e.g., edit/delete buttons in tables) are around 28-32px, causing mis-clicks on mobile touchscreens.
3. Mobile viewports require safe-area padding for bottom navigation bars, home indicators, and notches.

### Decision
1. **Input Font Size Standard**:
   - In `src/index.css`, ensure `.input` has `text-base sm:text-xs` (16px on mobile screens, 12px on desktop) to completely eliminate iOS Safari auto-zoom.
2. **Touch Targets (WCAG 2.2 Level AA)**:
   - Ensure all interactive buttons, icon buttons, and navigation links have a minimum target size of `44x44px` (or `min-h-[44px] min-w-[44px]`).
3. **HTML & Viewport Standard**:
   - Update `index.html` to declare `lang="ar"` and `dir="rtl"`.
   - Set viewport meta to `width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover`.
   - Add Tailwind safe-area utility support for `pb-safe` (`padding-bottom: env(safe-area-inset-bottom)`).
