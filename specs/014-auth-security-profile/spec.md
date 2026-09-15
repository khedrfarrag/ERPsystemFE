# Feature Specification: Authentication, Silent Refresh Token, and Account Security Architecture

**Feature Branch**: `014-auth-security-profile`

**Created**: 2026-09-15

**Status**: Draft

**Input**: User description: "دلوقتي انا عاوز اظبط الجزء بتاع الاوثنتكيشن وتجيل الحساب والحسابات التجريبيه والسيكريوتي بتاع الجزء ده كله وتجربة المستخدم مفيش موديول في الصفحه بتاعة الاعدادات جزء مخصص بالتعديل علي الحساب وحجات كتير عاوز اعمل تيست علي الجزء جه كويس جدا والادج كيسيز واولا كده الريفريش توكين عاوز اظبطه هوا دلوقتي لما اليوزر بيسجل بيقعد مثلا ربع ساعه واوتوماتيك بيسجل خروج واليوزر يسجل تاني وهكذا ودا تجربة مستخدم سيئه المفروض طول ما اليوزر شغال ميسجلش خروج لحد ممكن يوم كل يوم مره انما كل ربع ساعه يطلع الطالعه دي مش حلوه وهوا اصلا المفروض تتهندل في الباك جراوند مهوا في ريفرريش توكين المفروض كل اما التوكين يخلص في الباك جراوند ينشئ توكين جديد بالرفريش توكين ولا انا كلامي غلط"

## Clarifications

### Session 2026-09-15

- Q: هل يقتصر موديول "حسابي والأمان" في الإعدادات على عرض البيانات وتغيير كلمة المرور فقط، أم إتاحة تعديل الاسم والهاتف؟ → A: الاكتفاء بعرض البيانات الشاملة وتغيير كلمة المرور وتفاصيل أمان الجلسة.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Seamless Session Persistence via Silent Refresh Token (Priority: P1)

As an active user (Owner, Manager, Cashier, or Merchant), I want my session to remain continuously authenticated without interruption while I am actively using the system, so that I never get abruptly logged out after 15 minutes of work.

**Why this priority**: Sudden session invalidation disrupts operations during sales, inventory checking, or reporting, creating severe frustration and potential data entry loss.

**Independent Test**: Can be tested by letting an access token expire (or simulating short expiry), then performing an action like fetching dashboard stats or products; the system automatically renews the session in the background and completes the action with zero user intervention or UI jarring.

**Acceptance Scenarios**:

1. **Given** an authenticated user whose access token has expired after 15 minutes, **When** any background or foreground request is initiated, **Then** the system automatically exchanges the refresh token for a new access token and retries the original request seamlessly.
2. **Given** multiple concurrent requests failing with expired credentials simultaneously, **When** the first failure occurs, **Then** only one token refresh request is dispatched, and subsequent waiting requests execute smoothly once the new credentials arrive.
3. **Given** a refresh token that has reached its absolute expiration limit (e.g. 7 days of inactivity) or has been revoked, **When** a renewal attempt fails, **Then** the user is gracefully notified with a clear message and redirected to the login screen without broken page states.

---

### User Story 2 - Personal Account & Security Management Module in Settings (Priority: P2)

As an authenticated system user, I want a dedicated "Account & Security" section in the Settings page where I can view my profile details, update my personal credentials, change my password securely, and monitor my active session status.

**Why this priority**: Users must have autonomy over their individual account credentials, security preferences, and personal identity without relying solely on system administrators.

**Independent Test**: Navigate to Settings -> "حسابي والأمان" (Account & Security), change password with valid current credentials, and verify successful update; attempt with incorrect current password and verify friendly error rejection.

**Acceptance Scenarios**:

1. **Given** any logged-in user on the Settings page, **When** selecting the "حسابي والأمان" tab, **Then** they see their profile card (Name, Email, Role, Assigned Store, and Security status).
2. **Given** a user wishing to change their password, **When** they provide their current password and enter a strong new password with confirmation, **Then** the system verifies the current password, validates the strength of the new password, and updates it successfully.
3. **Given** a user attempting to change password with mismatched confirmation or weak password, **Then** the interface provides instant, helpful feedback and disables submission until criteria are met.

---

### User Story 3 - New Store Registration & Instant Onboarding (Priority: P3)

As a prospective retail store owner, I want to create a new store and owner account directly from the login portal, so that I can immediately start using RetailOS without manual database seeding.

**Why this priority**: Self-service onboarding is fundamental for SaaS scalability and user acquisition.

**Independent Test**: Click "تسجيل متجر جديد" on the login screen, enter store name, owner name, email, and password, and verify instant account creation and automatic login into the dashboard.

**Acceptance Scenarios**:

