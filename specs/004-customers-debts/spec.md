# Feature Specification: 004-customers-debts

**Feature Name**: Customers, Receivables & Credit Limit Management (إدارة العملاء، الديون، وسقف الائتمان)
**Feature Directory**: `specs/004-customers-debts`
**Created**: 2026-09-05
**Status**: Ready for Planning
**Input**: User description: "04-customers-debts"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Customers Ledger, Receivables Overview & Search (Priority: P1)

As a store owner or accountant,
I want to view a comprehensive, paginated directory of all customers with real-time balance tracking, credit limit badges, and instant search by name or phone,
So that I can monitor total outstanding customer receivables and assess individual customer debt at a glance.

**Why this priority**:
Accounts receivable management is vital for maintaining cash flow and identifying credit risks across the retail business.

**Independent Test**:
Can be fully tested by loading the customers page, searching for a customer by name or phone, and viewing their balance badge, credit ceiling, and debt status.

**Acceptance Scenarios**:
1. **Given** the customers screen, **When** user types a customer name or phone number, **Then** matching customers are filtered with debounced latency (<250ms).
2. **Given** a customer with an active balance of 1,200 EGP and credit limit of 2,000 EGP, **Then** the row displays an Amber balance badge and a 60% credit consumption bar.
3. **Given** customers with zero debt, **Then** they show a green "خالص / مسدد" badge.

---

### User Story 2 - Add & Edit Customer with Credit Limit Rules (Priority: P1)

As a store manager or owner,
I want to register new customer profiles (Name, Phone, Address, Maximum Credit Ceiling, Initial Balance, and Notes) with strict validations,
So that deferred sales can be accurately assigned and bad debt is prevented.

**Why this priority**:
Creating customer records is a prerequisite for POS credit/deferred sales and debt tracking.

**Independent Test**:
Can be tested by filling the Add Customer modal with valid Egyptian phone format, setting a credit limit (e.g. 5,000 EGP), and verifying the customer appears immediately in the table and the POS customer dropdown.

**Acceptance Scenarios**:
1. **Given** the Add Customer modal, **When** manager enters a valid 11-digit phone number (e.g. `01012345678`) and credit limit, **Then** the customer is saved and a confirmation toast is shown.
2. **Given** an invalid phone number or duplicate name, **When** submitting, **Then** the form highlights the exact validation error using Zod rules.
3. **Given** an existing customer, **When** owner updates the credit limit from 1,000 to 3,000 EGP, **Then** the new limit takes effect immediately across both customer screen and POS terminal without page refresh.

---

### User Story 3 - Detailed Customer Account Statement & Transaction History (Priority: P2)

As a store owner or customer settling accounts,
I want to generate and view a chronological account statement showing sales invoices, payments, returns, and running balance (كشف حساب مع الرصيد التراكمي),
So that any financial disputes or balance inquiries can be reconciled transparently.

**Why this priority**:
Essential for customer trust, credit reconciliation, and auditing deferred payments.

**Independent Test**:
Can be tested by clicking "كشف حساب" on any customer with transaction history, verifying the ledger entries (Date, Type, Reference, Debit, Credit, Running Balance), and triggering the print dialog.

**Acceptance Scenarios**:
1. **Given** a customer account statement modal, **When** loaded, **Then** all historical sales, returns, and payments are displayed in chronological order with calculating running balance.
2. **Given** the statement modal, **When** user clicks "طباعة كشف الحساب", **Then** a clean printable statement layout is formatted without navigation bars or UI clutter.

---

### User Story 4 - Receive Customer Payment & Settle Receivables (Priority: P2)

As a cashier or accountant,
I want to record a debt settlement payment from a customer (Cash, Bank Transfer, or Cheque) with amount, receipt reference, and notes,
So that customer debt is reduced immediately and drawer cash balance is updated in real time.

**Why this priority**:
Collecting customer debts is the definitive cash inflow step for credit retail sales.

**Independent Test**:
Can be tested by clicking "تسجيل دفعة / قبض" on a debtor customer, entering amount (e.g. 500 EGP), selecting Cash payment, and verifying customer balance reduces by 500 EGP and cashier drawer balance increases.

