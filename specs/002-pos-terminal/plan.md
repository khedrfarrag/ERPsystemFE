# Implementation Plan: 002-pos-terminal

**Branch**: `main` | **Date**: 2026-09-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-pos-terminal/spec.md`

## Summary

Build a high-performance, enterprise-grade POS Terminal & Cashier Sales Desk interface for RetailOS.
The implementation uses a dedicated Feature-Sliced Architecture under `src/features/pos/` leveraging:
- **TanStack Query v5** for asynchronous server state (catalog, customers, categories, and sales mutations with automatic cache invalidation).
- **Custom Memoized Cart Hook (`usePosCart`)** for lag-free cart operations (barcode scan, quantity adjustments, line discounts, and live totals).
- **Multi-Payment Modal** supporting `Cash`, `Credit`, and `Mixed` payments with client-side credit limit and stock enforcement.
- **Dedicated 80mm Thermal Receipt Generator** with zero-margin print stylesheets.

---

## Technical Context

**Language/Version**: TypeScript 5.8 / React 19.x (Strict mode, 0 `any` types)
**Primary Dependencies**:
- `@tanstack/react-query` v5.66.0 (Server state & cache invalidation)
- `react-hook-form` v7.54.2 + `zod` v3.24.2 (Checkout form validation)
- `react-hot-toast` v2.5.2 (Instant visual & auditory feedback)
- `lucide-react` v0.475.0 (Clean modern icons)
- `clsx` + `tailwind-merge` (Dynamic styling)
- Tailwind CSS v3.4.17 (Custom RTL typography & Cairo font)

**Target Platform**: Modern Desktop Web Browsers (Chrome, Edge, Firefox, Safari) + POS Touch Terminals & 80mm ESC/POS Thermal Printers.
**Project Type**: Single Page Web Application (Vite + React + TypeScript)
**Performance Goals**:
- Barcode-to-cart latency: < 16ms
- 100-item cart calculation time: < 1ms (memoized with `useMemo`)
- API round-trip & cache invalidation: < 500ms
- Thermal receipt preview render: < 50ms

**Constraints**:
- Full Arabic RTL interface layout.
- 0 `any` TypeScript types across all modules.
- Strict compliance with Backend API Contracts (`POST /api/sales`, `GET /api/products`, `GET /api/customers`).
- Offline session cart protection via `sessionStorage` / local memory.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Strict TypeScript (No Any)**: All data types, DTOs, and hook returns have explicit TypeScript interfaces.
- [x] **TanStack Query Server State**: All data fetching and mutations use React Query hooks. Zero raw `fetch` or manual unmanaged `useEffect` API calls.
- [x] **Automatic Cache Invalidation**: Successful sale mutations automatically invalidate `['products']`, `['dashboard']`, and `['customers']`.
- [x] **Memoization & Performance**: Cart calculations, search debouncing, and list filtering use `useMemo` and `useCallback`.
- [x] **Feature-Sliced Architecture**: Code is encapsulated within `src/features/pos/` and rendered cleanly in `src/pages/Pos.tsx`.
- [x] **RTL & Design System**: Uses Cairo font, curated Slate/Emerald/Amber palette, and standard UI primitives.

---

## Project Structure

### Documentation (this feature)

```text
specs/002-pos-terminal/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Technical research & decisions (Phase 0)
├── data-model.md        # Entities, validation, and schemas (Phase 1)
├── quickstart.md        # Verification and end-to-end testing guide (Phase 1)
├── contracts/
│   └── pos-contracts.md # Backend REST API payload & response contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code Layout

```text
src/
├── features/
│   └── pos/
│       ├── api/
│       │   ├── usePosQueries.ts      # useProductsCatalogQuery, useCustomersQuery, useCategoriesQuery
│       │   └── usePosMutations.ts    # useCreateSaleMutation with automatic cache invalidation
│       ├── components/
│       │   ├── BarcodeScannerInput.tsx   # Fast barcode scanner input with autofocus
│       │   ├── ProductCatalogGrid.tsx    # Visual category tabs and touch cards
│       │   ├── PosCart.tsx               # Live scrollable cart with quantity & discount controls
│       │   ├── PosSummary.tsx            # Memoized subtotal, discount, tax, and action buttons
│       │   ├── CustomerSelectModal.tsx   # Customer search and credit status badge
│       │   ├── PaymentModal.tsx          # Cash, Credit, Mixed checkout with change calculation
│       │   └── ReceiptModal.tsx          # 80mm thermal receipt preview & print dialog
│       ├── hooks/
│       │   ├── usePosCart.ts             # Cart state management and memoized totals
│       │   └── usePosScanner.ts          # Barcode scan keydown buffering listener
│       └── types/
│           └── pos.types.ts              # Strict TypeScript interfaces and schemas
├── pages/
│   └── Pos.tsx                           # Main POS layout aggregating catalog, cart, and modals
```

---

## Complexity Tracking

No constitution violations detected. Standard Feature-Sliced module with clean TanStack Query hooks.
