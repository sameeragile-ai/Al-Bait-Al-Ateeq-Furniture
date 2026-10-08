import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';

export const NotFoundPage: React.FC = () => {
  const { t, language, isRtl } = useTranslation();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="pt-36 pb-32 max-w-2xl mx-auto px-6 text-center space-y-6">
      <span className="font-serif-luxury text-7xl sm:text-8xl text-[#B08D57] font-light block">
        404
      </span>
      <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
        {t.notFound.title}
      </h1>
      <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto font-light leading-relaxed">
        {t.notFound.subtitle}
      </p>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <Link
          to="/"
          className="btn-quiet-luxury px-8 py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
        >
          <span>{t.notFound.backHome}</span>
          <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
        </Link>
        <Link
          to="/shop"
          className="px-8 py-3.5 border border-[#1C1C1C]/20 text-[#1C1C1C] hover:border-[#1C1C1C] text-xs uppercase tracking-widest font-semibold transition-colors"
        >
          {t.notFound.browseShop}
        </Link>
      </div>
    </div>
  );
};
