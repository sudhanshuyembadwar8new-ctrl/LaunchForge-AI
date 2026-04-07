'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

const TOAST_ICONS: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-[#34D399]" />,
  error:   <XCircle className="w-4 h-4 text-[#F87171]" />,
  info:    <Info className="w-4 h-4 text-[#7C6FF7]" />,
};

const TOAST_STYLES: Record<ToastType, { bg: string; border: string }> = {
  success: { bg: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' },
  error:   { bg: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)' },
  info:    { bg: 'rgba(124,111,247,0.06)', border: '1px solid rgba(124,111,247,0.15)' },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = crypto.randomUUID();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      {/* Toast container - top right */}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[360px]">
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 100, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] text-[--text-primary] backdrop-blur-xl shadow-lg"
              style={{
                background: TOAST_STYLES[t.type].bg,
                border: TOAST_STYLES[t.type].border,
                backdropFilter: 'blur(24px)',
              }}
            >
              {TOAST_ICONS[t.type]}
              <span className="flex-1 font-medium">{t.message}</span>
              <button
                onClick={() => removeToast(t.id)}
                className="text-[--text-muted] hover:text-[--text-primary] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
