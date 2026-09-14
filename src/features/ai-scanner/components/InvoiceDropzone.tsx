import React, { useRef, useState } from 'react';
import { UploadCloud, Camera, Sparkles, AlertCircle, FileText } from 'lucide-react';

interface InvoiceDropzoneProps {
  onFileSelect: (file: File) => void;
  isScanning: boolean;
}

export const InvoiceDropzone: React.FC<InvoiceDropzoneProps> = ({ onFileSelect, isScanning }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setError('يرجى اختيار صورة صالحة (JPG, PNG, WebP) أو مستند PDF.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('حجم الملف كبير جداً. الحد الأقصى المسموح به هو 10 ميجابايت.');
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={
          'relative overflow-hidden rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ' +
          (isDragOver
            ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/20 shadow-lg shadow-violet-500/10'
            : 'border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-850 hover:border-violet-400')
        }
      >
        {isScanning ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-xl shadow-violet-500/30 animate-pulse">
                <Sparkles className="w-10 h-10 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-40 blur-lg animate-pulse" />
            </div>
            <div className="space-y-1 text-center">
              <h4 className="text-base font-black text-slate-900 dark:text-white">
                جاري مسح وتحليل الفاتورة بالذكاء الاصطناعي...
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                يقوم محرك Google Gemini Vision باستخراج اسم المورد، رقم الفاتورة، الأصناف، الأسعار، ومطابقتها مع قاعدة بيانات المتجر.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400">
              <UploadCloud className="w-8 h-8 stroke-[1.8]" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                اسحب وأفلت صورة الفاتورة هنا، أو اختر ملفاً
              </h4>
              <p className="text-xs text-slate-400">
                يدعم الفواتير الورقية والمطبوعة والمكتوبة بخط اليد باللغتين العربية والإنجليزية (JPG, PNG, WebP, PDF حتى 10MB)
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateAndProcess(e.target.files[0]);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-extrabold shadow-md shadow-violet-600/20 hover:shadow-violet-600/30 transition transform active:scale-98"
              >
                <FileText className="w-4 h-4" />
                <span>اختيار ملف من الجهاز</span>
              </button>

              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateAndProcess(e.target.files[0]);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-bold transition shadow-sm"
              >
                <Camera className="w-4 h-4 text-violet-600" />
                <span>التقاط صورة بكاميرا الهاتف</span>
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-rose-600 text-xs font-bold pt-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
