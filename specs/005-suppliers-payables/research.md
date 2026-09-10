# Research & Technical Decisions: 005-suppliers-payables

## Decision 1: Purchase Confirmation & Inventory Synchronization

- **Decision**: When a purchase invoice is confirmed via `POST /api/purchases/{id}/confirm`, automatically invalidate `['products']`, `['suppliers']`, and `['dashboard']`.
- **Rationale**:
  - Immediately updates stock counts in the product catalog and POS terminal without page refresh.
- **Alternatives Considered**:
  - *Manual stock entry*: Disconnected from supplier invoices, leading to accounting mismatches.

---

## Decision 2: Multi-Item Purchase Order Form Management

- **Decision**: Manage line items (Product, Quantity, UnitCost, Discount) using React Hook Form `useFieldArray` or custom state inside `CreatePurchaseModal.tsx` with memoized subtotal, discount, and grand total calculations.
- **Rationale**:
  - Delivers instant sub-millisecond calculation as purchasing clerks modify quantities or costs.
