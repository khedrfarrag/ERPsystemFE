# Feature Specification: 003-products-inventory

**Feature Name**: Products, Categories, Units & Inventory Management (إدارة المنتجات، الأقسام، الوحدات، والمخزون)
**Feature Directory**: `specs/003-products-inventory`
**Created**: 2026-09-05
**Status**: Ready for Planning
**Input**: User description: "03-products-inventory"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Product Catalog Exploration, Filtering & Real-Time Search (Priority: P1)

As an inventory manager or store owner,
I want to view a comprehensive, paginated catalog of all products with instant search by name or barcode and filtering by category and stock availability,
So that I can quickly assess store stock, identify retail prices, profit margins, and inventory status.

**Why this priority**:
The product catalog is the central master data screen for all retail operations. Cashiers, managers, and owners need immediate access to product records and pricing.

**Independent Test**:
Can be fully tested by loading the products page, searching for items via debounced search bar, toggling category tabs, filtering for low/out-of-stock items, and verifying table pagination.

**Acceptance Scenarios**:
1. **Given** the products management page, **When** the user types a search query (e.g. "زيت" or barcode `6221234567890`), **Then** matching products are filtered instantly with debouncing (<300ms) and highlighted stock levels.
2. **Given** a list of products, **When** the user clicks a category filter pill, **Then** only products belonging to that category are shown.
3. **Given** products with low stock (below minimum threshold) or zero stock, **When** the user toggles the "نواقص المخزون" filter, **Then** low-stock and out-of-stock items are isolated with color-coded severity badges (Amber for Low Stock, Rose for Out of Stock).

---

### User Story 2 - Add, Edit & Delete Product with Strict Validation (Priority: P1)

As a store owner or manager,
I want to add new products or update existing product details (Name, Barcode, Category, Measurement Unit, Purchase Cost, Retail Selling Price, and Minimum Stock Alert Level),
So that our inventory database accurately reflects physical stock, cost structures, and pricing rules.

**Why this priority**:
Adding and maintaining accurate product items is mandatory to enable POS sales, stock deductions, and margin calculations.

**Independent Test**:
Can be tested by opening the Add Product modal, filling in valid inputs, submitting the form, and observing the new product appearing in the list and being ready for POS sales.

**Acceptance Scenarios**:
1. **Given** the Add Product modal, **When** the user enters valid details (Selling Price = 120, Cost = 90), **Then** the form displays the calculated profit margin (30 EGP / 25%) in real time and successfully creates the product upon submission.
2. **Given** the Add/Edit Product form, **When** the user enters a Selling Price less than the Purchase Cost, **Then** the form presents a warning badge indicating negative/zero profit margin.
3. **Given** an existing product, **When** the manager edits prices or minimum stock levels and saves, **Then** the table reflects the updated data immediately without full page reload via TanStack Query invalidation.
4. **Given** an owner deleting an unreferenced product with confirmation, **When** approved, **Then** the product is deleted and an Arabic confirmation toast is shown.

---

### User Story 3 - Quick Categories & Measurement Units Management (Priority: P2)

As a manager setting up new product lines,
I want to manage categories (e.g. ألبان، منظفات، مشروبات) and units (e.g. قطعة، كجم، لتر، كرتونة) directly or on-the-fly inside the product creation modal,
So that I don't have to navigate away or abandon my current product entry flow.

**Why this priority**:
Reduces setup friction and eliminates workflow interruptions when onboarding new inventory suppliers and product lines.

**Independent Test**:
Can be tested by opening the quick-create category/unit popover inside the product modal, adding a new category (e.g. "مجمدات"), and observing it immediately selected in the dropdown.

**Acceptance Scenarios**:
1. **Given** the product form category selector, **When** the user clicks "+ إضافة قسم جديد", **Then** an inline mini-modal appears, allows entering category name and description, and auto-selects the new category upon creation.
2. **Given** the units selector, **When** the user creates a new unit with symbol (e.g. "كيس" / "كيس"), **Then** it is saved to the units dictionary and available across all product forms.

---

### User Story 4 - Stock Status Toggling & Opening Stock Balance Recording (Priority: P2)

As an inventory clerk or owner,
I want to toggle product active/inactive status and record opening stock balances for newly introduced products,
So that inventory quantities are initialized cleanly and discontinued products can be hidden from the POS screen without losing historical reports.

**Why this priority**:
Ensures inventory integrity and prevents selling discontinued items while maintaining historical reporting.

**Independent Test**:
Can be tested by clicking the status toggle switch on a product row to deactivate it, verifying it shows "معطل" badge and is excluded from active POS catalog.

