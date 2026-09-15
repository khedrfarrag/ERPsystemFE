# Feature Specification: Mobile Responsiveness & Adaptive UI/UX Architecture

**Feature Branch**: `013-mobile-responsive-ui-ux`

**Created**: 2026-09-15

**Status**: Draft

**Input**: User description: "انا عاوز اعمل الشاشه تكون ريسبونسيف علي شاشات الموبايل باحترافيه كخبير ui ux developer اكتر من 20 سنه" (Make the screens fully responsive on mobile screens with senior UI/UX standard)

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fluid Responsive Application Shell & Mobile Navigation (Priority: P1)

As a retail store manager or cashier using a smartphone or small tablet, I need to navigate between dashboard, sales, products, and management screens through an intuitive off-canvas mobile drawer and accessible top header, so that the navigation does not block my workspace and allows one-handed mobile operation.

**Why this priority**: Without a responsive application shell, all pages are squished or clipped on screens narrower than 1024px, completely blocking mobile usability.

**Independent Test**: Can be tested on any mobile device or viewport (360px - 768px). The user can open the navigation drawer using the menu toggle button, tap any navigation destination, have the drawer auto-dismiss, and access their store profile and quick theme switch without layout overflow.

**Acceptance Scenarios**:

1. **Given** a user accesses the application on a mobile viewport (< 1024px), **When** the page loads, **Then** the desktop sidebar is hidden by default, the main content takes 100% of the viewport width without horizontal overflow, and a hamburger menu button is visible in the header.
2. **Given** the mobile view, **When** the user taps the hamburger menu icon, **Then** an off-canvas navigation drawer smoothly slides in from the right edge with a backdrop overlay covering the main screen.
3. **Given** the navigation drawer is open, **When** the user taps a navigation link, taps the backdrop overlay, or taps the close button, **Then** the drawer smoothly dismisses and the selected page is presented.
4. **Given** the mobile header, **When** viewed on small screens (360px - 480px), **Then** secondary elements (e.g., non-critical badges) collapse gracefully, preventing horizontal header scroll or overlapping controls.

---

### User Story 2 - Adaptive Mobile Point of Sale (POS) Workflow (Priority: P1)

As a cashier or store owner using a smartphone at a popup counter or on the sales floor, I need an adaptive POS interface where I can search or scan products and seamlessly view/edit my active cart and complete checkout without elements being cut off or hidden.

**Why this priority**: POS is the core transactional engine of the store. If cashiers cannot view both products and their cart on a mobile device, they cannot sell goods away from a stationary desktop computer.

**Independent Test**: On a 375px mobile screen, a user can search a product, add it to the cart, see an updated floating cart summary bar at the bottom of the screen with total amount and item count, expand the cart drawer to adjust quantities or apply discounts, and trigger the payment modal to complete checkout.

**Acceptance Scenarios**:

1. **Given** a user on a mobile viewport in the POS screen, **When** viewing the catalog, **Then** the product grid displays in a compact, touch-friendly 2-column card layout, and a sticky floating cart summary bar appears at the bottom displaying item count and total price.
2. **Given** the floating cart summary bar, **When** the cashier taps it, **Then** the full shopping cart expands in an accessible bottom sheet or modal drawer allowing item quantity updates, removal, and discount editing.
3. **Given** items in the cart on mobile, **When** the cashier clicks "Proceed to Checkout", **Then** the payment modal opens as an ergonomic, thumb-friendly dialog with large touch numpad buttons and payment method selectors.
4. **Given** an completed sale on mobile, **When** receipt modal appears, **Then** the receipt is fully readable, scrollable, and offers immediate print or dismiss actions without clipping.

---

### User Story 3 - Responsive Data Lists & Mobile Card Views for Management Screens (Priority: P2)

As a store owner on the go, I need to inspect and manage products, sales history, customers, suppliers, and daily expenses on my phone without horizontal scrolling across wide 10-column tables.

**Why this priority**: Complex desktop data tables are virtually unreadable on mobile screens and force frustrating lateral scrolling. Converting them to adaptive cards empowers owners to review inventory, sales, and accounts anywhere.

**Independent Test**: Opening the Products or Customers page on a mobile device renders an elegant, card-based list displaying primary identifiers, key values (e.g., price, stock status badge, phone number), and an action menu button, while desktop view preserves the comprehensive tabular grid.

**Acceptance Scenarios**:

1. **Given** a management page (Products, Sales, Customers, Suppliers, Expenses), **When** viewed on screens below 768px, **Then** the wide table is replaced by a responsive card list where each record is clearly bounded with distinct visual hierarchy.
2. **Given** a record card on mobile, **When** the user taps the action menu or action button, **Then** immediate editing, status toggling, or deletion options are presented with ample touch spacing (minimum 44x44px touch targets).
3. **Given** the search and filter controls on mobile, **When** viewing the filter bar, **Then** search inputs take full width and category filters are presented as horizontally scrollable chips or an expandable filter drawer rather than cramped inline inputs.

---

### User Story 4 - Mobile-Optimized Modals, Forms & Ergonomics (Priority: P2)

