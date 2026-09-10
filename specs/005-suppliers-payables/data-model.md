# Data Model: 005-suppliers-payables

## TypeScript Interfaces

```typescript
// src/features/suppliers/types/suppliers.types.ts

export interface Representative {
  id: string;
  supplierId: string;
  name: string;
  phone: string;
  notes?: string | null;
  isActive: boolean;
}

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
  currentBalance: number; // In EGP
  isActive: boolean;
  representatives: Representative[];
  createdAt?: string;
  updatedAt?: string;
}

export interface SupplierListResponse {
  items: Supplier[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface CreateSupplierRequest {
  name: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
  openingBalance?: number | null;
}

export interface UpdateSupplierRequest {
  name: string;
  phone: string;
  address?: string | null;
  notes?: string | null;
}

export interface CreateRepresentativeRequest {
  name: string;
  phone: string;
  notes?: string | null;
}

export interface PurchaseLineItemRequest {
  productId: string;
  quantity: number;
  unitCost: number;
  discount: number;
}

export interface CreatePurchaseRequest {
  supplierId: string;
  invoiceNumber?: string | null;
  purchaseDate: string;
  notes?: string | null;
  items: PurchaseLineItemRequest[];
}

export interface PurchaseLineItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitCost: number;
  discount: number;
  subTotal: number;
}

export interface PurchaseResponse {
  id: string;
  supplierId: string;
  supplierName: string;
  purchaseNumber: string;
  invoiceNumber?: string | null;
  purchaseDate: string;
  status: string;
  totalAmount: number;
  notes?: string | null;
  createdAt: string;
  items: PurchaseLineItemResponse[];
}

export interface PurchaseListResponse {
  items: PurchaseResponse[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface AccountStatementItemResponse {
  id: string;
  date: string;
  type: string;
  amount: number;
  runningBalance: number;
  referenceId?: string | null;
  notes?: string | null;
}

export interface AccountStatementResponse {
  partyId: string;
  partyName: string;
  currentBalance: number;
  transactions: AccountStatementItemResponse[];
}

export interface SupplierFilterParams {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
  hasPayables?: boolean;
}
```

---

## Validation Schemas (Zod)

```typescript
// src/features/suppliers/types/suppliers.schemas.ts
import { z } from 'zod';

export const supplierFormSchema = z.object({
  name: z.string().min(2, 'اسم المورد أو الشركة مطلوب'),
  phone: z.string().regex(/^(010|011|012|015)[0-9]{8}$/, 'رقم الهاتف يجب أن يكون رقم محمول مصري صحيح (11 رقماً)'),
  address: z.string().optional().nullable(),
  openingBalance: z.number().min(0, 'الرصيد الافتتاحي لا يمكن أن يكون سالباً').optional().nullable(),
  notes: z.string().max(500, 'الملاحظات يجب ألا تتجاوز 500 حرف').optional().nullable(),
});

export const representativeFormSchema = z.object({
  name: z.string().min(2, 'اسم المندوب مطلوب'),
  phone: z.string().regex(/^(010|011|012|015)[0-9]{8}$/, 'رقم الهاتف يجب أن يكون 11 رقماً'),
  notes: z.string().max(300, 'الملاحظات يجب ألا تتجاوز 300 حرف').optional().nullable(),
});

export const disbursePaymentFormSchema = z.object({
  amount: z.number().min(0.5, 'المبلغ يجب أن يكون 0.5 ج.م على الأقل'),
  paymentMethod: z.enum(['Cash', 'BankTransfer', 'Cheque'] as const, {
    message: 'يرجى تحديد طريقة السداد',
  }),
  referenceNumber: z.string().optional().nullable(),
  notes: z.string().max(300, 'الملاحظات يجب ألا تتجاوز 300 حرف').optional().nullable(),
});
```
