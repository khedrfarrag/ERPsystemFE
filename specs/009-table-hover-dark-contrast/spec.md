# Feature Specification: 009-table-hover-dark-contrast

**Feature Branch**: `009-table-hover-dark-contrast`  
**Created**: 2026-09-06  
**Status**: Draft  
**Input**: User description: "دول مشكلتين هتلاقيهم في كل الصفحات الاخطاء هي ان في الداش بورد في القسم بتاع الاحداث ده في كلام لونه في الدارك ابنفس لون الباك جراوند انا عامل سيليكت عليه عشان يبان السلييكت بيخلي الباك جراوند ابيض فاللون بيبان والصوره التانيه دي برده مشكله وهي الجدوب الهيدير بتتاعه لونه فاتح والكتابه الي فيه مش واضحه بسبب لون التيكيست داخل علي نفس الدرجه وكمان تحتها انا عامل هوفر علي الفيلدس فبرده التيكست لما بعمل هوفر مش بيبان عشان الهوفر بيغير الباك جراوند لفس المشكله تداخل في اللون الفاتح وكذلك في كل الصفحات عاوزك تحلل كلامي كويس وتعمل تيست تاني بالديف تول  علي النقط دي عشان كل حاجه تطلع مظبوطه"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dashboard Timeline & Stock Alerts Dark Mode Visibility (Priority: P1)

As a business owner or branch manager viewing the executive dashboard in Dark Mode, I need to clearly read all recent transactions (Sale, Purchase, Expense, Receipt) and stock shortage alerts without text blending into the dark card backgrounds, so that I have immediate situational awareness of store operations.

**Why this priority**:
The dashboard timeline and stock alerts are the primary live monitoring hub. Invisible transaction descriptions and inventory shortages prevent managers from tracking activities and auditing cash flows.

**Independent Test**:
Can be fully tested by opening the Dashboard in Dark Mode and verifying with Chrome DevTools that all activity transaction names, timestamps, GUIDs, and stock alert product names have a WCAG AA contrast ratio $\ge 4.5:1$ against their container backgrounds without requiring text selection.

**Acceptance Scenarios**:
1. **Given** the user is on the Dashboard with Dark Mode active, **When** viewing the "أحدث الحركات اليومية" (Recent Daily Activities) card, **Then** all transaction titles (e.g., "Sale (Credit)", "فاتورة كهرباء المحل", "Purchase from...") render in crisp bright text (contrast $\ge 7:1$) and timestamps/IDs render in legible muted text (contrast $\ge 4.5:1$).
2. **Given** the user is on the Dashboard with Dark Mode active, **When** viewing the "تنبيهات نواقص المخزون" (Low Stock Alerts) card, **Then** product titles (e.g., "كريم فاتيكا", "ديتول سائل مطهر", "أريال جل") render in crisp bright text instead of blending into the card background.
3. **Given** the user toggles between Dark and Light Mode, **Then** the timeline text smoothly adapts to high-contrast dark text in Light Mode and bright text in Dark Mode.

---

### User Story 2 - Universal Table Header Contrast Across All Pages (Priority: P1)

As a system user managing products, customers, suppliers, expenses, or reports in Dark Mode, I need table headers (`<thead>`) to have dark, elevated backgrounds with distinct high-contrast column labels, so that the column headers do not display as washed-out white/pale strips.

**Why this priority**:
Table headers guide every data table in the system. An inverted light header on a dark page creates extreme visual dissonance and renders pale column titles unreadable.

**Independent Test**:
Can be fully tested by navigating across Products, Customers, Suppliers, Expenses, and Reports tables in Dark Mode and auditing `<thead>` background and text contrast with Chrome DevTools.

**Acceptance Scenarios**:
1. **Given** the user is viewing any data table in Dark Mode, **When** the table header renders, **Then** its background is an elevated dark slate (`dark:bg-slate-900` or `dark:bg-slate-850`) with distinct border separators.
2. **Given** the table header in Dark Mode, **Then** all column labels (e.g., "الصنف / الباركود", "سعر البيع", "المخزون الحالي", "الإجراءات") render in clear, high-contrast text (`dark:text-slate-200` or `dark:text-white`) with a contrast ratio $\ge 4.5:1$.
3. **Given** the user is in Light Mode, **Then** table headers render with clean light gray backgrounds (`bg-slate-50` or `bg-slate-100`) and dark bold labels (`text-slate-700`).

---

### User Story 3 - Universal Table Row Hover Contrast Across All Pages & Modals (Priority: P1)

