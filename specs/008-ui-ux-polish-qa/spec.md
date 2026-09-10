# Feature Specification: 008-ui-ux-polish-qa

**Feature Name**: Comprehensive UI/UX Testing, Theme & Color Contrast Standardization, Edge Cases & Visual Polish  
**Target Module**: RetailOS Frontend (`system-FE`)  
**Status**: Clarified & Ready for Task Planning  
**Version**: 1.1.0  

---

## Clarifications

### Session 2026-09-06
- **Q**: هل ترغب في تفعيل ودعم التبديل اليدوي بين النمط الداكن والفاتح (Dark / Light Mode Toggle) عبر شريط التنقل العلوي، أم اعتماد وتثبيت نمط فاتح احترافي عالي التباين؟  
  **A**: Option A — Full Dark/Light mode toggle with persistent state in `localStorage`, with strict WCAG AA/AAA contrast enforcement across all floating, dynamic, and asynchronous components (Modals, Forms, Dropdowns, Tooltips, Toasts) and interactive states (`:focus`, `:hover`, `:disabled`, validation errors).

---

## 1. Executive Summary & Problem Statement

RetailOS operates in diverse retail environments — from high-glare daytime counters to low-light evening shifts. While all 7 functional modules are built, color clashing and low-contrast typography exist, especially in floating/portal overlays (Modals, Dropdowns, Tooltips, Form Inputs):
1. **Dynamic / Portal Color Clashes**:
   - Floating overlays (Modals, Popovers, Select Dropdowns, Tooltips) frequently fail to inherit the parent theme correctly, resulting in white text on white backgrounds or dark text on dark card backgrounds.
   - Text inputs and textareas lack explicit text colors, causing typed characters or placeholders to blend into the input background.
2. **Interactive States Degradation**:
   - Under `:focus`, `:hover`, and `:disabled` states, focus rings and borders become invisible or lose contrast below WCAG minimums.
   - Validation error messages blend into backgrounds or fail to draw immediate attention.
3. **Comprehensive QA Testing via Chrome DevTools**:
   - Every single modal, form, and table must be audited with Chrome DevTools' Inspect Element Contrast Ratio tool to certify zero contrast violations below 4.5:1 (normal text) and 3:1 (large headers/icons).

---

## 2. Target User Personas & Quality Goals

| Persona | Primary Goal | UI/UX & Contrast Standards |
|---------|--------------|----------------------------|
| **Cashier** | Rapid, error-free POS checkout in any lighting | WCAG AAA contrast on totals, readable barcode inputs, clear receipt previews, instant theme toggle. |
| **Store Manager** | Form entry & inventory auditing | Distinct borders on all inputs, unambiguous dropdown selections, visible disabled states. |
| **Store Owner** | Executive reporting & P&L audits | Legible charts in both themes, crisp printable A4 views, high-contrast KPI metrics. |

---

## 3. Comprehensive Test Cases: Modals, Forms & Overlays

### Category A: Modal Dialogs & Overlay Portals
| Test ID | Overlay / Component | Light Mode Verification | Dark Mode Verification | Acceptance Criteria |
|---|---|---|---|---|
| **TC-MOD-01** | **POS Payment Modal** (`PaymentModal.tsx`) | Dialog bg: `bg-white`, title: `text-slate-900`, method cards: `border-slate-200`. | Dialog bg: `dark:bg-slate-800`, title: `dark:text-white`, method cards: `dark:border-slate-700`. | No white-on-white text; Cash/Card/Credit options clearly highlighted. |
| **TC-MOD-02** | **POS Thermal Receipt Modal** (`ReceiptModal.tsx`) | Pure white paper card (`bg-white`), black text (`text-black`), mono font. | Pure white paper preview with sharp black monospace text even when Dark Mode is active. | Thermal receipt always preserves realistic black-on-white paper style. |
| **TC-MOD-03** | **Product Add/Edit Modal** (`ProductModal.tsx`) | Inputs: `bg-white text-slate-900 border-slate-300`. Profit card: `bg-emerald-50 text-emerald-800`. | Inputs: `dark:bg-slate-900 dark:text-white dark:border-slate-600`. Profit card: `dark:bg-emerald-950/60 dark:text-emerald-300`. | Live profit margin indicator is high-contrast in both modes. |
| **TC-MOD-04** | **Customer Payment Modal** (`ReceivePaymentModal.tsx`) | Form labels: `text-slate-700`, debt balance: `text-rose-600`. | Form labels: `dark:text-slate-200`, debt balance: `dark:text-rose-400`. | Remaining debt calculation clearly readable. |
| **TC-MOD-05** | **Customer Statement Modal** (`CustomerStatementModal.tsx`) | Table header: `bg-slate-50 text-slate-700`, rows: `text-slate-800`. | Table header: `dark:bg-slate-900 dark:text-slate-200`, rows: `dark:text-slate-200`. | Running balance ledger legible across all columns. |
| **TC-MOD-06** | **Create Purchase Modal** (`CreatePurchaseModal.tsx`) | Items table, quantity & cost inputs visible with high-contrast borders. | Dark table rows, dark inputs with explicit white text and clear borders. | Small laptop screens fit with scrollable body and sticky action buttons. |
| **TC-MOD-07** | **Supplier Disbursement Modal** (`DisbursePaymentModal.tsx`) | Payment amount, supplier payable balance in bold high contrast. | Dark mode text high contrast; warning notice legible. | Submit button permanently visible. |
| **TC-MOD-08** | **Record Expense Modal** (`RecordExpenseModal.tsx`) | Category dropdown, cash deduction warning alert clear. | Category dropdown options readable; warning alert high contrast. | Payment method radio cards distinct. |
| **TC-MOD-09** | **Close Register Modal** (`CloseRegisterModal.tsx`) | Expected vs Counted cards, Discrepancy indicator (Surplus/Deficit). | Dark mode discrepancy card uses vibrant green/red badges with high contrast. | Notes textarea border and text clearly defined. |
| **TC-MOD-10** | **Product Movement Modal** (`ProductMovementModal.tsx`) | Timeline rows with green (+) and red (-) badges. | Dark timeline with crisp contrast badges and timestamps. | Ledger history easily scannable. |

