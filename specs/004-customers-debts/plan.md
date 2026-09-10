# Implementation Plan: 004-customers-debts

**Branch**: `main` | **Date**: 2026-09-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-customers-debts/spec.md`

## Summary

Build an enterprise-grade Customers, Accounts Receivable & Credit Limit Management module for RetailOS.
The implementation follows the Feature-Sliced Architecture under `src/features/customers/` leveraging:
- **TanStack Query v5** for asynchronous customer directories, account statement ledgers, and payment mutations with instant cache invalidations.
- **React Hook Form + Zod** for strict input validation, Egyptian phone formatting, and positive credit limits.
- **Receive Payment Flow** with auto-updated cashier cash drawers and customer balances.
- **Dedicated Account Statement Viewer** with running balance calculations and clean zero-margin printing.

---

## Technical Context

**Language/Version**: TypeScript 5.8 / React 19.x (Strict mode, 0 `any` types)
**Primary Dependencies**:
- `@tanstack/react-query` v5.66.0 (Server state & cache invalidation)
- `react-hook-form` v7.54.2 + `zod` v3.24.2 (Customer & Payment validation)
- `react-hot-toast` v2.5.2 (Arabic notifications)
- `lucide-react` v0.475.0 (Clean icons)
- Tailwind CSS v3.4.17 (Custom RTL & Cairo font)

**Target Platform**: Modern Desktop Web Browsers & POS Tablets.
**Project Type**: Single Page Web Application (Vite + React + TypeScript)
**Performance Goals**:
- Debounced search response: < 200ms
- Account statement render: < 50ms
- Payment submission roundtrip: < 500ms

**Constraints**:
- Full Arabic RTL interface.
- 0 `any` TypeScript types across all schemas and hooks.
- Immediate cache invalidation across POS and Dashboard screens upon payment recording.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Strict TypeScript (No Any)**: All DTOs and mutation inputs have explicit TypeScript interfaces.
- [x] **TanStack Query Server State**: Single source of truth for customer lists, statement records, and payments.
- [x] **Automatic Cache Invalidation**: Payment mutations automatically invalidate `['customers']`, `['dashboard']`, and `['payments']`.
- [x] **Form Validation**: React Hook Form + Zod for phone numbers and credit limits.
- [x] **Feature-Sliced Architecture**: Encapsulated under `src/features/customers/` and rendered in `src/pages/Customers.tsx`.

---

## Project Structure

### Documentation (this feature)

```text
specs/004-customers-debts/
├── spec.md              # Feature specification
├── plan.md              # Implementation plan (this file)
├── research.md          # Technical research & decisions (Phase 0)
├── data-model.md        # Entities, validation, and schemas (Phase 1)
├── quickstart.md        # Verification and end-to-end testing guide (Phase 1)
├── contracts/
│   └── customers-contracts.md # Backend REST API payload & response contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code Layout

```text
src/
├── features/
│   └── customers/
│       ├── api/
│       │   ├── useCustomersQueries.ts     # useCustomersListQuery, useCustomerStatementQuery
│       │   └── useCustomersMutations.ts   # create, update, delete, receive payment
│       ├── components/
│       │   ├── CustomersHeader.tsx        # KPI cards (Total, Total Debt, Debtors Count)
│       │   ├── CustomersFilterBar.tsx     # Debounced search, risk filters
│       │   ├── CustomersTable.tsx         # Customer directory with credit bar & actions
│       │   ├── CustomerModal.tsx          # Add & Edit customer modal
│       │   ├── ReceivePaymentModal.tsx    # Debt settlement receipt modal
│       │   ├── CustomerStatementModal.tsx # Running balance statement viewer & printer
│       │   └── DeleteCustomerModal.tsx    # Delete confirmation modal
│       └── types/
│           ├── customers.types.ts         # TypeScript interfaces
│           └── customers.schemas.ts       # Zod schemas
├── pages/
│   └── Customers.tsx                      # Main Customers management page
```

---

## Complexity Tracking

No constitution violations detected. Standard Feature-Sliced module with clean TanStack Query integration.
