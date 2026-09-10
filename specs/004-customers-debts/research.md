# Research & Technical Decisions: 004-customers-debts

## Decision 1: Running Balance Calculation for Account Statements

- **Decision**: Render transactions sequentially with debit/credit indicators and display the running balance (`RunningBalance`) returned by the backend ledger engine.
- **Rationale**:
  - Financial ledgers require audit-proof transparency so customers can see exact invoice amounts and partial payment deductions step by step.
- **Alternatives Considered**:
  - *Showing only current balance*: Does not provide dispute resolution capability.

---

## Decision 2: Debt Settlement & Cash Register Impact

- **Decision**: When a payment is recorded via `POST /api/payments` with paymentMethod="Cash", automatically invalidate `['dashboard']` query cache so that the active cashier drawer balance updates instantly.
- **Rationale**:
  - Ensures accurate cashier drawer reconciliation at shift closing.
- **Alternatives Considered**:
  - *Manual drawer adjustments*: Prone to cashier errors and double counting.

---

## Decision 3: Egyptian Phone Number Validation

- **Decision**: Enforce standard Egyptian mobile format (`^(010|011|012|015)[0-9]{8}$`) with optional international code (+20).
- **Rationale**:
  - Standardizes SMS/WhatsApp notifications and prevents typos.
