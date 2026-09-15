# Feature Specification: 015-copilot-catalog-history

**Feature Title**: AI Copilot Catalog Generation & Product Lifecycle Intelligence
**Feature Directory**: `specs/015-copilot-catalog-history`
**Created**: 2026-09-16
**Status**: Ready for Review / Planning
**Target Users**: Store Owner, Store Manager, Cashier

---

## 1. Problem Statement & Motivation
Currently, RetailOS users can converse with the AI Copilot (`AiCopilotWidget`) about store totals and general retail advice. However:
1. **Catalog Onboarding Bottleneck**: When starting or expanding a store with new departments (e.g. detergents, paper products, powders, cigarettes), users manually search for or construct product lists. Asking the Copilot for an Excel catalog currently returns plain unstructured text rather than a compliant, downloadable file ready for the existing "Import from Excel" feature (`ProductImportService`).
2. **Product Historical Blindspot**: While RetailOS meticulously records every inventory transaction (`InventoryTransactions`), purchase (`PurchaseLineItems`), and sale (`SaleLineItems`), owners and cashiers cannot easily ask natural language questions like *"What is the story of Ariel 4kg since it entered our store?"* to get an integrated lifecycle summary (initial stock, purchase batches, total sold, profits made, and remaining inventory).

This feature elevates the AI Copilot from a conversational assistant into an operational copilot capable of generating import-ready catalog spreadsheets and answering deep historical product lifecycle inquiries.

---

## Clarifications

### Session 2026-09-16
- Q: ما هو الحجم والعدد المستهدف للأصناف التي ينشئها المساعد الذكي عند طلب ملف إكسيل لأقسام متعددة (مثل: منظفات، أوراق، مساحيق، سجائر)؟ → A: اعتماد خيار A (8 إلى 12 صنفاً لكل قسم مقترح، إجمالي ~30-40 صنفاً) كأساس، مع تطبيق تصميم معماري ديناميكي مرن ومدرك للسياق (Context-Aware):
  1. **التكيف الديناميكي مع النشاط التجاري (Dynamic Business Domain)**: يتعرف النظام تلقائياً على نوع النشاط (محل منظفات، سوبرماركت، محل سباكة، أدوات منزلية...) من سياق المتجر أو يسأل المستخدم عند الحاجة.
  2. **منع تكرار الأصناف (Deduplication Safeguard)**: حقن أسماء أو معرفات الأصناف الموجودة مسبقاً في المتجر (`ExistingProducts`) ضمن سياق الطلب وتوجيه النموذج صراحة: "أنشئ أصنافاً جديدة فريدة لا توجد ضمن هذه القائمة: [ExistingProducts]".
- Q: عندما يسأل المستخدم عن تاريخ وأداء منتج باسم عام أو مختصر وتوجد منه عدة أصناف أو أحجام في المتجر؟ → A: اعتماد خيار A عبر تدفق البحث الضبابي وفك الالتباس التفاعلي (Fuzzy Search & Interactive Disambiguation Flow):
  1. يبحث الباك إند عن جميع التطابقات القريبة للاسم المستفسر عنه في المتجر النشط.
  2. يعرض المساعد قائمة تفاعلية سريعة ونظيفة تضم الأصناف المتطابقة مع رصيدها الحالي.
  3. يسأل المستخدم بوضوح: *"أي صنف محدد تقصد؟"* دون تخمين، لضمان دقة 100% في المبيعات، خصم المخزون، وحساب الأرباح.
- Q: ما هو مستوى التحقق من الصلاحيات (RBAC) المطلوب تطبيقه على بطاقة الإجراء التفاعلية [تأكيد وحفظ في المتجر] عند إضافة صنف جديد من الشات إذا كان المستخدم الحالي "كاشير"؟ → A: اعتماد خيار A بتطبيق حماية مزدوجة (UI Guard + API 403): تعطيل زر الحفظ تلقائياً في واجهة الكاشير مع إظهار تلميح (Tooltip) يفيد بأن الإجراء يتطلب صلاحية المالك أو المدير، مع حماية مسار API في الباك إند برفض غير المصرح لهم بنمط 403 Forbidden.

---

## 2. User Scenarios & Prioritized User Stories

