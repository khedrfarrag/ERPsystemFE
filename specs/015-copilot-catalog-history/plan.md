# Implementation Plan: 015-copilot-catalog-history

**Branch**: `015-copilot-catalog-history` | **Date**: 2026-09-16 | **Spec**: [spec.md](./spec.md)

---

## 1. Summary
Empower the RetailOS AI Copilot (`AiCopilotWidget`) to become an agentic assistant that:
1. **Generates Downloadable Catalogs (Context-Aware & Deduplicated)**: Dynamically adapts to store business domains (Detergents, Supermarket, Plumbing, etc.), injects existing store product names into the prompt to prevent duplicate generation, and outputs structured JSON converted to downloadable UTF-8 BOM CSV/Excel spreadsheets preformatted to RetailOS's official import headers.
2. **Answers Product Lifecycle Inquiries with Fuzzy Disambiguation**: Employs fuzzy search across database products. If multiple variants match, presents a clean interactive disambiguation list of variants and current stock; once specified, queries real inventory transactions, sales, and purchase ledgers in PostgreSQL to deliver verified, zero-hallucination product timelines and velocity insights.
3. **Interactive Action Confirmation with Strict RBAC**: Renders interactive "Action Cards" in the chat for product creation with prefilled fields, client-side RBAC guard (disabling button with tooltip for Cashiers), and backend 403 authorization before saving.

---

## 2. Technical Context
- **Backend**: .NET 9 Web API (`RetailOS.Api`), EF Core 9 with PostgreSQL (`detergents_shop`), Npgsql.
- **Frontend**: React 19, TypeScript 6, Vite 8, TanStack React Query v5, Tailwind CSS v3, Lucide React.
- **AI Engine**: OpenCode Zen (`mimo-v2.5-free`) as primary, Groq (`allam-2-7b`) as resilient fallback.
- **Deduplication Engine**: Backend queries top/active product names for `CurrentStoreId` and formats `[ExistingProducts: ...]` in prompt context instructing LLM: "Generate X unique items excluding existing ones".
- **Disambiguation Engine**: Fuzzy partial match (`ILIKE %query%`) returning `DisambiguationAction` or structured list in chat response.
- **File Export**: Client-side dynamic CSV generation with UTF-8 BOM (`\uFEFF`) and Blob URL trigger for universal Windows Excel compatibility.
- **Security & Tenancy**: Multi-tenant row-level query filtering (`StoreId == CurrentStoreId`), JWT bearer auth, RBAC (`Owner`, `Manager`, `Cashier`).

---

## 3. Constitution Check

| Principle | Status | Notes |
|:---|:---:|:---|
| **Zero Financial Miscalculation** | **PASS** | Product history numbers are queried directly from EF Core ledger calculations (`InventoryTransactions`, `Sales`); no numbers are guessed or invented. Disambiguation prevents mixing variant figures. |
| **Strict RBAC & Route Security** | **PASS** | `POST /api/v1/ai/chat` requires `[Authorize]` with active tenant context; product creation action cards enforce UI disabled states for Cashiers + backend 403 rejection. |
| **Strict TypeScript Zero Any** | **PASS** | Strong typing for `CopilotAction`, `CatalogExportAction`, `ProductDisambiguationAction`, and `ProductConfirmAction`. |
| **Arab-First RTL Design** | **PASS** | Arabic headers, RTL-compatible tables, and localized prompt chips. |

---

## 4. Project Structure

### Documentation
```text
specs/015-copilot-catalog-history/
├── spec.md                  # Feature requirements & user stories (clarified)
├── plan.md                  # This implementation plan
├── research.md              # Phase 0 research & architectural decisions
├── data-model.md            # Action schemas & lifecycle DTOs
├── quickstart.md            # Step-by-step runnable validation scenarios
├── contracts/
│   ├── chat-api.contract.json       # Chat response schema with actions
│   └── catalog-export-format.md     # Official column headers specification
└── checklists/
    └── requirements.md      # Specification quality checklist
```

### Source Code Targets
```text
system-BE/src/RetailOS.Api/
├── Controllers/
│   └── AiChatController.cs              # Enhanced with deduplication, product history lookup, fuzzy disambiguation, & action prompt logic

system-FE/src/features/ai-copilot/
├── types/
│   └── index.ts                         # Copilot action models & DTOs
├── api/
│   └── copilotApi.ts                    # Updated with CopilotAction models & parser
├── components/
│   ├── AiCopilotWidget.tsx              # Renders interactive action cards, disambiguation lists, & download buttons
│   ├── DownloadCatalogCard.tsx          # Component for 1-click Excel/CSV generation & download
│   ├── ProductActionCard.tsx            # Component for 1-click product creation confirmation with RBAC guard
│   └── ProductDisambiguationCard.tsx    # Interactive selection list for ambiguous product queries
└── utils/
    └── exportCsvUtils.ts                # Client-side UTF-8 BOM CSV generator
```

---

## 5. Implementation Phases

### Phase 1: Backend Product History, Deduplication & Action Generation (`system-BE`)
1. In `AiChatController.cs`, query existing product names for the store and inject `[ExistingProducts: ...]` into prompt context with explicit deduplication instructions.
2. In `AiChatController.cs`, detect product lifecycle queries using fuzzy matching. If multiple matches occur, return disambiguation candidates; if a single match occurs, query the database for its entry date, total inbound stock, total sold, revenue, profit, and current stock, injecting verified numbers into the system prompt.
3. Support returning structured `actions` array (`DOWNLOAD_CATALOG`, `DISAMBIGUATE_PRODUCT`, `CREATE_PRODUCT`) alongside `reply` in `AiChatResponse`.

### Phase 2: Frontend Action Cards & Excel/CSV Blob Builder (`system-FE`)
1. Create `exportCsvUtils.ts` to convert catalog item arrays into a downloadable `.csv` file with UTF-8 BOM (`\uFEFF`) and proper quoting.
2. Create `DownloadCatalogCard.tsx` to render inside the chat bubble whenever `DOWNLOAD_CATALOG` action is present.
3. Create `ProductDisambiguationCard.tsx` to display variant selection chips/buttons whenever multiple products match a query.
4. Create `ProductActionCard.tsx` with role checking (`useAuth`), disabling save button for Cashiers, and connecting to `useCreateProductMutation`.
5. Update `AiCopilotWidget.tsx` to render action cards alongside text messages.

### Phase 3: End-to-End Validation
1. Test requesting an Excel catalog -> verify dynamic domain adaptation, absence of duplicate items against existing stock -> download file -> import via Excel import modal.
2. Test asking for product history ("إيه أخبار أريال؟") -> observe disambiguation list -> pick variant -> verify exact numbers returned.
3. Test adding product via chat as Owner -> verify confirmation card creates product in database with initial stock; verify Cashier sees disabled button with tooltip.
