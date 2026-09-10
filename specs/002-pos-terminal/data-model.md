# Data Model: 002-pos-terminal

## TypeScript Entities & Schemas

```typescript
// src/features/pos/types/pos.types.ts

export type PaymentMethod = 'Cash' | 'Credit' | 'Mixed';

export interface PosProduct {
  id: string;
  name: string;
  barcode: string;
  categoryName: string;
  categoryId?: string;
  sellingPrice: number;
  currentStock: number;
  minStockLevel?: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  barcode: string;
  unitPrice: number;
  quantity: number;
  discount: number; // in EGP
  maxStock: number;
  total: number; // (unitPrice * quantity) - discount
}

export interface CustomerCreditInfo {
  id: string;
  name: string;
  phone: string;
  currentBalance: number; // Existing debt in EGP
  creditLimit: number;    // Maximum allowable debt in EGP
}

export interface SaleItemPayload {
  productId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface CreateSalePayload {
  customerId?: string | null;
  paymentMethod: PaymentMethod;
  discountAmount: number;
  paidAmount: number;
  items: SaleItemPayload[];
}

export interface SaleResponse {
  id: string;
  saleNumber: string;
  totalAmount: number;
  discountAmount: number;
  netAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: string;
  customerName?: string;
  cashierName?: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }[];
}

export interface CartTotals {
  subtotal: number;
  totalDiscount: number;
  grandTotal: number;
  itemCount: number;
  totalUnits: number;
}
```

---

## Validation Rules (Zod Schemas)

1. **Cart Item Validation**:
   - `quantity`: integer >= 1 and <= `maxStock`.
   - `discount`: number >= 0 and <= `unitPrice * quantity`.

2. **Checkout Payment Validation**:
   - **Cash Sale**:
     - `paidAmount >= grandTotal` (change calculated as `paidAmount - grandTotal`).
   - **Credit Sale**:
     - Requires `customerId != null`.
     - `customer.currentBalance + grandTotal <= customer.creditLimit`.
   - **Mixed Sale**:
     - Requires `customerId != null`.
     - `0 < paidAmount < grandTotal`.
     - `customer.currentBalance + (grandTotal - paidAmount) <= customer.creditLimit`.
