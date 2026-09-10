import React, { useState, useRef, useEffect } from 'react';
import { Search, ScanBarcode, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProductByBarcode } from '../api/usePosQueries';
import type { PosProduct } from '../types/pos.types';

interface BarcodeScannerInputProps {
  onProductFound: (product: PosProduct) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export const BarcodeScannerInput: React.FC<BarcodeScannerInputProps> = ({
  onProductFound,
  searchQuery,
  onSearchChange,
  inputRef: externalRef,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const internalRef = useRef<HTMLInputElement>(null);
  const activeRef = externalRef || internalRef;

  // Auto focus input on mount
  useEffect(() => {
    activeRef.current?.focus();
  }, [activeRef]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const code = searchQuery.trim();
      if (!code) return;

      setIsScanning(true);
      try {
        const product = await fetchProductByBarcode(code);
        if (product) {
          onProductFound(product);
          onSearchChange(''); // Clear input for next barcode
        } else {
          toast.error(`لم يتم العثور على صنف بالباركود: ${code}`, {
            duration: 2500,
          });
        }
      } catch (err) {
        console.error('Barcode scan error', err);
        toast.error('خطأ أثناء قراءة الباركود');
      } finally {
        setIsScanning(false);
      }
    }
  };

  return (
    <div className="relative flex-1">
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
        {isScanning ? (
          <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
        ) : (
          <ScanBarcode className="w-5 h-5 text-emerald-600" />
        )}
      </div>

      <input
        ref={activeRef}
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="امسح الباركود بجهاز المسح أو ابحث بالاسم / الكود (F2)..."
        className="w-full pr-11 pl-10 py-3 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-base shadow-sm transition-all duration-200"
        autoComplete="off"
      />

      {searchQuery && (
        <button
          type="button"
          onClick={() => {
            onSearchChange('');
            activeRef.current?.focus();
          }}
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
