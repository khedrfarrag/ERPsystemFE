# Tasks: Frontend Core Foundation & Architecture

**Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Phase 1: Setup & Project Infrastructure

- [x] T001 Configure TanStack Query Client instance with caching policies in `src/lib/queryClient.ts`
- [x] T002 Configure Axios client with Bearer JWT interceptor and global 401 session clearing in `src/api/client.ts`
- [x] T003 [P] Setup Zod schemas and validation helpers for authentication in `src/lib/validations.ts`

## Phase 2: Foundational Components (Prerequisites)

- [x] T004 [P] Implement multi-variant accessible Button component with loading spinner in `src/components/ui/Button.tsx`
- [x] T005 [P] Implement Input component with label, error display, and forwardRef in `src/components/ui/Input.tsx`
- [x] T006 [P] Implement Modal dialog with backdrop blur, portal, and escape key listener in `src/components/ui/Modal.tsx`
- [x] T007 [P] Implement Card and Badge status components in `src/components/ui/Card.tsx` and `src/components/ui/Badge.tsx`
- [x] T008 [P] Implement Skeleton and Spinner loaders in `src/components/feedback/Skeleton.tsx` and `src/components/feedback/Spinner.tsx`
- [x] T009 Implement RTL Toast configuration with `react-hot-toast` in `src/components/feedback/ToastContainer.tsx`

## Phase 3: User Story 1 - Role-Based Auth & Session Management (Priority: P1)

*Goal*: Authenticate users, store tokens, provide `useAuth` hook, and guard routes by role.
*Test*: Log in as Owner/Manager/Cashier, reload page to confirm session, and attempt unauthorized route access.

- [x] T010 [US1] Implement AuthContext with session persistence in `src/context/AuthContext.tsx`
- [x] T011 [US1] Implement multi-tier `ProtectedRoute` with Role-Based Access Control in `src/routes/ProtectedRoute.tsx`
- [x] T012 [US1] Rebuild Login page using `react-hook-form`, Zod schema, and fast demo buttons in `src/pages/Login.tsx`

## Phase 4: User Story 2 - Global Server State & Layout Framework (Priority: P1)

*Goal*: Connect QueryClient, build Master Layout with role-aware Sidebar and live Navbar.
*Test*: Verify QueryClient devtools, navigation active states, drawer balance pill, and logout flow.

- [x] T013 [US2] Implement role-aware Sidebar with active states in `src/components/layout/Sidebar.tsx`
- [x] T014 [US2] Implement live Navbar with drawer balance and low stock counter in `src/components/layout/Navbar.tsx`
- [x] T015 [US2] Implement Master Shell Layout in `src/components/layout/Layout.tsx`
- [x] T016 [US2] Wire `QueryClientProvider`, `Toaster`, and lazy-loaded routes in `src/App.tsx`

## Phase 5: User Story 3 - Shared Design System & Form Verification (Priority: P2)

*Goal*: Ensure all shared components adhere to Cairo font, RTL direction, and strict accessibility.
*Test*: Verify all components render smoothly without layout shifts across screen sizes.

- [x] T017 [US3] Verify RTL direction, Cairo typography, and button/card styling in `src/index.css`
- [x] T018 [US3] Ensure 100% strict TypeScript types and eliminate any remaining `any` types across all components

## Phase 6: Polish & Build Verification

- [x] T019 Execute full production bundle build (`npm run build`) to verify 0 TypeScript/compilation errors
- [x] T020 Perform end-to-end verification of login, route protection, and toast feedback
