# Quickstart & Verification Guide: 003-products-inventory

## 1. Verification Scenarios

### Scenario A: Product Catalog Exploration & Debounced Search
1. Navigate to `/products`.
2. Type "أرز" in the search box; verify filtering triggers smoothly (<300ms).
3. Click a category tab (e.g. "ألبان"); verify only dairy products are listed.
4. Toggle "نواقص المخزون" filter; verify low-stock items are highlighted in amber/rose.

### Scenario B: Add New Product & Margin Calculation
1. Click "إضافة منتج جديد".
2. Enter Name: "شاي العروسة 250 جم", Cost: "45.00", Selling: "55.00".
3. Verify Profit Margin displays `10.00 ج.م (18.18%)` in green.
4. Click Save; verify product appears immediately in the table and POS catalog.

### Scenario C: Quick Category & Unit Creation
1. Inside Product Modal, click "+ إضافة قسم".
2. Enter "مشروبات ساخنة" and confirm.
3. Verify the new category is automatically selected in the product form.

### Scenario D: Status Toggle
1. Toggle the status switch of any product to "معطل".
2. Verify it shows inactive status badge and disappears from active POS cashier grid.

---

## 2. Production Build Validation Command

```bash
npm run build
```
Must exit with Code 0 and 0 TypeScript compilation errors.
