# Implementation Plan: 003-products-inventory

**Branch**: `main` | **Date**: 2026-09-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-products-inventory/spec.md`

## Summary

Build an enterprise-grade Products, Categories, Units & Inventory Management module for RetailOS.
The implementation follows the Feature-Sliced Architecture under `src/features/products/` leveraging:
- **TanStack Query v5** for paginated queries, instant filtering, and optimistic/immediate cache invalidations.
- **React Hook Form + Zod** for strict input validation, negative profit margin warnings, and live profit calculators.
- **On-The-Fly Modals** for instant Category and Measurement Unit creation without context switching.
- **2-Step Excel / CSV Import Flow** (Preview & Commit) with detailed validation summaries.

---

## Technical Context

**Language/Version**: TypeScript 5.8 / React 19.x (Strict mode, 0 `any` types)
**Primary Dependencies**:
- `@tanstack/react-query` v5.66.0 (Server state & cache management)
- `react-hook-form` v7.54.2 + `zod` v3.24.2 (Product & Category validation)
- `react-hot-toast` v2.5.2 (Arabic visual feedback)
- `lucide-react` v0.475.0 (Clean modern icons)
- Tailwind CSS v3.4.17 (Custom RTL & Cairo font)

**Target Platform**: Modern Desktop Web Browsers (Chrome, Edge, Firefox, Safari) + POS Tablet Terminals.
**Project Type**: Single Page Web Application (Vite + React + TypeScript)
**Performance Goals**:
- Debounced search latency: < 250ms
- Product list re-render: < 16ms
- Modal open/close transition: < 100ms
- Excel 500-item preview generation: < 1s

**Constraints**:
- Strict Arabic RTL UI with Cairo typography.
- 0 `any` TypeScript types across all schemas and hooks.
- Role guards: Owners/Managers can Add/Edit/Import; Cashiers have view-only access.
- Seamless synchronization with POS Terminal catalog via TanStack Query cache invalidation.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Strict TypeScript (No Any)**: All data types, DTOs, and mutation inputs have explicit TypeScript interfaces.
- [x] **TanStack Query Server State**: All catalog reads and writes use `useQuery` and `useMutation` hooks.
- [x] **Automatic Cache Invalidation**: Product updates automatically invalidate `['products']`, `['categories']`, `['units']`, and `['dashboard']`.
- [x] **Forms & Validations**: Form management with React Hook Form, resolver with Zod, and realtime margin computation.
- [x] **Feature-Sliced Architecture**: Clean modularization under `src/features/products/` and page aggregation in `src/pages/Products.tsx`.

---

## Project Structure

### Documentation (this feature)

```text
specs/003-products-inventory/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Technical research & decisions (Phase 0)
├── data-model.md        # Entities, validation, and schemas (Phase 1)
├── quickstart.md        # Verification and end-to-end testing guide (Phase 1)
├── contracts/
│   └── products-contracts.md # Backend REST API payload & response contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code Layout

```text
src/
├── features/
│   └── products/
│       ├── api/
│       │   ├── useProductsQueries.ts     # useProductsQuery, useCategoriesQuery, useUnitsQuery
│       │   └── useProductsMutations.ts   # create, update, delete, status toggle, import preview/commit
│       ├── components/
│       │   ├── ProductsHeader.tsx        # KPI summary stat cards (Total, Low Stock, Valuation)
│       │   ├── ProductsFilterBar.tsx     # Debounced search, category filter, stock filters
│       │   ├── ProductsTable.tsx         # Paginated table with status toggles and actions
│       │   ├── ProductModal.tsx          # Add & Edit product modal with margin calculator
│       │   ├── CategoryUnitModal.tsx     # Quick create category and measurement unit popover
│       │   └── ImportProductsModal.tsx   # 2-step Excel/CSV import preview & commit
│       └── types/
│           ├── products.types.ts         # Strict TypeScript DTOs & models
│           └── products.schemas.ts       # Zod validation schemas
├── pages/
│   └── Products.tsx                      # Main Products & Inventory screen
```

---

## Complexity Tracking

No constitution violations detected. Standard Feature-Sliced module with clean TanStack Query integration.
