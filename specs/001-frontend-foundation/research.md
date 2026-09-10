# Research & Architecture Decisions: 001-frontend-foundation

## 1. Server State vs Client State Separation
- **Decision**: Adopt TanStack React Query v5 as the single source of truth for remote server data.
- **Rationale**: Eliminates manual `useState` / `useEffect` data fetching boilerplate, provides built-in caching, background revalidation, request deduplication, and declarative mutation states.
- **Alternatives Considered**: Redux Toolkit (too heavy/boilerplate), Context API for server state (causes cascading re-renders and lacks caching).

## 2. Form Management & Validation
- **Decision**: Combine `react-hook-form` with `zod` via `@hookform/resolvers/zod`.
- **Rationale**: `react-hook-form` utilizes uncontrolled components for maximum 60fps rendering performance. `zod` ensures compile-time TypeScript type inference matching runtime validation.
- **Alternatives Considered**: Formik + Yup (slower, legacy performance issues), plain React state (excessive re-renders).

## 3. User Feedback & Notifications
- **Decision**: Use `react-hot-toast` with Cairo typography and RTL positioning (`top-left` / `top-center`).
- **Rationale**: Extremely lightweight (<5kb), zero dependency footprint, highly customizable with Tailwind CSS classes.
