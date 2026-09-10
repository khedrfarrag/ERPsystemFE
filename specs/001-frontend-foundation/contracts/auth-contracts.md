# Interface Contracts: Authentication & Client API

## 1. POST /api/auth/login
- **Request Body**:
```json
{
  "email": "user@retailos.com",
  "password": "Password123!"
}
```
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "d7a8b...",
    "expiresIn": 86400,
    "user": {
      "id": "guid",
      "email": "owner@retailos.com",
      "firstName": "محمود",
      "lastName": "المالك",
      "role": "Owner",
      "storeId": "guid",
      "storeName": "مؤسسة الأمل للمنظفات"
    }
  },
  "message": "Logged in successfully"
}
```