**Acceptance Scenarios**:
1. **Given** an active product, **When** the manager clicks the status toggle switch to deactivate, **Then** the status updates via `PATCH /api/products/{id}/status` and the product is grayed out.
2. **Given** a new product creation, **When** initial stock quantity and cost are supplied, **Then** the opening stock is automatically recorded in the inventory balance ledger.

---

### User Story 5 - Bulk Excel / CSV Import with Live Validation Preview (Priority: P3)

As a store owner onboarding a large inventory from an existing spreadsheet,
I want to upload an Excel/CSV file and preview rows, errors, and duplicates before committing the bulk import,
So that hundreds of products can be added in seconds without data corruption.

**Why this priority**:
Significantly accelerates onboarding and store migration from legacy systems.

**Independent Test**:
Can be tested by selecting an Excel sheet via the import dialog, previewing valid and invalid rows, and clicking "Commit Import" to batch-create products.

**Acceptance Scenarios**:
1. **Given** the import modal, **When** an Excel file is uploaded, **Then** the system calls `POST /api/products/import/preview` and renders a summary of valid rows, duplicate barcodes, and missing fields.
2. **Given** a validated preview, **When** the user clicks "تأكيد الاستيراد", **Then** the batch is committed, product list is refreshed, and a success toast announces the count of imported products.

---

## Edge Cases

- **Duplicate Barcode Entry**: If a barcode already exists in the store, the system must detect and reject duplicate creation with a specific error message.
- **Selling Price Below Cost**: If user sets selling price < purchase cost, require explicit acknowledgment or highlight profit loss in red.
- **Deleting Product with Existing Sales**: If a product has past sales invoices, hard deletion must be blocked by the server with a recommendation to deactivate the product instead.
- **Large Excel Import (1,000+ rows)**: File upload size capped at 5MB with progress spinner and chunked preview.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a paginated, sortable table of products with columns: Name, Barcode, Category, Unit, Cost Price, Selling Price, Margin %, Current Stock, Status, and Actions.
- **FR-002**: System MUST provide a debounced search input supporting real-time filtering by product name and barcode.
- **FR-003**: System MUST provide filter tabs for Category, In-Stock, Low-Stock (<= minStockLevel), and Out-of-Stock (== 0).
- **FR-004**: System MUST provide Add and Edit modals using React Hook Form + Zod schema validation for all product fields.
- **FR-005**: System MUST compute and display real-time profit amount and margin percentage as user types Cost and Selling prices.
- **FR-006**: System MUST allow adding new Categories and Units on-the-fly without navigating away from the Product modal.
- **FR-007**: System MUST provide single-click status toggling (Active / Inactive) with optimistic UI updates and TanStack Query synchronization.
- **FR-008**: System MUST display a dedicated KPI overview header showing: Total Products, Low Stock Count, Out of Stock Count, and Total Inventory Valuation.
- **FR-009**: System MUST support Excel / CSV file upload with a 2-step preview and commit workflow.
- **FR-010**: System MUST automatically invalidate and refetch `['products']`, `['categories']`, `['units']`, and `['dashboard']` query keys after any mutation.

---

### Key Entities

- **Product**:
  - `id`: GUID
  - `name`: Arabic title string
  - `barcode`: Optional EAN-13 / Code-128 string
  - `categoryId`: GUID
  - `categoryName`: Display string
  - `unitId`: GUID
  - `unitName`: Display string (e.g. قطعة)
  - `purchaseCost`: Decimal in EGP (>= 0)
  - `sellingPrice`: Decimal in EGP (> 0)
  - `currentStock`: Decimal quantity in store
  - `minStockLevel`: Decimal threshold for low stock alert
  - `isActive`: Boolean

- **Category**:
  - `id`: GUID
  - `name`: Category name in Arabic
  - `description`: Optional text

- **Unit**:
  - `id`: GUID
  - `name`: Unit title (e.g. كيلو جرام)
  - `symbol`: Short abbreviation (e.g. كجم)

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Store managers can search and find any product in a 5,000-item catalog in under 200ms.
- **SC-002**: Adding a new product with category and price rules takes under 20 seconds.
- **SC-003**: 100% of negative profit margins or duplicate barcodes are flagged before saving.
- **SC-004**: Bulk importing a 500-item Excel sheet is previewed and committed in under 5 seconds.
- **SC-005**: Zero data discrepancies between product catalog stock levels and POS cashier terminal counters.

---

## Assumptions

- Currency is Egyptian Pound (`ج.م` / EGP).
- Role-based permissions: Cashiers can view products, Managers can add/edit, Owners have full rights including deletion and Excel imports.
- Backend API endpoints at `/api/products`, `/api/categories`, `/api/units`, and `/api/inventory` are active and follow standard REST contracts.