---

### Category B: Form Controls, Dropdowns & Interactive States

| Test ID | Control Type | States to Test | Light Mode Standard | Dark Mode Standard |
|---|---|---|---|---|
| **TC-INP-01** | **Text Inputs & Textareas** | `:default`, `:hover`, `:focus`, `:disabled` | `bg-white text-slate-900 border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:bg-slate-100 disabled:text-slate-400` | `dark:bg-slate-800 dark:text-white dark:border-slate-600 dark:focus:border-primary-400 dark:disabled:bg-slate-900 dark:disabled:text-slate-500` |
| **TC-INP-02** | **Placeholders** | `:default` | `placeholder:text-slate-400` (Contrast $\ge 4.5:1$ against white/slate-50) | `dark:placeholder:text-slate-500` (Contrast $\ge 4.5:1$ against slate-800) |
| **TC-INP-03** | **Select Dropdowns** | `:closed`, `:open`, `<option>` | Dropdown menu: `bg-white text-slate-900 border-slate-300`. Options: `bg-white text-slate-900 hover:bg-slate-100`. | Dropdown menu: `dark:bg-slate-800 dark:text-white dark:border-slate-600`. Options: `dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700`. |
| **TC-INP-04** | **Validation Error Text** | `:invalid` | `text-rose-600 font-bold text-[11px]` with alert icon. | `dark:text-rose-400 font-bold text-[11px]` with alert icon. |
| **TC-INP-05** | **Radio & Checkbox Cards** | `:checked`, `:unchecked` | Unchecked: `bg-white border-slate-200 text-slate-700`. Checked: `bg-primary-50 border-primary-500 text-primary-900`. | Unchecked: `dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300`. Checked: `dark:bg-primary-950/60 dark:border-primary-500 dark:text-primary-200`. |
| **TC-INP-06** | **Action Buttons** | `:default`, `:hover`, `:active`, `:disabled` | Primary: `bg-primary-600 text-white hover:bg-primary-700`. Secondary: `bg-slate-100 text-slate-800 hover:bg-slate-200`. Disabled: `opacity-50 cursor-not-allowed`. | Primary: `dark:bg-primary-500 dark:text-white dark:hover:bg-primary-600`. Secondary: `dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600`. |

---

## 4. Step-by-Step Chrome DevTools Verification Protocol

All developers and QA agents must follow this exact inspection procedure for every page:

1. **Step 1: Open Chrome DevTools & Inspect Element**:
   - Right-click any text element, input, button, or badge and select **Inspect**.
2. **Step 2: Check Contrast in Color Picker**:
   - In the **Styles** pane, locate the `color` property.
   - Click the color swatch to open the DevTools Color Picker.
   - Inspect the **Contrast ratio** line:
     - Must show **✓✓** (passes WCAG AAA $ge 7:1$) or **✓** (passes WCAG AA $ge 4.5:1$ for body text, $ge 3:1$ for large headings).
     - If it shows an exclamation mark ⚠️ or ratio $< 4.5:1$, it fails and must be corrected immediately.
3. **Step 3: Audit Interactive States with Force State**:
   - In DevTools Styles pane, click the **:hov** button (Toggle Element State).
   - Check `:focus`, `:hover`, and `:disabled`.
   - Verify that focus borders are visibly distinct (not invisible) and placeholders remain legible.
4. **Step 4: Toggle Theme & Repeat**:
   - Click the Theme Toggle button in the RetailOS Navbar (Light $\leftrightarrow$ Dark).
   - Re-inspect all inputs, dropdown options, and floating modals to confirm zero color clashing.
5. **Step 5: Emulate Reduced Contrast & Dark Preference**:
   - In DevTools, press `Ctrl+Shift+P` $\rightarrow$ type `Rendering`.
   - Test under `Emulate CSS media feature prefers-color-scheme: dark` and `prefers-contrast: more` to guarantee optimal accessibility.

---

## 5. Success Criteria

1. **100% WCAG 2.1 AA / AAA Compliance**:
   - Every piece of text, table cell, input, placeholder, badge, and tooltip satisfies at least a 4.5:1 contrast ratio against its adjacent background in both Light and Dark modes.
2. **Zero Floating / Portal Theme Leaks**:
   - All dropdowns, modals, popovers, and toasts explicitly inherit or declare the active theme background and foreground styles.
3. **Zero Console Errors**:
   - Navigating through all 8 pages and opening all 10 modals yields zero unhandled runtime errors or warnings in the DevTools Console.
4. **Clean 0-Error Build**:
   - `npm run build` exits with code 0.
