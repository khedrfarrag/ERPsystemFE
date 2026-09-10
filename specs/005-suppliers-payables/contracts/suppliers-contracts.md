# Backend API Contracts: 005-suppliers-payables

## 1. Get Suppliers List

- **Endpoint**: `GET /api/suppliers?search={term}&pageNumber={n}&pageSize={size}`
- **Response**: `ApiResponse<SupplierListResponse>`

---

## 2. Create Supplier & Add Representative

- **Create Supplier**: `POST /api/suppliers` -> `CreateSupplierRequest`
- **Add Representative**: `POST /api/suppliers/{id}/representatives` -> `CreateRepresentativeRequest`

---

## 3. Create & Confirm Purchase Invoice

- **Create Draft**: `POST /api/purchases` -> `CreatePurchaseRequest`
- **Confirm & Receive Stock**: `POST /api/purchases/{id}/confirm`

---

## 4. Disburse Payment to Supplier

- **Endpoint**: `POST /api/payments`
- **Payload**:
```json
{
  "partyType": "Supplier",
  "supplierId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "amount": 2500.0,
  "paymentMethod": "Cash",
  "referenceNumber": "PAY-2026-001",
  "notes": "سداد دفعة من فاتورة توريد رقم 102"
}
```
