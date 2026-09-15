# Tasks: 015-copilot-catalog-history

**Feature Title**: AI Copilot Catalog Generation & Product Lifecycle Intelligence
**Feature Directory**: `specs/015-copilot-catalog-history`
**Specification**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)
**Status**: Ready for Implementation

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Establish shared TypeScript contracts, DTOs, and client-side spreadsheet generation utilities.

- [X] T001 Configure Copilot Action TypeScript types and DTOs in system-FE/src/features/ai-copilot/types/index.ts matching contracts/chat-api.contract.json
- [X] T002 [P] Create CSV generation utility with UTF-8 BOM encoding (\uFEFF) in system-FE/src/features/ai-copilot/utils/exportCsvUtils.ts conforming to contracts/catalog-export-format.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core API contract alignment and AI model orchestration for structured actions.

**⚠️ CRITICAL**: Must be completed before any user story can be implemented.

- [X] T003 Update AiChatRequest and AiChatResponse DTOs with action list support in system-BE/src/RetailOS.Api/Controllers/AiChatController.cs and system-FE/src/features/ai-copilot/api/copilotApi.ts
- [X] T004 Enhance base AI prompt and action extraction parser in system-BE/src/RetailOS.Api/Controllers/AiChatController.cs to support DOWNLOAD_CATALOG, DISAMBIGUATE_PRODUCT, and CREATE_PRODUCT action tags alongside Arabic markdown replies

**Checkpoint**: Foundation ready - User Stories can now be implemented.

---

## Phase 3: User Story 1 - Export Import-Ready Catalog Spreadsheets from Chat (Priority: P1) 🎯 MVP

**Goal**: Store owners can ask Copilot to generate an Excel catalog for specific departments across any retail business domain, with deduplication against existing store items, and receive an interactive file card to download a compliant UTF-8 BOM spreadsheet ready for immediate Excel import.

**Independent Test**: Send prompt *"جهز لي ملف إكسيل يحتوي على أصناف مقترحة لأقسام المنظفات والمساحيق والسجائر"* -> download generated file via chat card -> upload to `POST /api/v1/products/import/preview` -> 100% valid rows recognized with zero duplicate clashes.

### Implementation for User Story 1

- [X] T005 [US1] Implement catalog generation prompt and structured action extraction in system-BE/src/RetailOS.Api/Controllers/AiChatController.cs with dynamic business domain adaptation and existing product deduplication injection
- [X] T006 [P] [US1] Implement DownloadCatalogCard component in system-FE/src/features/ai-copilot/components/DownloadCatalogCard.tsx with row preview, file count badges, and 1-click download
- [X] T007 [US1] Integrate DownloadCatalogCard into system-FE/src/features/ai-copilot/components/AiCopilotWidget.tsx to render for messages containing DOWNLOAD_CATALOG actions
- [X] T008 [US1] Validate end-to-end catalog export & import into product preview per scenario 1 in specs/015-copilot-catalog-history/quickstart.md

**Checkpoint**: At this point, User Story 1 (MVP) is fully functional and independently testable.

---

## Phase 4: User Story 2 - Deep Product Lifecycle & History Intelligence (Priority: P1)

**Goal**: Store owners and cashiers can ask about any product's complete history. If multiple variants match, Copilot offers an interactive disambiguation list; once identified, it outputs factual summaries of first entry date, opening stock, purchase batches, total sales, revenue, gross profit, and stock velocity directly from database ledgers.

**Independent Test**: Send prompt *"إيه أخبار أريال في متجري؟"* -> Copilot presents disambiguation list of matched variants with current stock -> user selects variant -> Copilot outputs accurate opening stock, sales, and profit margin matching database ledgers with zero hallucination.

### Implementation for User Story 2

- [X] T009 [US2] Implement ProductLifecycleSummaryDto and ledger query logic in system-BE/src/RetailOS.Api/Controllers/AiChatController.cs aggregating InventoryTransactions, SaleLineItems, and PurchaseLineItems per CurrentStoreId
- [X] T010 [US2] Add fuzzy product search and DISAMBIGUATE_PRODUCT action emission when multiple variants match in system-BE/src/RetailOS.Api/Controllers/AiChatController.cs
- [X] T011 [P] [US2] Implement ProductDisambiguationCard component in system-FE/src/features/ai-copilot/components/ProductDisambiguationCard.tsx rendering interactive selectable variant chips with stock levels
- [X] T012 [US2] Integrate ProductDisambiguationCard and prompt chips into system-FE/src/features/ai-copilot/components/AiCopilotWidget.tsx
- [X] T013 [US2] Validate product lifecycle ledger query and disambiguation flow with zero hallucination per scenario 2 in specs/015-copilot-catalog-history/quickstart.md

