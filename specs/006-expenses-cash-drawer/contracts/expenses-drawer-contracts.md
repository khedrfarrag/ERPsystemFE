# API Contracts: 006-expenses-cash-drawer

## 1. Expense Categories

### GET `/api/expenses/categories`
- **Query**: `isActive?: boolean`
- **Response**: `ApiResponse<ExpenseCategory[]>`

### POST `/api/expenses/categories`
- **Body**:
  ```json
  {
    "name": "فواتير ومرافق",
    "description": "كهرباء ومياه وغاز"
  }
  ```
- **Response**: `ApiResponse<ExpenseCategory>`

---

## 2. Expenses

### GET `/api/expenses`
- **Query**: `categoryId?: string`, `from?: string`, `to?: string`, `pageNumber?: number`, `pageSize?: number`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "id": "uuid",
          "categoryId": "uuid",
          "categoryName": "فواتير ومرافق",
          "amount": 350.00,
          "expenseDate": "2026-09-05T00:00:00Z",
          "paymentMethod": "Cash",
          "description": "فاتورة كهرباء شهر سبتمبر",
          "createdAt": "2026-09-05T12:30:00Z"
        }
      ],
      "totalCount": 1,
      "pageNumber": 1,
      "pageSize": 20
    }
  }
  ```

### POST `/api/expenses`
- **Body**:
  ```json
  {
    "categoryId": "uuid",
    "amount": 350.00,
    "expenseDate": "2026-09-05T00:00:00Z",
    "paymentMethod": "Cash",
    "description": "فاتورة كهرباء شهر سبتمبر"
  }
  ```
- **Response**: `ApiResponse<ExpenseItem>`

---

## 3. Cash Register / Drawer

### GET `/api/cash-register/current`
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "currentBalance": 3250.00,
      "lastFloatDate": "2026-09-05T08:00:00Z",
      "lastFloatAmount": 500.00,
      "todayInflows": 4000.00,
      "todayOutflows": 1250.00
    }
  }
  ```

### POST `/api/cash-register/open`
- **Body**:
  ```json
  {
    "amount": 500.00,
    "notes": "عهدة بداية الوردية الصباحية"
  }
  ```
- **Response**: `ApiResponse<CashRegisterTransaction>`

### POST `/api/cash-register/close`
- **Body**:
  ```json
  {
    "countedAmount": 3200.00,
    "notes": "تم جرد النقدية ووجد عجز 50 ج.م فكة لم تسجل"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "data": {
      "expectedBalance": 3250.00,
      "countedAmount": 3200.00,
      "discrepancy": -50.00,
      "notes": "تم جرد النقدية ووجد عجز 50 ج.م فكة لم تسجل",
      "closedAt": "2026-09-05T22:00:00Z"
    }
  }
  ```

### GET `/api/cash-register/transactions`
- **Query**: `from?: string`, `to?: string`
- **Response**: `ApiResponse<CashRegisterTransaction[]>`
