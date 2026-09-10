import { useEffect } from 'react';

interface PosShortcutsProps {
  onFocusSearch: () => void;
  onOpenCheckout: () => void;
  onCloseModals: () => void;
  canCheckout: boolean;
}

export function usePosShortcuts({
  onFocusSearch,
  onOpenCheckout,
  onCloseModals,
  canCheckout,
}: PosShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F2 or Ctrl+K -> Focus Search
      if (e.key === 'F2' || ((e.ctrlKey || e.metaKey) && e.key === 'k')) {
        e.preventDefault();
        onFocusSearch();
        return;
      }

      // F9 -> Open Checkout
      if (e.key === 'F9') {
        e.preventDefault();
        if (canCheckout) {
          onOpenCheckout();
        }
        return;
      }

      // Escape -> Close Modals
      if (e.key === 'Escape') {
        onCloseModals();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onFocusSearch, onOpenCheckout, onCloseModals, canCheckout]);
}
