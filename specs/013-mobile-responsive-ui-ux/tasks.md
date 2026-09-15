# Tasks: Mobile Responsiveness & Adaptive UI/UX Architecture

**Input**: Design artifacts from `specs/013-mobile-responsive-ui-ux/` (`spec.md`, `plan.md`, `data-model.md`, `contracts/ui-contracts.md`, `research.md`, `quickstart.md`)  
**Status**: Ready for Implementation

---

## Phase 1: Setup & Environment Standards

**Purpose**: Core viewport and styling infrastructure for mobile devices

- [X] T001 Update HTML root configuration with `lang="ar"`, `dir="rtl"`, and mobile viewport meta `viewport-fit=cover` in `index.html`
- [X] T002 [P] Configure mobile safe area utility classes (`pb-safe`) and input font size rules (`text-base sm:text-xs`) to eliminate iOS auto-zoom in `src/index.css`

---

## Phase 2: Foundational (Responsive Shell State)

**Purpose**: Core state and layout adaptations that MUST be complete before user story screens

- [X] T003 Update main application container margin from hardcoded `mr-64` to responsive `mr-0 lg:mr-64` in `src/components/layout/Layout.tsx`
- [X] T004 Implement mobile drawer toggle state and body scroll locking in `src/components/layout/Layout.tsx`

**Checkpoint**: Foundation ready - main layout adapts cleanly to any viewport width without breaking desktop view.

---

## Phase 3: User Story 1 - Fluid Responsive Application Shell & Mobile Navigation (Priority: P1) 🎯 MVP

**Goal**: Cashiers and managers can navigate the entire app on mobile via an off-canvas drawer and touch-friendly header without horizontal overflow.

**Independent Test**: Resize viewport to 375px; verify desktop sidebar is hidden, hamburger button opens off-canvas drawer from right, tapping links or backdrop closes drawer.

### Implementation for User Story 1

- [X] T005 [US1] Update `src/components/layout/Sidebar.tsx` to support dual mode: static sidebar on `lg:` viewports and sliding off-canvas drawer (`translate-x-full` / `translate-x-0`) with dimmed backdrop on `< lg` screens
- [X] T006 [US1] Add accessible hamburger menu button (minimum 44x44px tap target) and adapt header stats layout for mobile viewports in `src/components/layout/Navbar.tsx`
- [X] T007 [US1] Wire mobile drawer open/close handlers between `Navbar.tsx`, `Sidebar.tsx`, and `Layout.tsx` with auto-dismiss on route change

**Checkpoint**: User Story 1 fully functional - the entire system has a responsive navigation shell.

---

## Phase 4: User Story 2 - Adaptive Mobile Point of Sale (POS) Workflow (Priority: P1)

**Goal**: Full mobile POS capability allowing product search, touch catalog addition, live floating cart summary bar, and slide-up cart bottom sheet for checkout.

**Independent Test**: On a 375px mobile screen in `/pos`, add products to cart, see floating cart bar at bottom with total and item count, expand cart bottom sheet, adjust quantity, and complete checkout.

### Implementation for User Story 2

- [X] T008 [P] [US2] Create sticky floating cart indicator bar component in `src/features/pos/components/PosMobileFloatingBar.tsx`
- [X] T009 [P] [US2] Create slide-up cart bottom sheet drawer component in `src/features/pos/components/PosMobileCartSheet.tsx`
- [X] T010 [US2] Optimize catalog grid layout in `src/features/pos/components/ProductCatalogGrid.tsx` for 2-column touch-friendly cards on mobile screens (`< lg`)
- [X] T011 [US2] Refactor `src/pages/Pos.tsx` layout to adaptively switch between side-by-side view on desktop (`lg:`) and catalog + floating cart sheet on mobile (`< lg`)

**Checkpoint**: User Stories 1 AND 2 complete - cashiers can sell goods and complete checkout on mobile phones.

---

## Phase 5: User Story 3 - Responsive Data Lists & Mobile Card Views (Priority: P2)

**Goal**: Store owners can manage inventory and records on mobile through touch cards without scrolling 10-column tables horizontally.

**Independent Test**: Navigate to `/products` on a 375px viewport; verify table is replaced by responsive product cards with clear pricing, stock badges, and touch action buttons.

### Implementation for User Story 3

- [X] T012 [P] [US3] Create touch-friendly product card component in `src/features/products/components/ProductMobileCard.tsx`
- [X] T013 [US3] Implement dual-view pattern in `src/features/products/components/ProductsTable.tsx` (desktop table `hidden md:table` + mobile cards `block md:hidden`)
- [X] T014 [US3] Adapt filter bar layout for mobile in `src/features/products/components/ProductsFilterBar.tsx` with full-width search and scrollable category chips
- [X] T015 [US3] Optimize KPI summary cards and action button row for mobile screens in `src/pages/Dashboard.tsx`

**Checkpoint**: User Stories 1, 2, and 3 functional - management and inventory workflows are mobile-first.

---

## Phase 6: User Story 4 - Mobile-Optimized Modals, Forms & Ergonomics (Priority: P2)

**Goal**: Modals and form dialogs accommodate mobile virtual keyboards without clipping buttons or triggering unwanted viewport zooming.

**Independent Test**: Open "Add Product" or "Payment" modal on mobile; verify modal renders with responsive height, scrollable body, and sticky action buttons.

### Implementation for User Story 4

- [X] T016 [P] [US4] Optimize `src/features/products/components/ProductModal.tsx` for mobile viewports with scrollable body and sticky save footer
- [X] T017 [P] [US4] Optimize `src/features/pos/components/PaymentModal.tsx` touch numpad and payment method selector for mobile touchscreens
- [X] T018 [US4] Optimize `src/features/pos/components/ReceiptModal.tsx` for mobile viewports with accessible action buttons

**Checkpoint**: All user stories complete and ergonomically sound on touchscreens.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality assurance, verification, and zero-error validation

- [X] T019 Execute strict TypeScript build check (`npm run build`) and fix any compilation or type mismatches
- [X] T020 Run end-to-end device viewport validation across 375px, 390px, 768px, and 1280px viewports per `quickstart.md`
- [X] T021 Verify zero horizontal layout shift (CLS = 0) and Arabic RTL visual consistency across all modified components

---

## Dependencies & Execution Order

### Phase Dependencies

1. **Phase 1 (Setup)**: No dependencies - immediate start
2. **Phase 2 (Foundational)**: Depends on Phase 1 - blocks user stories
3. **Phase 3 (User Story 1 - Shell & Drawer)**: Depends on Phase 2 - provides the navigation foundation
4. **Phase 4 (User Story 2 - POS Mobile)**: Depends on Phase 3
5. **Phase 5 (User Story 3 - Data Cards)**: Depends on Phase 3 (can run parallel with Phase 4)
6. **Phase 6 (User Story 4 - Modals)**: Depends on Phase 4 & Phase 5
7. **Phase 7 (Polish)**: Depends on all user stories being complete

### Parallel Opportunities

- **T001 & T002**: HTML setup and CSS utilities can run in parallel
- **T008 & T009**: Floating bar and bottom sheet components can be built in parallel
- **T012 & T016**: Mobile product card and product modal optimization can be built in parallel
