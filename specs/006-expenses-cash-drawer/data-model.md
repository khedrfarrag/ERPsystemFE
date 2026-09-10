# Data Model: 006-expenses-cash-drawer

## Entity Definitions

### 1. ExpenseCategory
```typescript
export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string | null;
  isActive: boolean;
}
```

### 2. ExpenseItem
```typescript
export interface ExpenseItem {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  expenseDate: string;
  paymentMethod: 'Cash' | 'BankTransfer' | 'Cheque';
  description?: string | null;
  createdAt: string;
}
```

### 3. CashRegisterSummary
```typescript
export interface CashRegisterSummary {
  currentBalance: number;
  lastFloatDate?: string | null;
  lastFloatAmount?: number | null;
  todayInflows: number;
  todayOutflows: number;
}
```

### 4. CashRegisterCloseResult
```typescript
export interface CashRegisterCloseResult {
  expectedBalance: number;
  countedAmount: number;
  discrepancy: number;
  notes?: string | null;
  closedAt: string;
}
```

### 5. CashRegisterTransaction
```typescript
export interface CashRegisterTransaction {
  id: string;
  date: string;
  type: string; // 'OPENING_FLOAT' | 'SALE' | 'CUSTOMER_PAYMENT' | 'EXPENSE' | 'SUPPLIER_PAYMENT' | 'CLOSE'
  amount: number;
  referenceId?: string | null;
  notes?: string | null;
}
```
