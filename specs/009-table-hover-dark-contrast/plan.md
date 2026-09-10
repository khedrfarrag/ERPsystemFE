# Implementation Plan: 009-table-hover-dark-contrast

**Branch**: `009-table-hover-dark-contrast` | **Date**: 2026-09-06 | **Spec**: [spec.md](./spec.md)  
**Target Module**: RetailOS Frontend (`system-FE`)  
**Input**: User visual bug report detailing invisible text in Dashboard timeline and stock alerts in Dark Mode, and washed-out table headers and table row hover states across all pages.

---

## 1. Summary & Core Strategy

Fix the visual contrast defects identified in the user's screenshots:
1. **Dashboard Timeline & Alerts Contrast**: Update all hardcoded `text-slate-900` and `text-slate-800` titles and descriptions in `src/pages/Dashboard.tsx` to dynamic `text-slate-900 dark:text-white` and `text-slate-800 dark:text-slate-100`. Ensure timestamps, GUIDs, and stock badges remain legible ($ge 4.5:1$ contrast).
2. **Standardized Table Headers (`<thead>`)**: Standardize all table headers across all pages (`ProductsTable`, `CustomersTable`, `SuppliersTable`, `ExpensesTable`, statement modals, and reports) to use solid dark headers in Dark Mode (`bg-slate-100 dark:bg-slate-900`) with bold high-contrast text (`text-slate-800 dark:text-white`).
3. **Harmonious Dark Table Row Hover**: Replace fragile hover classes with robust, solid dark hover states (`hover:bg-slate-100/70 dark:hover:bg-slate-700/60`) that maintain a dark background under the cursor so that white, green, and amber text never wash out.

---

## 2. Technical Context

- **Language/Version**: TypeScript 5.6+, React 19+
- **Styling**: Tailwind CSS v3.4 with `darkMode: 'class'`
- **Component Libraries**: Lucide React icons, Tailwind utility tokens
- **Target Platform**: Modern desktop and tablet browsers (WCAG 2.1 AA compliance)
- **DevTools Protocol**: Chrome DevTools MCP server for automated navigation, script evaluation, and screenshot regression testing

---

## 3. Architecture & File Structure

```text
src/
├── index.css                                     # Global .table-header, .table-row-hover utility classes
├── pages/
│   └── Dashboard.tsx                             # Activity timeline & stock alerts dark contrast fix
├── features/
│   ├── products/components/ProductsTable.tsx     # Header & row hover contrast fix
│   ├── customers/components/
│   │   ├── CustomersTable.tsx                    # Header & row hover contrast fix
│   │   └── CustomerStatementModal.tsx            # Statement ledger table header & hover fix
│   ├── suppliers/components/
│   │   ├── SuppliersTable.tsx                    # Header & row hover contrast fix
│   │   ├── SupplierStatementModal.tsx            # Statement ledger table header & hover fix
│   │   └── CreatePurchaseModal.tsx               # Purchase items table header & hover fix
│   ├── expenses/components/
│   │   ├── ExpensesTable.tsx                     # Header & row hover contrast fix
│   │   └── CashDrawerHistoryModal.tsx            # Cash drawer timeline table header & hover fix
│   └── reports/components/
│       ├── SalesReportTab.tsx                    # Top products table header & hover fix
│       ├── ProfitLossReportTab.tsx               # P&L table rows hover contrast fix
│       ├── InventoryValuationReportTab.tsx       # Valuation table header & hover fix
│       ├── BalancesReportTab.tsx                 # Debtors/creditors table header & hover fix
│       ├── CashRegisterAuditTab.tsx              # Shift reconciliation table header & hover fix
│       └── ProductMovementModal.tsx              # Movement ledger table header & hover fix
```

---

## 4. Phased Execution Roadmap

- **Phase 1: Global Utility Tokens (`index.css`)**: Define standardized `.table-header` and `.table-row` classes with bulletproof dark mode styling.
- **Phase 2: Dashboard Dark Mode Contrast (`Dashboard.tsx`)**: Fix activity timeline names, timestamps, stock shortage alerts, and dead stock cards.
- **Phase 3: Catalog & People Tables (`ProductsTable`, `CustomersTable`, `SuppliersTable`)**: Update table headers and row hover states.
- **Phase 4: Financial & Modal Ledger Tables (`ExpensesTable`, Statements, Purchase Modals)**: Update table headers and row hover states in all overlays.
- **Phase 5: Reports Center Tables**: Update all report table headers and hover states.
- **Phase 6: Live Chrome DevTools Visual Verification & Build**: Verify all pages in browser with screenshots and run `npm run build`.
