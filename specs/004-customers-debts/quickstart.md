# Quickstart & Verification Guide: 004-customers-debts

## 1. Verification Scenarios

### Scenario A: Customer Directory & Search
1. Navigate to `/customers`.
2. Search by phone number (e.g. "01012345678"); verify instant filtering.
3. Check KPI cards for total receivables matching sum of customer balances.

### Scenario B: Add Customer with Credit Ceiling
1. Click "إضافة عميل جديد".
2. Fill Name: "مكتبة النور", Phone: "01098765432", Credit Limit: "3000.00".
3. Save; verify customer appears in table and in POS customer dropdown.

### Scenario C: Receive Debt Payment
1. Click "تسجيل دفعة" on a debtor customer row.
2. Enter Amount: "500", Payment Method: "Cash".
3. Confirm; verify balance reduces by 500 EGP and cashier drawer balance updates.

### Scenario D: Account Statement View & Print
1. Click "كشف حساب" on customer row.
2. Verify chronological transactions ledger with running balance.
3. Click "طباعة"; verify clean statement output without UI clutter.

---

## 2. Production Build Validation Command

```bash
npm run build
```
Must exit with Code 0 and 0 TypeScript compilation errors.
