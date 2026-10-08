import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../../store/useStore.ts';

export const WhatsAppFloating: React.FC = () => {
  const { language } = useStore();

  const phone = '971500000000';
  const defaultMessage =
    language === 'ar'
      ? 'مرحباً مفروشات البيت العتيق، أود الاستفسار عن تصاميمكم الفاخرة وخيارات التفصيل.'
      : 'Hello Al Bait Al Ateeq Furniture, I would like to inquire about your luxury collections and bespoke orders.';

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      className={`fixed z-40 bottom-6 ${
        language === 'ar' ? 'right-6' : 'left-6'
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center gap-3 bg-[#1C1C1C] text-[#FAF7F2] pl-3.5 pr-4 py-2.5 rounded-full border border-[#B08D57]/40 shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
        <span className="text-[11px] uppercase tracking-wider font-medium text-[#FAF7F2]/90 group-hover:text-[#D4B483] transition-colors">
          {language === 'ar' ? 'استشارة واتساب' : 'WhatsApp Concierge'}
        </span>
        <MessageCircle className="w-4 h-4 text-[#D4B483]" />
      </a>
    </div>
  );
};