1. **Given** a visitor on the login page, **When** clicking "تسجيل متجر جديد", **Then** a modal/form opens with fields for Store Name, Business Type, Owner Name, Email, Password, and Phone.
2. **Given** valid registration details, **When** the form is submitted, **Then** the system creates the tenant store, provisions the owner account, issues initial authentication tokens, and redirects directly to the store dashboard.
3. **Given** an email address that is already registered in the system, **When** attempting to register, **Then** the system shows an informative duplicate account warning without crashing.

---

### User Story 4 - Multi-Role Quick Demo Access & Login UX Enhancements (Priority: P4)

As a tester, demo viewer, or stakeholder, I want quick 1-click access to test all four system roles (Owner, Manager, Cashier, and Merchant) and enhanced login features like password visibility toggling, so that system capabilities can be tested effortlessly.

**Why this priority**: Accelerates testing, demonstrations, and QA validation across different permission tiers.

**Independent Test**: Click the "تاجر الجملة" (Merchant) demo button on the login screen, verify the form fills with merchant credentials, and click Login to be routed directly to the B2B Wholesale Portal.

**Acceptance Scenarios**:

1. **Given** the login screen, **When** viewing the demo accounts section, **Then** four distinct role badges are available (Owner, Manager, Cashier, Merchant) with clear descriptions.
2. **Given** any demo badge clicked, **When** selected, **Then** the credentials are auto-populated into the email and password inputs with active validation.
3. **Given** any password input on the login or registration forms, **When** clicking the eye toggle button, **Then** the masked characters become visible and can be toggled back.

---

### Edge Cases

- **Rapid Multiple API Calls on Token Expiry**: What happens when a page loads 5 simultaneous API calls right after the access token expires?
  * The system MUST queue the 4 dependent calls while 1 refresh call executes, preventing 4 separate refresh calls and race conditions.
- **Refresh Token Invalidation / Revocation**: What happens if the refresh token is revoked on the server (e.g., from another device or administrative action)?
  * The refresh call returns 401; the system MUST catch this, purge local storage, notify the user with a session expired toast, and redirect cleanly to `/login`.
- **Offline / Network Disconnection during Token Refresh**: What happens if the network drops while renewing the token?
  * The system MUST NOT log the user out immediately for pure network failures; it should display a network error toast and preserve cached tokens for retry when connection restores.
- **Password Change for Forced-Change Users**: What happens if a user is flagged with `mustChangePassword: true`?
  * The existing ForceChangePasswordModal interacts seamlessly with the new change-password backend contract and clears the flag upon success.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST store both `accessToken` and `refreshToken` securely in client storage upon login, registration, and refresh.
- **FR-002**: System MUST implement an automatic response interceptor that catches 401 Unauthorized errors on protected requests and transparently renews the access token using the stored refresh token.
- **FR-003**: System MUST serialize concurrent 401 requests so that only one refresh request is dispatched to `/api/v1/auth/refresh` at any time.
- **FR-004**: System MUST purge authentication tokens and redirect to `/login` with an informative message if and only if the refresh token itself fails or expires.
- **FR-005**: System MUST call `/api/v1/auth/logout` upon explicit user logout to revoke the active refresh token in the backend database.
- **FR-006**: Settings page MUST provide a dedicated "حسابي والأمان" tab accessible to all authenticated users.
- **FR-007**: "حسابي والأمان" tab MUST display the current user's profile information (name, email, role, and store).
- **FR-008**: "حسابي والأمان" tab MUST allow users to change their password by validating current password and confirming new password.
- **FR-009**: Login screen MUST provide a 1-click self-service Store Registration modal/flow submitting to `/api/v1/auth/register`.
- **FR-010**: Login screen MUST provide demo account quick-fill buttons for all 4 roles: Owner, Manager, Cashier, and Merchant.
- **FR-011**: Password input fields MUST include a toggleable visibility icon (show/hide password).

### Key Entities

- **AuthSession**: Client-side authentication state encapsulating `user`, `accessToken`, `refreshToken`, and expiration metadata.
- **UserProfile**: Current authenticated user identity data including ID, email, first name, last name, role, store ID, and store name.
- **ChangePasswordCommand**: Request payload containing current password and verified new password.
- **StoreRegistrationCommand**: Request payload containing store name, business type, owner credentials, phone, and optional store address.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of expired access token events during active user sessions are refreshed silently in the background with zero user disruption.
- **SC-002**: Zero unnecessary logouts occur during continuous active daily usage (up to the 7-day refresh window).
- **SC-003**: Password changes complete in under 1 second with immediate feedback and no session invalidation unless intended.
- **SC-004**: New store registration completes in under 3 seconds from form submission to active dashboard access.
- **SC-005**: All four system roles can be tested via 1-click demo buttons within 2 seconds.

## Assumptions

- The backend already provides active endpoints for `/api/v1/auth/refresh`, `/api/v1/auth/logout`, `/api/v1/auth/register`, and `/api/v1/auth/change-password`.
- The default server refresh token expiration is 7 days, and access token expiry is configured via application settings.
- All users have permission to view their own profile and change their own password regardless of role.
