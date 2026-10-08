import React from 'react';
import { useStore } from '../../store/useStore.ts';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, language } = useStore();

  return (
    <div
      className={`fixed z-50 bottom-6 ${
        language === 'ar' ? 'left-6' : 'right-6'
      } flex flex-col gap-2.5 max-w-sm w-full pointer-events-none`}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const title = language === 'ar' ? toast.titleAr : toast.titleEn;
          const message = language === 'ar' ? toast.messageAr : toast.messageEn;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex items-start gap-3 p-4 bg-[#1C1C1C] text-[#FAF7F2] shadow-xl border border-[#B08D57]/40"
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#D4B483]" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-[#D4B483]" />}
                {toast.type === 'warning' && <AlertCircle className="w-4 h-4 text-amber-400" />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-serif-luxury text-base text-[#FAF7F2] font-medium leading-none">
                  {title}
                </p>
                {message && (
                  <p className="text-xs text-[#FAF7F2]/75 mt-1 font-light leading-relaxed">
                    {message}
                  </p>
                )}
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#FAF7F2]/40 hover:text-[#FAF7F2] p-0.5 transition-colors"
                aria-label="Close"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
