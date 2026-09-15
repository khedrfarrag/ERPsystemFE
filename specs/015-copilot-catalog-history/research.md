# Phase 0 Research: AI Copilot Catalog Generation & Product Lifecycle Intelligence

**Feature**: `specs/015-copilot-catalog-history`
**Date**: 2026-09-16
**Status**: Completed

---

## 1. Research Question: Catalog File Generation Architecture
### Question
How should the AI Copilot generate and deliver the downloadable catalog files requested by the user, ensuring immediate availability and 100% compatibility with Microsoft Excel on Windows and RetailOS's import engine?

### Findings & Decision
- **RetailOS Import Engine**: [ProductImportService.cs](file:///g:/system-analysiss-saas/system-BE/src/RetailOS.Infrastructure/Catalog/ProductImportService.cs) supports both `.csv` and `.xlsx`. It expects exact column headers:
  `اسم الصنف (إجباري)`, `الباركود`, `الفئة`, `الوحدة`, `سعر البيع (إجباري)`, `سعر التكلفة`, `الحد الأدنى للمخزون`, `الوصف`, `سعر الجملة`, `متاح جملة (1 أو 0)`.
- **Arabic Character Encoding in Excel**: Microsoft Excel on Windows defaults to local ANSI code pages for `.csv` files unless a UTF-8 Byte Order Mark (`\uFEFF`) is prepended. Without BOM, Arabic text displays as corrupted characters (mojibake).
- **Delivery Pattern**: 
  - The backend LLM generates a structured JSON payload for the catalog within the chat response (or wrapped in a dedicated action schema `[ACTION:DOWNLOAD_CATALOG]`).
  - The frontend widget receives the structured rows, constructs a UTF-8 BOM CSV/Excel blob in-memory, and provides an instant one-click download card.
- **Alternatives Considered**:
  - *Server-side temporary file storage*: Storing `.xlsx` files on server disk and serving via temporary URL. Rejected because it introduces disk cleanup tasks, ephemeral container state issues, and network latency when client-side blob generation is instantaneous and zero-cost.

---

## 2. Research Question: Product Lifecycle Ledger & Audit Trail Extraction
### Question
How can the AI Copilot reliably extract a complete lifecycle history of a specific product without hallucinating financial figures or slow N+1 database queries?

### Findings & Decision
- **Source of Truth**: RetailOS already maintains full transaction audit trails:
  - `InventoryTransactions`: tracks `OpeningBalance`, `Purchase`, `Sale`, `PurchaseReturn`, `SaleReturn`, `Adjustment`, and `Damage` with timestamps, quantities, and cost per unit.
  - `SaleLineItems` & `Sales`: tracks sales prices and dates.
  - `PurchaseLineItems` & `Purchases`: tracks supplier purchase prices and invoice references.
- **Data Aggregation**: In [AiChatController.cs](file:///g:/system-analysiss-saas/system-BE/src/RetailOS.Api/Controllers/AiChatController.cs), if a query targets a specific product (detected via keyword/name matching against store products), the backend performs an optimized projection:
  ```csharp
  var productHistory = await _context.Products
      .Where(p => p.StoreId == storeId && (p.Name.ToLower().Contains(target) || p.Barcode == target))
      .Select(p => new {
          p.Id, p.Name, p.Barcode, p.SellingPrice, p.PurchaseCost, p.MinStockLevel,
          CurrentStock = p.InventoryTransactions.Sum(t => (decimal?)t.Quantity) ?? 0,
          FirstEntry = p.InventoryTransactions.OrderBy(t => t.CreatedAt).FirstOrDefault(),
          PurchasedQty = p.InventoryTransactions.Where(t => t.Quantity > 0).Sum(t => (decimal?)t.Quantity) ?? 0,
          SoldQty = Math.Abs(p.InventoryTransactions.Where(t => t.Reason == InventoryTransactionReason.Sale).Sum(t => (decimal?)t.Quantity) ?? 0),
          TotalRevenue = p.InventoryTransactions.Where(t => t.Reason == InventoryTransactionReason.Sale).Sum(t => (decimal?)(Math.Abs(t.Quantity) * p.SellingPrice)) ?? 0
      })
      .FirstOrDefaultAsync(cancellationToken);
  ```
- **Constitution Compliance**: The LLM receives verified factual numbers in the system prompt context, completely preventing financial hallucination in accordance with Constitution Rule 1.

---

## 3. Research Question: Interactive Action Cards Protocol (Human-in-the-Loop)
### Question
How should the Copilot represent actions (e.g. download catalog, confirm new product creation) within the chat interface?

### Findings & Decision
- The Copilot's response payload will support an optional `actions` list alongside `reply`:
  ```json
  {
    "reply": "لقد قمت بتجهيز قائمة أصناف مقترحة...",
    "model": "OpenCode Zen",
    "actions": [
      {
        "type": "DOWNLOAD_CATALOG",
        "title": "كتالوج المنظفات والمساحيق والسجائر",
        "filename": "retailos_catalog.csv",
        "rows": [ ... ]
      }
    ]
  }
  ```
- The frontend chat UI parses `actions` and renders specialized interactive cards:
  - `DOWNLOAD_CATALOG`: Renders a download card with filename, items count, and a direct download button.
  - `CREATE_PRODUCT`: Renders a prefilled product preview card with a `[تأكيد وحفظ]` button that calls `useCreateProductMutation`.

---

## 4. Research Question: Dynamic Domain Adaptation & Context-Aware Deduplication
### Question
How to prevent the AI from generating duplicate products on repeated requests and dynamically adapt to different retail business types?

### Findings & Decision
- **Dynamic Domain Detection**: Store profile information (e.g. store name, category tags) and explicit user prompts are inspected. If not explicit, the agent prompts for the business domain (e.g. Detergents, Supermarket, Plumbing, Electrical).
- **Deduplication Safeguard**: In `AiChatController.cs`, before invoking the LLM for catalog generation, the system queries the active store's existing product names:
  ```csharp
  var existingProductNames = await _context.Products
      .Where(p => p.StoreId == storeId)
      .Select(p => p.Name)
      .Take(100)
      .ToListAsync(cancellationToken);
  ```
  This list is passed in the prompt:
  `"Generate 8-12 unique products per requested category that DO NOT exist in this list: [{string.Join(", ", existingProductNames)}]"`
- **Strict Output**: LLM outputs a JSON array matching the 10 Excel import headers directly.

---

## 5. Research Question: Fuzzy Search & Interactive Disambiguation Flow
### Question
How should the Copilot handle inquiries for generic product names with multiple variants (e.g. "أريال" having 2.5kg, 4kg, Gel)?

### Findings & Decision
- **Fuzzy Search**: When a query matches a product name loosely (`ILIKE %query%`) and produces >1 match:
  - Instead of guessing or combining totals (which corrupts unit financials), the backend emits a `DISAMBIGUATE_PRODUCT` action:
    ```json
    {
      "type": "DISAMBIGUATE_PRODUCT",
      "query": "أريال",
      "variants": [
        { "id": "guid1", "name": "أريال أوتوماتيك 4 كجم", "currentStock": 15 },
        { "id": "guid2", "name": "أريال يدوي 2.5 كجم", "currentStock": 8 }
      ]
    }
    ```
  - The UI renders interactive chips/buttons for the user to click. Clicking a variant sends the exact name back to retrieve the definitive single-product lifecycle.

---

## 6. Research Question: Strict Dual-Layer RBAC for Action Cards
### Question
How to enforce security constraints so unauthorized roles (e.g. Cashiers) cannot execute product creation via chat action cards?

### Findings & Decision
- **Client-Side Guard**: Inside `ProductActionCard.tsx`, the `useAuth()` hook checks user roles (`user.role !== 'Cashier'`). If Cashier, the `[تأكيد وحفظ]` button is disabled with a Cairo-font tooltip: *"يتطلب صلاحية مالك أو مدير"*.
- **Backend API Guard**: The `POST /api/v1/products` endpoint continues to enforce `[Authorize(Roles = "Owner,Manager")]`. If a Cashier bypasses client checks, the server returns `403 Forbidden` and the frontend displays a standard red error toast.

