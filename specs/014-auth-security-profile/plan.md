# Implementation Plan: Authentication, Silent Refresh Token & Account Security

**Branch**: `014-auth-security-profile` | **Date**: 2026-09-15 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/014-auth-security-profile/spec.md`

## User Review Required

> [!IMPORTANT]
> - **Silent Token Refresh**: Eliminates the 15-minute logout bug. Users stay logged in seamlessly up to 7 days of activity without interruptions.
> - **Account Security Tab**: Added to `/settings` for all authenticated users to manage passwords and profile details.
> - **Store Self-Service Registration**: Adds registration flow to `/login` calling `/api/v1/auth/register`.

## Proposed Changes

### 1. API Client & Authentication Layer

#### [MODIFY] [`src/api/client.ts`](file:///g:/system-analysiss-saas/system-FE/src/api/client.ts)
- Implement Mutex & Queue Axios Response Interceptor for 401 status.
- Catch 401s, hold concurrent requests in `failedQueue`, call `POST /api/v1/auth/refresh`.
- Update `localStorage` with renewed access and refresh tokens.
- Re-dispatch waiting requests with the new Bearer token.
- On refresh token failure (expired/revoked), clear storage and redirect cleanly to `/login`.

#### [MODIFY] [`src/context/AuthContext.tsx`](file:///g:/system-analysiss-saas/system-FE/src/context/AuthContext.tsx)
- Persist `refreshToken` in `login(authData)`.
- Update `logout()` to call `/api/v1/auth/logout` with `{ refreshToken }` to revoke session server-side.
- Synchronize token state on refresh events.

---

### 2. Settings & Account Management

#### [NEW] [`src/features/settings/components/AccountSecurityTab.tsx`](file:///g:/system-analysiss-saas/system-FE/src/features/settings/components/AccountSecurityTab.tsx)
- Profile details card (Name, Role badge, Email, Store Name, Join Date).
- Change password card with real-time strength criteria and current password verification.
- Active session card showing session security status.

#### [MODIFY] [`src/pages/Settings.tsx`](file:///g:/system-analysiss-saas/system-FE/src/pages/Settings.tsx)
- Add `'account'` to `TabType`.
- Render "حسابي والأمان" tab with user profile icon.

---

### 3. Login, Registration & Demo Accounts UX

#### [NEW] [`src/features/auth/components/RegisterStoreModal.tsx`](file:///g:/system-analysiss-saas/system-FE/src/features/auth/components/RegisterStoreModal.tsx)
- Clean, responsive modal for new store self-service onboarding.
- Inputs for Store Name, Business Type, Owner First/Last Name, Email, Password, and Phone.
- Submits to `/api/v1/auth/register` and automatically logs in on success.

#### [MODIFY] [`src/pages/Login.tsx`](file:///g:/system-analysiss-saas/system-FE/src/pages/Login.tsx)
- Add "تسجيل متجر جديد" CTA button opening `RegisterStoreModal`.
- Add Eye toggle button for password fields.
- Expand demo accounts to 4 roles: Owner, Manager, Cashier, Merchant.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to ensure 100% clean TypeScript compilation.
- Run `oxlint` to ensure strict linting compliance.

### Manual Verification
- Follow scenarios detailed in [`quickstart.md`](./quickstart.md):
  1. Simulated token expiration & silent renewal.
  2. Concurrent API calls during token expiry.
  3. Settings account tab & password change.
  4. Instant store registration.
  5. 4-role demo 1-click test.
