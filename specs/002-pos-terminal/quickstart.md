# Quickstart & Verification Guide: 002-pos-terminal

## 1. Prerequisites
- React Frontend running on `http://localhost:5173` (or active build).
- Backend running on `http://localhost:5000` or Mock API fallback.

---

## 2. Verification Scenarios

### Scenario A: Fast Barcode Scan & Quantity Adjustment
1. Navigate to `/pos`.
2. Ensure barcode search box is focused.
3. Type or scan `6221234567890` and press Enter.
4. Verify item appears in the cart with quantity 1 and correct subtotal.
5. Click `+` to increase quantity to 2; verify totals update instantaneously.
6. Attempt to set quantity higher than available stock; verify out-of-stock toast appears.

### Scenario B: Cash Checkout & Change Computation
1. Click "إتمام البيع (F9)" or press F9.
2. In Payment Modal, verify "الدفع النقدي" (Cash) is selected by default.
3. Enter a Paid Amount higher than the total (e.g. Total = 180, Paid = 200).
4. Verify Change Due shows `20.00 ج.م`.
5. Click "تأكيد وإصدار الفاتورة".
6. Verify receipt modal opens with invoice details and print button.
7. Verify product catalog stock reflects deduction.

### Scenario C: Credit Limit Protection
1. Open customer selector and choose a customer near their credit ceiling.
2. Add items exceeding their remaining credit ceiling.
3. Open Payment Modal and select "آجل (شكك)".
4. Verify system shows warning and disables confirmation button until customer is cleared or payment method changed.

---

## 3. Production Build Validation Command

```bash
npm run build
```
Must exit with Code 0 and 0 TypeScript compilation errors.
