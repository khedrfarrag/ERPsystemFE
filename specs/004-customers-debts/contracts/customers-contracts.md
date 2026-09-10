# Backend API Contracts: 004-customers-debts

## 1. Get Customers List

- **Endpoint**: `GET /api/customers?search={term}&isActive={bool}&pageNumber={n}&pageSize={size}`
- **Response**: `ApiResponse<CustomerListResponse>`

---

## 2. Create Customer

- **Endpoint**: `POST /api/customers`
- **Payload**:
```json
{
  "name": "شركة الأمل للتجارة",
  "phone": "01012345678",
  "address": "القاهرة - وسط البلد",
  "creditLimit": 5000.0,
  "openingBalance": 1000.0,
  "notes": "عميل جملة منتظم"
}
```

---

## 3. Customer Account Statement

- **Endpoint**: `GET /api/customers/{id}/statement?from=&to=`
- **Response**: `ApiResponse<AccountStatementResponse>`

---

## 4. Receive Customer Payment

- **Endpoint**: `POST /api/payments`
- **Payload**:
```json
{
  "partyType": "Customer",
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "amount": 500.0,
  "paymentMethod": "Cash",
  "referenceNumber": "REC-2026-001",
  "notes": "سداد دفعة من الحساب"
}
```
