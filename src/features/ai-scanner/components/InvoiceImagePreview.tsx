import React, { useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, RefreshCw, Eye, EyeOff } from 'lucide-react';

interface InvoiceImagePreviewProps {
  file?: File | null;
  remoteUrl?: string | null;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const InvoiceImagePreview: React.FC<InvoiceImagePreviewProps> = ({
  file,
  remoteUrl,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setObjectUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setObjectUrl(null);
    }
  }, [file]);

  const displayUrl = objectUrl || remoteUrl;
  const isPdf = file?.type === 'application/pdf' || displayUrl?.endsWith('.pdf');

  if (!displayUrl) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-700/80 overflow-hidden shadow-lg">
      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300">معاينة الفاتورة الأصلية</span>
          {file && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800">
              {file.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            title="تكبير"
            onClick={() => setScale((s) => Math.min(s + 0.25, 3))}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="تصغير"
            onClick={() => setScale((s) => Math.max(s - 0.25, 0.5))}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="تدوير"
            onClick={() => setRotation((r) => (r + 90) % 360)}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            title="إعادة ضبط"
            onClick={() => {
              setScale(1);
              setRotation(0);
            }}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {onToggleCollapse && (
            <button
              type="button"
              title={isCollapsed ? 'إظهار المعاينة' : 'إخفاء المعاينة'}
              onClick={onToggleCollapse}
              className="p-1 ml-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              {isCollapsed ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Viewer Area */}
      {!isCollapsed && (
        <div className="flex-1 relative overflow-auto p-4 flex items-center justify-center min-h-[350px] bg-slate-950/60">
          {isPdf ? (
            <iframe
              src={displayUrl}
              className="w-full h-full min-h-[450px] rounded-lg border-0"
              title="PDF Invoice"
            />
          ) : (
            <div
              className="transition-transform duration-150 ease-out origin-center cursor-grab active:cursor-grabbing"
              style={{
                transform: 'scale(' + scale + ') rotate(' + rotation + 'deg)',
              }}
            >
              <img
                src={displayUrl}
                alt="Original Invoice"
                className="max-h-[600px] w-auto object-contain rounded-lg shadow-2xl select-none"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
