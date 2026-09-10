# Data Model: 007-reports-analytics

## Core Report Entities

### 1. SalesSummaryReport
```typescript
export interface SalesSummaryReport {
  from?: string | null;
  to?: string | null;
  accountingBasis: string;
  grossSales: number;
  totalDiscounts: number;
  totalReturns: number;
  netSales: number;
  totalOrders: number;
  averageOrderValue: number;
  paymentBreakdown: {
    paymentMethod: string;
    totalAmount: number;
    transactionCount: number;
    percentage: number;
  }[];
  topProducts: {
    productId: string;
    productName: string;
    barcode?: string | null;
    categoryName: string;
    quantitySold: number;
    totalRevenue: number;
    totalCost: number;
    totalProfit: number;
  }[];
  categoryBreakdown: {
    categoryId: string;
    categoryName: string;
    quantitySold: number;
    totalRevenue: number;
    percentage: number;
  }[];
}
```

### 2. ProfitLossReport
```typescript
export interface ProfitLossReport {
  from?: string | null;
  to?: string | null;
  accountingBasis: string;
  grossSales: number;
  salesReturns: number;
  netSalesRevenue: number;
  costOfGoodsSold: number;
  grossProfit: number;
  grossProfitMarginPercentage: number;
  operatingExpenses: number;
  netProfit: number;
  netProfitMarginPercentage: number;
  expenseBreakdown: {
    categoryId: string;
    categoryName: string;
    totalAmount: number;
    percentage: number;
  }[];
}
```

### 3. InventoryValuationReport
```typescript
export interface InventoryValuationReport {
  asOfDate: string;
  totalValuation: number;
  totalProductsCount: number;
  totalUnitsCount: number;
  items: {
    productId: string;
    productName: string;
    barcode?: string | null;
    categoryName: string;
    currentStock: number;
    unitCostWac: number;
    totalValue: number;
    sellingPrice: number;
    potentialRevenue: number;
  }[];
}
```

### 4. Customer & Supplier Balances
```typescript
export interface CustomerBalancesReport {
  totalReceivables: number;
  totalDebtorsCount: number;
  debtors: {
    customerId: string;
    customerName: string;
    phone?: string | null;
    currentBalance: number;
    creditLimit?: number | null;
    lastTransactionDate?: string | null;
  }[];
}

export interface SupplierBalancesReport {
  totalPayables: number;
  intTotalCreditorsCount: number;
  creditors: {
    supplierId: string;
    supplierName: string;
    phone?: string | null;
    currentBalance: number;
    lastTransactionDate?: string | null;
  }[];
}
```
