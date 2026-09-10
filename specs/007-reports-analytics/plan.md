# Implementation Plan: 007-reports-analytics

**Feature**: Comprehensive Financial, Sales, Inventory Valuation & Cash Audit Reports  
**Target Module**: RetailOS Frontend (`system-FE`)  
**Status**: Approved & Ready for Tasks  

---

## 1. Technical Context & Stack Alignment

- **Framework**: React 19 + TypeScript 5.8 + Vite 8.2
- **Styling & Visualization**: Tailwind CSS v3, Recharts (Bar/Area/Pie charts), Lucide React icons, Arabic Cairo font with RTL alignment and clean print styles (`@media print`).
- **Data Fetching**: TanStack Query v5 (`@tanstack/react-query`) with date range query caching.
- **Backend Endpoints**:
  - `GET /api/reports/sales`
  - `GET /api/reports/profit-loss`
  - `GET /api/reports/inventory/valuation`
  - `GET /api/reports/inventory/movement/{productId}`
  - `GET /api/reports/inventory/low-stock`
  - `GET /api/reports/balances/customers`
  - `GET /api/reports/balances/suppliers`
  - `GET /api/reports/cash-register`

---

## 2. Proposed Architecture & File Structure

```text
src/
├── features/
│   └── reports/
│       ├── types/
│       │   └── reports.types.ts
│       ├── api/
│       │   └── useReportsQueries.ts
│       └── components/
│           ├── ReportsHeader.tsx
│           ├── ReportsTabNavigation.tsx
│           ├── SalesReportTab.tsx
│           ├── ProfitLossReportTab.tsx
│           ├── InventoryValuationReportTab.tsx
│           ├── BalancesReportTab.tsx
│           ├── CashRegisterAuditTab.tsx
│           └── ProductMovementModal.tsx
└── pages/
    └── Reports.tsx
```

---

## 3. Phased Implementation Roadmap

1. **Phase 1: Contracts & Types**:
   - Define TypeScript interfaces in `reports.types.ts` (0 `any` types).
2. **Phase 2: TanStack Query Data Layer**:
   - Implement query hooks in `useReportsQueries.ts` for all 7 report endpoints.
3. **Phase 3: Header, Tabs & Filters**:
   - Build `ReportsHeader.tsx` with date presets (اليوم، آخر 7 أيام، هذا الشهر، مخصص) and print/export triggers.
   - Build `ReportsTabNavigation.tsx`.
4. **Phase 4: Sales & Profit/Loss Tabs**:
   - Build `SalesReportTab.tsx` (KPIs, payment breakdowns, bestsellers).
   - Build `ProfitLossReportTab.tsx` (Income statement, margin %, expense distribution).
5. **Phase 5: Inventory Valuation & Movements**:
   - Build `InventoryValuationReportTab.tsx` (WAC valuation vs potential retail revenue).
   - Build `ProductMovementModal.tsx` (Drilldown stock ledger for individual products).
6. **Phase 6: Balances & Cash Audit Tabs**:
   - Build `BalancesReportTab.tsx` (Customer receivables & Supplier payables).
   - Build `CashRegisterAuditTab.tsx` (Shift discrepancies & daily summaries).
7. **Phase 7: Page Assembly & Print Polish**:
   - Assemble `src/pages/Reports.tsx` with print styling.
   - Run `npm run build` to verify 0 TypeScript/bundling errors.
