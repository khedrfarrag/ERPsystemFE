# Quickstart & Verification Guide: Authentication & Account Security

**Feature**: `014-auth-security-profile`  
**Date**: 2026-09-15  
**Status**: Completed

---

## 1. Prerequisites

- Frontend server running: `npm run dev` (running on port 5173 or configured dev port).
- Backend server running: `dotnet run --project src/RetailOS.Api` (port 5030).

---

## 2. Test Scenarios

### Scenario 1: Verify Silent Refresh Token in Background
1. Log in as Owner (`owner@retailos.com`).
2. Open Browser DevTools -> Application / Storage -> `localStorage`:
   - Verify `token` AND `refreshToken` are both present.
3. Open DevTools Network tab.
4. Manually modify `token` in `localStorage` to an invalid or expired string (or wait for 15-minute expiry).
5. Navigate to Dashboard or Products (triggers an API call).
6. **Observed Result**:
   - The original request gets `401 Unauthorized`.
   - A single `POST /api/v1/auth/refresh` request is immediately dispatched automatically.
   - `localStorage` receives the new `token` and `refreshToken`.
   - The original request re-executes successfully (status `200 OK`).
   - The user remains logged in with zero disruption, zero error toast, and zero redirects.

### Scenario 2: Test Account & Security Tab in Settings
1. Navigate to `/settings`.
2. Notice the new tab: **"حسابي والأمان"**.
3. Click it and verify:
   - Profile card displays user name, email, role, and store.
   - Session status displays "جلسة آمنة نشطة" and refresh token validity.
4. Test Change Password:
   - Enter wrong current password -> Verify red error banner "كلمة المرور الحالية غير صحيحة".
   - Enter weak new password -> Verify password requirement checklist indicators.
   - Enter valid matching password -> Verify success toast "تم تغيير كلمة المرور بنجاح".

### Scenario 3: Test New Store Registration
1. Navigate to `/login`.
2. Click "تسجيل متجر جديد".
3. Fill in store details:
   - Store name: "متجر تجريبي جديد"
   - Business type: "تجزئة عامة"
   - Owner name: "أحمد علي"
   - Email: `demo_new_store@retailos.com`
   - Password: `Password123!`
4. Click "إنشاء المتجر وحساب المالك".
5. **Observed Result**: Store is created, tokens are stored, and user is redirected directly to `/` logged in as the new owner!

### Scenario 4: Test All 4 Demo Accounts
1. Log out.
2. In the demo accounts section on `/login`, click each button in sequence:
   - **المالك (Owner)** -> logs in as Owner
   - **المدير (Manager)** -> logs in as Manager
   - **الكاشير (Cashier)** -> logs in as Cashier
   - **تاجر الجملة (Merchant)** -> logs in and redirects automatically to `/portal/catalog`!
