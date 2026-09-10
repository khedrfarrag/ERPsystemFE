# Backend API Contracts: 002-pos-terminal

## 1. Create Sale Transaction

- **Endpoint**: `POST /api/sales`
- **Headers**: `Authorization: Bearer <jwt-token>`, `Content-Type: application/json`

### Request Payload

```json
{
  "customerId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "paymentMethod": "Cash",
  "discountAmount": 10.0,
  "paidAmount": 200.0,
  "items": [
    {
      "productId": "7bc32f91-1234-4567-8901-abcdef123456",
      "quantity": 2,
      "unitPrice": 95.0,
      "discount": 0.0
    }
  ]
}
```

### Response (201 Created)

```json
{
  "id": "e8912345-6789-4abc-def0-123456789abc",
  "saleNumber": "INV-20260905-0012",
  "totalAmount": 190.0,
  "discountAmount": 10.0,
  "netAmount": 180.0,
  "paidAmount": 200.0,
  "remainingAmount": 0.0,
  "paymentMethod": "Cash",
  "createdAt": "2026-09-05T21:45:00.000Z",
  "customerName": "عميل نقدي",
  "cashierName": "الكاشير الرئيسي",
  "items": [
    {
      "productId": "7bc32f91-1234-4567-8901-abcdef123456",
      "productName": "زيت عافية ذرة 1.6 لتر",
      "quantity": 2,
      "unitPrice": 95.0,
      "discount": 0.0,
      "total": 190.0
    }
  ]
}
```

---

## 2. Product Catalog Query

- **Endpoint**: `GET /api/products`
- **Query Params**: `?search={term}&categoryId={id}&inStock=true`
- **Response**:

```json
[
  {
    "id": "7bc32f91-1234-4567-8901-abcdef123456",
    "name": "زيت عافية ذرة 1.6 لتر",
    "barcode": "6221234567890",
    "categoryName": "زيوت وسمن",
    "sellingPrice": 95.0,
    "currentStock": 24,
    "minStockLevel": 5
  }
]
```

---

## 3. Customers Query

- **Endpoint**: `GET /api/customers`
- **Response**:

```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "name": "شركة الأمل للتجارة",
    "phone": "01012345678",
    "currentBalance": 1250.0,
    "creditLimit": 5000.0
  }
]
```
