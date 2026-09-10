# Tasks: 004-customers-debts

**Feature Name**: Customers, Receivables & Credit Limit Management (إدارة العملاء، الديون، وسقف الائتمان)
**Feature Directory**: `specs/004-customers-debts`
**Status**: Ready for Implementation
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Feature Module Structure & Types)

**Purpose**: Initialize directory structure, TypeScript interfaces, and validation schemas.

- [x] T001 Create Customers feature directory structure in `src/features/customers/` (api, components, types)
- [x] T002 [P] Implement strict TypeScript interfaces in `src/features/customers/types/customers.types.ts`
- [x] T003 [P] Implement Zod validation schemas in `src/features/customers/types/customers.schemas.ts`

---

## Phase 2: Foundational (Data Fetching & Cache Mutations)

**Purpose**: TanStack Query hooks for querying and mutating customers, statements, and payments.

- [x] T004 [P] Implement TanStack Query queries in `src/features/customers/api/useCustomersQueries.ts`
- [x] T005 [P] Implement customer & payment mutations with automatic cache invalidation in `src/features/customers/api/useCustomersMutations.ts`

---

## Phase 3: User Story 1 - Customers Directory & Receivables Overview (Priority: P1) 🎯 MVP

**Goal**: Store owners can view, search, and monitor customer debts and credit ceilings.
**Independent Test**: Load page, type search query, verify debounced filtering (<200ms), check balance badges.

- [x] T006 [P] [US1] Implement KPI overview summary cards in `src/features/customers/components/CustomersHeader.tsx`
- [x] T007 [P] [US1] Implement filter bar with debounced search and risk filters in `src/features/customers/components/CustomersFilterBar.tsx`
- [x] T008 [US1] Implement paginated customers table with credit bar and action triggers in `src/features/customers/components/CustomersTable.tsx`

**Checkpoint**: User Story 1 provides a fully functional customer directory and receivables tracker.

---

## Phase 4: User Story 2 - Add & Edit Customer with Credit Limit Rules (Priority: P1)

**Goal**: Register and edit customer profiles with 11-digit phone number check and credit limit setup.
**Independent Test**: Create a customer with credit limit = 4,000 EGP, verify immediate appearance in table and POS dropdown.

- [x] T009 [US2] Implement Add/Edit Customer modal with React Hook Form + Zod in `src/features/customers/components/CustomerModal.tsx`
- [x] T010 [US2] Implement Delete Customer confirmation modal with debt protection in `src/features/customers/components/DeleteCustomerModal.tsx`

---

## Phase 5: User Story 3 - Detailed Customer Account Statement (Priority: P2)

**Goal**: Transparent running balance ledger for sales, payments, and returns with print mode.
**Independent Test**: Open account statement for customer with history, verify chronological ledger and running balance math, trigger print.

- [x] T011 [US3] Implement Account Statement modal with running balance ledger in `src/features/customers/components/CustomerStatementModal.tsx`
- [x] T012 [US3] Configure dedicated print styles for account statements in `src/features/customers/components/CustomerStatementModal.tsx`

---

## Phase 6: User Story 4 - Receive Customer Payment & Settle Receivables (Priority: P2)

**Goal**: Record debt settlement receipts and automatically update customer balance and cashier drawer.
**Independent Test**: Record a payment of 500 EGP, verify customer balance decreases and cashier cash drawer updates.

- [x] T013 [US4] Implement Receive Payment modal with Cash, Bank Transfer, and Cheque modes in `src/features/customers/components/ReceivePaymentModal.tsx`
- [x] T014 [US4] Wire payment mutation with instant cache invalidation in `src/features/customers/components/ReceivePaymentModal.tsx`

---

## Phase 7: User Story 5 - Credit Risk & High Debt Aging Filters (Priority: P3)

**Goal**: Identify over-limit debtors and high-risk customer accounts.
**Independent Test**: Click "تجاوز الائتمان" filter pill, verify only customers near or exceeding their limit are displayed.

- [x] T015 [US5] Implement credit limit consumption progress indicators and debtor risk filters in `src/features/customers/components/CustomersTable.tsx`

---

## Phase 8: Page Assembly & Polish

**Purpose**: Assemble the complete Customers page and validate production build.

- [x] T016 Assemble complete Customers & Receivables management page in `src/pages/Customers.tsx`
- [x] T017 [P] Verify navigation link in `src/components/layout/Sidebar.tsx` and router registration in `src/App.tsx`
- [x] T018 Validate production TypeScript compilation with 0 errors via `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all User Stories.
- **Phase 3 (US1 - MVP)**: Depends on Phase 2.
- **Phase 4 (US2 - Customer Profiles)**: Depends on Phase 3.
- **Phase 5 (US3 - Account Statement)**: Depends on Phase 4.
- **Phase 6 (US4 - Receive Payment)**: Depends on Phase 4.
- **Phase 7 (US5 - Risk Filters)**: Depends on Phase 3.
- **Phase 8 (Assembly & Polish)**: Depends on Phases 1-7.

### Parallel Opportunities
- T002 and T003 can be built in parallel.
- T004 and T005 can be built in parallel.
- T006 and T007 can be built in parallel.
- T011 and T013 can be built in parallel after Phase 4.

---

## Implementation Strategy

### MVP First (User Story 1 + Story 2)
1. Complete Setup & Foundational queries/mutations (T001-T005).
2. Complete Directory Table, Filters & Header (T006-T008).
3. Complete Add/Edit/Delete Customer modals (T009-T010).
4. Add Account Statement Ledger & Receive Payment modals (T011-T014).
5. Add Risk Filters & Final Page Assembly (T015-T018).
6. Validate with 0-error TypeScript production build.
