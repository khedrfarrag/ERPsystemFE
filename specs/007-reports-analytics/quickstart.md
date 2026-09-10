# Quickstart & Verification Guide: 007-reports-analytics

## Prerequisites
- Backend running on `http://localhost:5030`
- Frontend running on `http://localhost:5173`
- Logged in as `Owner` or `Manager`

## Validation Scenarios

### Scenario 1: Sales & P&L Statement Verification
1. Navigate to `/reports`.
2. Click **"قائمة الأرباح والخسائر"**.
3. Select date preset **"هذا الشهر"**.
4. Verify Net Profit = Gross Sales - COGS - Operating Expenses.
5. Click **"طباعة التقرير"** -> Browser print preview opens with clean formatted layout.

### Scenario 2: Inventory Valuation & Movement Drilldown
1. Click **"تقييم المخزون وحركة الأصناف"**.
2. View Total Warehouse Cost Value and Potential Revenue.
3. Click on any product row -> Product Stock Movement modal opens showing chronological stock changes (POS sales, Purchases, Adjustments).

### Scenario 3: Customer Receivables & Cash Audit
1. Click **"أرصدة ومديونيات"** -> displays debtors with outstanding balances.
2. Click **"تدقيق الدرج والورديات"** -> displays shift discrepancy history.
