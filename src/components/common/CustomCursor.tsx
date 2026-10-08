import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useTranslation } from '../../i18n/index.ts';

export const CustomCursor: React.FC = () => {
  const { language } = useTranslation();
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorType, setCursorType] = useState<'default' | 'view'>('default');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices and if user does not prefer reduced motion
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      const viewElement = target?.closest('[data-cursor="view"]');
      if (viewElement) {
        setCursorType('view');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-50 rounded-full flex items-center justify-center mix-blend-difference"
      animate={{
        x: pos.x - (cursorType === 'view' ? 36 : 6),
        y: pos.y - (cursorType === 'view' ? 36 : 6),
        width: cursorType === 'view' ? 72 : 12,
        height: cursorType === 'view' ? 72 : 12,
        backgroundColor: cursorType === 'view' ? 'rgba(250, 247, 242, 0.95)' : '#B08D57',
      }}
      transition={{
        type: 'spring',
        damping: 28,
        stiffness: 350,
        mass: 0.4,
      }}
    >
      {cursorType === 'view' && (
        <span className="text-[10px] font-bold tracking-widest uppercase text-[#1C1C1C]">
          {language === 'ar' ? 'عرض' : 'View'}
        </span>
      )}
    </motion.div>
  );
};
