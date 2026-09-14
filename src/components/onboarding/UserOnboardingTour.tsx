import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  Receipt,
  BarChart3,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  X,
  Lightbulb,
  Play,
  RotateCcw,
  Check,
  Zap,
  Bot
} from 'lucide-react';

export interface TourStep {
  id: string;
  title: string;
  badge: string;
  route?: string;
  icon: React.ElementType;
  gradient: string;
  description: string;
  bulletPoints: string[];
  proTip: string;
  actionText?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'dashboard',
    title: 'لوحة التحكم المباشرة (Dashboard)',
    badge: 'نبض المتجر والسيولة',
    route: '/',
    icon: LayoutDashboard,
    gradient: 'from-blue-600 via-indigo-600 to-violet-600',
    description: 'شاشتك الرئيسية لمراقبة الأداء التشغيلي والمالي لحظة بلحظة دون أي تعقيد.',
    bulletPoints: [
      'متابعة صافي مبيعات اليوم وعدد العمليات المنفذة في الوقت الفعلي.',
      'عرض مباشر لرصيد درج الكاشير النقدي لمعرفة السيولة الفعلية المتاحة.',
      'تنبيهات تلقائية وفورية لأي أصناف أوشكت على النفاد أو نفدت بالفعل من المخزن.',
      'مؤشرات أفضل الأصناف مبيعاً لمساعدتك في اتخاذ قرارات الشراء والتسعير.'
    ],
    proTip: 'احرص على فتح وردية الكاشير مع بداية يوم العمل وتسجيل العهدة الافتتاحية لضمان مطابقة الحسابات بنهاية اليوم.',
    actionText: 'استكشف لوحة التحكم الآن'
  },
  {
    id: 'pos',
    title: 'نقطة البيع السريعة (POS)',
    badge: 'إصدار الفواتير في ثوانٍ',
    route: '/pos',
    icon: ShoppingCart,
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    description: 'واجهة مصممة لتسريع عملية البيع المباشر ومسح المنتجات بالباركود بدون إهدار وقت الزبائن.',
    bulletPoints: [
      'مسح تلقائي للباركود بالماسح الضوئي مباشرة دون الحاجة للضغط بالفأرة.',
      'دعم كامل لطرق الدفع المتعددة: نقداً (كاش)، بطاقات الدفع (شبكة/فيزا)، أو آجل (حساب عميل).',
      'إمكانية تعليق الفاتورة (Hold) لخدمة زبون آخر مؤقتاً والرجوع إليها بضغطة زر واحدة.',
      'طباعة فورية لإيصال الكاشير الحراري (80mm) أو فواتير A4 مع شعار المتجر والضريبة.'
    ],
    proTip: 'يمكنك استخدام اختصارات لوحة المفاتيح السريعة (مثل مفتاح المسافة لإنهاء البيع) لإنجاز الفاتورة في أقل من 5 ثوانٍ.',
    actionText: 'انتقل لشاشة نقطة البيع'
  },
  {
    id: 'products',
    title: 'إدارة المنتجات والمخزون والذكاء الاصطناعي',
    badge: 'التحكم الذكي في الأصناف',
    route: '/products',
    icon: Package,
    gradient: 'from-purple-600 via-pink-600 to-rose-600',
    description: 'كتالوج متكامل لجميع بضائعك، تصنيفاتها، مستويات المخزون، مع دعم استيراد الفواتير بالذكاء الاصطناعي.',
    bulletPoints: [
      'تسجيل الأصناف مع تحديد سعر التكلفة، وسعر بيع التجزئة، وسعر الجملة، وسعر الفنيين/الصنايعية.',
      'ماسح الفواتير بالذكاء الاصطناعي (AI Scanner): التقط صورة لأي فاتورة شراء ورقية من المورد، وسيقوم النظام باستخراج الأصناف والكميات تلقائياً.',
      'ضبط حد الطلب الأدنى لكل صنف ليصلك تنبيه مسبق قبل نفاذ البضاعة من الرفوف.',
      'توليد وطباعة ملصقات الباركود بمقاسات متعددة لطباعتها ولصقها على المنتجات.'
    ],
    proTip: 'جرب زر "مسح فاتورة ذكي" في أعلى شاشة المنتجات لترى كيف يستخرج الذكاء الاصطناعي بنود الفاتورة الورقية دون إدخال يدوي.',
    actionText: 'عرض قائمة المنتجات والمخزون'
  },
  {
    id: 'customers',
    title: 'العملاء وحسابات الآجل والصنايعية',
    badge: 'إدارة الائتمان والتحصيل',
    route: '/customers',
    icon: Users,
    gradient: 'from-amber-600 via-orange-600 to-red-600',
    description: 'دفتر أستاذ إلكتروني دقيق لجميع عملائك، فواتيرهم الآجلة، ومديونياتهم وسداداتهم.',
    bulletPoints: [
      'تحديد سقف ائتماني أقصى (Credit Limit) لكل عميل لمنع تراكم الديون وتنبيه الكاشير.',
      'كشف حساب تفصيلي لكل عميل يوضح كل فاتورة شراء، وسداد، والمرتجعات والرصيد المتبقي.',
      'تسجيل سندات القبض والدفعات النقدية مع توليد إيصال قبض رسمي.',
      'إمكانية تصدير أو طباعة كشف الحساب بصيغة PDF ومشاركته مع العميل مباشرة.'
    ],
    proTip: 'سجل أرقام هواتف الصنايعية والعملاء الدائمين لتسريع اختيارهم في نقطة البيع وتقديم أسعار خاصة لهم.',
    actionText: 'انتقل لسجل العملاء'
  },
  {
    id: 'suppliers',
    title: 'الموردين وفواتير الشراء والتوريد',
    badge: 'سلاسل الإمداد والمستحقات',
    route: '/suppliers',
    icon: Truck,
    gradient: 'from-cyan-600 via-blue-600 to-indigo-600',
    description: 'متابعة الشركات الموردة، أوامر الشراء، استلام الشحنات، وجدولة المبالغ المستحقة لهم.',
    bulletPoints: [
      'إنشاء أوامر شراء جديدة واعتمادها لزيادة رصيد المخزن الفعلي وتحديث تكلفة الصنف.',
      'تتبع المبالغ المتبقية للشركات الموردة ومواعيد الاستحقاق لتفادي التأخيرات.',
      'تسجيل دفعات السداد للموردين سواء من خزينة المحل أو بحوالات بنكية.',
      'كشف حساب شامل لحركة التعامل مع كل مورد لمطابقة الحسابات بكل سهولة.'
    ],
    proTip: 'عند اعتماد فاتورة الشراء، يقوم النظام آلياً بحساب متوسط التكلفة وحماية هوامش أرباحك.',
    actionText: 'انتقل لقسم الموردين'
  },
  {
    id: 'expenses',
    title: 'المصروفات اليومية ودرج الكاشير',
    badge: 'ضبط الهوالك والنثريات',
    route: '/expenses',
    icon: Receipt,
    gradient: 'from-emerald-600 via-green-600 to-teal-600',
    description: 'تسجيل المصاريف التشغيلية (إيجار، كهرباء، بوفيه، عمالة، نثريات) بدقة بالغة.',
    bulletPoints: [
      'تصنيف المصروفات حسب النوع لمعرفة أين تذهب أرباح المتجر كل شهر.',
      'ربط المصروف بدرج الكاشير مباشرة ليتم خصمه من النقدية الحية وتجنب وجود عجز.',
      'إرفاق تفاصيل وتاريخ وملاحظات كل مصروف لمراجعتها في تقارير نهاية الشهر.'
    ],
    proTip: 'أي جنيه يخرج من درج الكاشير لشراء أي غرض يجب تسجيله فوراً ليكون تقفيل الوردية متطابقاً 100%.',
    actionText: 'انتقل للمصروفات'
  },
  {
    id: 'reports',
    title: 'التقارير المالية والقرارات الذكية',
    badge: 'الأرباح والتحليل الرقمي',
    route: '/reports',
    icon: BarChart3,
    gradient: 'from-violet-600 via-purple-600 to-indigo-600',
    description: 'تقارير مالية وتفصيلية تمنحك صورة كاملة عن صافي أرباحك، مبيعاتك، ونمو نشاطك.',
    bulletPoints: [
      'تقرير صافي الربح الحقيقي بعد خصم تكلفة البضاعة والمصروفات التشغيلية.',
      'تقرير مبيعات كل كاشير ومقارنة أداء الورديات المختلفة.',
      'تقرير حركة وركود المخزون لمعرفة البضاعة بطيئة الحركة وتجنب تجميد رأس المال.',
      'إمكانية تصدير كافة التقارير بصيغة Excel أو PDF للطباعة والحفظ.'
    ],
    proTip: 'خصص وقتاً نهاية كل أسبوع لمراجعة تقرير صافي الأرباح لتحديد الأصناف الأكثر ربحية لمتجرك.',
    actionText: 'انتقل للتقارير المالية'
  }
];