### User Story 1 - Export Import-Ready Catalog Spreadsheets from Chat (Priority: P1)
**User Journey**:
As a store owner setting up or expanding store stock across any business domain (e.g. Detergent Shop, Supermarket, Plumbing Store), I ask the Copilot in Arabic to prepare an Excel catalog for specific departments (e.g. منظفات، أوراق، مساحيق، سجائر). 
The Copilot dynamically detects or clarifies the store's business type, checks the store's existing product catalog to avoid duplicates, and generates 8-12 unique, realistic items per requested department. The output is delivered as an interactive downloadable spreadsheet directly within the chat window, formatted with RetailOS's exact import headers:
`اسم الصنف (إجباري)`، `الباركود`، `الفئة`، `الوحدة`، `سعر البيع (إجباري)`، `سعر التكلفة`، `الحد الأدنى للمخزون`، `الوصف`، `سعر الجملة`، `متاح جملة (1 أو 0)`.
I can click the download button to save the file and immediately upload it through the "Import from Excel" modal without manual formatting or duplicate clashes.
I can click the download button to save the `.xlsx`/`.csv` file and immediately upload it through the "Import from Excel" modal without manual formatting.

**Why this priority**: Solves the immediate friction of populating new inventory and eliminates manual data entry mistakes for tens of products.

**Independent Test**:
Can be fully tested by sending a chat message: *"جهز لي ملف إكسيل يحتوي على أصناف المنظفات والمساحيق والسجائر"* -> an interactive file card appears in the chat with a download button -> downloading the file and uploading it to `POST /api/v1/products/import/preview` succeeds with 100% valid rows.

**Acceptance Scenarios**:
1. **Given** an authenticated user in the chat copilot, **When** they request a catalog or product template in Excel/CSV format for specified categories, **Then** the Copilot returns a friendly message accompanied by a downloadable file card containing real structured product suggestions.
2. **Given** the generated file card, **When** the user clicks "تحميل ملف الإكسيل" (Download), **Then** a `.xlsx` or `.csv` file is immediately downloaded to their device with proper UTF-8 BOM encoding supporting Arabic characters.
3. **Given** the downloaded file, **When** uploaded into the RetailOS Excel Import modal, **Then** all columns map automatically and rows are recognized without syntax or schema mismatch errors.

---

### User Story 2 - Deep Product Lifecycle & History Intelligence (Priority: P1)
**User Journey**:
As a store owner or manager, I ask the Copilot about any product in my store (e.g. *"ما هو تاريخ وأداء صنف مسحوق أريال 4 كجم منذ دخوله المتجر؟"* or *"إيه أخبار بيبسي كانز؟"*). The Copilot identifies the product, fetches its full transaction history from the database, and presents a structured timeline covering:
- First entry date and initial opening stock quantity.
- Supplier purchase history (total purchased, suppliers, and purchase cost fluctuations).
- Sales performance (total units sold, revenue generated, and gross profit margin).
- Current stock status and reorder velocity recommendation (slow-moving vs. fast-moving).

**Why this priority**: Delivers core ERP business intelligence natively through chat, giving instant answers to crucial operational and financial questions without navigating through multiple report tabs.

**Independent Test**:
Can be tested by asking about an existing product with sales and purchases -> the Copilot returns precise, verified numeric facts matching the database ledger without hallucinating prices or quantities.

**Acceptance Scenarios**:
1. **Given** an existing product with inventory movements, **When** the user asks about its history or performance by exact name or barcode, **Then** the Copilot queries the product ledger and presents an accurate summary of entry date, purchase batches, total sales, remaining stock, and profits.
2. **Given** a query with a generic or ambiguous product name matching multiple store items (e.g. "أريال" or "ماسورة"), **When** processed by the Copilot, **Then** the system triggers a Fuzzy Search & Interactive Disambiguation Flow displaying the matched variants with their current stock and asking the user to choose the specific item before retrieving financial figures.
3. **Given** a requested product that does not exist in the active store, **When** queried, **Then** the Copilot politely informs the user that the product is not found in the current store catalog and suggests similar product names if available.
4. **Given** a product with stock below the minimum threshold, **When** its lifecycle is reviewed, **Then** the Copilot includes an alert indicating low stock and recommending reorder quantities based on recent sales velocity.

---

### User Story 3 - Interactive Action Confirmation for Product Creation (Priority: P2)
**User Journey**:
As a store owner chatting with the Copilot, I state: *"أضف منتج جديد باسم صابون ديتول 120 جم بسعر شراء 18 وسعر بيع 25 والكمية 30 في قسم المنظفات"*.
Instead of blindly writing to the database, the Copilot outputs an interactive "Action Card" with prefilled fields and buttons: `[تأكيد وحفظ في المتجر]` و `[تعديل]`. Upon clicking "تأكيد", the product and its opening balance are created via the official product API, displaying a success toast.

**Why this priority**: Follows the Human-in-the-Loop best practice, combining chat speed with absolute audit safety and zero accidental data corruption.

