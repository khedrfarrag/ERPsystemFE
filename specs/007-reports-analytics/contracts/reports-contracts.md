# API Contracts: 007-reports-analytics

## 1. Sales Summary
- **GET** `/api/reports/sales`
- **Query**: `from?: string`, `to?: string`, `customerId?: string`, `paymentMethod?: string`, `basis?: string`, `format?: string`
- **Response**: `ApiResponse<SalesSummaryReportResponse>`

## 2. Profit & Loss Statement
- **GET** `/api/reports/profit-loss`
- **Query**: `from?: string`, `to?: string`, `basis?: string`
- **Response**: `ApiResponse<ProfitLossReportResponse>`

## 3. Inventory Valuation
- **GET** `/api/reports/inventory/valuation`
- **Query**: `asOfDate?: string`, `categoryId?: string`, `format?: string`
- **Response**: `ApiResponse<InventoryValuationReportResponse>`

## 4. Product Stock Movement
- **GET** `/api/reports/inventory/movement/{productId}`
- **Query**: `from?: string`, `to?: string`, `format?: string`
- **Response**: `ApiResponse<ProductStockMovementReportResponse>`

## 5. Balances Reports
- **GET** `/api/reports/balances/customers?hasBalanceOnly=true` -> `ApiResponse<CustomerBalancesReportResponse>`
- **GET** `/api/reports/balances/suppliers?hasBalanceOnly=true` -> `ApiResponse<SupplierBalancesReportResponse>`

## 6. Cash Register Shift Audit
- **GET** `/api/reports/cash-register`
- **Query**: `from?: string`, `to?: string`, `format?: string`
- **Response**: `ApiResponse<CashRegisterAuditReportResponse>`
