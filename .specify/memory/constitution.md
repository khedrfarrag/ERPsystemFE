<!-- SYNC IMPACT REPORT
Version change: 2.0.0 → 2.1.0 (Added Form & Toast Standards)
Core Focus: Enterprise-Grade, Modern, Bulletproof React + TypeScript + TanStack Query Architecture
Key Principles:
  - Zero Legacy Libraries: React 19, Vite 8, TanStack Query v5, Tailwind CSS v3, React Router v7, React Hook Form, React Hot Toast
  - Forms: React Hook Form + Zod schema validation for all user input forms
  - Notifications: React Hot Toast for all asynchronous and user feedback alerts
  - Server State: TanStack React Query v5 as the single source of truth for remote data
  - Architecture: Feature-Sliced / Bulletproof Modular Structure (features/*, components/ui/*, lib/*)
  - Security: Multi-tier ProtectedRoute with Role-Based Access Control (RBAC)
  - Performance: Strict Memoization (useMemo, useCallback, React.memo, Lazy Loading)
  - Type Safety: 100% Strict TypeScript with ZERO `any` allowance and 1-to-1 Backend DTO sync
  - Arab-First RTL: Seamless RTL layout, Cairo typography, EGP currency format, high accessibility
-->

# RetailOS — Frontend Enterprise Constitution (دستور هندسة الواجهة الأمامية)

## Absolute Constraints (القيود الصارمة غير القابلة للتفاوض)

كل سطر كود وكل قرار معماري في الواجهة الأمامية يجب أن يخضع لهذه القيود الثلاثة دون أي استثناء:

1. **صحة وتطابق البيانات 100% (Zero Financial Miscalculation & Contract Strictness)**:
   - الواجهة لا تقوم باختراع أو تزييف أي أرقام مالية (مثل صافي الربح، تكلفة البضاعة، الضرائب، الأرصدة)؛ المصدر الوحيد للحقيقة هو الباك إند.
   - جميع الـ DTOs والواجهات (`src/types/index.ts`) يجب أن تكون متطابقة حرفياً بنسبة 100% مع عقود الباك إند (C# DTOs).
2. **الأمان الصارم وحماية المسارات (Multi-Tier ProtectedRoute & RBAC)**:
   - لا يُسمح بفتح أي مسار أو تنفيذ أي عملية حساسة (مثل التقارير المالية، تعديل الأسعار، الخزينة) إلا بعد التحقق من صحة الجلسة وصلاحية الدور (`Owner`, `Manager`, `Cashier`).
   - الحماية مطبقة على مستوى: المسار (Route Guards)، المكون (Conditional Rendering)، والطلب الشبكي (Bearer Tokens + 401 Auto-Recovery).
3. **الصرامة البرمجية وتكامل الأنواع (Strict TypeScript Zero Any)**:
   - يُمنع منعاً باتاً استخدام `any` أو `unknown` غير المفحوص. كل دالة، وكل Hook، وكل استجابة API لها نوع صارم ومحدد.
4. **واجهة مستخدم فائقة السرعة ودعم أصيل للغة العربية (True RTL & High-Speed POS UX)**:
   - التطبيق مبني من الصفر ليدعم اتجاه اليمين لليسار (RTL) مع خط **Cairo**، استجابة فورية لمسح الباركود، واختصارات لوحة المفاتيح لتسريع عمليات البيع اليومية.

---

## Quality Tradeoffs (أولويات التصميم وجودة الكود)

عند المفاضلة الهندسية أثناء كتابة الأكواد، نلتزم بالترتيب الصارم التالي:

> **دقة البيانات والأمان (Correctness & Security)** → **تجربة المستخدم والسرعة (UX & Performance)** → **وضوح الكود والبساطة (Readable & KISS)** → **القابلية للتوسع والصيانة (Maintainability)**

---

## Modern Tech Stack (الستاك التقني المعتمد — خالٍ تماماً من أي Legacy)

| الطبقة / الغرض | المكتبة المعتمدة | الإصدار | سبب الاختيار والمزايا |
|---|---|---|---|
| **Core Framework** | React | `^19.0.0` | أحدث معايير React الرسمية، أداء تصيير فائق وخفيف |
| **Build Tool** | Vite | `^8.0.0` | تجميع فوري (Instant HMR) وأداء إنتاجي متميز |
| **Language** | TypeScript | `^5.8.0 / 6.0` | بيئة عمل صارمة (Strict Mode)، منع أخطاء وقت التشغيل |
| **Server State & Cache** | TanStack React Query | `^5.0.0` | المعيار العالمي لإدارة الـ Caching، الخلفية، والـ Invalidation |
| **Form Management** | React Hook Form | `^7.54.0` | أداء فائق بدون Re-renders عشوائية، ومعالجة سهلة للمدخلات |
| **Schema Validation** | Zod | `^3.24.0` | التحقق الصارم من صحة المدخلات ومطابقتها للـ Types |
| **Toast Notifications**| React Hot Toast | `^2.5.0` | إشعارات عصرية، خفيفة، تدعم RTL والتغذية الراجعة الفورية |
| **HTTP Client** | Axios | `^1.7.0` | إدارة الـ Interceptors، حقن التوكنات، ومعالجة أخطاء 401 |
| **Styling & CSS** | Tailwind CSS v3 | `^3.4.17` | نظام تصميم مرن، سريع، خفيف، ومستقر 100% |
| **Icons** | Lucide React | `^1.40.0` | أيقونات عصرية، خفيفة، وشاملة لكل شاشات الكاشير |
| **Charts & Analytics**| Recharts | `^3.10.0` | رسوم بيانية تفاعلية دقيقة للمبيعات والأرباح |
| **Routing** | React Router | `^7.0.0` | إدارة التوجيه، المسارات المحمية، والـ Lazy Loading |
| **Class Merging** | clsx + tailwind-merge | `latest` | دمج وتخصيص كلاسات Tailwind بأمان لمنع التضارب |
| **Typography** | Google Fonts (Cairo) | Standard | خط عربي رسمي ومريح للعين في الاستخدام اليومي الطويل |

---

## Forms & User Feedback Guidelines (معايير النماذج وتجربة المستخدم)

1. **إدارة النماذج (React Hook Form + Zod)**:
   - كل نافذة منبثقة أو شاشة إضافة/تعديل (منتج، عميل، مورد، مصروف، تسجيل دخول) تُبنى عبر `react-hook-form` ومخطط `zod`.
   - عرض رسائل الأخطاء أسفل الحقول باللغة العربية الواضحة وبشكل فوري عند عدم مطابقة الشروط.
   - تعطيل زر الحفظ وإظهار مؤشر دوران (Spinner) أثناء عملية الإرسال لتفادي الإرسال المكرر.
2. **الإشعارات والتغذية البصرية (React Hot Toast)**:
   - كل عملية حفظ أو تعديل ناجحة تُظهر رسالة Toast خضراء أنيقة باللغة العربية (مثال: "تم حفظ الفاتورة بنجاح"، "تمت إضافة الصنف للمخزن").
   - كل خطأ شبكي أو خطأ في الصلاحيات يُعرض عبر Toast أحمر يوضح سبب المشكلة بدقة مع خيار إعادة المحاولة.

---

## Architecture: Bulletproof Feature-Driven Design

نعتمد هيكلية معيارية قائمة على الميزات (Feature-Sliced Architecture) المعترف بها كأفضل نمط لتطبيقات الـ SaaS والـ POS الكبيرة:

```
src/
├── api/                      # إعدادات Axios المركزية والـ Interceptors
│   └── client.ts             # Axios Instance, JWT Injection, 401 Handler
├── components/               # مكونات واجهة المستخدم المشتركة (Shared UI)
│   ├── ui/                   # المكونات الأساسية (Button, Input, Modal, Card, Badge, Table, Tooltip)
│   ├── feedback/             # مؤشرات التحميل، التنبيهات (Skeleton, Spinner, ToastProvider, EmptyState)
│   └── layout/               # هيكل التطبيق (Sidebar, Navbar, ProtectedLayout, PageContainer)
├── context/                  # سياقات الحالة المحلية للعميل فقط (AuthContext)
├── features/                 # وحدات الأعمال المستقلة (Features Modules)
│   ├── pos/                  # شاشة الكاشير وسلة المبيعات والباركود
│   │   ├── api/              # React Query Hooks (useCreateSale, usePosCatalog)
│   │   ├── components/       # Cart, ProductGrid, BarcodeScanner, ReceiptModal
│   │   ├── hooks/            # useCart, usePosKeyboardShortcuts
│   │   └── types/            # عقود المبيعات وسلة الشراء
│   ├── products/             # إدارة الأصناف والجرد والمخازن
│   ├── customers/            # حسابات العملاء، الديون، وسقف الائتمان
│   ├── suppliers/            # حسابات الموردين، المستحقات، وفواتير التوريد
│   ├── expenses/             # المصروفات اليومية والنثريات
│   ├── dashboard/            # بطاقات الـ KPIs ومراقبة الرواكد والاتجاهات
│   └── reports/              # تقارير قائمة الدخل (P&L) وطباعة الكشوفات
├── hooks/                    # خطافات مساعدة عامة (useDebounce, useLocalStorage, useTitle)
├── lib/                      # إعدادات المكتبات الخارجية (queryClient.ts, tailwindUtils.ts)
├── routes/                   # تعريف المسارات وحمايتها (AppRoutes.tsx, ProtectedRoute.tsx)
├── types/                    # النماذج المشتركة المطابقة للباك إند (index.ts)
├── utils/                    # دوال التنسيق النقدي والتواريخ (formatCurrency, formatDate)
├── App.tsx                   # مزود React Query والـ Toast والـ Router الرئيسي
├── index.css                 # توجيهات Tailwind وتخصيصات RTL
└── main.tsx                  # نقطة الدخول للتطبيق
```

---

## Data Fetching & Server State Strategy (استراتيجية إدارة الـ API)

1. **TanStack Query هو المصدر الوحيد لحالة السيرفر (Single Source of Server Truth)**:
   - لا نضع استجابات الـ API في `useState` يدوية ما لم تكن هناك حاجة لتعديل محلي قبل الإرسال.
   - استخدام `useQuery` لجلب البيانات مع تحديد `staleTime` و `gcTime` المناسبة لكل شاشة.
   - استخدام `useMutation` لكل عمليات الحفظ، التعديل، والحذف.
2. **تحديث الكاش التلقائي (Automatic Cache Invalidation)**:
   - عند إتمام عملية بيع جديدة في الـ POS، يتم عمل `queryClient.invalidateQueries({ queryKey: ['dashboard'] })` و `['products']` لتحديث الأرصدة والمبيعات فوراً دون إعادة تحميل الصفحة.
   - عند تسجيل مصروف جديد، يتم عمل Invalidation لكاش ملخص الأرباح والدرج.
3. **المعالجة البصرية لحالات التحميل والأخطاء (Skeletons & Error Recovery)**:
   - استخدام `isLoading` لعرض هياكل رمادية أنيقة (Skeletons) متناغمة مع مقاس الجدول أو البطاقة.
   - معالجة `isError` بعرض رسائل تنبيهية باللغة العربية مع Toast فوري وزر "إعادة المحاولة" (Retry Button).

---

## Performance & Memoization Rules (قواعد تحسين الأداء والميمويزيشن الصارمة)

1. **استخدام `useMemo` للعمليات الحسابية والفلاتر الثقيلة**:
   - حساب إجمالي الفاتورة، الخصومات، والضرائب داخل سلة الـ POS يجب تغليفه بـ `useMemo`.
   - فلترة مصفوفات المنتجات الكبيرة بالاسم والباركود يجب أن تتم عبر `useMemo`.
2. **استخدام `useCallback` للدوال الممررة كـ Props**:
   - كل دالة تُمرر إلى مكون فرعي معتمد على `React.memo` (مثل أزرار السلة أو عناصر القائمة) يجب تغليفها بـ `useCallback` لتفادي إعادة التصيير العشوائي (Re-render).
3. **تحسين البحث بـ Debouncing**:
   - أي حقل بحث بالاسم أو الباركود يجب أن يستخدم `useDebounce` (بمعدل 250-300ms) لمنع إطلاق عمليات بحث مكررة مع كل حرف.
4. **تقسيم الكود بالـ Lazy Loading**:
   - جميع صفحات التطبيق الرئيسية (`Dashboard`, `Pos`, `Products`, `Reports`, ...) تُحمّل عبر `React.lazy` و `Suspense` لتقليل حجم الحزمة الأولية وضمان سرعة فتح التطبيق.

---

## Security & Role-Based Access Control (الأمان وحماية الأدوار)

1. **مستويات الحماية الثلاثية**:
   - **Level 1 (Router Guard):** حظر المسارات المحمية وتوجيه المستخدم غير المسجل إلى `/login`.
   - **Level 2 (Role Guard):** منع الكاشير من دخول شاشات التقارير المالية أو إعدادات المالك.
   - **Level 3 (Component Guard):** إخفاء أزرار الحذف أو تعديل الأسعار داخل الجداول إذا كان دور المستخدم لا يملك الصلاحية.
2. **إدارة جلسة العمل (JWT Session Management)**:
   - حفظ التوكن وبيانات المستخدم في `localStorage` مشفرة/منظمة.
   - اعتراض أي رد `401 Unauthorized` وتوجيه المستخدم لتسجيل الدخول بأمان دون تعليق التطبيق.

---

## Definition of Done (شروط الاعتماد للإنتاج والدمج)

لا يُعتبر أي كود أو ميزة منتهية وجاهزة للإنتاج إلا إذا استوفت المتطلبات التالية بالكامل:

- [ ] تجميع الـ TypeScript ينجح 100% بدون أي أخطاء (`npm run build` يعطي Exit Code 0).
- [ ] لا يوجد أي استخدام للنوع `any` في أي ملف تم إنشاؤه أو تعديله.
- [ ] إدارة البيانات معتمدة بالكامل على TanStack React Query مع إعداد الـ QueryKeys والـ Mutations بدقة.
- [ ] إدارة النماذج بـ React Hook Form والتحقق بـ Zod، مع إشعارات Toast تفاعلية.
- [ ] معالجة حالات التحميل (Skeleton/Spinner)، الخطأ (Toast/Alerts)، والفراغ (Empty States) باللغة العربية.
- [ ] تطبيق الـ Memoization والـ Debouncing في المواضع الحساسة للأداء.
- [ ] التأكد من تجاوب الواجهة مع الشاشات المختلفة ودعم الـ RTL وتنسيق العملات (`ج.م`).

---

**Version**: 2.1.0 | **Ratified**: 2026-09-05 | **Status**: Active & Enforced