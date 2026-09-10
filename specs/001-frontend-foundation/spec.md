# Feature Specification: Frontend Core Foundation & Architecture

**Feature Branch**: `001-frontend-foundation`

**Created**: 2026-09-05

**Status**: Ready for Planning

**Input**: User description: "تأسيس معمارية الواجهة الأمامية، مزود React Query، نظام المصادقة وحماية المسارات، ومكتبة المكونات المشتركة مع التوست والنماذج"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Secure Role-Based Authentication & Session Management (Priority: P1)

As a Store Staff Member (Owner, Manager, or Cashier),
I want to log into the RetailOS system securely with my email and password,
So that I can access my store's management tools and have my permissions enforced according to my role.

**Why this priority**:
Without secure authentication and session persistence, no business operations or protected store data can be accessed.

**Independent Test**:
Can be fully tested by submitting valid credentials for Owner, Manager, and Cashier accounts, observing proper role-based redirects, token storage, and automatic session restoration on page reload.

**Acceptance Scenarios**:

1. **Given** a user is on the login page with valid credentials, **When** they submit the login form, **Then** a secure JWT token is stored, their user role is identified, and they are redirected to the main dashboard.
2. **Given** an unauthenticated user attempts to access `/pos` or `/reports`, **When** the page loads, **Then** the system immediately redirects them to `/login` while preserving their attempted destination.
3. **Given** an authenticated Cashier attempts to access the financial reports route, **When** navigation occurs, **Then** access is denied with a clear Arabic permission alert and they remain on their authorized view.
4. **Given** a user's token expires or returns a 401 error, **When** any API request is made, **Then** the session is cleanly cleared and the user is redirected to the login screen without application crashes.

---

### User Story 2 - Global Server State Management & Fast Feedback (Priority: P1)

As a User,
I want the application to load data seamlessly with elegant loading skeletons, automatic background synchronization, and instant feedback toasts,
So that I never experience frozen screens or unclear system states during daily operations.

**Why this priority**:
TanStack Query and instant visual feedback (Toasts & Skeletons) form the core reactivity and usability foundation for all subsequent feature modules.

**Independent Test**:
Can be tested by triggering queries and mutations, observing structured skeleton loaders during data fetching, instantaneous Arabic success/error toast notifications on operations, and automatic cache invalidation.

**Acceptance Scenarios**:

1. **Given** data is being fetched from the server, **When** the screen renders, **Then** smooth skeleton placeholders matching the layout dimensions are displayed until the data arrives.
2. **Given** a network mutation or data submission succeeds, **When** completed, **Then** a green Arabic toast notification confirms success and affected query caches are automatically marked stale and re-fetched.
3. **Given** a network request fails, **When** the error occurs, **Then** a descriptive red toast explains the issue in Arabic and offers a retry mechanism without breaking the layout.

---

### User Story 3 - Shared Design System & Reusable Form Architecture (Priority: P2)

As a Developer and Store User,
I want standard, accessible, and high-performance UI components (Buttons, Inputs, Modals, Cards, Badges, Tables) with strict form validation,
So that all modules look unified, responsive, beautiful in Arabic RTL, and prevent invalid input before submission.

**Why this priority**:
Ensures zero duplication of UI code and establishes bulletproof form handling with real-time validation across the entire application.

**Independent Test**:
Can be tested by interacting with the shared UI component library and submitting forms with valid/invalid inputs using React Hook Form and Zod schemas.

**Acceptance Scenarios**:

1. **Given** a form with required fields (e.g., product name, price), **When** a user enters invalid or empty data, **Then** real-time Arabic validation errors appear under the respective inputs and submission is blocked.
2. **Given** a modal dialog is opened, **When** the user clicks outside or presses Escape, **Then** it cleanly closes while preserving form state if appropriate.
3. **Given** different screen sizes (desktop POS, laptop, tablet), **When** navigating the application, **Then** the layout gracefully adapts in true RTL format with Cairo typography.

---

### Edge Cases

- **Offline / Network Drops**: The system intercepts network loss and displays a non-blocking toast warning indicating connection issues.
- **Corrupted LocalStorage**: If saved auth data is malformed JSON, the AuthProvider gracefully resets without crashing.
- **Rapid Navigation**: Cancels in-flight unmounted requests cleanly without React state update memory leaks.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a centralized Axios client with request/response interceptors for Bearer token injection and global 401 error handling.
- **FR-002**: System MUST integrate TanStack React Query v5 as the single source of truth for server state with customized queryClient defaults (staleTime, gcTime, retry policy).
- **FR-003**: System MUST provide a robust `ProtectedRoute` component that enforces authentication and Role-Based Access Control (RBAC) across all routes.
- **FR-004**: System MUST implement a unified `AuthContext` managing login, logout, user profile state, and persistent authentication tokens.
- **FR-005**: System MUST provide a set of shared, accessible UI components (`Button`, `Input`, `Select`, `Modal`, `Card`, `Badge`, `Table`, `Skeleton`, `Spinner`, `EmptyState`).
- **FR-006**: System MUST integrate `react-hook-form` with `zod` resolvers for type-safe form validation with inline Arabic error messages.
- **FR-007**: System MUST provide global Arabic toast notifications powered by `react-hot-toast` with RTL styling.
- **FR-008**: System MUST support responsive RTL layouts adhering to the Cairo typography design system.

### Key Entities

- **User**: Represents authenticated staff member (id, email, firstName, lastName, role, storeId, storeName).
- **AuthResponse**: Encapsulates access token, refresh token, expiry, and User profile.
- **ToastNotification**: Feedback entity (type: success | error | loading, message, duration).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Zero TypeScript compilation errors (`npm run build` exits with code 0).
- **SC-002**: Unauthenticated access to protected routes is blocked and redirected in under 50ms.
- **SC-003**: Form validation provides instant feedback under 16ms (60fps UI responsiveness).
- **SC-004**: 100% of user-facing feedback and error messages are presented in fluent Arabic.
- **SC-005**: Initial page bundle loads swiftly with lazy-loaded route chunks.

## Assumptions

- Backend REST API is running locally on `http://localhost:5030/api`.
- Authentication uses standard Bearer JWT tokens.
- Target devices are modern evergreen browsers (Chrome, Edge, Firefox, Safari) with modern ES2022+ support.