**Independent Test**:
Can be tested by typing an add-product prompt -> confirming the action card -> verifying the product appears in the products table with current stock = 30.

**Acceptance Scenarios**:
1. **Given** a prompt requesting to add or register a product, **When** processed by the Copilot, **Then** an action card appears in the chat rendering the parsed product details (name, category, price, cost, initial stock).
2. **Given** the action card for an Owner or Manager, **When** the user clicks "تأكيد وحفظ", **Then** the application triggers `CreateProductRequest` with `InitialStock` and displays confirmation in the chat.
3. **Given** an authenticated Cashier viewing the action card, **When** rendered, **Then** the "تأكيد وحفظ" button is disabled with an explanatory tooltip (*"يتطلب صلاحية مالك أو مدير"*), and any direct API submission is rejected with 403 Forbidden.

---

## 3. Edge Cases & Safeguards
- **Arabic Encoding & Excel Compatibility**: CSV files generated directly in the browser must include the UTF-8 Byte Order Mark (`\uFEFF`) so Microsoft Excel on Windows renders Arabic letters correctly without scrambled characters.
- **Dynamic Business Domain Adaptation**: If the store business type is ambiguous or unspecified in the request, the Copilot asks or infers the domain (e.g. detergents, supermarket, plumbing) to produce relevant products.
- **Deduplication Safeguard Across Repeated Prompts**: The backend/agent injects the active store's existing product names (`ExistingProducts`) into the prompt context, commanding the LLM to generate novel, unique items excluding any already in the store.
- **Large Catalog Output Limit**: Cap generated catalogs at a practical batch size (8-12 items per department, ~30-40 curated items per request) to prevent token exhaustion and latency spikes.
- **Ambiguous Product Names in Queries**: If a user asks about "شيبسي" and multiple varieties exist, the Copilot uses Fuzzy Search to return an interactive disambiguation list of matched variants with current stock rather than guessing or merging financial totals.
- **Tenant Data Isolation**: All product lifecycle searches MUST strictly filter by `StoreId == CurrentStoreId` to ensure complete multi-tenant privacy.

---

## 4. Functional Requirements
- **FR-001**: The system MUST detect when a user requests an Excel or CSV product catalog/template in the AI Copilot.
- **FR-002**: The generated catalog MUST adhere strictly to RetailOS's official import headers:
  `اسم الصنف (إجباري)`, `الباركود`, `الفئة`, `الوحدة`, `سعر البيع (إجباري)`, `سعر التكلفة`, `الحد الأدنى للمخزون`, `الوصف`, `سعر الجملة`, `متاح جملة (1 أو 0)`.
- **FR-003**: The chat widget MUST render an interactive file download card with filename, row count, and a direct download action.
- **FR-004**: The system MUST identify product lifecycle inquiries (by name or barcode) and retrieve the product's associated `InventoryTransactions`, `PurchaseLineItems`, and `SaleLineItems` for the active store.
- **FR-005**: The product lifecycle summary MUST report: first entry date, total inbound stock, total sold units, current stock, and net profit contribution.
- **FR-006**: The system MUST support an interactive Action Card in the chat UI allowing user confirmation before executing product creation commands.
- **FR-007**: Generated files containing Arabic text MUST be encoded with UTF-8 BOM to prevent character distortion in Microsoft Excel.
- **FR-008**: The system MUST dynamically adapt catalog generation to the store's business domain (e.g. Supermarket, Detergents, Plumbing, Hardware) from store profile or prompt context.
- **FR-009**: The system MUST inject existing store product names into the prompt context with explicit deduplication instructions to ensure repeated requests generate only new items.
- **FR-010**: The catalog output MUST be structured as a JSON array matching the import schema ready for conversion to `.xlsx`/`.csv`.
- **FR-011**: When a product lifecycle query matches multiple product variants, the system MUST return an interactive disambiguation list with variant names and current stock for user selection.
- **FR-012**: Action Cards for product creation MUST disable the confirmation button for Cashier roles with a tooltip, and backend endpoints MUST enforce 403 Forbidden for unauthorized roles.

---

## 5. Success Criteria
- **SC-001**: 100% of generated catalog files can be uploaded and parsed by `ProductImportService` with zero column header mismatch errors.
- **SC-002**: Product lifecycle queries return responses within 2.5 seconds with 100% numerical consistency with database ledger totals.
- **SC-003**: Users can download a generated catalog with a single click directly inside the chat interface without leaving the page.
- **SC-004**: Zero unauthorized cross-store data leakage in product timeline queries across multi-tenant stores.
- **SC-005**: 0% duplicate item generation when repeating catalog generation commands for an existing store catalog.
