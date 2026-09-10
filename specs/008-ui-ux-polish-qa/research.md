# Research & Color Palette Decisions: 008-ui-ux-polish-qa

## 1. Root Causes of Low-Contrast Text
- **Cause 1**: Overusing `text-slate-400` or `text-slate-500` on light gray backgrounds (`bg-slate-50`) resulted in a contrast ratio under 2.8:1 (below WCAG minimum 4.5:1).
  - **Remedy**: Upgrade secondary text to `text-slate-600` on light backgrounds and `text-slate-300` on dark backgrounds.
- **Cause 2**: Implicit inheritance of text color inside inputs (`<input className="bg-slate-50 ...">`) where dark mode or autocomplete sets dark background with dark text.
  - **Remedy**: Explicitly declare `text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600` on every input and select element.
- **Cause 3**: Badges with light text on pastel backgrounds (e.g. `bg-rose-50 text-rose-500`).
  - **Remedy**: Use rich saturated tones: `bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50`.

## 2. Modal Screen Fit & Overflow Architecture
- **Problem**: Long modal forms (such as Multi-item Purchase Orders or Product creation with profit margin calculators) on 768px laptop screens had their bottom submit buttons clipped.
- **Solution**: Standardize all modals with:
  ```html
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <div className="bg-white dark:bg-slate-800 w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
      <!-- Fixed Header -->
      <div className="px-6 py-4 border-b shrink-0 flex items-center justify-between">...</div>
      <!-- Scrollable Form Body -->
      <form className="p-6 overflow-y-auto space-y-4 flex-1">
        ...
      </form>
      <!-- Fixed Sticky Footer -->
      <div className="px-6 py-3 border-t shrink-0 flex justify-end gap-2 bg-slate-50 dark:bg-slate-900">...</div>
    </div>
  </div>
  ```
