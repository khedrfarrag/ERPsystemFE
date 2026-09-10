# Research & Technical Decisions: 009-table-hover-dark-contrast

## 1. Root Cause Analysis of User Reported Defects

### Defect 1: Invisible Text in Dashboard Timeline & Stock Alerts
- **Observed Behavior**: Text in "أحدث الحركات اليومية" and "تنبيهات نواقص المخزون" blends invisibly with the `bg-slate-900` / `bg-slate-800` card background and is only visible when highlighted with mouse selection.
- **Root Cause**: In `src/pages/Dashboard.tsx`, titles and descriptions use `text-slate-900` and `text-slate-800` without a `dark:text-white` or `dark:text-slate-100` modifier. When the container card turns dark (`dark:bg-slate-800`), the text color remains dark slate, resulting in a contrast ratio $< 1.5:1$ (severe WCAG AA failure).
- **Solution**: Explicitly pair dark text classes with bright dark-mode overrides:
  - Titles: `text-slate-900 dark:text-white font-bold` (Contrast $> 13:1$).
  - Subtitles & IDs: `text-slate-600 dark:text-slate-300` (Contrast $> 7:1$).

### Defect 2: Washed-Out Table Headers in Dark Mode
- **Observed Behavior**: Table headers in Dark Mode render with an unintended pale/white background and light gray text.
- **Root Cause**: Table headers used `bg-slate-50 dark:bg-slate-850/60`. Opacity on top of card containers causes color washing. In addition, some column headers lacked explicit `dark:text-slate-200` styling.
- **Solution**: Establish solid, non-transparent header background in Dark Mode:
  - Header row: `bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-black border-b border-slate-200 dark:border-slate-700`.

### Defect 3: Inverted Light Row Hover in Dark Mode
- **Observed Behavior**: Hovering cursor over table rows turns the row background white/light, which clashes with the white row text and makes all values vanish.
- **Root Cause**: Rows had `hover:bg-slate-50/70 dark:hover:bg-slate-750/50`. If the dark hover class failed or blended with opacity, the light hover took precedence, wiping out text visibility.
- **Solution**: Standardize row hover to `hover:bg-slate-100/70 dark:hover:bg-slate-700/60`. In Dark Mode, `bg-slate-700/60` creates an elegant, elevated slate background against which white, emerald, and amber text stand out clearly.
