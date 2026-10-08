import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'motion/react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';

function AnimatedCounter({ to, duration = 1.8 }: { to: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const stepTime = Math.abs(Math.floor((duration * 1000) / to));
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= to) clearInterval(timer);
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, to, duration]);

  return <span ref={ref}>{count}</span>;
}

export const AboutPage: React.FC = () => {
  const { t, language, isRtl } = useTranslation();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-24">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block">
          {t.about.badge}
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-6xl font-light text-[#1C1C1C] leading-tight">
          {t.about.title}
        </h1>
        <p className="text-sm sm:text-base text-[#3B2A20]/80 font-light leading-relaxed">
          {t.brand.tagline}
        </p>
      </div>

      {/* Narrative Section with Overlapping Photography */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6 text-sm text-[#3B2A20]/80 font-light leading-relaxed">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block">
            {language === 'ar' ? 'أصالة التأسيس' : 'Founding Narrative'}
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1C1C] font-light">
            {t.about.storyTitle}
          </h2>
          <p>{t.about.storyP1}</p>
          <p>{t.about.storyP2}</p>
          <p>{t.about.storyP3}</p>
        </div>

        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <div className="aspect-[3/4] overflow-hidden bg-stone-200">
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"
              alt="Artisan Timber"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="aspect-[3/4] overflow-hidden bg-stone-200 translate-y-8">
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
              alt="Hand Carved Majlis"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Animated Counter Stats Section */}
      <div className="grad-sand-ivory py-16 px-8 border-y border-[#3B2A20]/10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="space-y-1">
          <span className="font-serif-luxury text-5xl sm:text-6xl text-[#1C1C1C] font-light block">
            <AnimatedCounter to={15} />+
          </span>
          <span className="text-xs uppercase tracking-widest text-[#8C6B3F] font-medium">
            {t.hero.statsExperience}
          </span>
        </div>
        <div className="space-y-1">
          <span className="font-serif-luxury text-5xl sm:text-6xl text-[#1C1C1C] font-light block">
            <AnimatedCounter to={850} duration={2} />+
          </span>
          <span className="text-xs uppercase tracking-widest text-[#8C6B3F] font-medium">
            {t.hero.statsProjects}
          </span>
        </div>
        <div className="space-y-1">
          <span className="font-serif-luxury text-5xl sm:text-6xl text-[#1C1C1C] font-light block">
            <AnimatedCounter to={100} duration={1.5} />%
          </span>
          <span className="text-xs uppercase tracking-widest text-[#8C6B3F] font-medium">
            Solid Kiln-Dried Hardwoods
          </span>
        </div>
      </div>

      {/* Four Quality Pillars */}
      <div className="space-y-10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block mb-2">
            Standards of Distinction
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1C1C] font-light">
            {t.about.valuesTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="border-t border-[#3B2A20]/10 pt-4 space-y-2">
            <span className="font-serif-luxury text-2xl font-light text-[#B08D57]">01</span>
            <h3 className="font-serif-luxury text-lg text-[#1C1C1C] font-medium">{t.about.value1Title}</h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">{t.about.value1Desc}</p>
          </div>
          <div className="border-t border-[#3B2A20]/10 pt-4 space-y-2">
            <span className="font-serif-luxury text-2xl font-light text-[#B08D57]">02</span>
            <h3 className="font-serif-luxury text-lg text-[#1C1C1C] font-medium">{t.about.value2Title}</h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">{t.about.value2Desc}</p>
          </div>
          <div className="border-t border-[#3B2A20]/10 pt-4 space-y-2">
            <span className="font-serif-luxury text-2xl font-light text-[#B08D57]">03</span>
            <h3 className="font-serif-luxury text-lg text-[#1C1C1C] font-medium">{t.about.value3Title}</h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">{t.about.value3Desc}</p>
          </div>
          <div className="border-t border-[#3B2A20]/10 pt-4 space-y-2">
            <span className="font-serif-luxury text-2xl font-light text-[#B08D57]">04</span>
            <h3 className="font-serif-luxury text-lg text-[#1C1C1C] font-medium">{t.about.value4Title}</h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">{t.about.value4Desc}</p>
          </div>
        </div>
      </div>

      {/* Showroom CTA */}
      <div className="text-center pt-8 border-t border-[#3B2A20]/10">
        <Link
          to="/contact"
          className="btn-quiet-luxury inline-flex items-center gap-2.5 px-9 py-4 text-xs uppercase tracking-widest font-semibold"
        >
          <span>{language === 'ar' ? 'حجز موعد زيارة المعرض' : 'Schedule Showroom Visit'}</span>
          <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
        </Link>
      </div>
    </div>
  );
};
