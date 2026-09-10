# Tasks: 003-products-inventory

**Feature Name**: Products, Categories, Units & Inventory Management (إدارة المنتجات، الأقسام، الوحدات، والمخزون)
**Feature Directory**: `specs/003-products-inventory`
**Status**: Ready for Implementation
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Phase 1: Setup (Feature Module Structure & Types)

**Purpose**: Initialize directory layout, TypeScript interfaces, and validation schemas.

- [x] T001 Create Products feature directory structure in `src/features/products/` (api, components, types)
- [x] T002 [P] Implement strict TypeScript interfaces in `src/features/products/types/products.types.ts`
- [x] T003 [P] Implement Zod validation schemas in `src/features/products/types/products.schemas.ts`

---

## Phase 2: Foundational (Data Fetching & Cache Mutations)

**Purpose**: TanStack Query hooks for querying and mutating products, categories, and units.

- [x] T004 [P] Implement TanStack Query queries in `src/features/products/api/useProductsQueries.ts`
- [x] T005 [P] Implement product and category mutations with automatic cache invalidation in `src/features/products/api/useProductsMutations.ts`

---

## Phase 3: User Story 1 - Product Catalog Exploration, Filtering & Real-Time Search (Priority: P1) 🎯 MVP

**Goal**: Store managers can search, filter, and view products with stock levels and profit margins.
**Independent Test**: Load page, type search query, verify debounced filtering (<250ms), change category tabs, verify pagination.

- [x] T006 [P] [US1] Implement filter bar with debounced search, category pills, and stock status in `src/features/products/components/ProductsFilterBar.tsx`
- [x] T007 [P] [US1] Implement paginated products table with profit margins, stock badges, and action menus in `src/features/products/components/ProductsTable.tsx`
- [x] T008 [US1] Implement KPI overview summary cards in `src/features/products/components/ProductsHeader.tsx`

**Checkpoint**: User Story 1 provides a fully browsable, searchable catalog MVP.

---

## Phase 4: User Story 2 - Add, Edit & Delete Product with Strict Validation (Priority: P1)

**Goal**: Add and edit products with React Hook Form + Zod, profit margin calculator, and delete protections.
**Independent Test**: Create a product with Cost=40 and Price=50, verify margin shows 20%, verify item appears in table and POS catalog.

- [x] T009 [US2] Implement Add/Edit Product modal with React Hook Form + Zod and live margin calculator in `src/features/products/components/ProductModal.tsx`
- [x] T010 [US2] Implement delete confirmation modal with toast feedback in `src/features/products/components/DeleteProductModal.tsx`

**Checkpoint**: Full CRUD lifecycle for individual products is complete and verified.

---

## Phase 5: User Story 3 - Quick Categories & Measurement Units Management (Priority: P2)

**Goal**: Create categories and units on-the-fly inside the product modal without losing form state.
**Independent Test**: Inside Product modal, click "+ إضافة قسم", create a category, verify it auto-selects in the dropdown.

- [x] T011 [US3] Implement on-the-fly Category and Measurement Unit mini modal in `src/features/products/components/CategoryUnitModal.tsx`
- [x] T012 [US3] Integrate Category/Unit quick creation triggers inside `src/features/products/components/ProductModal.tsx`

---

## Phase 6: User Story 4 - Stock Level Tracking & Status Toggles (Priority: P2)

**Goal**: Single-click product activation/deactivation and low-stock filter view.
**Independent Test**: Toggle a product to inactive, verify status badge updates and product disappears from active POS catalog.

- [x] T013 [US4] Integrate optimistic active/inactive status toggle switch in `src/features/products/components/ProductsTable.tsx`
- [x] T014 [US4] Add low-stock and out-of-stock quick filter pills in `src/features/products/components/ProductsFilterBar.tsx`

---

## Phase 7: User Story 5 - Bulk Excel / CSV Import with Live Validation Preview (Priority: P3)

**Goal**: Drag-and-drop Excel/CSV import with 2-step preview of valid rows and duplicate detection.
**Independent Test**: Upload an Excel file, review preview table showing valid/invalid row counts, click commit to batch-create items.

- [x] T015 [US5] Implement Excel import preview & commit mutation hooks in `src/features/products/api/useImportMutations.ts`
- [x] T016 [US5] Implement 2-step drag-and-drop import modal with preview table in `src/features/products/components/ImportProductsModal.tsx`

---

## Phase 8: Page Assembly & Polish

**Purpose**: Assemble the complete Products page and validate production build.

- [x] T017 Assemble complete Products & Inventory Management page in `src/pages/Products.tsx`
- [x] T018 [P] Verify navigation link in `src/components/layout/Sidebar.tsx` and router registration in `src/App.tsx`
- [x] T019 Validate production TypeScript compilation with 0 errors via `npm run build`

---

## Dependencies & Execution Order

### Phase Dependencies
- **Phase 1 (Setup)**: Can start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 - BLOCKS all User Stories.
- **Phase 3 (US1 - MVP)**: Depends on Phase 2.
- **Phase 4 (US2 - CRUD)**: Depends on Phase 3.
- **Phase 5 (US3 - Categories/Units)**: Depends on Phase 4.
- **Phase 6 (US4 - Stock Tracking)**: Depends on Phase 3.
- **Phase 7 (US5 - Bulk Import)**: Depends on Phase 4.
- **Phase 8 (Assembly & Polish)**: Depends on Phases 1-7.

### Parallel Opportunities
- T002 and T003 can be built in parallel.
- T004 and T005 can be built in parallel.
- T006 and T007 can be built in parallel.
- T015 and T016 can run in parallel after Phase 4.

---

## Implementation Strategy

### MVP First (User Story 1 + Story 2)
1. Complete Setup & Foundational queries/mutations (T001-T005).
2. Complete Catalog Table, Filters & Header (T006-T008).
3. Complete Add/Edit/Delete Modals with Zod validation (T009-T010).
4. Add Quick Categories/Units & Status Toggles (T011-T014).
5. Add Excel Import Flow & Final Page Assembly (T015-T019).
6. Validate with 0-error TypeScript production build.
