# Data Model: Frontend Core Foundation

## Shared Entities & DTOs

### User Profile
```typescript
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Owner' | 'Manager' | 'Cashier' | 'InventoryClerk';
  storeId: string;
  storeName: string;
}
```

### Auth Response
```typescript
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}
```

### API Standard Envelope
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  errors?: string[];
  code?: string;
}
```
