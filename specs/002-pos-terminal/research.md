# Research & Technical Decisions: 002-pos-terminal

## Decision 1: POS Cart State Management & Reactivity

- **Decision**: Implement a custom React Hook (`usePosCart`) utilizing `useState` + `useCallback` + `useMemo` and synchronizing to `sessionStorage` for recovery.
- **Rationale**:
  - Cart state is ephemeral client state local to the POS screen. Using TanStack Query for server state and a dedicated hook for client cart keeps concerns separated.
  - Recalculations of 50-100 items with discounts and taxes take < 0.2ms using `useMemo`, completely eliminating re-render lag during fast barcode scans.
- **Alternatives Considered**:
  - *Zustand / Redux Toolkit*: Excessive boilerplate for a single feature module; local React Hook provides cleaner lifecycle and tree-shaking.
  - *Global Context*: Would trigger unnecessary re-renders in unrelated navigation components.

---

## Decision 2: Rapid Barcode Scanner Input Handling

- **Decision**: Dual-mode input capture:
  1. Primary: Direct high-speed auto-focusing `<Input>` component with `onKeyDown` Enter interception.
  2. Secondary / Global: Background keydown buffer listener (`usePosScanner`) capturing barcode bursts (inter-key delay < 50ms) even if focus momentarily shifts.
- **Rationale**:
  - Commercial barcode scanners (Honeywell, Zebra, Datalogic) emulate USB HID keyboards and emit the full barcode string followed by an `Enter` key in ~30-50ms.
  - Audio and visual toast confirmations provide tactile validation for cashiers.
- **Alternatives Considered**:
  - *WebUSB / WebHID APIs*: Require explicit browser permissions and do not support generic legacy scanners. USB HID Keyboard emulation works universally out-of-the-box.

---

## Decision 3: Server State & Cache Invalidation Strategy

- **Decision**: Use TanStack Query `useMutation` for `POST /api/sales` with automatic invalidation of:
  - `queryClient.invalidateQueries({ queryKey: ['products'] })` -> updates stock counts across all catalog views.
  - `queryClient.invalidateQueries({ queryKey: ['dashboard'] })` -> updates cash drawer, daily revenue, and transaction counters.
  - `queryClient.invalidateQueries({ queryKey: ['customers'] })` -> updates customer balances and remaining credit limits.
- **Rationale**:
  - Guarantees immediate consistency across the entire SaaS without manual state syncing.
- **Alternatives Considered**:
  - *Manual local state mutation*: Error-prone and risks stale product quantities.

---

## Decision 4: 80mm Thermal Receipt Printing

- **Decision**: Dedicated modal rendering pure semantic HTML styled with Tailwind and scoped CSS print media queries (`@media print`).
- **Rationale**:
  - Standard ESC/POS 80mm thermal printers render HTML perfectly at 72mm-80mm width when page margins are reset (`@page { margin: 0; size: 80mm auto; }`).
  - Allows instant preview on screen before physical print trigger (`window.print()`).
- **Alternatives Considered**:
  - *Raw ESC/POS binary printing via WebSerial*: Too hardware-dependent; web print dialog is universal across Windows/Mac/Linux and mobile POS tablets.