**Acceptance Scenarios**:
1. **Given** a customer owing 1,500 EGP, **When** user records a payment of 500 EGP, **Then** the customer balance updates to 1,000 EGP and an Arabic success notification is shown.
2. **Given** payment creation, **When** submitted, **Then** TanStack Query automatically invalidates `['customers']`, `['dashboard']`, and `['payments']`.

---

### User Story 5 - Credit Risk & High Debt Aging Filters (Priority: P3)

As a business owner reviewing credit risks,
I want quick filter buttons for "العملاء المدينون فقط", "المتجاوزين للحد الائتماني", and "الرصيد الصفري",
So that debt collection priorities can be established quickly.

**Why this priority**:
Helps management focus on high-risk debtors and overdue accounts.

**Independent Test**:
Can be tested by clicking the "تجاوز الائتمان" filter pill, verifying only customers whose debt >= 90% of credit limit are shown.

**Acceptance Scenarios**:
1. **Given** the filters bar, **When** user clicks "العملاء المدينون فقط", **Then** customers with `currentBalance > 0` are filtered.
2. **Given** the KPI header, **When** viewing the "إجمالي الديون المستحقة" card, **Then** the sum of all customer receivables is rendered accurately.

---

## Edge Cases

- **Payment Exceeding Outstanding Debt**: If cashier enters a payment amount greater than the customer balance, show a friendly confirmation prompt to ensure intent (creating a credit balance / overpayment).
- **Deleting Customer with Non-Zero Balance**: System must prevent deleting customers who have active debt balances or transaction history.
- **Credit Limit Zero / Cash Only**: When credit limit is 0, the customer is restricted strictly to cash sales in the POS.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a paginated directory of customers with Name, Phone, Address, Current Balance, Credit Limit, Credit Bar, Status, and Action menu.
- **FR-002**: System MUST calculate and display KPI summary cards: Total Customers, Total Receivables (إجمالي الديون), Total Debtors Count, and Over-Limit Risk Count.
- **FR-003**: System MUST provide debounced search (<250ms) by customer name or phone number.
- **FR-004**: System MUST provide filter pills for: All, Debtors Only (`balance > 0`), Over-Limit Risk (`balance >= 90% limit`), and Zero Debt.
- **FR-005**: System MUST provide Add and Edit Customer modals with React Hook Form + Zod validation (11-digit phone check, positive credit limits).
- **FR-006**: System MUST provide a Receive Payment modal (`POST /api/payments`) supporting Cash, Bank Transfer, and Cheque payment methods with reference numbers and notes.
- **FR-007**: System MUST provide an Account Statement dialog (`GET /api/customers/{id}/statement`) with running balance ledger and print stylesheet.
- **FR-008**: System MUST automatically invalidate and refetch `['customers']`, `['dashboard']`, and `['payments']` caches upon customer creation, update, or payment receipt.
- **FR-009**: System MUST prevent deletion of customers with outstanding balances or transaction history.

---

### Key Entities

- **Customer**:
  - `id`: GUID
  - `name`: Full customer title
  - `phone`: Contact phone
  - `address`: Optional address
  - `creditLimit`: Decimal ceiling (EGP)
  - `currentBalance`: Outstanding debt (EGP)
  - `notes`: Optional string
  - `isActive`: Boolean

- **PaymentReceipt**:
  - `id`: GUID
  - `partyType`: `"Customer"`
  - `customerId`: GUID
  - `amount`: Decimal (EGP)
  - `paymentMethod`: `"Cash" | "BankTransfer" | "Cheque"`
  - `referenceNumber`: Optional string
  - `notes`: Optional string
  - `paymentDate`: DateTimeOffset

- **AccountStatement**:
  - `partyId`: GUID
  - `partyName`: string
  - `currentBalance`: Decimal
  - `transactions`: Array of `{ id, date, type, amount, runningBalance, referenceId, notes }`

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Searching a customer directory of 2,000 customers responds in under 150ms.
- **SC-002**: Recording a debt payment reduces customer balance and updates cash drawer totals in under 500ms.
- **SC-003**: 100% of customer debt transactions are verifiable via the running balance account statement.
- **SC-004**: 0% invalid phone numbers or over-limit credit bypasses occur.

---

## Assumptions

- Currency is Egyptian Pound (`ج.م` / EGP).
- Role access: Cashiers can view balances and record payments; Managers/Owners have full add, edit, and credit limit configuration rights.
- Backend API endpoints at `/api/customers` and `/api/payments` are active and tested.
