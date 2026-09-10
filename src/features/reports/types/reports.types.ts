export type ReportTabType = 'sales' | 'profit-loss' | 'inventory-valuation' | 'balances' | 'cash-audit';

export type DatePreset = 'today' | 'last7' | 'thisMonth' | 'lastMonth' | 'custom';

export interface SalesByPaymentMethod {
  paymentMethod: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface TopSellingProduct {
  productId: string;
  productName: string;
  barcode?: string | null;
  categoryName: string;
  quantitySold: number;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}

export interface SalesByCategory {
  categoryId: string;
  categoryName: string;
  quantitySold: number;
  totalRevenue: number;
  percentage: number;
}

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
  paymentBreakdown: SalesByPaymentMethod[];
  topProducts: TopSellingProduct[];
  categoryBreakdown: SalesByCategory[];
}

export interface ExpenseCategoryBreakdown {
  categoryId: string;
  categoryName: string;
  totalAmount: number;
  percentage: number;
}

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
  expenseBreakdown: ExpenseCategoryBreakdown[];
}

export interface ProductValuationItem {
  productId: string;
  productName: string;
  barcode?: string | null;
  categoryName: string;
  currentStock: number;
  unitCostWac: number;
  totalValue: number;
  sellingPrice: number;
  potentialRevenue: number;
}

export interface InventoryValuationReport {
  asOfDate: string;
  totalValuation: number;
  totalProductsCount: number;
  totalUnitsCount: number;
  items: ProductValuationItem[];
}

export interface StockMovementItem {
  transactionId: string;
  date: string;
  reason: string;
  quantityChange: number;
  unitCost: number;
  resultingBalance: number;
  referenceId?: string | null;
  notes?: string | null;
}

export interface ProductStockMovementReport {
  productId: string;
  productName: string;
  barcode?: string | null;
  currentStock: number;
  movements: StockMovementItem[];
}

export interface CustomerBalanceItem {
  customerId: string;
  customerName: string;
  phone?: string | null;
  currentBalance: number;
  creditLimit?: number | null;
  lastTransactionDate?: string | null;
}

export interface CustomerBalancesReport {
  totalReceivables: number;
  totalDebtorsCount: number;
  debtors: CustomerBalanceItem[];
}

export interface SupplierBalanceItem {
  supplierId: string;
  supplierName: string;
  phone?: string | null;
  currentBalance: number;
  lastTransactionDate?: string | null;
}

export interface SupplierBalancesReport {
  totalPayables: number;
  totalCreditorsCount: number;
  creditors: SupplierBalanceItem[];
}

export interface DailyCashRegisterSummary {
  date: string;
  openingFloat: number;
  inflows: number;
  outflows: number;
  expectedClosing: number;
  actualCounted?: number | null;
  discrepancy?: number | null;
}

export interface CashRegisterAuditReport {
  from?: string | null;
  to?: string | null;
  totalOpeningFloats: number;
  totalCashSalesInflows: number;
  totalCustomerPaymentInflows: number;
  totalExpenseOutflows: number;
  totalSupplierPaymentOutflows: number;
  totalRefundOutflows: number;
  totalDiscrepancies: number;
  netCashChange: number;
  dailySummaries: DailyCashRegisterSummary[];
}
