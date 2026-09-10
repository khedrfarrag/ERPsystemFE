# Tasks: 002-pos-terminal

**Feature Name**: Point of Sale (POS) Terminal & Cashier Checkout (شاشة نقطة البيع ومكتب الكاشير)
**Feature Directory**: `specs/002-pos-terminal`
**Status**: Ready for Implementation
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Feature Module Structure & Types)

**Purpose**: Initialize feature directory structure and declare strict TypeScript types and schemas.

- [x] T001 Create POS feature directory structure in `src/features/pos/` (api, components, hooks, types)
- [x] T002 [P] Implement strict TypeScript interfaces in `src/features/pos/types/pos.types.ts`
- [x] T003 [P] Implement Zod validation schemas in `src/features/pos/types/pos.schemas.ts`

---

## Phase 2: Foundational (Data Fetching & State Hooks)

**Purpose**: Core data layer, TanStack Query hooks, and high-performance memoized cart hook.

- [x] T004 [P] Implement TanStack Query queries in `src/features/pos/api/usePosQueries.ts`
- [x] T005 [P] Implement POS sales mutation with automatic cache invalidation in `src/features/pos/api/usePosMutations.ts`
- [x] T006 Implement high-performance memoized cart hook in `src/features/pos/hooks/usePosCart.ts`

---

## Phase 3: User Story 1 - Fast Barcode Scanning & Live Cart Operations (Priority: P1) 🎯 MVP

**Goal**: Cashier can scan or search items, manage quantities/discounts, and see live memoized totals without lag.
**Independent Test**: Add products to cart via barcode/search, adjust quantities, verify out-of-stock toast, verify live totals recalculation (<16ms).

- [x] T007 [P] [US1] Implement dual-mode barcode scanner input with autofocus in `src/features/pos/components/BarcodeScannerInput.tsx`
- [x] T008 [P] [US1] Implement live scrollable cart item list in `src/features/pos/components/PosCart.tsx`
- [x] T009 [US1] Implement memoized cart summary footer and totals display in `src/features/pos/components/PosSummary.tsx`
- [x] T010 [US1] Implement global POS keyboard shortcuts hook (F2 search, F9 checkout, Esc dismiss) in `src/features/pos/hooks/usePosShortcuts.ts`

**Checkpoint**: User Story 1 can be tested as an independent MVP with live cart and barcode scanning.

---

## Phase 4: User Story 2 - Multi-Payment Checkout & Split Payment (Priority: P1)

**Goal**: Settle sales via Cash, Credit, or Mixed payments with live change computation and payload submission.
**Independent Test**: Complete a cart sale using Cash (change verified), Credit (debt assigned), and Mixed payment, verifying API payload and success notifications.

- [x] T011 [US2] Implement multi-payment checkout modal with Cash, Credit, and Mixed modes in `src/features/pos/components/PaymentModal.tsx`
- [x] T012 [US2] Wire sales mutation into PaymentModal with loading states, change computation, and error/success toasts in `src/features/pos/components/PaymentModal.tsx`

**Checkpoint**: Full checkout flow complete and verified against backend API contracts.

---

## Phase 5: User Story 3 - Customer Selection & Credit Ceiling Validation (Priority: P2)

**Goal**: Assign customer to order and dynamically enforce credit limits on deferred/mixed sales.
**Independent Test**: Search and pick a customer, verify credit limit badge, verify system blocks credit checkout when exceeding allowable balance.

- [x] T013 [US3] Implement customer search modal with balance and credit limit badges in `src/features/pos/components/CustomerSelectModal.tsx`
- [x] T014 [US3] Integrate customer state with cart and credit limit validation logic in `src/features/pos/components/PosCart.tsx` and `PaymentModal.tsx`

---

## Phase 6: User Story 4 - Thermal Receipt Preview & 80mm Printing (Priority: P2)

**Goal**: Instant 80mm thermal receipt preview and clean physical print dialog.
**Independent Test**: Complete a sale, open receipt preview, click Print, verify dedicated print stylesheet formats correctly for 80mm thermal printers.

- [x] T015 [US4] Implement 80mm thermal receipt preview and print dialog in `src/features/pos/components/ReceiptModal.tsx`
- [x] T016 [US4] Configure dedicated `@media print` styles for 80mm thermal printing in `src/index.css`

---

## Phase 7: User Story 5 - Visual Product Catalog Grid & Category Filter (Priority: P3)

**Goal**: Touch-friendly visual product grid with category pills and live stock status.
**Independent Test**: Filter by category, search by product name, tap product cards to add directly to cart.

- [x] T017 [US5] Implement touch-friendly product catalog grid and category tabs in `src/features/pos/components/ProductCatalogGrid.tsx`

---

## Phase 8: Page Assembly & Polish

**Purpose**: Assemble the complete POS terminal page and validate production build.

- [x] T018 Assemble complete POS terminal layout in `src/pages/Pos.tsx`
- [x] T019 [P] Verify router integration in `src/App.tsx` and navigation links in `src/components/layout/Sidebar.tsx`
- [x] T020 Validate production TypeScript compilation with 0 errors via `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all User Stories.
- **Phase 3 (US1 - MVP)**: Depends on Phase 2.
- **Phase 4 (US2 - Payments)**: Depends on Phase 3.
- **Phase 5 (US3 - Customers)**: Depends on Phase 4.
- **Phase 6 (US4 - Receipts)**: Depends on Phase 4.
- **Phase 7 (US5 - Catalog Grid)**: Depends on Phase 3.
- **Phase 8 (Assembly & Polish)**: Depends on Phases 1-7.

### Parallel Opportunities
- T002 and T003 can be built in parallel.
- T004 and T005 can be built in parallel.
- T007 and T008 can be built in parallel.
- T015 and T017 can be built in parallel after Phase 4.

---

## Implementation Strategy

### MVP First (User Story 1 + Story 2)
1. Complete Setup & Foundational data hooks (T001-T006).
2. Complete Barcode Scan & Live Cart (T007-T010).
3. Complete Payment Checkout (T011-T012).
4. Add Customer Credit Profiling & Thermal Receipts (T013-T016).
5. Add Visual Catalog Grid & Final Assembly (T017-T020).
6. Validate with 0-error TypeScript production build.
