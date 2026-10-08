import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  Sparkles,
  TreePine,
  ShieldCheck,
  Scissors,
} from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';
import { CATEGORIES, PRODUCTS } from '../data/products.ts';
import { ProductCard } from '../components/common/ProductCard.tsx';
import { formatPrice } from '../utils/formatters.ts';

export const HomePage: React.FC = () => {
  const { t, language, isRtl } = useTranslation();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  // Best sellers
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 8);
  const majlisFeature = PRODUCTS.find((p) => p.category === 'majlis') || PRODUCTS[0];

  // Parallax ref for quote section
  const quoteRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: quoteScrollProgress } = useScroll({
    target: quoteRef,
    offset: ['start end', 'end start'],
  });
  const quoteParallaxY = useTransform(quoteScrollProgress, [0, 1], ['-10%', '10%']);

  // Horizontal scroll for featured collections
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.scrollBy({ left: isRtl ? 350 : -350, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.scrollBy({ left: isRtl ? -350 : 350, behavior: 'smooth' });
    }
  };

  return (
    <div className="overflow-hidden">
      {/* ================= 1. FULL-SCREEN HERO ================= */}
      <section className="relative h-screen w-full flex items-end pb-20 sm:pb-24 overflow-hidden bg-[#1C1C1C] text-[#FAF7F2]">
        {/* Full-screen background image with subtle Ken Burns zoom */}
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2200&q=90"
            alt="Al Bait Al Ateeq Living Sanctuary"
            className="w-full h-full object-cover object-center opacity-70"
          />
          {/* Dark gradient overlay (from 0.65 bottom to transparent top) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/90 via-[#1C1C1C]/45 to-transparent" />
        </motion.div>

        {/* Hero Content with Masked Line-by-Line Reveal */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="max-w-3xl space-y-6">
            {/* Minimal kicker */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.3em] text-[#D4B483] font-light"
            >
              <span className="w-8 h-[1px] bg-[#B08D57]" />
              <span>{t.hero.badge}</span>
            </motion.div>

            {/* Masked Headline Reveal */}
            <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl font-light tracking-[-0.03em] leading-[1.08] text-[#FAF7F2]">
              {language === 'ar' ? (
                <>
                  صُنعت لترتقي بتفاصيل{' '}
                  <span className="text-brass-shimmer font-normal">{t.hero.highlightWord}</span>
                </>
              ) : (
                <>
                  Crafted for the Way You{' '}
                  <span className="text-brass-shimmer font-normal">{t.hero.highlightWord}</span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-sm sm:text-base text-[#FAF7F2]/80 max-w-xl font-light leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.65 }}
              className="pt-2 flex flex-wrap items-center gap-6"
            >
              <Link
                to="/shop"
                className="btn-quiet-luxury px-8 py-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2.5 border border-white/10"
              >
                <span>{t.hero.exploreCollection}</span>
                <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
              </Link>

              <Link
                to="/custom-order"
                className="group text-xs uppercase tracking-widest text-[#FAF7F2] hover:text-[#D4B483] flex items-center gap-2 transition-colors relative py-2"
              >
                <span>{t.hero.customOrderCta}</span>
                <span className="w-4 h-[1px] bg-current transition-all group-hover:w-8" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator with animated thin line */}
        <div
          className={`absolute bottom-8 ${
            isRtl ? 'left-8 sm:left-12' : 'right-8 sm:right-12'
          } hidden md:flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] text-[#FAF7F2]/60`}
        >
          <span>{t.hero.scrollPrompt}</span>
          <div className="w-12 h-[1px] bg-white/30 overflow-hidden relative">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-full h-full bg-[#D4B483]"
            />
          </div>
        </div>
      </section>

      {/* ================= 2. SHORT BRAND STATEMENT WITH GENEROUS WHITESPACE ================= */}
      <section className="py-28 sm:py-36 px-6 sm:px-8 max-w-4xl mx-auto text-center">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block mb-6">
          {language === 'ar' ? 'فلسفة التصميم' : 'Atelier Philosophy'}
        </span>
        <blockquote className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#1C1C1C] leading-[1.35] font-light">
          "{t.hero.statement}"
        </blockquote>
        <div className="hairline-brass-divider max-w-xs mx-auto mt-10" />
      </section>

      {/* ================= 3. ASYMMETRIC CATEGORY GRID ================= */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-28">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block mb-2">
              {language === 'ar' ? 'المجموعات الفاخرة' : 'The Collections'}
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
              {t.categories.title}
            </h2>
          </div>

          <Link
            to="/shop"
            className="group text-xs uppercase tracking-widest text-[#1C1C1C] hover:text-[#B08D57] flex items-center gap-2 font-medium transition-colors"
          >
            <span>{t.categories.viewAll}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Asymmetric Mixed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* Item 1: Large Span (Majlis) */}
          <div className="md:col-span-7 relative group overflow-hidden bg-[#E8DFD3]/40 aspect-[4/3] md:aspect-auto min-h-[380px]">
            <Link to="/shop?category=majlis" className="block w-full h-full">
              <img
                src={CATEGORIES[2].image}
                alt={CATEGORIES[2].nameEn}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/25 to-transparent flex flex-col justify-end p-8 text-[#FAF7F2]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B483] mb-1">
                  Signature Heritage
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light">
                  {language === 'ar' ? CATEGORIES[2].nameAr : CATEGORIES[2].nameEn}
                </h3>
                <p className="text-xs text-[#FAF7F2]/80 mt-1 max-w-md line-clamp-2 font-light">
                  {language === 'ar' ? CATEGORIES[2].descriptionAr : CATEGORIES[2].descriptionEn}
                </p>
              </div>
            </Link>
          </div>

          {/* Item 2: Vertical Stack (Living Room) */}
          <div className="md:col-span-5 relative group overflow-hidden bg-[#E8DFD3]/40 aspect-[4/5] min-h-[380px]">
            <Link to="/shop?category=living-room" className="block w-full h-full">
              <img
                src={CATEGORIES[0].image}
                alt={CATEGORIES[0].nameEn}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/25 to-transparent flex flex-col justify-end p-8 text-[#FAF7F2]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B483] mb-1">
                  Sculptural Living
                </span>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl font-light">
                  {language === 'ar' ? CATEGORIES[0].nameAr : CATEGORIES[0].nameEn}
                </h3>
              </div>
            </Link>
          </div>

          {/* Item 3: Bedroom */}
          <div className="md:col-span-4 relative group overflow-hidden bg-[#E8DFD3]/40 aspect-[4/5] min-h-[320px]">
            <Link to="/shop?category=bedroom" className="block w-full h-full">
              <img
                src={CATEGORIES[1].image}
                alt={CATEGORIES[1].nameEn}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/25 to-transparent flex flex-col justify-end p-6 text-[#FAF7F2]">
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-light">
                  {language === 'ar' ? CATEGORIES[1].nameAr : CATEGORIES[1].nameEn}
                </h3>
              </div>
            </Link>
          </div>

          {/* Item 4: Dining Tables */}
          <div className="md:col-span-4 relative group overflow-hidden bg-[#E8DFD3]/40 aspect-[4/5] min-h-[320px]">
            <Link to="/shop?category=dining" className="block w-full h-full">
              <img
                src={CATEGORIES[3].image}
                alt={CATEGORIES[3].nameEn}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/25 to-transparent flex flex-col justify-end p-6 text-[#FAF7F2]">
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-light">
                  {language === 'ar' ? CATEGORIES[3].nameAr : CATEGORIES[3].nameEn}
                </h3>
              </div>
            </Link>
          </div>

          {/* Item 5: Custom Commissions */}
          <div className="md:col-span-4 relative group overflow-hidden bg-[#E8DFD3]/40 aspect-[4/5] min-h-[320px]">
            <Link to="/custom-order" className="block w-full h-full">
              <img
                src={CATEGORIES[6].image}
                alt={CATEGORIES[6].nameEn}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/80 via-[#1C1C1C]/25 to-transparent flex flex-col justify-end p-6 text-[#FAF7F2]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B483] mb-1">
                  {language === 'ar' ? 'تفصيل ملكي' : 'Royal Atelier'}
                </span>
                <h3 className="font-serif-luxury text-xl sm:text-2xl font-light">
                  {language === 'ar' ? CATEGORIES[6].nameAr : CATEGORIES[6].nameEn}
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= 4. HORIZONTAL SCROLL: FEATURED PIECES ================= */}
      <section ref={horizontalSectionRef} className="grad-sand-ivory py-24 sm:py-32 border-y border-[#3B2A20]/8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Header & Horizontal Arrows */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block mb-2">
                {language === 'ar' ? 'تشكيلات مختارة' : 'Curated Selection'}
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
                {language === 'ar' ? 'إبداعات التصميم الحديث' : 'Featured Architectural Pieces'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={scrollLeft}
                className="w-11 h-11 border border-[#3B2A20]/20 hover:border-[#1C1C1C] flex items-center justify-center text-[#1C1C1C] transition-colors"
                aria-label="Previous"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={scrollRight}
                className="w-11 h-11 border border-[#3B2A20]/20 hover:border-[#1C1C1C] flex items-center justify-center text-[#1C1C1C] transition-colors"
                aria-label="Next"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrolling Track */}
          <div
            ref={horizontalScrollRef}
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          >
            {PRODUCTS.slice(0, 7).map((product) => (
              <div
                key={product.id}
                className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 snap-start"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 5. SPLIT-SCREEN: CRAFTSMANSHIP & ATELIER STORY ================= */}
      <section className="grad-ambient-loop py-24 sm:py-32 border-b border-[#3B2A20]/8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Large Image Column */}
            <div className="lg:col-span-7 relative">
              <div className="aspect-[4/3] overflow-hidden bg-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=85"
                  alt="Al Bait Al Ateeq Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block p-6 bg-[#1C1C1C] text-[#FAF7F2] max-w-xs border border-white/10 shadow-xl">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B483] block mb-1">
                  Solid Hardwoods
                </span>
                <p className="font-serif-luxury text-base font-light">
                  {language === 'ar'
                    ? 'أخشاب زان وبلوط طبيعية 100% معالجة خصيصاً لمناخ الخليج العربي.'
                    : 'Kiln-dried European beech & oak seasoned for generational Gulf endurance.'}
                </p>
              </div>
            </div>

            {/* Narrative Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block">
                {t.customSection.tag}
              </span>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] leading-tight">
                {t.customSection.title}
              </h2>

              <p className="text-sm text-[#3B2A20]/80 leading-relaxed font-light">
                {t.customSection.description}
              </p>

              <div className="space-y-4 pt-2 border-t border-[#3B2A20]/10">
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2 shrink-0" />
                  <p className="text-xs text-[#1C1C1C] leading-relaxed">
                    {t.customSection.feature1}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2 shrink-0" />
                  <p className="text-xs text-[#1C1C1C] leading-relaxed">
                    {t.customSection.feature2}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B08D57] mt-2 shrink-0" />
                  <p className="text-xs text-[#1C1C1C] leading-relaxed">
                    {t.customSection.feature3}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/custom-order"
                  className="btn-quiet-luxury inline-flex items-center gap-2.5 px-8 py-4 text-xs uppercase tracking-widest font-semibold"
                >
                  <span>{t.customSection.cta}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 6. BEST SELLERS: BORDERLESS EDITORIAL GRID ================= */}
      <section className="py-24 sm:py-32 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block mb-2">
              {language === 'ar' ? 'الأكثر تميزاً' : 'The Icons'}
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
              {t.bestSellers.title}
            </h2>
            <p className="text-xs text-stone-500 mt-1 max-w-md">
              {t.bestSellers.subtitle}
            </p>
          </div>

          <Link
            to="/shop"
            className="group text-xs uppercase tracking-widest text-[#1C1C1C] hover:text-[#B08D57] flex items-center gap-2 font-medium transition-colors"
          >
            <span>{t.categories.viewAll}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Clean Borderless Grid with Image Crossfade */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ================= 7. FULL-BLEED PARALLAX CUSTOMER QUOTE ================= */}
      <section
        ref={quoteRef}
        className="relative h-[480px] sm:h-[540px] flex items-center justify-center overflow-hidden bg-[#1C1C1C] text-[#FAF7F2]"
      >
        <motion.div style={{ y: quoteParallaxY }} className="absolute inset-0 z-0 h-[120%] -top-[10%]">
          <img
            src="https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=2200&q=85"
            alt="Palace Interior"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[#1C1C1C]/65" />
        </motion.div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center space-y-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4B483] font-semibold block">
            {language === 'ar' ? 'أصداء عملائنا' : 'Client Reflection'}
          </span>
          <blockquote className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-[#FAF7F2] font-light leading-relaxed">
            "{language === 'ar'
              ? 'المجلس الملكي المفصل من مفروشات البيت العتيق أضفى هيبة وفخامة استثنائية لفيلا العائلة. دقة الخشب ونقوشه تبيض الوجه أمام الضيوف.'
              : 'The royal Majlis commissioned from Al Bait Al Ateeq became the soul of our private villa in Abu Dhabi. Every seam and timber joint speaks of true dignity.'}"
          </blockquote>
          <div className="pt-2 text-xs text-[#D4B483] uppercase tracking-widest font-light">
            — {language === 'ar' ? 'الشيخ سلطان النعيمي، أبوظبي' : 'Sheikh Sultan Al Nuaimi, Abu Dhabi'}
          </div>
        </div>
      </section>

      {/* ================= 8. SIGNATURE ARABIC MAJLIS SPOTLIGHT (ROSE-SAND GRADIENT) ================= */}
      <section className="grad-rose-sand py-24 sm:py-32 border-b border-[#3B2A20]/8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story & Cultural Context */}
            <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block">
                {t.majlisSection.tag}
              </span>

              <h2 className="font-serif-luxury text-3xl sm:text-4xl lg:text-5xl font-light text-[#1C1C1C] leading-tight">
                {t.majlisSection.title}
              </h2>

              <p className="text-sm text-[#3B2A20]/80 leading-relaxed font-light">
                {t.majlisSection.description}
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  to="/shop?category=majlis"
                  className="btn-quiet-luxury inline-flex items-center gap-2.5 px-8 py-4 text-xs uppercase tracking-widest font-semibold"
                >
                  <span>{t.majlisSection.cta}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
                </Link>

                <Link
                  to="/contact"
                  className="text-xs uppercase tracking-widest text-[#1C1C1C] hover:text-[#B08D57] flex items-center gap-2 font-medium px-4 py-4"
                >
                  <span>{t.majlisSection.consultationCta}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Visual Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 relative aspect-[4/3] bg-stone-200 overflow-hidden">
              <img
                src={majlisFeature.images[0]}
                alt="Al Bait Al Ateeq Majlis"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1C1C]/40 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= 9. MINIMAL NEWSLETTER SECTION ================= */}
      <section className="py-24 sm:py-32 max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-8">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block mb-3">
            {language === 'ar' ? 'دعوة خاصة' : 'Private Salon'}
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
            {t.newsletter.title}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mt-2 font-light">
            {t.newsletter.subtitle}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="max-w-md mx-auto flex gap-3 border-b border-[#1C1C1C]/30 pb-2 focus-within:border-[#B08D57] transition-colors"
        >
          <input
            type="email"
            placeholder={t.newsletter.placeholder}
            required
            className="flex-1 bg-transparent text-xs text-[#1C1C1C] placeholder:text-stone-400 outline-none"
          />
          <button
            type="submit"
            className="text-xs uppercase tracking-widest text-[#1C1C1C] hover:text-[#B08D57] font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>{t.newsletter.subscribe}</span>
            <ArrowIcon className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[11px] text-stone-400 font-light">
          {t.newsletter.privacy}
        </p>
      </section>
    </div>
  );
};
