# Implementation Plan: Frontend Core Foundation & Architecture

**Branch**: `001-frontend-foundation` | **Date**: 2026-09-05 | **Status**: Active

## Technical Context

- **Core Framework**: React 19.x + Vite 8.x + TypeScript 5.8/6.0 (Strict Mode)
- **State Management & Caching**: TanStack React Query v5 (`@tanstack/react-query`, `@tanstack/react-query-devtools`)
- **HTTP Client**: Axios with centralized request/response interceptors (`src/api/client.ts`)
- **Routing & Guards**: React Router v7 (`react-router-dom`) with `ProtectedRoute` & Role-Based Access Control
- **Styling**: Tailwind CSS v3.4.17 + PostCSS + `clsx` + `tailwind-merge` + `lucide-react`
- **Form Management**: `react-hook-form` + `@hookform/resolvers/zod` + `zod`
- **Notifications**: `react-hot-toast` with RTL styling & custom Arabic icons

## Constitution Check

- [x] **Zero Financial Miscalculation**: All financial values, calculation models, and DTO contracts synchronize 1-to-1 with Backend.
- [x] **Multi-Tier Route Security**: Unauthenticated and unauthorized users are prevented from accessing protected routes via `ProtectedRoute`.
- [x] **Strict TypeScript Zero Any**: All DTOs, query hooks, mutation payloads, and UI props have complete, strict types.
- [x] **True Arabic RTL**: Cairo font, RTL direction, currency format (`ج.م`), and Arabic error handling.
- [x] **No Legacy**: React 19, TanStack Query v5, Vite 8, React Hook Form 7, Zod 3, React Hot Toast.

## Proposed File Changes

### 1. Core Architecture & Libraries (`src/lib/`, `src/api/`)
- `src/lib/queryClient.ts`: Global `QueryClient` configuration with standard defaults (`staleTime: 60_000`, `gcTime: 300_000`, `retry: 1`).
- `src/api/client.ts`: Axios instance with Bearer token injection and global 401 session clearing.

### 2. Context & Security (`src/context/`, `src/routes/`)
- `src/context/AuthContext.tsx`: Unified Auth Provider handling `login`, `logout`, user state, and token persistence.
- `src/routes/ProtectedRoute.tsx`: Guard component verifying `isAuthenticated` and optional `allowedRoles`.
- `src/routes/AppRoutes.tsx`: Lazy-loaded application route definitions.

### 3. Shared UI Components (`src/components/ui/`, `src/components/feedback/`)
- `src/components/ui/Button.tsx`: Multi-variant button (`primary`, `secondary`, `danger`, `ghost`) with loading spinners.
- `src/components/ui/Input.tsx`: Accessible input component with error message rendering.
- `src/components/ui/Modal.tsx`: Accessible modal dialog with backdrop blur and escape key handling.
- `src/components/ui/Card.tsx`: Styled container with header/body/footer slots.
- `src/components/ui/Badge.tsx`: Status badge (`success`, `warning`, `danger`, `primary`).
- `src/components/feedback/Skeleton.tsx`: Animated skeleton placeholders.
- `src/components/feedback/ToastContainer.tsx`: RTL-configured `Toaster` from `react-hot-toast`.

### 4. Layout Framework (`src/components/layout/`)
- `src/components/layout/Sidebar.tsx`: Role-aware navigation drawer with active states.
- `src/components/layout/Navbar.tsx`: Topbar with live store context, drawer status, and user profile menu.
- `src/components/layout/Layout.tsx`: Master application shell wrapping protected pages.

## Verification Plan

### Automated Build Verification
```bash
cd g:\system-analysiss-saas\system-FE
npm run build
```

### Manual End-to-End Scenarios
1. Login as Owner (`owner@retailos.com` / `Pass123456!`) → Success toast + redirect to Dashboard.
2. Login as Cashier (`cashier@retailos.com` / `Pass123456!`) → Restricted from Reports route.
3. Form validation triggers with Zod error messages in Arabic on empty/invalid inputs.
