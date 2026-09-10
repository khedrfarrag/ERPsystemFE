# Backend API Contracts: 003-products-inventory

## 1. Get Paginated Products

- **Endpoint**: `GET /api/products`
- **Query Parameters**:
  - `page`: int (default: 1)
  - `pageSize`: int (default: 25)
  - `search`: string (optional)
  - `categoryId`: GUID (optional)
  - `isActive`: boolean (optional)
  - `inStock`: boolean (optional)

### Response (200 OK)

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "7bc32f91-1234-4567-8901-abcdef123456",
        "name": "زيت عافية ذرة 1.6 لتر",
        "barcode": "6221234567890",
        "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "categoryName": "زيوت وسمن",
        "unitId": "8fa85f64-5717-4562-b3fc-2c963f66afa7",
        "unitName": "قطعة",
        "purchaseCost": 78.5,
        "sellingPrice": 95.0,
        "currentStock": 24,
        "minStockLevel": 5,
        "isActive": true
      }
    ],
    "totalCount": 128,
    "pageNumber": 1,
    "pageSize": 25
  }
}
```

---

## 2. Create Product

- **Endpoint**: `POST /api/products`
- **Request Body**:

```json
{
  "name": "أرز الضحى 1 كجم",
  "barcode": "6229876543210",
  "categoryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "unitId": "8fa85f64-5717-4562-b3fc-2c963f66afa7",
  "purchaseCost": 32.0,
  "sellingPrice": 38.0,
  "minStockLevel": 10,
  "initialStock": 50
}
```

---

## 3. Update Product & Status

- **Update**: `PUT /api/products/{id}`
- **Toggle Status**: `PATCH /api/products/{id}/status` -> `{ "isActive": false }`
- **Delete**: `DELETE /api/products/{id}`

---

## 4. Excel Bulk Import

- **Preview**: `POST /api/products/import/preview` (Multipart Form)
- **Commit**: `POST /api/products/import/commit` (Multipart Form)
