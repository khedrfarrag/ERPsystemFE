# Data Model: 003-products-inventory

## TypeScript Interfaces

```typescript
// src/features/products/types/products.types.ts

export interface Product {
  id: string;
  name: string;
  barcode?: string;
  categoryId: string;
  categoryName?: string;
  unitId: string;
  unitName?: string;
  sellingPrice: number;
  purchaseCost?: number;
  minStockLevel?: number;
  currentStock?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  productCount?: number;
}

export interface Unit {
  id: string;
  name: string;
  symbol: string;
}

export interface CreateProductRequest {
  name: string;
  barcode?: string;
  categoryId: string;
  unitId: string;
  purchaseCost: number;
  sellingPrice: number;
  minStockLevel: number;
  initialStock?: number;
}

export interface UpdateProductRequest {
  name: string;
  barcode?: string;
  categoryId: string;
  unitId: string;
  purchaseCost: number;
  sellingPrice: number;
  minStockLevel: number;
}

export interface ProductListResponse {
  items: Product[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ImportPreviewRow {
  rowNumber: number;
  name: string;
  barcode?: string;
  categoryName?: string;
  unitName?: string;
  purchaseCost: number;
  sellingPrice: number;
  minStockLevel: number;
  isValid: boolean;
  errors: string[];
}

export interface ImportPreviewResponse {
  totalRows: number;
  validRowsCount: number;
  invalidRowsCount: number;
  rows: ImportPreviewRow[];
}

export interface ImportCommitResponse {
  importedCount: number;
  skippedCount: number;
}
```

---

## Validation Schemas (Zod)

```typescript
// src/features/products/types/products.schemas.ts
import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(2, 'اسم الصنف يجب أن يتكون من حرفين على الأقل'),
  barcode: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'يرجى اختيار القسم'),
  unitId: z.string().min(1, 'يرجى اختيار وحدة القياس'),
  purchaseCost: z.number().min(0, 'سعر التكلفة يجب أن يكون 0 أو أكثر'),
  sellingPrice: z.number().min(0.01, 'سعر البيع يجب أن يكون أكبر من 0'),
  minStockLevel: z.number().min(0, 'حد الطلب الأدنى يجب أن يكون 0 أو أكثر'),
  initialStock: z.number().min(0, 'الرصيد الافتتاحي لا يمكن أن يكون سالباً').optional(),
}).refine(data => data.sellingPrice >= data.purchaseCost, {
  message: 'تنبيه: سعر البيع أقل من سعر التكلفة (هامش ربح سالب)',
  path: ['sellingPrice'],
});

export const categoryFormSchema = z.object({
  name: z.string().min(2, 'اسم القسم مطلوب'),
  description: z.string().optional().nullable(),
});

export const unitFormSchema = z.object({
  name: z.string().min(1, 'اسم الوحدة مطلوب'),
  symbol: z.string().min(1, 'رمز الوحدة مطلوب (مثال: كجم، قطعة)'),
});
```
