# Feature Specification: 005-suppliers-payables

**Feature Name**: Suppliers, Purchase Invoices & Payables Management (إدارة الموردين، فواتير التوريد، والمستحقات)
**Feature Directory**: `specs/005-suppliers-payables`
**Created**: 2026-09-05
**Status**: Ready for Planning
**Input**: User description: "05-suppliers-payables"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Suppliers Directory & Accounts Payable Overview (Priority: P1)

As a store owner or purchasing manager,
I want to view a comprehensive directory of all product suppliers with real-time balance tracking, search by company name or phone, and contact representatives,
So that I can monitor total outstanding supplier payables and plan cash outflows.

**Why this priority**:
Managing suppliers and outstanding payables is critical for maintaining supply chains and supplier trust.

**Independent Test**:
Can be fully tested by loading the suppliers screen, searching for a supplier, and viewing their balance badge and representative contact numbers.

**Acceptance Scenarios**:
1. **Given** the suppliers screen, **When** user searches by company name or phone, **Then** matching suppliers appear instantly (<250ms).
2. **Given** a supplier with outstanding payables (e.g. 14,500 EGP), **Then** their row displays an Amber payables badge and count of registered sales reps.

---

### User Story 2 - Add & Edit Supplier Profile & Sales Representatives (Priority: P1)

As a purchasing manager,
I want to register new supplier companies and attach their sales representatives (Name, Phone, Notes),
So that our store maintains accurate supplier records and direct contact lines for ordering.

**Why this priority**:
Supplier records are required to process purchase orders and record payables.

**Independent Test**:
Can be tested by adding a new supplier with opening balance, attaching a sales rep contact, and verifying they appear in the directory.

**Acceptance Scenarios**:
1. **Given** the Add Supplier modal, **When** user inputs company name and phone, **Then** the supplier is created and ready for purchase invoices.
2. **Given** a supplier card, **When** user clicks "+ إضافة مندوب", **Then** the rep is added to the supplier's contact roster.

---

### User Story 3 - Create & Confirm Purchase Invoices (Priority: P1)

As an inventory clerk or purchasing officer,
I want to create purchase invoices with multiple product items, quantities, and cost prices, and confirm them into the system,
So that warehouse stock is incremented and the supplier payable balance is updated automatically.

**Why this priority**:
The core inventory intake flow that replenishes stock and creates payable debts.

**Independent Test**:
Can be tested by creating a purchase invoice for 2 products (10 units each), confirming the invoice, and verifying product stock increments by 10 and supplier debt increases by invoice total.

**Acceptance Scenarios**:
1. **Given** the New Purchase modal, **When** user adds line items with unit costs and saves as Draft, **Then** the draft is saved with an assigned purchase number.
2. **Given** a draft purchase order, **When** manager clicks "تأكيد واستلام البضاعة", **Then** inventory stock levels increase immediately and supplier balance is updated.

---

### User Story 4 - Pay Supplier & Settle Payables (Priority: P2)

As a store owner or accountant,
I want to record payment disbursements to suppliers (Cash, Bank Transfer, Cheque) with receipt number and notes,
So that outstanding supplier debt is reduced and cash drawer balance is deducted accurately.

**Why this priority**:
Essential for tracking cash outflows and settling debts.

**Independent Test**:
Can be tested by clicking "سداد دفعة" on a supplier row, entering 2,000 EGP Cash, and verifying supplier balance decreases by 2,000 EGP.

**Acceptance Scenarios**:
1. **Given** a supplier with 5,000 EGP debt, **When** a payment of 2,000 EGP is recorded, **Then** supplier debt updates to 3,000 EGP.
2. **Given** payment creation, **Then** TanStack Query automatically invalidates `['suppliers']`, `['dashboard']`, `['payments']`, and `['purchases']`.

---

### User Story 5 - Supplier Detailed Account Statement (Priority: P2)

As an accountant reconciling supplier invoices,
I want to view and print a chronological account statement showing purchase invoices, payments, and running balance,
So that payment reconciliations with supplier accounting departments are error-free.

**Why this priority**:
Audit-proof transaction transparency for supply chain accounting.

**Independent Test**:
Can be tested by clicking "كشف حساب" on any supplier, viewing the ledger math, and triggering print.

**Acceptance Scenarios**:
1. **Given** the supplier statement modal, **Then** all purchases and payments appear with calculated running balance and print button.

---

## Edge Cases

- **Deleting Supplier with Unsettled Balance**: System blocks deleting suppliers with active balances or purchase history.
- **Confirming Purchase with Negative Cost**: Validation requires cost price > 0.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a paginated directory of suppliers with Name, Phone, Address, Payables Balance, Reps Count, Status, and Actions.
- **FR-002**: System MUST calculate and display KPI summary cards: Total Suppliers, Total Outstanding Payables, Active Creditors Count.
- **FR-003**: System MUST provide debounced search (<250ms) by supplier name or phone.
- **FR-004**: System MUST provide Add and Edit Supplier modals with Zod validation.
- **FR-005**: System MUST provide a New Purchase Order modal with live item selector, cost inputs, quantity controls, and grand total computation.
- **FR-006**: System MUST support 2-step purchase order flow (Draft -> Confirm & Receive Stock).
- **FR-007**: System MUST provide a Supplier Payment Disbursement modal (`POST /api/payments` with `partyType: "Supplier"`).
- **FR-008**: System MUST provide a Supplier Account Statement modal with running balance and clean print mode.
- **FR-009**: System MUST automatically invalidate and refetch `['suppliers']`, `['purchases']`, `['products']`, and `['dashboard']` after any mutation.

---

### Key Entities

- **Supplier**:
  - `id`: GUID
  - `name`: Company title
  - `phone`: Contact phone
  - `address`: Optional string
  - `currentBalance`: Outstanding payables (EGP)
  - `notes`: Optional string
  - `isActive`: Boolean
  - `representatives`: Array of `{ id, name, phone, notes }`

- **PurchaseOrder**:
  - `id`: GUID
  - `supplierId`: GUID
  - `supplierName`: string
  - `purchaseNumber`: string
  - `invoiceNumber`: Optional supplier invoice ref
  - `status`: `"Draft" | "Confirmed" | "Cancelled"`
  - `totalAmount`: Decimal
  - `items`: Array of `{ productId, productName, quantity, unitCost, subTotal }`

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Confirming a 10-item purchase order increments inventory stock across all catalog and POS screens in under 500ms.
- **SC-002**: Supplier payment disbursements reflect immediately in the cashier drawer and dashboard summary.
- **SC-003**: 100% of supplier debts match the cumulative total of confirmed purchases minus payments.

---

## Assumptions

- Currency is Egyptian Pound (`ج.م` / EGP).
- Role access: Cashiers have view access; Managers and Owners have full purchase, payment, and supplier edit rights.
