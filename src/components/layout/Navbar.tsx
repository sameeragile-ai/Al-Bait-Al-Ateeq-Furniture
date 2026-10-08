import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Heart,
  ShoppingBag,
  Globe,
  ChevronDown,
  X,
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
} from 'lucide-react';
import { useStore } from '../../store/useStore.ts';
import { useTranslation } from '../../i18n/index.ts';
import { CATEGORIES, PRODUCTS } from '../../data/products.ts';
import { formatPrice } from '../../utils/formatters.ts';

export const Navbar: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const { cart, wishlist, setCartOpen, toggleLanguage } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll states for hide-on-scroll-down & shrink
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // Mega menu, search, mobile menu
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Cart item count
  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  // Determine if on homepage top where navbar can be transparent over hero
  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !isScrolled;

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if scrolled past threshold
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide on scroll down, show on scroll up
      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY.current && currentScrollY - lastScrollY.current > 10) {
          setIsVisible(false);
          setMegaMenuOpen(false);
        } else if (lastScrollY.current - currentScrollY > 10) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMegaMenuOpen(false);
    setSearchOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Focus search input
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 120);
    }
  }, [searchOpen]);

  // Search live results
  const searchResults = searchQuery.trim()
    ? PRODUCTS.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.nameEn.toLowerCase().includes(q) ||
          p.nameAr.toLowerCase().includes(q) ||
          p.materialEn.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const activeCategory = CATEGORIES[activeCategoryIndex] || CATEGORIES[0];
  const featuredProductForCategory = PRODUCTS.find((p) => p.category === activeCategory.id) || PRODUCTS[0];

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* 1. Thin Announcement Bar (Collapses on scroll) */}
        <div
          className={`overflow-hidden transition-all duration-500 grad-walnut-charcoal text-[#FAF7F2] ${
            isScrolled ? 'max-h-0 opacity-0' : 'max-h-9 opacity-100'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-center text-[11px] uppercase tracking-[0.2em] font-light">
            <span className="truncate">{t.announcement.banner}</span>
          </div>
        </div>

        {/* 2. Main Navbar Bar */}
        <nav
          className={`w-full transition-all duration-500 ${
            isTransparent
              ? 'bg-transparent text-[#FAF7F2] py-6 sm:py-8'
              : 'grad-sand-ivory text-[#1C1C1C] py-3.5 sm:py-4 shadow-sm border-b border-[#3B2A20]/8'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Left Column: Nav Links (Desktop) / Mobile Toggle */}
              <div className="flex items-center gap-8 flex-1">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-1.5 focus:outline-none transition-colors"
                  aria-label="Toggle Navigation"
                >
                  <div className="w-6 h-5 flex flex-col justify-between">
                    <span
                      className={`h-[1.5px] w-6 transition-all duration-300 ${
                        isTransparent ? 'bg-[#FAF7F2]' : 'bg-[#1C1C1C]'
                      } ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
                    />
                    <span
                      className={`h-[1.5px] w-4 transition-all duration-300 ${
                        isTransparent ? 'bg-[#FAF7F2]' : 'bg-[#1C1C1C]'
                      } ${mobileMenuOpen ? 'opacity-0' : ''}`}
                    />
                    <span
                      className={`h-[1.5px] w-6 transition-all duration-300 ${
                        isTransparent ? 'bg-[#FAF7F2]' : 'bg-[#1C1C1C]'
                      } ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
                    />
                  </div>
                </button>

                {/* Desktop Links with Drawing Underline */}
                <div className="hidden lg:flex items-center gap-8 text-[13px] tracking-wide uppercase font-medium">
                  {/* Shop Trigger (Mega Menu) */}
                  <div
                    className="relative"
                    onMouseEnter={() => setMegaMenuOpen(true)}
                  >
                    <button
                      onClick={() => navigate('/shop')}
                      className={`group flex items-center gap-1.5 py-1.5 transition-colors relative ${
                        isTransparent
                          ? 'hover:text-[#D4B483]'
                          : 'hover:text-[#B08D57]'
                      }`}
                    >
                      <span>{t.nav.shop}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-300 ${
                          megaMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                      {/* Animated underline */}
                      <span
                        className={`absolute bottom-0 inset-x-0 h-[1px] bg-[#B08D57] transition-transform duration-300 origin-left ${
                          isRtl ? 'origin-right' : 'origin-left'
                        } ${megaMenuOpen ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                      />
                    </button>
                  </div>

                  {/* Majlis Spotlight Link */}
                  <Link
                    to="/shop?category=majlis"
                    className={`group relative py-1.5 transition-colors ${
                      isTransparent
                        ? 'hover:text-[#D4B483]'
                        : 'hover:text-[#B08D57]'
                    }`}
                  >
                    <span>{t.nav.majlis}</span>
                    <span
                      className={`absolute bottom-0 inset-x-0 h-[1px] bg-[#B08D57] transition-transform duration-300 ${
                        isRtl ? 'origin-right' : 'origin-left'
                      } scale-x-0 group-hover:scale-x-100`}
                    />
                  </Link>

                  {/* Custom Orders */}
                  <Link
                    to="/custom-order"
                    className={`group relative py-1.5 transition-colors ${
                      isTransparent
                        ? 'hover:text-[#D4B483]'
                        : 'hover:text-[#B08D57]'
                    }`}
                  >
                    <span>{t.nav.customOrders}</span>
                    <span
                      className={`absolute bottom-0 inset-x-0 h-[1px] bg-[#B08D57] transition-transform duration-300 ${
                        isRtl ? 'origin-right' : 'origin-left'
                      } scale-x-0 group-hover:scale-x-100`}
                    />
                  </Link>

                  {/* About */}
                  <Link
                    to="/about"
                    className={`group relative py-1.5 transition-colors ${
                      isTransparent
                        ? 'hover:text-[#D4B483]'
                        : 'hover:text-[#B08D57]'
                    }`}
                  >
                    <span>{t.nav.about}</span>
                    <span
                      className={`absolute bottom-0 inset-x-0 h-[1px] bg-[#B08D57] transition-transform duration-300 ${
                        isRtl ? 'origin-right' : 'origin-left'
                      } scale-x-0 group-hover:scale-x-100`}
                    />
                  </Link>
                </div>
              </div>

              {/* Center: Brand Wordmark Logo */}
              <div className="text-center px-4">
                <Link to="/" className="group inline-block">
                  <span
                    className={`font-serif-luxury text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.03em] block transition-colors ${
                      isTransparent ? 'text-[#FAF7F2]' : 'text-[#1C1C1C]'
                    }`}
                  >
                    Al Bait Al Ateeq
                  </span>
                  <span
                    className={`text-[10px] tracking-[0.25em] font-light block transition-colors -mt-0.5 ${
                      isTransparent ? 'text-[#D4B483]' : 'text-[#8C6B3F]'
                    }`}
                  >
                    مفروشات البيت العتيق
                  </span>
                </Link>
              </div>

              {/* Right Column: Icons (Search, Lang, Wishlist, Cart) */}
              <div className="flex items-center justify-end gap-3 sm:gap-5 flex-1">
                {/* Search */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className={`p-1.5 transition-colors ${
                    isTransparent
                      ? 'text-[#FAF7F2] hover:text-[#D4B483]'
                      : 'text-[#1C1C1C] hover:text-[#B08D57]'
                  }`}
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                </button>

                {/* Language Toggle */}
                <button
                  onClick={toggleLanguage}
                  className={`text-[11px] uppercase tracking-widest font-medium px-2 py-1 transition-colors border ${
                    isTransparent
                      ? 'text-[#FAF7F2] border-white/20 hover:border-[#D4B483]'
                      : 'text-[#1C1C1C] border-[#3B2A20]/20 hover:border-[#B08D57]'
                  }`}
                  title={language === 'en' ? 'التحويل إلى العربية' : 'Switch to English'}
                >
                  {language === 'en' ? 'العربية' : 'EN'}
                </button>

                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className={`relative p-1.5 transition-colors ${
                    isTransparent
                      ? 'text-[#FAF7F2] hover:text-[#D4B483]'
                      : 'text-[#1C1C1C] hover:text-[#B08D57]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                  {wishlistCount > 0 && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#B08D57] text-[#FAF7F2] text-[9px] flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart Drawer Trigger */}
                <button
                  onClick={() => setCartOpen(true)}
                  className={`relative p-1.5 transition-colors group ${
                    isTransparent
                      ? 'text-[#FAF7F2] hover:text-[#D4B483]'
                      : 'text-[#1C1C1C] hover:text-[#B08D57]'
                  }`}
                  aria-label="Shopping Bag"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                  {totalCartCount > 0 && (
                    <motion.span
                      key={totalCartCount}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                      className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1C1C1C] text-[#FAF7F2] text-[10px] flex items-center justify-center font-bold"
                    >
                      {totalCartCount}
                    </motion.span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* 3. FULL-WIDTH SLIDE-DOWN MEGA MENU */}
        <AnimatePresence>
          {megaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              onMouseLeave={() => setMegaMenuOpen(false)}
              className="w-full bg-[#FAF7F2] border-b border-[#3B2A20]/10 overflow-hidden shadow-2xl text-[#1C1C1C]"
            >
              <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
                <div className="grid grid-cols-12 gap-8 items-stretch">
                  {/* Left Column: Categories List */}
                  <div className="col-span-5 space-y-2 border-r border-[#3B2A20]/8 pr-8">
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block mb-4">
                      {language === 'ar' ? 'أقسام المجموعات' : 'Categories'}
                    </span>
                    {CATEGORIES.map((cat, idx) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.id}`}
                        onMouseEnter={() => setActiveCategoryIndex(idx)}
                        className={`group flex items-center justify-between py-2 text-base transition-colors ${
                          activeCategoryIndex === idx
                            ? 'text-[#B08D57] font-semibold'
                            : 'text-[#1C1C1C]/75 hover:text-[#1C1C1C]'
                        }`}
                      >
                        <span className="font-serif-luxury text-lg sm:text-xl">
                          {language === 'ar' ? cat.nameAr : cat.nameEn}
                        </span>
                        <span className="text-[11px] text-[#3B2A20]/40 font-mono">
                          ({cat.itemCount})
                        </span>
                      </Link>
                    ))}

                    <div className="pt-4 border-t border-[#3B2A20]/8">
                      <Link
                        to="/shop"
                        className="text-xs uppercase tracking-widest font-semibold text-[#1C1C1C] hover:text-[#B08D57] flex items-center gap-1.5 transition-colors"
                      >
                        <span>{language === 'ar' ? 'استعراض الكتالوج كاملاً' : 'View Full Catalog'}</span>
                        <ArrowIcon className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Middle Column: Large Category Preview Image Crossfade */}
                  <div className="col-span-4 relative overflow-hidden bg-[#E8DFD3]/40 aspect-[4/3] rounded-sm">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activeCategory.id}
                        src={activeCategory.image}
                        alt={activeCategory.nameEn}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full object-cover"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#1C1C1C]/80 to-transparent text-[#FAF7F2]">
                      <p className="text-xs font-light line-clamp-1 text-[#FAF7F2]/90">
                        {language === 'ar' ? activeCategory.descriptionAr : activeCategory.descriptionEn}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Featured Product in Active Category */}
                  <div className="col-span-3 flex flex-col justify-between bg-white/60 p-4 border border-[#3B2A20]/5">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-[#B08D57] font-semibold block mb-2">
                        {language === 'ar' ? 'قطعة مميزة' : 'Featured Piece'}
                      </span>
                      <div className="aspect-[4/3] overflow-hidden bg-stone-100 mb-3">
                        <img
                          src={featuredProductForCategory.images[0]}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-serif-luxury font-medium text-sm text-[#1C1C1C] line-clamp-1">
                        {language === 'ar' ? featuredProductForCategory.nameAr : featuredProductForCategory.nameEn}
                      </h4>
                      <p className="text-xs font-semibold text-[#3B2A20] mt-1">
                        {formatPrice(featuredProductForCategory.salePrice || featuredProductForCategory.price, language)}
                      </p>
                    </div>

                    <Link
                      to={`/product/${featuredProductForCategory.slug}`}
                      className="mt-4 text-[11px] uppercase tracking-widest text-[#1C1C1C] hover:text-[#B08D57] flex items-center justify-between border-t border-[#3B2A20]/10 pt-2 transition-colors font-medium"
                    >
                      <span>{language === 'ar' ? 'عرض القطعة' : 'Inspect Details'}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 4. FULL-SCREEN SEARCH OVERLAY */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#FAF7F2]/98 backdrop-blur-md flex flex-col"
          >
            {/* Search Top Bar */}
            <div className="max-w-5xl mx-auto w-full px-6 pt-8 pb-4 flex items-center justify-between border-b border-[#3B2A20]/10">
              <span className="text-xs uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold">
                {language === 'ar' ? 'البحث في المجموعات' : 'Search Collection'}
              </span>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 text-[#1C1C1C] hover:text-[#B08D57] transition-colors"
                aria-label="Close search"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Input Container */}
            <div className="max-w-5xl mx-auto w-full px-6 py-8">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={language === 'ar' ? 'ابحث عن مجالس، كنب، طاولات خشب...' : 'Type to discover handcrafted furniture...'}
                  className="w-full font-serif-luxury text-2xl sm:text-4xl text-[#1C1C1C] placeholder:text-stone-300 bg-transparent outline-none border-b border-[#1C1C1C]/20 pb-4 focus:border-[#B08D57] transition-colors"
                />
              </div>

              {/* Quick Keywords */}
              {searchQuery.trim() === '' && (
                <div className="pt-6">
                  <span className="text-[11px] uppercase tracking-widest text-stone-400 block mb-3">
                    {language === 'ar' ? 'عمليات البحث الشائعة:' : 'Curated Inquiries:'}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {['Royal Majlis', 'Curved Bouclé', 'Walnut Dining', 'Travertine', 'Canopy Bed', 'Chesterfield'].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="text-xs px-3 py-1.5 border border-[#3B2A20]/15 hover:border-[#B08D57] text-[#1C1C1C] transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Live Results Grid */}
              <div className="pt-8 max-h-[60vh] overflow-y-auto">
                {searchQuery.trim() !== '' && searchResults.length === 0 && (
                  <p className="font-serif-luxury text-lg text-stone-400 italic py-8 text-center">
                    {language === 'ar' ? 'لم يتم العثور على قطع تطابق بحثك.' : 'No handcrafted pieces match your search.'}
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="group flex gap-4 items-center p-3 hover:bg-white/60 transition-colors"
                    >
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-20 h-20 object-cover bg-stone-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase tracking-wider text-stone-400 block">
                          {p.category.replace('-', ' ')}
                        </span>
                        <h4 className="font-serif-luxury font-medium text-base text-[#1C1C1C] group-hover:text-[#B08D57] transition-colors line-clamp-1">
                          {language === 'ar' ? p.nameAr : p.nameEn}
                        </h4>
                        <span className="text-xs font-semibold text-[#3B2A20] mt-1 block">
                          {formatPrice(p.salePrice || p.price, language)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. FULL-SCREEN MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: isRtl ? '100%' : '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRtl ? '100%' : '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 grad-walnut-charcoal text-[#FAF7F2] p-8 flex flex-col justify-between overflow-y-auto"
          >
            {/* Top Bar with Close Button */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6">
              <span className="font-serif-luxury text-xl font-bold tracking-tight">
                Al Bait Al Ateeq
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#FAF7F2]/75 hover:text-[#FAF7F2]"
                aria-label="Close menu"
              >
                <X className="w-6 h-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Staggered Navigation Links */}
            <div className="py-10 space-y-5">
              {[
                { title: t.nav.home, path: '/' },
                { title: t.nav.shop, path: '/shop' },
                { title: t.nav.majlis, path: '/shop?category=majlis' },
                { title: t.nav.customOrders, path: '/custom-order' },
                { title: t.nav.about, path: '/about' },
                { title: t.nav.contact, path: '/contact' },
              ].map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-serif-luxury text-3xl sm:text-4xl hover:text-[#D4B483] transition-colors block"
                  >
                    {link.title}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Bottom Contact & Language Switcher */}
            <div className="border-t border-white/10 pt-6 space-y-4">
              <div className="flex items-center justify-between text-xs tracking-wider">
                <span className="text-[#FAF7F2]/60">+971 50 000 0000</span>
                <button
                  onClick={() => {
                    toggleLanguage();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 border border-[#B08D57] text-[#D4B483] uppercase tracking-widest font-semibold"
                >
                  {language === 'en' ? 'العربية' : 'English'}
                </button>
              </div>
              <p className="text-[10px] text-[#FAF7F2]/40 tracking-widest uppercase">
                {t.brand.tagline}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
