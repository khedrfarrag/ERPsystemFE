# Implementation Plan: 005-suppliers-payables

**Branch**: `main` | **Date**: 2026-09-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/005-suppliers-payables/spec.md`

## Summary

Build an enterprise-grade Suppliers, Purchase Orders & Accounts Payable Management module for RetailOS.
The implementation follows the Feature-Sliced Architecture under `src/features/suppliers/` leveraging:
- **TanStack Query v5** for asynchronous supplier records, purchase invoices, ledger statements, and disbursement mutations.
- **React Hook Form + Zod** for supplier records, sales representatives, purchase order lines, and payment disbursements.
- **2-Step Purchase Intake Flow** (Draft & Confirm) automatically replenishing warehouse product stock and incrementing supplier payables.
- **Payment Disbursements & Account Statement** with running balance calculation and zero-margin printing.

---

## Technical Context

**Language/Version**: TypeScript 5.8 / React 19.x (Strict mode, 0 `any` types)
**Primary Dependencies**:
- `@tanstack/react-query` v5.66.0 (Server state & cache invalidation)
- `react-hook-form` v7.54.2 + `zod` v3.24.2 (Purchase & Supplier validation)
- `react-hot-toast` v2.5.2 (Arabic notifications)
- `lucide-react` v0.475.0 (Clean icons)
- Tailwind CSS v3.4.17 (Custom RTL & Cairo font)

**Target Platform**: Modern Desktop Web Browsers & POS Tablets.
**Project Type**: Single Page Web Application (Vite + React + TypeScript)
**Performance Goals**:
- Debounced search response: < 200ms
- Purchase order total recalculation: < 1ms
- Inventory stock sync upon purchase confirmation: < 500ms

**Constraints**:
- Full Arabic RTL interface.
- 0 `any` TypeScript types across all schemas and hooks.
- Immediate cache invalidation across `['suppliers']`, `['purchases']`, `['products']`, and `['dashboard']`.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Strict TypeScript (No Any)**: All DTOs and mutation inputs have explicit TypeScript interfaces.
- [x] **TanStack Query Server State**: Single source of truth for suppliers, purchase invoices, and payments.
- [x] **Automatic Cache Invalidation**: Confirming purchases invalidates `['products']`, `['suppliers']`, and `['dashboard']`.
- [x] **Form Validation**: React Hook Form + Zod for purchase lines and supplier forms.
- [x] **Feature-Sliced Architecture**: Encapsulated under `src/features/suppliers/` and rendered in `src/pages/Suppliers.tsx`.

---

## Project Structure

### Documentation (this feature)

```text
specs/005-suppliers-payables/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Technical research & decisions (Phase 0)
├── data-model.md        # Entities, validation, and schemas (Phase 1)
├── quickstart.md        # Verification and end-to-end testing guide (Phase 1)
├── contracts/
│   └── suppliers-contracts.md # Backend REST API payload & response contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code Layout

```text
src/
├── features/
│   └── suppliers/
│       ├── api/
│       │   ├── useSuppliersQueries.ts      # suppliers, statement, purchases
│       │   └── useSuppliersMutations.ts    # create, update, delete, purchase, pay
│       ├── components/
│       │   ├── SuppliersHeader.tsx         # KPI cards (Total, Payables, Creditors)
│       │   ├── SuppliersFilterBar.tsx      # Debounced search & payables filters
│       │   ├── SuppliersTable.tsx          # Suppliers directory with reps & actions
│       │   ├── SupplierModal.tsx           # Add & Edit supplier modal
│       │   ├── RepresentativeModal.tsx     # Add sales rep contact modal
│       │   ├── CreatePurchaseModal.tsx     # Multi-item purchase order & confirm
│       │   ├── DisbursePaymentModal.tsx    # Pay supplier debt modal
│       │   ├── SupplierStatementModal.tsx  # Running balance statement viewer
│       │   └── DeleteSupplierModal.tsx     # Delete confirmation modal
│       └── types/
│           ├── suppliers.types.ts          # TypeScript interfaces
│           └── suppliers.schemas.ts        # Zod schemas
├── pages/
│   └── Suppliers.tsx                       # Main Suppliers & Payables page
```

---

## Complexity Tracking

No constitution violations detected. Standard Feature-Sliced module with clean TanStack Query integration.