As a user interacting with tables in Dark Mode, when I hover the cursor over table rows or interactive table cells, the row background must remain a harmonious dark tone rather than switching to light gray/white, preventing text washing out or becoming unreadable.

**Why this priority**:
Hovering over rows is the primary interaction for inspecting and selecting items. If hovering turns the background white while the text is white, all row data instantaneously vanishes.

**Independent Test**:
Can be fully tested by hovering cursor over rows in Products, Customers, Suppliers, Expenses, Statements, and Reports tables in Dark Mode, verifying that background changes to a dark hover tone (`dark:hover:bg-slate-750` / `dark:hover:bg-slate-800/80`) and all row text retains high contrast.

**Acceptance Scenarios**:
1. **Given** any table row in Dark Mode, **When** the cursor hovers over the row (`:hover`), **Then** the background transitions to a subtle elevated dark highlight (`dark:hover:bg-slate-750` or `dark:hover:bg-slate-800`) and NEVER switches to white or light gray.
2. **Given** the row is hovered in Dark Mode, **Then** primary text (product names, customer names, prices) remains bright white/colored and secondary text (barcodes, phone numbers, units) remains crisp and readable.
3. **Given** any modal containing tables (Customer Statement, Supplier Statement, Create Purchase Order, Cash Drawer History, Stock Movement), **When** hovering over table rows in Dark Mode, **Then** the same dark hover contrast rules apply.

---

## Edge Cases

- **Row Selection / Highlighting**: When a row is selected or active, its highlight must use a dedicated translucent primary tone (`dark:bg-primary-950/40`) with high-contrast text.
- **Badge and Icon Visibility on Hover**: Action buttons (Edit, Delete, View) and status badges (Active, Inactive, Low Stock) must maintain their distinct colors and border contrast during row hover.
- **Empty State Contrast**: Empty tables and search result notifications must have clear contrast in both themes.
- **Theme Toggling during Hover**: If the user toggles theme while hovering, transitions must be smooth without flickering.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Dashboard recent activity timeline items MUST use high-contrast primary text (`text-slate-900 dark:text-slate-100`) for event names and clear secondary text (`text-slate-600 dark:text-slate-400`) for timestamps and identifiers in both themes.
- **FR-002**: Dashboard stock shortage alert cards MUST use high-contrast text (`text-slate-900 dark:text-white`) for product names and readable threshold badges in both themes.
- **FR-003**: All table headers (`<thead>`) across all pages (Products, Customers, Suppliers, Expenses, Reports) and modals MUST use dark backgrounds (`dark:bg-slate-900` / `dark:bg-slate-850`) and high-contrast text (`dark:text-slate-200`) in Dark Mode, and light gray backgrounds (`bg-slate-50` / `bg-slate-100`) with dark text (`text-slate-700`) in Light Mode.
- **FR-004**: All table row hover states (`tr:hover`) MUST use dark hover backgrounds (`dark:hover:bg-slate-750` or `dark:hover:bg-slate-800`) in Dark Mode and MUST NOT use light backgrounds (`hover:bg-slate-50`) in Dark Mode.
- **FR-005**: All statement ledger tables in modals (`CustomerStatementModal`, `SupplierStatementModal`, `CreatePurchaseModal`, `CashDrawerHistoryModal`, `ProductMovementModal`) MUST adopt the standardized table header and row hover contrast rules.
- **FR-006**: Interactive action buttons inside table rows (Edit, Delete, Print, Statement) MUST have explicit hover styles in Dark Mode that preserve icon contrast and prevent disappearance.
- **FR-007**: Verification MUST be conducted using Chrome DevTools MCP tools (page navigation, script evaluation, and viewport screenshots) across Dashboard, Products, Customers, Suppliers, Expenses, and Reports in both Dark and Light modes.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of text elements in Dashboard activity feed and stock alert cards achieve WCAG AA contrast ratio $\ge 4.5:1$ against their backgrounds in both Dark and Light themes.
- **SC-002**: 100% of table headers across all pages and modals display dark backgrounds in Dark Mode with column title contrast ratio $\ge 4.5:1$.
- **SC-003**: 100% of table rows maintain dark background and readable text during `:hover` state in Dark Mode with 0 text washing out or blending.
- **SC-004**: Frontend build validation (`npm run build: tsc -b && vite build`) passes with 0 TypeScript and bundling errors.

---

## Assumptions

- Tailwind v3 configuration supports `slate-750` and `slate-850` tokens or classes can use `slate-800` / `slate-900`.
- All tables follow standard HTML `<table>`, `<thead>`, `<tbody>`, `<tr>` structure.
- Chrome DevTools MCP server is available for live DOM inspection and visual screenshot verification.
