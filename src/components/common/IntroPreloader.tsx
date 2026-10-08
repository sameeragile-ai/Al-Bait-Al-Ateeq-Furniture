import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../../i18n/index.ts';

export const IntroPreloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const { language } = useTranslation();

  useEffect(() => {
    // Only show once per tab session to avoid disrupting rapid navigation
    const hasSeenIntro = sessionStorage.getItem('al_bait_intro_seen');
    if (hasSeenIntro) {
      setIsVisible(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('al_bait_intro_seen', 'true');
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ y: '-100%', transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1C1C1C] text-[#FAF7F2] overflow-hidden"
        >
          <div className="text-center space-y-3 px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-1.5"
            >
              <span className="font-serif-luxury text-3xl sm:text-5xl font-bold tracking-tight block">
                Al Bait Al Ateeq
              </span>
              <span className="text-xs sm:text-sm text-[#D4B483] font-light tracking-[0.25em] uppercase block">
                مفروشات البيت العتيق
              </span>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#B08D57] to-transparent mx-auto"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
