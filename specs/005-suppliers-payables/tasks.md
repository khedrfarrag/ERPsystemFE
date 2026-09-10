# Tasks: 005-suppliers-payables

**Feature Name**: Suppliers, Purchase Invoices & Payables Management (إدارة الموردين، فواتير التوريد، والمستحقات)
**Feature Directory**: `specs/005-suppliers-payables`
**Status**: Ready for Implementation
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Feature Module Structure & Types)

**Purpose**: Initialize directory structure, TypeScript interfaces, and validation schemas.

- [x] T001 Create Suppliers feature directory structure in `src/features/suppliers/` (api, components, types)
- [x] T002 [P] Implement strict TypeScript interfaces in `src/features/suppliers/types/suppliers.types.ts`
- [x] T003 [P] Implement Zod validation schemas in `src/features/suppliers/types/suppliers.schemas.ts`

---

## Phase 2: Foundational (Data Fetching & Cache Mutations)

**Purpose**: TanStack Query hooks for querying and mutating suppliers, purchases, and payments.

- [x] T004 [P] Implement TanStack Query queries in `src/features/suppliers/api/useSuppliersQueries.ts`
- [x] T005 [P] Implement supplier, purchase & payment mutations with automatic cache invalidation in `src/features/suppliers/api/useSuppliersMutations.ts`

---

## Phase 3: User Story 1 - Suppliers Directory & Accounts Payable Overview (Priority: P1) 🎯 MVP

**Goal**: Store owners can view, search, and monitor supplier payables and registered representatives.
**Independent Test**: Load page, type search query, verify debounced filtering (<200ms), check payables badges.

- [x] T006 [P] [US1] Implement KPI overview summary cards in `src/features/suppliers/components/SuppliersHeader.tsx`
- [x] T007 [P] [US1] Implement filter bar with debounced search and payables filter in `src/features/suppliers/components/SuppliersFilterBar.tsx`
- [x] T008 [US1] Implement paginated suppliers table with payables badges and action triggers in `src/features/suppliers/components/SuppliersTable.tsx`

**Checkpoint**: User Story 1 provides a fully functional supplier directory and accounts payable ledger.

---

## Phase 4: User Story 2 - Add & Edit Supplier Profile & Sales Representatives (Priority: P1)

**Goal**: Register suppliers and manage their sales representative contacts.
**Independent Test**: Create a supplier, add a sales rep, verify immediate appearance in table and contact roster.

- [x] T009 [US2] Implement Add/Edit Supplier modal with React Hook Form + Zod in `src/features/suppliers/components/SupplierModal.tsx`
- [x] T010 [US2] Implement Add Sales Representative modal in `src/features/suppliers/components/RepresentativeModal.tsx`
- [x] T011 [US2] Implement Delete Supplier confirmation modal with payables protection in `src/features/suppliers/components/DeleteSupplierModal.tsx`

---

## Phase 5: User Story 3 - Create & Confirm Purchase Invoices (Priority: P1)

**Goal**: Multi-item purchase order entry that automatically replenishes stock and creates payables.
**Independent Test**: Create a purchase order for 2 products (10 units each), confirm, verify inventory stock increases and supplier debt increases.

- [x] T012 [US3] Implement multi-item purchase order creation modal in `src/features/suppliers/components/CreatePurchaseModal.tsx`
- [x] T013 [US3] Wire direct purchase confirmation with automatic stock & payables cache invalidation in `src/features/suppliers/components/CreatePurchaseModal.tsx`

---

## Phase 6: User Story 4 - Pay Supplier & Settle Payables (Priority: P2)

**Goal**: Record debt settlement payments to suppliers and automatically update supplier balance and cashier drawer.
**Independent Test**: Record a payment of 2,000 EGP, verify supplier debt decreases and drawer cash updates.

- [x] T014 [US4] Implement Disburse Payment modal with Cash, Bank Transfer, and Cheque modes in `src/features/suppliers/components/DisbursePaymentModal.tsx`
- [x] T015 [US4] Wire payment disbursement mutation with instant cache invalidation in `src/features/suppliers/components/DisbursePaymentModal.tsx`

---

## Phase 7: User Story 5 - Supplier Detailed Account Statement (Priority: P2)

**Goal**: Transparent running balance statement for purchase invoices and payments with print mode.
**Independent Test**: Open account statement for a supplier with history, verify chronological ledger and running balance math, trigger print.

- [x] T016 [US5] Implement Supplier Account Statement modal with running balance ledger and print styles in `src/features/suppliers/components/SupplierStatementModal.tsx`

---

## Phase 8: Page Assembly & Polish

**Purpose**: Assemble the complete Suppliers page and validate production build.

- [x] T017 Assemble complete Suppliers & Payables management page in `src/pages/Suppliers.tsx`
- [x] T018 [P] Verify navigation link in `src/components/layout/Sidebar.tsx` and router registration in `src/App.tsx`
- [x] T019 Validate production TypeScript compilation with 0 errors via `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all User Stories.
- **Phase 3 (US1 - MVP)**: Depends on Phase 2.
- **Phase 4 (US2 - Supplier Profiles)**: Depends on Phase 3.
- **Phase 5 (US3 - Purchase Orders)**: Depends on Phase 4.
- **Phase 6 (US4 - Pay Supplier)**: Depends on Phase 4.
- **Phase 7 (US5 - Statement)**: Depends on Phase 4.
- **Phase 8 (Assembly & Polish)**: Depends on Phases 1-7.

### Parallel Opportunities
- T002 and T003 can be built in parallel.
- T004 and T005 can be built in parallel.
- T006 and T007 can be built in parallel.
- T014 and T016 can be built in parallel after Phase 4.

---

## Implementation Strategy

### MVP First (User Story 1 + Story 2 + Story 3)
1. Complete Setup & Foundational queries/mutations (T001-T005).
2. Complete Directory Table, Filters & Header (T006-T008).
3. Complete Add/Edit/Delete Supplier & Rep modals (T009-T011).
4. Complete Create & Confirm Purchase Orders (T012-T013).
5. Add Payment Disbursement & Account Statement modals (T014-T016).
6. Final Page Assembly & 0-error TypeScript production build (T017-T019).