**Checkpoint**: At this point, User Stories 1 AND 2 are both independently functional.

---

## Phase 5: User Story 3 - Interactive Action Confirmation for Product Creation (Priority: P2)

**Goal**: Allow users to register new products directly through chat using Human-in-the-Loop Action Confirmation Cards with strict RBAC enforcement (Cashier button disabled with tooltip; Owner/Manager allowed), creating products with initial opening stock via the official product service upon explicit approval.

**Independent Test**: Send prompt *"أضف صنف جديد باسم صابون سائل ديتول بسعر شراء 20 وسعر بيع 30 والكمية 40"* -> confirm Action Card -> verify product is created with 40 units initial stock in database; verify Cashier sees disabled button with tooltip.

### Implementation for User Story 3

- [X] T014 [US3] Implement product creation intent parsing and CREATE_PRODUCT action generation in system-BE/src/RetailOS.Api/Controllers/AiChatController.cs
- [X] T015 [P] [US3] Implement ProductActionCard component in system-FE/src/features/ai-copilot/components/ProductActionCard.tsx with prefilled fields, client-side RBAC role check (disabling save for Cashier with tooltip), and loading state
- [X] T016 [US3] Integrate ProductActionCard with useCreateProductMutation in system-FE/src/features/ai-copilot/components/AiCopilotWidget.tsx
- [X] T017 [US3] Validate interactive product creation flow and RBAC constraints per scenario 3 in specs/015-copilot-catalog-history/quickstart.md

**Checkpoint**: All three user stories are now independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: RTL styling compliance, TypeScript verification, and end-to-end regression validation.

- [X] T018 [P] Ensure Arabic RTL layout, Cairo typography, and responsive drawer design in system-FE/src/features/ai-copilot/components/AiCopilotWidget.tsx
- [X] T019 Run TypeScript compilation check (npm run build) in system-FE to guarantee zero any and zero type errors
- [X] T020 Execute complete validation walkthrough across all 3 quickstart scenarios in specs/015-copilot-catalog-history/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies
- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 - BLOCKS all user stories.
- **User Story 1 (Phase 3 - MVP)**: Depends on Phase 2 completion.
- **User Story 2 (Phase 4)**: Depends on Phase 2 completion (can run in parallel with US1).
- **User Story 3 (Phase 5)**: Depends on Phase 2 completion (can run in parallel with US1/US2).
- **Polish (Phase 6)**: Depends on completion of desired user stories.

### User Story Dependencies
- **User Story 1 (P1)**: Independent of other stories.
- **User Story 2 (P1)**: Independent of US1 and US3.
- **User Story 3 (P2)**: Independent of US1 and US2.

---

## Parallel Opportunities

- **Phase 1**: T001 and T002 can be implemented in parallel.
- **Phase 3 (US1)**: T006 (`DownloadCatalogCard.tsx`) can be built in parallel with T005 (`AiChatController.cs` catalog prompt).
- **Phase 4 (US2)**: T011 (`ProductDisambiguationCard.tsx`) can be created in parallel with T009/T010 (Backend ledger aggregation & fuzzy search).
- **Phase 5 (US3)**: T015 (`ProductActionCard.tsx`) can be developed in parallel with T014 (`AiChatController.cs` creation parser).

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup (T001 - T002)
2. Complete Phase 2: Foundational (T003 - T004)
3. Complete Phase 3: User Story 1 (T005 - T008)
4. **STOP and VALIDATE**: Confirm catalog generation, deduplication, & Excel download work end-to-end.

### Incremental Delivery
1. Add User Story 2 (T009 - T013) → Factual product lifecycle intelligence & disambiguation delivered.
2. Add User Story 3 (T014 - T017) → Human-in-the-Loop product registration with RBAC delivered.
3. Polish & Validate (T018 - T020) → Build clean, production-ready release.
