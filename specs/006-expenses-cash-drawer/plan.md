# Implementation Plan: 006-expenses-cash-drawer

**Feature**: Daily Expenses, Custom Expense Categories & Cash Drawer (Register Shift) Reconciliation  
**Target Module**: RetailOS Frontend (`system-FE`) & Backend APIs (`system-BE`)  
**Status**: Approved & Ready for Tasks  

---

## 1. Technical Context & Stack Alignment

- **Framework**: React 19 + TypeScript 5.8 + Vite 8.2
- **Styling & UI**: Tailwind CSS v3 with custom tokens (`card`, `badge`, `btn`), Lucide React icons, Arabic Cairo font, RTL alignment (`dir="rtl"`).
- **State & Server Cache**: TanStack Query v5 (`@tanstack/react-query`) with optimistic updates and cross-module invalidation (`['expenses']`, `['expense-categories']`, `['cash-register']`, `['dashboard']`).
- **Forms & Validation**: React Hook Form + Zod resolvers with Arabic error messages.
- **Backend API Endpoints**:
  - `GET /api/expenses/categories` & `POST /api/expenses/categories`
  - `GET /api/expenses` & `POST /api/expenses`
  - `GET /api/cash-register/current` (Live drawer summary)
  - `POST /api/cash-register/open` (Opening float)
  - `POST /api/cash-register/close` (Reconcile & close shift with counted cash)
  - `GET /api/cash-register/transactions` (Shift history and cash movements)

---

## 2. Proposed Architecture & File Structure

```text
src/
├── features/
│   └── expenses/
│       ├── types/
│       │   ├── expenses.types.ts
│       │   └── expenses.schemas.ts
│       ├── api/
│       │   ├── useExpensesQueries.ts
│       │   └── useExpensesMutations.ts
│       └── components/
│           ├── ExpensesHeader.tsx
│           ├── ExpensesFilterBar.tsx
│           ├── ExpensesTable.tsx
│           ├── RecordExpenseModal.tsx
│           ├── ExpenseCategoryModal.tsx
│           ├── OpenFloatModal.tsx
│           ├── CloseRegisterModal.tsx
│           └── CashDrawerHistoryModal.tsx
└── pages/
    └── Expenses.tsx
```

---

## 3. Phased Implementation Roadmap

1. **Phase 1: Contracts & Types**:
   - Define exact TypeScript models in `expenses.types.ts` (0 `any` types).
   - Build Zod schemas with Arabic validations in `expenses.schemas.ts`.
2. **Phase 2: TanStack Data Hooks**:
   - Implement queries (`useExpensesListQuery`, `useExpenseCategoriesQuery`, `useCashRegisterSummaryQuery`, `useCashRegisterTransactionsQuery`).
   - Implement mutations (`useCreateExpenseMutation`, `useCreateExpenseCategoryMutation`, `useOpenFloatMutation`, `useCloseRegisterMutation`) with synchronized cache invalidation.
3. **Phase 3: Expenses Directory & UI Components**:
   - Build `ExpensesHeader.tsx` with live drawer balance, today inflows/outflows, and total month expenses.
   - Build `ExpensesFilterBar.tsx` and `ExpensesTable.tsx`.
4. **Phase 4: Expense & Category Modals**:
   - Build `RecordExpenseModal.tsx` and `ExpenseCategoryModal.tsx`.
5. **Phase 5: Cash Drawer Shift Operations**:
   - Build `OpenFloatModal.tsx` (opening session) and `CloseRegisterModal.tsx` (live discrepancy calculator & counted cash reconciliation).
   - Build `CashDrawerHistoryModal.tsx` (timeline audit log).
6. **Phase 6: Page Assembly & Role Security**:
   - Connect everything in `src/pages/Expenses.tsx` with Owner/Manager permission gates.
7. **Phase 7: Verification & Build**:
   - Run `npm run build` to ensure 0 TypeScript and bundling errors.
