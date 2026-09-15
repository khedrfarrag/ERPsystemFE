# Research & Architectural Decisions: Auth, Silent Refresh Token & Account Security

**Feature**: `014-auth-security-profile`  
**Date**: 2026-09-15  
**Status**: Completed

---

## 1. Silent Refresh Token & Interceptor Queue Pattern

### Context
In SPA web applications using JWT, access tokens have a short lifespan (15 minutes in RetailOS) for security. When access tokens expire, making an API call yields `401 Unauthorized`. If the application fails to handle this gracefully, the user is abruptly kicked to `/login`.

### Decision
Implement the standard **Axios Response Interceptor Queue & Mutex Pattern**:
1. Keep an `isRefreshing` boolean flag and a `failedQueue` array in `src/api/client.ts`.
2. When a 401 response arrives:
   - If `error.config.url` is `/auth/login` or `/auth/refresh`, reject immediately (real authentication failure or expired refresh token).
   - If `isRefreshing === true`, push the request resolve/reject promise into `failedQueue` and wait.
   - If `isRefreshing === false`, set `isRefreshing = true`, grab `refreshToken` from `localStorage`, and issue `POST /api/v1/auth/refresh`.
   - On refresh success:
     - Save new `accessToken` and `refreshToken` into `localStorage`.
     - Update default Axios auth header and original request header.
     - Drain `failedQueue` by resolving each queued request with the new token.
     - Reset `isRefreshing = false`.
     - Retry the original request.
   - On refresh error:
     - Drain `failedQueue` by rejecting with error.
     - Wipe `token`, `refreshToken`, and `user` from `localStorage`.
     - Dispatch toast "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجدداً".
     - Reset `isRefreshing = false`.
     - Redirect to `/login`.

### Rationale
- Completely transparent to the user; ongoing operations (POS checkout, barcode scanning, reporting) suffer zero interruption.
- Prevents the classic race condition where 5 simultaneous queries launch 5 simultaneous refresh calls.

---

## 2. Dedicated "حسابي والأمان" Tab in Settings

### Context
`Settings.tsx` currently only supports store settings (`StoreProfileTab`) and staff accounts (`UsersTab`). Regular users or store owners have no direct UI interface to review their own profile, change their password, or view their security state.

### Decision
Create `src/features/settings/components/AccountSecurityTab.tsx`:
1. **Profile Card**: Displays avatar icon, Full Name, Email, Role badge, Assigned Store Name, and tenant context.
2. **Change Password Form**: Current password, new password, confirm password with real-time validation via `zod` and password strength feedback. Calls `POST /api/v1/auth/change-password`.
3. **Session & Security Information Card**: Displays authentication status, active session duration, refresh token expiry window (7 days), and security recommendations.

---

## 3. Instant Store Registration & Multi-Role Demo UX

### Context
- The backend contains a robust `POST /api/v1/auth/register` endpoint that provisions a tenant store and owner account, but frontend has no registration UI.
- Testing across different role tiers (Owner, Manager, Cashier, Merchant) currently requires manual typing of credentials for the newly added Merchant role.

### Decision
1. Add a clean "تسجيل متجر جديد" button and modal on `Login.tsx` that collects:
   - Store Name
   - Business Type (سوبرماركت / تجزئة / أدوات منزلية / منظفات / إلكترونيات)
   - Owner First & Last Name
   - Email & Password
   - Phone & Address (optional)
   Submits to `/api/v1/auth/register`, logs in immediately with returned tokens, and redirects to Dashboard.
2. Update Demo Accounts on `Login.tsx` with 4 distinct tiles:
   - **المالك (Owner)**: `owner@retailos.com`
   - **المدير (Manager)**: `manager@retailos.com`
   - **الكاشير (Cashier)**: `cashier@retailos.com`
   - **تاجر الجملة (Merchant)**: `merchant@retailos.com`
3. Add show/hide password visibility toggle (Eye / EyeOff icon) on all password fields.
