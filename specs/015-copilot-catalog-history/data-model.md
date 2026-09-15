# Phase 1 Data Model: AI Copilot Catalog Generation & Product Lifecycle Intelligence

**Feature**: `specs/015-copilot-catalog-history`
**Date**: 2026-09-16
**Status**: Completed

---

## 1. Copilot Communication Contracts & Action Models

### 1.1 Chat Request DTO
```typescript
export interface AiChatRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
  pageContext?: string; // e.g. "products", "dashboard", "pos"
}
```

### 1.2 Chat Response DTO with Action Dispatching
```typescript
export interface AiChatResponse {
  reply: string;
  model: string;
  actions?: CopilotAction[];
}

export type CopilotAction = 
  | CatalogExportAction 
  | ProductDisambiguationAction
  | ProductConfirmAction;

export interface CatalogExportAction {
  type: 'DOWNLOAD_CATALOG';
  title: string;
  filename: string;
  rows: CatalogItemRow[];
}

export interface ProductDisambiguationAction {
  type: 'DISAMBIGUATE_PRODUCT';
  query: string;
  variants: Array<{
    id: string;
    name: string;
    currentStock: number;
    sellingPrice: number;
    categoryName?: string;
  }>;
}

export interface CatalogItemRow {
  name: string;
  barcode?: string;
  category: string;
  unit: string;
  sellingPrice: number;
  purchaseCost?: number;
  minStockLevel?: number;
  description?: string;
  wholesalePrice?: number;
  isWholesaleAvailable?: boolean;
}

export interface ProductConfirmAction {
  type: 'CREATE_PRODUCT';
  product: {
    name: string;
    barcode?: string;
    categoryName: string;
    unitName: string;
    sellingPrice: number;
    purchaseCost?: number;
    minStockLevel?: number;
    initialStock?: number;
    wholesalePrice?: number;
    isWholesaleAvailable?: boolean;
  };
}
```

---

## 2. Product Lifecycle Snapshot (Internal Backend Query Model)
Used by [AiChatController.cs](file:///g:/system-analysiss-saas/system-BE/src/RetailOS.Api/Controllers/AiChatController.cs) to inject factual product history into the LLM system prompt:

```csharp
public record ProductLifecycleSummaryDto(
    Guid Id,
    string Name,
    string? Barcode,
    string CategoryName,
    string UnitSymbol,
    decimal SellingPrice,
    decimal? PurchaseCost,
    decimal? MinStockLevel,
    decimal CurrentStock,
    DateTime? FirstEntryDate,
    decimal OpeningStockQuantity,
    decimal TotalPurchasedQuantity,
    decimal TotalSoldQuantity,
    decimal TotalSalesRevenue,
    decimal TotalGrossProfit,
    int TotalSaleTransactionsCount,
    bool IsLowStock,
    string VelocityCategory // "Fast-Moving", "Normal", "Slow-Moving"
);
```

---

## 3. Spreadsheet Schema Alignment
Exported catalog columns conform directly to `ProductImportService.cs`:
1. `اسم الصنف (إجباري)` -> string (max 300)
2. `الباركود` -> string? (max 100)
3. `الفئة` -> string (mapped or auto-created)
4. `الوحدة` -> string (mapped or auto-created)
5. `سعر البيع (إجباري)` -> decimal > 0
6. `سعر التكلفة` -> decimal? >= 0
7. `الحد الأدنى للمخزون` -> decimal? >= 0
8. `الوصف` -> string?
9. `سعر الجملة` -> decimal? >= 0
10. `متاح جملة (1 أو 0)` -> integer (1 or 0)
