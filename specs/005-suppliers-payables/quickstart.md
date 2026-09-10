# Quickstart & Verification Guide: 005-suppliers-payables

## 1. Verification Scenarios

### Scenario A: Suppliers Directory & Search
1. Navigate to `/suppliers`.
2. Search by supplier name or phone; verify instant filtering.
3. Check KPI cards for total payables matching sum of supplier balances.

### Scenario B: Add Supplier & Sales Representative
1. Click "إضافة مورد جديد".
2. Fill Name: "شركة الدلتا للصناعات الغذائية", Phone: "01012345678".
3. Add a sales representative: "أحمد فؤاد", Phone: "01123456789".
4. Save; verify supplier appears in table with 1 representative badge.

### Scenario C: Create & Confirm Purchase Order
1. Click "فاتورة توريد جديدة" on a supplier row.
2. Select 2 products with quantities (e.g. 20 units) and unit costs.
3. Click "تأكيد واستلام البضاعة".
4. Verify warehouse stock increments for both products and supplier debt increases.

### Scenario D: Pay Supplier Settlement
1. Click "سداد دفعة" on a supplier row.
2. Enter Amount: "3000", Method: "Cash".
3. Confirm; verify supplier debt decreases by 3,000 EGP.

---

## 2. Production Build Validation Command

```bash
npm run build
```
Must exit with Code 0 and 0 TypeScript compilation errors.
