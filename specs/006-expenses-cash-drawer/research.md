# Research & Technical Decisions: 006-expenses-cash-drawer

## 1. Cash Inflow vs Outflow Calculation Architecture
- **Decision**: In addition to backend calculation, calculate real-time discrepancy preview in the frontend client when the cashier types the counted cash.
- **Rationale**: Immediate visual feedback prevents counting errors before final submission. Discrepancy = `CountedAmount - ExpectedBalance`.
  - Discrepancy == 0: Green Badge ("مطابق تماماً 0.00 ج.م").
  - Discrepancy < 0: Red Alert ("عجز في الدرج بمقدار X ج.م - مطلوب تدوين سبب العجز").
  - Discrepancy > 0: Amber/Green Alert ("زيادة في الدرج بمقدار X ج.م").

## 2. Cross-Module Cache Invalidation Strategy
- **Decision**: Creating an expense or opening/closing a shift directly updates the cash drawer.
- **Cache Keys**:
  - `queryClient.invalidateQueries({ queryKey: ['expenses'] })`
  - `queryClient.invalidateQueries({ queryKey: ['cash-register'] })`
  - `queryClient.invalidateQueries({ queryKey: ['dashboard'] })`
- **Rationale**: Keeps the top Navbar cash drawer indicator, Dashboard KPI cards, and Expenses page 100% in sync without manual page refreshes.

## 3. Handling Payment Methods in Expenses
- **Decision**: Support `Cash` (نقدي - درج الكاشير), `BankTransfer` (تحويل بنكي / فودافون كاش / إنستاباي), and `Cheque` (شيك).
- **Behavior**: Only expenses marked with `paymentMethod: 'Cash'` deduct from the physical cash drawer. Other payment methods are logged as operational expenses without impacting the cash drawer balance.
