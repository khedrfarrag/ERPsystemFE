# Feature Specification: 002-pos-terminal

**Feature Name**: Point of Sale (POS) Terminal & Cashier Checkout (شاشة نقطة البيع ومكتب الكاشير)
**Feature Directory**: `specs/002-pos-terminal`
**Created**: 2026-09-05
**Status**: Ready for Planning
**Input**: User description: "02-pos-terminal"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fast Barcode Scanning & Live Cart Operations (Priority: P1)

As a cashier at the retail store checkout counter,
I want to scan item barcodes rapidly using a physical barcode scanner or type a product name/SKU,
So that products are instantly added to the active sales cart with accurate prices, stock deductions, and real-time total calculations.

**Why this priority**:
The core business throughput depends on rapid item entry. Inability to scan or assemble a cart blocks 100% of sales transactions.

**Independent Test**:
Can be fully tested by entering product barcodes or selecting items from the grid, adjusting quantities, applying item discounts, and observing real-time subtotal, discount, and tax calculations without finalizing checkout.

**Acceptance Scenarios**:
1. **Given** the POS screen is active with barcode input auto-focused, **When** a valid barcode (e.g. `6221234567890`) is scanned and Enter is pressed, **Then** the matching product is added to the cart (or quantity incremented by 1 if already in cart) and an audio-visual confirmation is triggered.
2. **Given** an item exists in the active cart with available stock of 5, **When** the cashier increases quantity to 6, **Then** the system displays a friendly out-of-stock warning toast and caps the quantity at available stock.
3. **Given** multiple items in the cart, **When** the cashier removes an item or changes item discount, **Then** the cart subtotal, item count, total discount, and net grand total recalculate instantaneously (<16ms).
4. **Given** an active cart with items, **When** the cashier clicks "Clear Cart" (مسح السلة) with confirmation, **Then** all items are removed and the POS resets to its initial clean state.

---

### User Story 2 - Multi-Payment Checkout & Split Payment Processing (Priority: P1)

As a cashier completing a customer order,
I want to process payments across multiple payment methods: Cash (`Cash`), On Credit / Deferred (`Credit`), and Mixed Split Payment (`Mixed`),
So that transactions are accurately settled, change is calculated for cash, and receivables are recorded for credit customers.

**Why this priority**:
Completing the financial exchange is the definitive revenue-generating step of the POS system.

**Independent Test**:
Can be tested by initiating checkout on a cart with a grand total, selecting each payment type (Cash, Credit, Mixed), entering paid amounts, and verifying payload validation and submission to the backend sales API.

**Acceptance Scenarios**:
1. **Given** a cart total of 250 EGP and Cash payment selected, **When** cashier enters 300 EGP in "Paid Amount", **Then** the system displays change due of 50 EGP and enables the "Complete Sale" button.
2. **Given** a customer with credit limit of 1,000 EGP and current balance of 800 EGP, **When** cashier attempts a Credit checkout of 300 EGP, **Then** the system prevents submission and alerts that the transaction exceeds the allowable credit limit (available credit is 200 EGP).
3. **Given** a mixed payment of total 500 EGP, **When** cashier specifies 200 EGP cash and 300 EGP credit for a selected eligible customer, **Then** the sale is processed with payment method `Mixed` and paid amount of 200 EGP.
4. **Given** a completed sale response from server, **Then** the system updates product stock, cashier drawer summary, and opens the receipt preview modal.

---

### User Story 3 - Customer Selection & Real-Time Financial Profiling (Priority: P2)

As a cashier handling a known regular or corporate customer,
I want to search and assign a customer to the current invoice and view their current balance and credit ceiling,
So that deferred sales are accurately assigned and loyal customers can be tracked.

**Why this priority**:
Required for B2B/deferred retail sales and preventing bad debts while providing personalized checkout experience.

**Independent Test**:
Can be tested by typing customer name or phone in the customer selector, viewing their balance badge, and observing automatic assignment to the invoice.

**Acceptance Scenarios**:
1. **Given** the customer dropdown/search modal, **When** cashier searches by name (e.g. "أحمد") or phone number, **Then** matching customers appear with their current balance and debt limit badges.
2. **Given** a selected customer with outstanding debt, **When** cashier selects "Walk-in Customer" (عميل نقدي عام), **Then** payment is restricted to `Cash` only (Credit disabled).

---

### User Story 4 - Thermal Receipt Preview & 80mm Printing (Priority: P2)

As a cashier after completing a sale,
I want an instant 80mm thermal receipt preview and one-click direct printing,
So that the customer receives a physical invoice containing store name, invoice number, items, VAT, discounts, cashier name, and barcode/QR code.

**Why this priority**:
Essential for customer trust, tax compliance, and return/exchange verification.

**Independent Test**:
Can be tested by clicking "Print Receipt" on a completed sale modal and verifying that the dedicated thermal print layout renders cleanly without UI clutter or margins distortion.

**Acceptance Scenarios**:
1. **Given** a finalized sale, **When** the receipt modal opens, **Then** all line items, tax breakdown, payment method, paid/remaining amounts, and store metadata are formatted in Arabic RTL optimized for 80mm thermal width.
2. **Given** the receipt modal, **When** the cashier presses "Print" (طباعة) or keyboard shortcut (Ctrl+P / Enter), **Then** the browser print dialog opens with `@media print` styles hiding navigation, background, and buttons.

---

### User Story 5 - Visual Product Catalog Grid & Fast Category Filter (Priority: P3)

As a cashier handling items without barcodes (e.g., fresh produce, bakery, bulk items),
I want a touch-friendly visual product grid with category tabs, search filter, and stock indicators,
So that I can click or tap items directly into the cart without needing a scanner.

