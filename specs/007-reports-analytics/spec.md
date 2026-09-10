# Feature Specification: 007-reports-analytics

**Feature Name**: Comprehensive Financial, Sales, Inventory Valuation & Cash Audit Reports  
**Target Module**: RetailOS Frontend (`system-FE`) & Reports Backend (`system-BE`)  
**Status**: Ready for Planning  
**Version**: 1.0.0  

---

## 1. Executive Summary & Business Value

Retail decision-making requires rapid, unambiguous insight into profitability, inventory valuation, sales velocity, customer debts, and cash drawer reconciliations. 

This feature delivers an executive reporting center for RetailOS with 5 interactive, tabbed report modules:
1. **Sales Summary Report (تقرير ملخص المبيعات)**: Gross revenue, discounts, returns, net sales, order count, payment methods breakdown (Cash/Card/Credit), and top-selling products.
2. **Profit & Loss / Income Statement (قائمة الأرباح والخسائر)**: Net sales revenue, Cost of Goods Sold (COGS), Gross Profit & Margin %, Operating Expenses breakdown, and Net Operating Profit.
3. **Inventory Valuation & Stock Movements (تقييم المخزون وحركة الأصناف)**: Total warehouse inventory value at Cost (WAC) vs Selling Price, potential gross profit, and individual item stock movement timeline (Purchases/Sales/Adjustments).
4. **Accounts Balances & Aging (أرصدة العملاء والموردين)**: Total receivables (ديون العملاء) and total payables (مستحقات الموردين) with aging indicators and direct statement shortcuts.
5. **Cash Register & Shift Audits (تقرير تدقيق الدرج والورديات)**: Aggregated inflows, outflows, total shift discrepancies (عجز أو زيادة), and daily cash ledger.

All reports support dynamic date ranges (اليوم، آخر 7 أيام، هذا الشهر، مخصص), visual interactive charts, thermal/A4 printing, and CSV export.

---

## 2. User Personas & Roles

| Persona | Role | Permissions |
|---------|------|-------------|
| **Store Owner** | `Owner` | Full access to all financial reports, P&L statements, valuation, debtor/creditor balances, and exports. |
| **Store Manager** | `Manager` | Full access to sales, inventory valuation, stock movements, and shift audits. |
| **Cashier / Staff** | `Cashier` | Restricted from accessing executive P&L and comprehensive balance reports. |

---

## 3. User Stories & Acceptance Scenarios

### User Story 1: Executive Profit & Loss Statement (P&L)
> **As a** Store Owner,  
> **I want to** view my store's income statement over any date range,  
> **So that** I know my true Net Operating Profit after deducting COGS and operating expenses.

- **Acceptance Scenario 1.1**: User selects date range "هذا الشهر". System displays Gross Sales, COGS (تكلفة البضاعة المباعة), Gross Profit (مجمل الربح), Operating Expenses (المصروفات التشغيلية), and Net Profit (صافي الربح الفعلي) with Net Margin %.
- **Acceptance Scenario 1.2**: Expense categories breakdown chart illustrates where expenses were spent (e.g. 40% Rent, 30% Salaries, 30% Utilities).

### User Story 2: Comprehensive Sales Performance & Breakdown
> **As a** Store Manager or Owner,  
> **I want to** analyze sales by payment method, product category, and top products,  
> **So that** I can identify bestsellers and revenue channels.

- **Acceptance Scenario 2.1**: User views Sales Summary -> displays Total Orders, Average Order Value, Paid vs Credit sales, and Top 5 Selling Products with quantities and revenue.
- **Acceptance Scenario 2.2**: User clicks "تصدير CSV" -> browser downloads `sales-summary-YYYYMMDD.csv` containing the report dataset.

### User Story 3: Warehouse Inventory Valuation
> **As a** Store Owner,  
> **I want to** see the total capital tied up in warehouse inventory,  
> **So that** I can assess inventory asset value and potential revenue.

- **Acceptance Scenario 3.1**: User opens "تقييم المخزون" -> displays Total Items, Total Warehouse Units, Total Capital Cost (at WAC), and Total Retail Value with Potential Gross Profit.
- **Acceptance Scenario 3.2**: Table lists each product with Current Stock, Unit Cost, Total Cost Value, Selling Price, and Potential Revenue.

### User Story 4: Customer Debtors & Supplier Creditors Balances
> **As a** Store Manager,  
> **I want to** view all customers who owe money and suppliers with pending invoices,  
> **So that** we can manage cash collection and upcoming payment obligations.

- **Acceptance Scenario 4.1**: User selects "أرصدة العملاء والموردين" -> displays Total Receivables and Total Payables KPI cards with debtor/creditor lists.

### User Story 5: Cash Register Reconciliation Audit
> **As a** Store Owner,  
> **I want to** audit historical shift discrepancies and daily cash drawer movements,  
> **So that** I can identify cash shortages or discrepancies across cashiers.

- **Acceptance Scenario 5.1**: User views Cash Register Audit -> displays Total Inflows, Total Outflows, and Net Discrepancies (عجز / زيادة) across all shift sessions in the period.

---

## 4. Functional Requirements

1. **Tabbed Navigation**:
   - 5 distinct tabs: المبيعات (Sales), الأرباح والخسائر (P&L), تقييم المخزون (Inventory Valuation), الأرصدة والديون (Balances), تدقيق الدرج (Cash Audit).
2. **Date Range Filter Bar**:
   - Presets: اليوم (Today), آخر 7 أيام (Last 7 Days), هذا الشهر (This Month), الشهر الماضي (Last Month), مخصص (Custom Range).
   - Instant query refetching upon filter change.
3. **Data Visualization**:
   - Area & Bar charts for sales velocity, profit progression, and expense category breakdown.
4. **Export & Print**:
   - Clean printable layout with store header, timestamp, and signature blocks.
   - CSV export download button for each report.
5. **Role-based Protection**:
   - Owner/Manager access enforcement.

---

## 5. Success Criteria

1. **Sub-second Tab Switching**: TanStack Query cached data allows instant navigation between report tabs.
2. **Financial Precision**: All decimal calculations formatted with Arabic locale and 2 decimal points.
3. **0 Inaccuracies**: P&L net profit exactly matches `Net Sales - COGS - Total Expenses`.
4. **Print & Export Reliability**: Formatted A4/thermal printing works seamlessly from the browser.
