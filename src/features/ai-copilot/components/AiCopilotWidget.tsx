import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  X, 
  Send, 
  Trash2, 
  Minimize2, 
  Maximize2, 
  Bot, 
  User, 
  Copy, 
  Check, 
  FileSpreadsheet,
  History,
  PlusCircle,
  Zap
} from 'lucide-react';
import { sendCopilotMessage, ChatMessage } from '../api/copilotApi';
import { DownloadCatalogCard } from './DownloadCatalogCard';
import { ProductDisambiguationCard } from './ProductDisambiguationCard';
import { ProductActionCard } from './ProductActionCard';
import toast from 'react-hot-toast';

const SUGGESTED_PROMPTS = [
  { 
    text: '📁 جهز كتالوج إكسيل (منظفات، أوراق، سجائر)', 
    query: 'جهز لي ملف إكسيل يحتوي على أصناف مقترحة لأقسام المنظفات والمساحيق والسجائر مع أسعار تقريبية' 
  },
  { 
    text: '🔍 ما هو تاريخ وأداء منتج في متجري؟', 
    query: 'ما هو تاريخ وأداء وحركات صنف في متجري بالتفصيل؟' 
  },
  { 
    text: '➕ أضف صنف صابون ديتول للمخزون', 
    query: 'أضف صنف جديد باسم صابون سائل ديتول بسعر شراء 20 وسعر بيع 30 والكمية 40 في قسم المنظفات' 
  },
  { 
    text: '📊 لخص لي مبيعات اليوم وأداء المتجر', 
    query: 'لخص لي مبيعات اليوم وأداء المتجر بناءً على الأرقام الحالية' 
  },
];

export const AiCopilotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'مرحباً بك! 👋 أنا **مساعد ريتيل الذكي** (RetailOS Copilot).\nجاهز لمساعدتك في استخراج وتجهيز كتالوجات المنتجات كملفات Excel، تتبع تاريخ وحركة أي صنف بدقة، وتسجيل الأصناف الجديدة بأمان. كيف أستطيع مساعدتك اليوم؟'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeModel, setActiveModel] = useState<string>('OpenCode Zen (mimo-v2.5-free)');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const pageContext = location.pathname.replace('/', '') || 'dashboard';
      const response = await sendCopilotMessage({
        messages: newMessages.filter(m => m.role !== 'system').map(m => ({
          role: m.role,
          content: m.content
        })),
        pageContext
      });

      if (response.reply) {
        setMessages([
          ...newMessages, 
          { 
            role: 'assistant', 
            content: response.reply,
            actions: response.actions
          }
        ]);
        if (response.model) setActiveModel(response.model);
      }
    } catch (err: unknown) {
      toast.error('تعذر التواصل مع المساعد الذكي حالياً');
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '⚠️ عذراً، واجهت مشكلة في الاتصال بالخدمة. يرجى المحاولة بعد لحظات.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success('تم نسخ النص');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'تم بدء محادثة جديدة! 🚀 كيف أستطيع مساعدتك في متجرك الآن؟'
      }
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white rounded-full shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all duration-300 group focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
          title="مساعد ريتيل الذكي (AI Copilot)"
          aria-label="افتح المساعد الذكي"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
            </span>
          </div>
          <span className="font-semibold text-sm tracking-wide">المساعد الذكي</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-mono text-emerald-100 uppercase">AI</span>
        </button>
      )}

      {/* Floating Chat Modal / Widget */}
      {isOpen && (
        <div
          className={`fixed left-6 bottom-6 z-50 w-[92vw] sm:w-[440px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-14' : 'h-[600px] max-h-[88vh]'
          }`}
          dir="rtl"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm leading-tight text-white">مساعد ريتيل الذكي</h3>
                  <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    نشط
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[220px]">
                  {activeModel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={clearChat}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="مسح المحادثة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title={isMinimized ? 'تكبير' : 'تصغير'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white hover:bg-rose-600/80 rounded-lg transition-colors"
                title="إإغلاق"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-start flex-row-reverse' : 'justify-start'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        msg.role === 'user'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-sm'
                      }`}
                    >
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div className="group relative max-w-[85%]">
                      <div
                        className={`p-3.5 rounded-2xl text-xs sm:text-[13px] leading-relaxed shadow-sm whitespace-pre-line ${
                          msg.role === 'user'
                            ? 'bg-emerald-600 text-white rounded-tl-sm'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tr-sm'
                        }`}
                      >
                        {msg.content}

                        {/* Render Copilot Action Cards if any */}
                        {msg.actions && msg.actions.map((action, aIdx) => {
                          if (action.type === 'DOWNLOAD_CATALOG') {
                            return <DownloadCatalogCard key={aIdx} action={action} />;
                          }
                          if (action.type === 'DISAMBIGUATE_PRODUCT') {
                            return (
                              <ProductDisambiguationCard 
                                key={aIdx} 
                                action={action} 
                                onSelectVariant={(variantPrompt) => handleSend(variantPrompt)} 
                              />
                            );
                          }
                          if (action.type === 'CREATE_PRODUCT') {
                            return <ProductActionCard key={aIdx} action={action} />;
                          }
                          return null;
                        })}
                      </div>

                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          className="opacity-0 group-hover:opacity-100 absolute -bottom-4 left-2 p-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded shadow hover:bg-slate-200 transition-opacity"
                          title="نسخ الرد"
                        >
                          {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-2.5 items-center text-slate-400 text-xs py-1">
                    <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 animate-bounce" />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping"></span>
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                      <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                      <span className="text-[11px] text-slate-400 mr-1 font-medium">جاري التحليل والكتابة...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts Chips */}
              {messages.length <= 3 && (
                <div className="px-3 py-2 bg-slate-100/70 dark:bg-slate-800/40 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-1.5 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-500" />
                    عمليات ذكية سريعة:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(prompt.query)}
                        disabled={loading}
                        className="text-[11px] px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors text-right truncate max-w-full"
                      >
                        {prompt.text}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Input Bar */}
              <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-end gap-2 bg-slate-50 dark:bg-slate-800/80 rounded-xl p-1.5 border border-slate-200 dark:border-slate-700 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="اطلب ملف إكسيل، اسأل عن صنف، أو سجل منتجاً..."
                    className="flex-1 bg-transparent border-0 resize-none text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none max-h-24 py-1.5 px-2"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || loading}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded-lg transition-all shrink-0 active:scale-95"
                    title="إرسال"
                  >
                    <Send className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-slate-400">
                  <span>Enter للإرسال • Shift+Enter لسطر جديد</span>
                  <span>RetailOS Copilot 2.0</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
