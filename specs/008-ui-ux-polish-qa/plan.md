# Implementation Plan: 008-ui-ux-polish-qa

**Feature**: Comprehensive UI/UX Testing, Theme & Color Contrast Standardization, Edge Cases & Visual Polish  
**Target Module**: RetailOS Frontend (`system-FE`)  
**Status**: Approved & Ready for Tasks  

---

## 1. Technical Context & Design System Standard

- **Typography**: Cairo Google Font (Arabic-first), with explicit weights: `font-bold` (700), `font-black` (900), and `font-semibold` (600).
- **Color Contrast Standard (WCAG 2.1 AA)**:
  - Primary text: `text-slate-900 dark:text-white` (Contrast ratio > 12:1).
  - Secondary text / descriptive labels: `text-slate-600 dark:text-slate-300` (Contrast ratio > 7:1) instead of `text-slate-400`.
  - Placeholder text: `placeholder:text-slate-400 dark:placeholder:text-slate-500`.
  - Input field text: `text-slate-900 dark:text-white` with background `bg-white dark:bg-slate-800` and border `border-slate-300 dark:border-slate-600`.
  - Financial numbers: `font-mono font-bold` or `font-black` with distinct colors: Emerald for revenue/inflows/profit, Rose for expenses/outflows/deficit/loss, Amber for credit/payables/pending, Indigo for totals and valuations.
- **Modals Architecture**:
  - Modal structure: `max-h-[90vh] flex flex-col` with scrollable body (`overflow-y-auto flex-1`) and sticky footer actions (`border-t p-4 flex justify-end shrink-0`) to ensure submit buttons are never pushed off-screen.

---

## 2. File-by-File Audit & Refactor Roadmap

```text
src/
├── index.css (Global design tokens, contrast utilities, card/input/badge enhancements)
├── components/layout/
│   ├── Navbar.tsx (Contrast in shift status, user profile, drawer badge)
│   └── Sidebar.tsx (Contrast in active/inactive nav links, icons, store badge)
├── pages/
│   ├── Dashboard.tsx (Contrast in KPI cards, sales trend tooltips, bestsellers, activity logs)
│   ├── Pos.tsx (Contrast in POS catalog, cart item controls, payment modal, thermal receipt)
│   ├── Products.tsx (Contrast in filter bar, table cells, profit calculation alert, modals)
│   ├── Customers.tsx (Contrast in debt badges, statement ledger, receive payment modal)
│   ├── Suppliers.tsx (Contrast in payables table, purchase order items, payment modal)
│   ├── Expenses.tsx (Contrast in drawer metrics, filter bar, close register discrepancy indicator)
│   ├── Reports.tsx (Contrast in tab switcher, P&L statement, valuation table, print layout)
│   └── Login.tsx (Contrast in login box, role credentials badges, error alerts)
```

---

## 3. Phased Implementation Roadmap

1. **Phase 1: Global Design Tokens & Typography (`index.css`)**:
   - Establish high-contrast base utility classes for cards, buttons, badges, tables, and form inputs in both light and dark themes.
2. **Phase 2: Layout & Navigation Contrast (`Navbar.tsx`, `Sidebar.tsx`)**:
   - Ensure cashier shift badge, live drawer indicator, search triggers, and active navigation links have crystal-clear contrast.
3. **Phase 3: Core Operation Pages (POS & Dashboard)**:
   - Audit and upgrade text colors, quantity controls, cart items, payment modal choices, and thermal receipt in POS.
   - Audit Dashboard KPI cards, chart tooltips, and lists.
4. **Phase 4: Catalog & People Pages (Products, Customers, Suppliers)**:
   - Enhance all table headers, row typography, search bars, category tags, debt indicators, and statement ledgers.
5. **Phase 5: Financial Operations (Expenses & Cash Drawer)**:
   - Enhance live drawer balance card, discrepancy alert box (Surplus/Deficit/Balanced), and history timeline.
6. **Phase 6: Executive Reporting & Printing (Reports)**:
   - Enhance tab navigation, P&L table rows, WAC inventory valuation table, and clean print styles (`@media print`).
7. **Phase 7: End-to-End DevTools Verification & Build**:
   - Verify all pages in browser with Chrome DevTools tools, checking network calls, UI rendering, and run `npm run build` to verify 0 errors.