**Why this priority**:
Provides fallback and high efficiency for non-barcoded or unreadable items and touch-screen POS terminals.

**Independent Test**:
Can be tested by switching category tabs, searching with debounced input, and clicking item cards to add them to cart.

**Acceptance Scenarios**:
1. **Given** the product grid, **When** the cashier clicks a category pill (e.g. "مشروبات"), **Then** only products belonging to that category are displayed with live stock badges.
2. **Given** a product with 0 stock, **When** displayed in the grid, **Then** it shows an "Out of Stock" (نفد المخزون) badge and is disabled from direct clicking.

---

## Edge Cases

- **Barcode Scanner Rapid Multishot**: When a scanner inputs 13 digits in <50ms followed by Enter, the system must process the exact barcode without debouncing collision or focus loss.
- **Stock Depletion During Sale**: If an item had stock of 2 and was added to cart, then another terminal sold it, the backend error must be intercepted gracefully with a specific error toast and option to adjust quantity.
- **Price Modification / Discounts**: If an overall or line discount exceeds total price, input validation must automatically restrict discount <= item/cart price.
- **Cashier Session Interruption / Drawer State**: If cashier connection drops temporarily, the active cart items are preserved in memory/local storage until explicitly cleared.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST maintain an active barcode scanner listener with automatic focus management on the search/barcode input.
- **FR-002**: System MUST support instant item addition to cart via barcode scan, product grid click, or debounced text search (name/SKU).
- **FR-003**: System MUST provide a responsive Live Cart displaying item name, unit price, quantity controls (+ / - / manual input), line discount, line total, and remove button.
- **FR-004**: System MUST recalculate cart subtotal, total discount amount, tax amount (if applicable), and final grand total using memoization (`useMemo`) for sub-millisecond response.
- **FR-005**: System MUST prevent setting item quantities greater than current available stock or less than 1.
- **FR-006**: System MUST allow selecting a customer from an auto-suggest list or choosing "Walk-in Customer" (عميل نقدي).
- **FR-007**: System MUST display customer financial status (Current Balance, Credit Limit, Remaining Credit Ceiling) upon customer selection.
- **FR-008**: System MUST support three payment methods: `Cash`, `Credit`, and `Mixed`, with strict rules:
  - `Cash`: requires `paidAmount >= grandTotal`, computes change.
  - `Credit`: requires a registered customer with `currentBalance + grandTotal <= creditLimit`.
  - `Mixed`: requires registered customer, `paidAmount > 0` and `paidAmount < grandTotal`, with remaining balance charged to customer debt if within credit limit.
- **FR-009**: System MUST post sales payload to `POST /api/sales` using TanStack Query mutation (`useMutation`).
- **FR-010**: System MUST automatically invalidate and refetch TanStack Query caches for `['products']`, `['dashboard']`, and `['customers']` upon successful sale creation.
- **FR-011**: System MUST display a thermal receipt modal (80mm width standard) with store logo, branch details, invoice number, cashier name, item breakdown, payment breakdown, and print trigger.
- **FR-012**: System MUST implement keyboard shortcuts for power cashiers:
  - `F2` or `Ctrl+K`: Focus Barcode/Search input
  - `F9` or `Space+Enter`: Open Checkout modal
  - `Escape`: Close modal or cancel action
- **FR-013**: System MUST provide immediate Arabic feedback toasts for operations (item added, stock warning, sale completed, error).

---

### Key Entities

- **CartItem**:
  - `productId`: Unique identifier (GUID)
  - `productName`: Product display title in Arabic
  - `barcode`: Barcode string
  - `unitPrice`: Retail selling price
  - `quantity`: Number of units in cart (integer >= 1)
  - `discount`: Line-level discount in EGP (>= 0)
  - `maxStock`: Current warehouse available stock
  - `total`: Computed line total (`(unitPrice * quantity) - discount`)

- **SaleTransaction**:
  - `customerId`: Optional GUID (required for Credit/Mixed)
  - `paymentMethod`: `'Cash' | 'Credit' | 'Mixed'`
  - `discountAmount`: Overall invoice discount in EGP
  - `paidAmount`: Cash amount handed over by customer
  - `items`: Array of `{ productId, quantity, unitPrice, discount }`

- **CustomerCreditProfile**:
  - `id`: GUID
  - `name`: Full customer/company name
  - `phone`: Contact phone
  - `currentBalance`: Existing debt amount in EGP
  - `creditLimit`: Maximum allowable debt in EGP

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A cashier can scan 5 items and finalize a cash sale in under 12 seconds.
- **SC-002**: Live cart calculations execute with zero perceptible delay (< 16ms latency) even with 100 line items in the cart.
- **SC-003**: 100% of out-of-stock or over-credit checkout attempts are blocked on the client side before triggering server errors.
- **SC-004**: Product stock and dashboard revenue metrics update within 500ms after sale completion across all client screens via TanStack Query cache invalidation.
- **SC-005**: 80mm thermal receipts print cleanly on standard thermal POS printers without clipping, misaligned text, or unwanted browser headers/footers.

---

## Assumptions

- Barcode scanners are configured in standard USB HID Keyboard Emulation mode emitting an `Enter` key after the scanned barcode string.
- The currency unit is Egyptian Pound (`ج.م` / EGP).
- Authentication token is provided via `AuthContext` and automatically attached to all API requests via Axios interceptor.
- The backend API endpoints (`/api/sales`, `/api/products`, `/api/customers`, `/api/categories`) are running and adhere to the REST contracts established in the system architecture.