As a mobile user creating or updating records (adding a new product, registering a customer, recording an expense), I need modals and form inputs to accommodate mobile virtual keyboards and avoid automatic browser zooming or obscured submit buttons.

**Why this priority**: When virtual keyboards pop up on iOS and Android, rigid desktop modals often hide action buttons and inputs, causing user abandonment or frustration.

**Independent Test**: Opening the "Add Product" or "Add Customer" modal on a phone presents a full-screen or bottom-sheet form with large, easily tapable inputs (font size >= 16px to prevent iOS auto-zoom) and a sticky footer containing Cancel and Save buttons.

**Acceptance Scenarios**:

1. **Given** any creation/edit modal on mobile, **When** opened, **Then** it renders as an ergonomic full-screen or bottom-sheet sheet with smooth entrance animation and a fixed header with close button.
2. **Given** an active form input focused on mobile, **When** the software keyboard appears, **Then** the active input scrolls into view and the primary submission action remains easily accessible without getting hidden off-screen.
3. **Given** any interactive element (buttons, inputs, dropdown selectors, tabs), **When** evaluated on touch screens, **Then** all tap targets measure at least 44x44 CSS pixels with safe-area spacing at the bottom of the viewport (`env(safe-area-inset-bottom)`).

---

### Edge Cases

- **Virtual Keyboard Overlap**: When a cashier types a barcode or custom price, the mobile keyboard must not push the modal header or submit action into an unrecoverable overflow state.
- **Orientation Changes (Portrait <-> Landscape)**: When a phone is rotated to landscape, the layout must fluidly reflow without crashing, clipping modals, or locking scroll.
- **Extremely Narrow Viewports (320px - 360px)**: The layout must remain functional on older budget smartphones (e.g., iPhone SE 1st gen, Galaxy A series) without text truncation that obscures critical financial numbers.
- **RTL Alignment on Drawer/Sheets**: The mobile drawer must slide from the right side for natural Arabic reading direction (RTL), with close and back gestures respecting right-to-left expectations.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST render an off-canvas navigation drawer on viewports under 1024px, toggled by an accessible hamburger button in the top navigation bar.
- **FR-002**: The application shell MUST remove fixed right margins (`mr-64`) on mobile and tablet viewports, ensuring content occupies 100% available viewport width.
- **FR-003**: The mobile navigation drawer MUST automatically close when a navigation link is clicked or when the dimmed backdrop overlay is tapped.
- **FR-004**: The POS terminal MUST provide an adaptive mobile experience featuring a touch-optimized catalog grid and a sticky floating cart summary bar.
- **FR-005**: The POS mobile cart summary MUST display live item count, total price in EGP (`ج.م`), and an action to expand the full cart details in a slide-up bottom sheet.
- **FR-006**: Data-heavy management views (Products, Sales, Customers, Suppliers, Expenses, B2B Orders) MUST provide an adaptive dual-view (full table on desktop >= 1024px, card-based list on mobile < 768px).
- **FR-007**: Management filter bars MUST adapt on mobile by offering full-width search and scrollable category chips or collapsible filter sections.
- **FR-008**: All interactive touch targets (buttons, icon actions, menu items, table actions) MUST have a minimum tap area of 44x44 pixels.
- **FR-009**: Form inputs on mobile MUST have a minimum font size of 16px (`1rem`) to prevent iOS Safari from triggering unwanted page zoom upon focus.
- **FR-010**: All modal dialogs on mobile (< 640px) MUST render as full-screen dialogs or bottom-anchored sheets with fixed action headers/footers to preserve usability when virtual keyboards open.
- **FR-011**: The viewport meta tag and styling MUST account for device safe areas (`env(safe-area-inset-bottom)`) for modern notch and home-bar devices.
- **FR-012**: The HTML root document MUST declare `lang="ar"` and `dir="rtl"` with appropriate page titles matching store operations.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of core store workflows (making a sale in POS, creating a product, searching customer debts, recording an expense) can be completed on a 375px mobile screen without horizontal viewport scrolling.
- **SC-002**: Mobile layout load and visual reflow occurs in under 100ms with zero horizontal layout shift (CLS = 0).
- **SC-003**: 100% of interactive buttons and inputs comply with the WCAG 2.2 touch target size criteria of at least 44x44 CSS pixels.
- **SC-004**: Cashiers can complete a standard 3-item cash sale on mobile in under 20 seconds.
- **SC-005**: Zero layout clipping or text overlap observed across major viewport widths: 360px, 375px, 414px, 768px, and 1024px+.

---

## Assumptions

- Target devices include modern Android (Chrome) and iOS (Safari) smartphones and small tablets.
- Existing business logic, backend API contracts, and calculations remain 100% unchanged; this feature is strictly an adaptive presentation and interaction layer enhancement.
- Keyboard shortcuts continue to operate when external physical keyboards or barcode scanners are connected to mobile/tablet devices.
- Dark mode and light mode theming tokens are preserved and fully consistent across all mobile cards, drawers, and sheets.
