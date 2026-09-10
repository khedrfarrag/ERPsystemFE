# Research & Technical Decisions: 003-products-inventory

## Decision 1: Live Profit Margin & Markup Calculation

- **Decision**: Calculate profit margin amount (`SellingPrice - CostPrice`) and margin percentage (`((SellingPrice - CostPrice) / SellingPrice) * 100`) dynamically within React Hook Form watchers using `useMemo`.
- **Rationale**:
  - Provides instant financial feedback to the store owner before committing prices.
  - Warns in bold Amber/Red when Selling Price is lower than or equal to Purchase Cost.
- **Alternatives Considered**:
  - *Server-only calculation*: Delays feedback until API submission; client-side gives 0ms latency.

---

## Decision 2: On-The-Fly Category & Unit Creation

- **Decision**: Embed an inline sub-modal inside `ProductModal.tsx` capable of creating Categories (`POST /api/categories`) and Units (`POST /api/units`) and auto-selecting them upon return.
- **Rationale**:
  - Avoids losing filled product form data when discovering that a category or unit does not exist yet.
  - Greatly streamlines store setup during bulk onboarding.
- **Alternatives Considered**:
  - *Redirecting to Settings page*: Bad UX, causes form state loss.

---

## Decision 3: Excel / CSV Import 2-Step Preview Pattern

- **Decision**: Use multipart form upload calling `POST /api/products/import/preview` returning parsed rows, duplicate warnings, and invalid data, followed by user confirmation calling `POST /api/products/import/commit`.
- **Rationale**:
  - Store owners can verify imported column mappings and fix errors before polluting production inventory tables.
- **Alternatives Considered**:
  - *Direct 1-step commit*: High risk of data pollution with zero preview safety.
