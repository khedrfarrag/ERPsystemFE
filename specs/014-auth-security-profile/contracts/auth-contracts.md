# API & Interface Contracts: Authentication & Account Security

**Feature**: `014-auth-security-profile`  
**Date**: 2026-09-15  
**Status**: Completed

---

## 1. Authentication Endpoints

### 1.1 POST `/api/v1/auth/refresh`
**Request Body**:
```json
{
  "refreshToken": "string"
}
```
**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "...",
    "expiresIn": 900,
    "user": {
      "id": "uuid",
      "email": "user@retailos.com",
      "firstName": "أحمد",
      "lastName": "علي",
      "role": "Owner",
      "storeId": "uuid",
      "storeName": "متجر البركة"
    }
  },
  "message": "Token refreshed successfully."
}
```
**Failure Response (401 Unauthorized)**:
```json
{
  "success": false,
  "message": "The refresh token is invalid or expired."
}
```

### 1.2 POST `/api/v1/auth/register`
**Request Body**:
```json
{
  "storeName": "متجر الأمل",
  "businessType": "سوبرماركت",
  "ownerFirstName": "محمد",
  "ownerLastName": "خالد",
  "email": "owner@alamal.com",
  "password": "Password123!",
  "phone": "01012345678",
  "address": "القاهرة، مصر"
}
```
**Success Response (201 Created)**: Returns `ApiResponse<AuthResponse>` with auto-login tokens.

### 1.3 POST `/api/v1/auth/change-password`
**Request Body**:
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewPassword456!"
}
```
**Success Response (200 OK)**:
```json
{
  "success": true,
  "data": true,
  "message": "Password changed successfully."
}
```

### 1.4 POST `/api/v1/auth/logout`
**Request Body**:
```json
{
  "refreshToken": "string"
}
```
**Success Response (204 No Content)**
