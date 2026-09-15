# Data Model & State Specifications: Authentication, Refresh Token & Account Security

**Feature**: `014-auth-security-profile`  
**Date**: 2026-09-15  
**Status**: Completed

---

## 1. Client-Side Authentication State

```typescript
export interface AuthState {
  user: User | null;
  token: string | null;           // Current short-lived JWT Access Token
  refreshToken: string | null;    // 7-day revolving Refresh Token
  isAuthenticated: boolean;
  isOwnerOrManager: boolean;
  isMerchant: boolean;
}
```

### LocalStorage Schema
- `token`: string (JWT Access Token)
- `refreshToken`: string (Opaque Cryptographic Refresh Token)
- `user`: JSON stringified `User` entity

---

## 2. DTOs & Validation Schemas

### 2.1 Refresh Token Request
```typescript
export interface RefreshTokenRequest {
  refreshToken: string;
}
```

### 2.2 Change Password Request & Validation
```typescript
export const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z.string()
    .min(8, 'كلمة المرور يجب أن لا تقل عن 8 أحرف')
    .regex(/[A-Z]/, 'يجب أن تحتوي على حرف كبير واحد على الأقل')
    .regex(/[a-z]/, 'يجب أن تحتوي على حرف صغير واحد على الأقل')
    .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل')
    .regex(/[^a-zA-Z0-9]/, 'يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)'),
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'كلمة المرور غير متطابقة',
  path: ['confirmPassword'],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordFormSchema>;
```

### 2.3 Store Registration Request & Validation
```typescript
export const registerStoreSchema = z.object({
  storeName: z.string().min(2, 'اسم المتجر يجب أن يكون حرفين على الأقل'),
  businessType: z.string().min(1, 'نوع النشاط التجاري مطلوب'),
  ownerFirstName: z.string().min(2, 'الاسم الأول مطلوب'),
  ownerLastName: z.string().min(2, 'اسم العائلة مطلوب'),
  email: z.string().email('صيغة البريد الإلكتروني غير صحيحة'),
  password: z.string().min(6, 'كلمة المرور يجب أن لا تقل عن 6 أحرف'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type RegisterStoreFormData = z.infer<typeof registerStoreSchema>;
```
