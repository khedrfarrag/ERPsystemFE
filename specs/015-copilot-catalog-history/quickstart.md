# Quickstart Validation Guide: AI Copilot Catalog & Lifecycle Intelligence

**Feature Directory**: `specs/015-copilot-catalog-history`
**Date**: 2026-09-16
**Status**: Ready for Validation

---

## Runnable Scenario 1: Request, Deduplicate, and Download an Excel Catalog
### Prerequisites
- Logged into RetailOS frontend (`http://localhost:5173`) as Store Owner (`owner@retailos.com`).
- AI Copilot Widget visible in bottom-left corner.
- Store already contains some existing products (e.g. "منتج فحص الكمية الافتتاحية").

### Steps
1. Click the floating **"المساعد الذكي"** button to open the Copilot drawer.
2. Send prompt:
   ```text
   جهز لي ملف إكسيل يحتوي على أصناف مقترحة لأقسام المنظفات والمساحيق والسجائر مع أسعار تقريبية
   ```
3. Observe Copilot response:
   - Identifies the business domain and creates 8-12 unique products per requested category.
   - None of the generated items clash with existing products in the store (Deduplication Safeguard).
   - Contains an interactive **Download Card** showing filename `products_catalog.csv` and items count (~30-36 items).
4. Click **[تحميل ملف الإكسيل الآن]**:
   - The `.csv` file is saved locally with UTF-8 BOM encoding.
5. Open the downloaded file in Microsoft Excel:
   - Arabic characters display cleanly without distortion.
   - Column headers match the 10 official import schema columns.
6. Open **المنتجات والمخزون** -> **استيراد من إكسيل**:
   - Upload the downloaded file.
   - The preview table shows valid rows ready to be imported.

---

## Runnable Scenario 2: Product Lifecycle Query with Fuzzy Disambiguation
### Prerequisites
- Store has products with similar brand names (e.g. "مسحوق أريال أوتوماتيك 4 كجم" and "مسحوق أريال يدوي 2.5 كجم").

### Steps
1. Open the Copilot drawer.
2. Send prompt with generic name:
   ```text
   إيه أخبار أريال في متجري؟
   ```
3. Observe Copilot response:
   - Triggers **Interactive Disambiguation Card** listing both variations with their current stock levels.
   - Asks: *"أي صنف محدد تقصد من الأصناف التالية؟"*.
4. Click on **"مسحوق أريال أوتوماتيك 4 كجم"**:
   - Copilot queries database ledger for that exact product.
   - Accurately states entry date, total purchased, total sold, remaining stock, revenue, and profit margin with 100% financial accuracy.

---

## Runnable Scenario 3: Interactive Action Card for Product Creation with RBAC Guard
### Steps for Store Owner (`owner@retailos.com`):
1. Open Copilot drawer.
2. Send prompt:
   ```text
   أضف صنف جديد باسم صابون سائل ديتول بسعر شراء 20 وسعر بيع 30 والكمية 40 في قسم المنظفات
   ```
3. Observe Copilot response:
   - Displays a structured **Action Confirmation Card** rendering the parsed values with an active green `[تأكيد وحفظ في المتجر]` button.
4. Click `[تأكيد وحفظ في المتجر]`:
   - Triggers `POST /api/v1/products` with `initialStock: 40`.
   - Toast notification confirms successful creation.
   - Product immediately appears in the products table with 40 units in stock.

### Steps for Cashier (`cashier@retailos.com`):
1. Send the same prompt: *"أضف صنف جديد باسم صابون سائل ديتول..."*.
2. Observe Action Confirmation Card:
   - The `[تأكيد وحفظ في المتجر]` button is **disabled**.
   - Hovering over the button reveals tooltip: *"يتطلب صلاحية مالك أو مدير"*.
   - Direct API attempts return `403 Forbidden`.