const ONBOARDING_STORAGE_KEY = 'retailos_onboarding_completed_v1';

export const UserOnboardingTour: React.FC = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(true);

  const totalSteps = TOUR_STEPS.length;
  const isWelcome = currentStepIndex === -1;
  const isFinish = currentStepIndex === totalSteps;
  const activeStep = !isWelcome && !isFinish ? TOUR_STEPS[currentStepIndex] : null;

  useEffect(() => {
    const handleOpenTour = (e?: any) => {
      const startIdx = typeof e?.detail?.step === 'number' ? e.detail.step : -1;
      setCurrentStepIndex(startIdx);
      setIsOpen(true);
    };

    window.addEventListener('retailos:open-tour', handleOpenTour);

    const hasCompleted = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!hasCompleted) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        setCurrentStepIndex(-1);
      }, 1000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('retailos:open-tour', handleOpenTour);
      };
    }

    return () => {
      window.removeEventListener('retailos:open-tour', handleOpenTour);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      } else if (e.key === 'ArrowLeft') {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    }
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > -1) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleNavigateToSection = (route?: string) => {
    if (route) {
      navigate(route);
    }
    handleClose();
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-300 select-none">
      <div
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                RetailOS • جولة تدريبية تفاعلية
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                {isWelcome
                  ? 'مرحباً بك في نظام إدارة نشاطك التجاري'
                  : isFinish
                  ? 'تهانينا! أنت جاهز تماماً للبدء'
                  : ('الخطوة ' + (currentStepIndex + 1) + ' من ' + totalSteps + ' : ' + (activeStep ? activeStep.badge : ''))}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isWelcome && !isFinish && (
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {currentStepIndex + 1} / {totalSteps}
              </span>
            )}
            <button
              onClick={handleClose}
              title="إغلاق الجولة"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!isWelcome && !isFinish && (
          <div className="px-6 py-2.5 bg-slate-100/60 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800/60 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {TOUR_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ' + (
                    isActive
                      ? 'bg-primary-600 text-white shadow-sm shadow-primary-600/30'
                      : isPast
                      ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 hover:bg-primary-100'
                      : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{idx + 1}. {step.title.split(' ')[0]}</span>
                  {isPast && <Check className="w-3 h-3 text-emerald-500 mr-0.5" />}
                </button>
              );
            })}
          </div>
        )}

        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
          {isWelcome && (
            <div className="space-y-6 text-center py-2 animate-in fade-in duration-300">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-primary-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-primary-500/30 animate-pulse">
                <Sparkles className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  أهلاً بك في RetailOS السحابي! 🚀
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  نظام ذكي وشامل لإدارة مبيعات التجزئة والجملة، نقاط البيع السريعة، ضبط المخزون، متابعة ديون العملاء والموردين، وتقفيل درج الكاشير باحترافية تامة.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-right max-w-2xl mx-auto pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mt-0.5">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">سرعة فائقة في البيع</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      فواتير فورية بالباركود وطرق دفع نقدية وآجلة متوافقة مع الكاشير الحراري.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mt-0.5">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">ماسح الفواتير بالذكاء الاصطناعي</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      ارفع صور فواتير الموردين ليقرأها النظام ويستخرج الأصناف آلياً.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mt-0.5">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">انضباط مالي ودقيق</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      متابعة حية لرصيد درج الكاشير وكشوف حساب تفصيلية للديون والمصروفات.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentStepIndex(0)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>بدء الجولة الإرشادية (دقيقتين)</span>
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition"
                >
                  تخطي والبدء بالعمل مباشرة
                </button>
              </div>
            </div>
          )}

          {activeStep && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className={'p-6 rounded-3xl bg-gradient-to-r ' + activeStep.gradient + ' text-white shadow-xl shadow-black/10 relative overflow-hidden'}>
                <div className="absolute -left-10 -bottom-10 opacity-15 pointer-events-none">
                  <activeStep.icon className="w-48 h-48" />
                </div>
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner flex-shrink-0">
                      <activeStep.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-bold tracking-wide mb-1">
                        {activeStep.badge}
                      </div>
                      <h3 className="text-xl md:text-2xl font-black leading-tight">
                        {activeStep.title}
                      </h3>
                    </div>
                  </div>

                  {activeStep.route && (
                    <button
                      onClick={() => handleNavigateToSection(activeStep.route)}
                      className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition flex items-center gap-1.5 flex-shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>{activeStep.actionText || 'فتح هذا القسم'}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-primary-600" />
                    </button>
                  )}
                </div>
                <p className="text-xs md:text-sm text-white/90 mt-4 leading-relaxed font-medium relative z-10 max-w-2xl">
                  {activeStep.description}
                </p>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-500" />
                  <span>ماذا ستفعل في هذا القسم وكيف تستفيد منه؟</span>
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {activeStep.bulletPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex items-start gap-2.5"
                    >
                      <div className="w-5 h-5 rounded-lg bg-primary-100 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-xs">
                        ✓
                      </div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-200/80 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h6 className="text-xs font-black text-amber-900 dark:text-amber-200">نصيحة تدريبية للمستخدم:</h6>
                  <p className="text-xs text-amber-800/90 dark:text-amber-300/90 mt-0.5 font-medium leading-relaxed">
                    {activeStep.proTip}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isFinish && (
            <div className="space-y-6 text-center py-4 animate-in fade-in duration-300">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                  رائع جداً! أصبحت جاهزاً للعمل 🌟
                </h2>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  تعرفت الآن على الركائز الأساسية لنظام RetailOS. يمكنك بدء تسجيل المبيعات، ومراقبة المخزون، واستخدام ماسح الفواتير بالذكاء الاصطناعي بكل ثقة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-primary-50 dark:bg-primary-950/50 border border-primary-200 dark:border-primary-800 max-w-lg mx-auto text-xs text-primary-900 dark:text-primary-200 font-semibold leading-relaxed flex items-center gap-3 text-right">
                <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span>يمكنك إعادة تشغيل هذه الجولة التدريبية في أي وقت تريده بمجرد الضغط على زر </span>
                  <span className="font-bold text-primary-700 dark:text-primary-300 underline">"الجولة الإرشادية"</span>
                  <span> في الشريط العلوي للنظام.</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => handleNavigateToSection('/pos')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>انتقل لنقطة البيع (POS) وابدأ البيع</span>
                </button>
                <button
                  onClick={() => handleNavigateToSection('/')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition"
                >
                  الذهاب للوحة التحكم
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded text-primary-600 border-slate-300 dark:border-slate-700 focus:ring-primary-500"
            />
            <span>عدم إظهار هذه الجولة تلقائياً مرة أخرى</span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {!isWelcome && (
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>السابق</span>
              </button>
            )}

            {!isFinish ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-600/30 flex items-center gap-1.5 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>{isWelcome ? 'التالي: لوحة التحكم' : 'الخطوة التالية'}</span>
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleRestart}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إعادة من البداية</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
