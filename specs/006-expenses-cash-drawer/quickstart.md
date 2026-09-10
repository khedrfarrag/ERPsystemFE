# Quickstart & Verification Guide: 006-expenses-cash-drawer

## Prerequisites
- Backend running on `http://localhost:5030`
- Frontend running on `http://localhost:5173`
- Logged in as `Owner` or `Manager`

## Validation Scenarios

### Scenario 1: Initializing Cash Drawer Shift (Opening Float)
1. Navigate to `/expenses`.
2. Click **"فتح الوردية / عهدة البداية"**.
3. Enter amount: `500` EGP, notes: "عهدة افتتاحية".
4. Confirm -> Status badge displays "الوردية مفتوحة" with starting balance of `500.00 ج.م`.

### Scenario 2: Recording an Operating Expense
1. Click **"تسجيل مصروف جديد"**.
2. Select or create category "ضيافة وبوفيه".
3. Enter amount: `150` EGP, payment method: "نقدي (من الدرج)".
4. Submit -> Expense appears in the expenses list, and live cash drawer balance decreases to `350.00 ج.م`.

### Scenario 3: End-of-Day Shift Close & Discrepancy Audit
1. Click **"تقفيل الوردية وجرد الدرج"**.
2. View expected balance (`350.00 ج.م`).
3. Enter counted cash: `350.00` -> Discrepancy shows "مطابق تماماً 0.00 ج.م".
4. Change counted cash to `300.00` -> Discrepancy highlights in red: "عجز 50.00 ج.م".
5. Enter justification note and confirm closure.
6. Check history log in "سجل حركات الدرج".
