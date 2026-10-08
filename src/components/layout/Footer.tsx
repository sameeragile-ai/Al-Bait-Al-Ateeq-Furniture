import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useTranslation } from '../../i18n/index.ts';
import { CATEGORIES } from '../../data/products.ts';

export const Footer: React.FC = () => {
  const { t, language, isRtl } = useTranslation();

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <footer className="relative grad-walnut-charcoal text-[#FAF7F2] overflow-hidden pt-24 pb-14 border-t border-[#B08D57]/30">
      {/* Huge Faded Background Wordmark */}
      <div className="absolute inset-x-0 bottom-10 select-none pointer-events-none opacity-[0.03] text-center overflow-hidden">
        <span className="font-serif-luxury text-[14vw] tracking-tighter uppercase whitespace-nowrap block">
          Al Bait Al Ateeq
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-20">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <Link to="/" className="inline-block group">
              <span className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#FAF7F2] block tracking-tight">
                Al Bait Al Ateeq
              </span>
              <span className="text-[11px] text-[#D4B483] tracking-[0.25em] font-light uppercase block">
                مفروشات البيت العتيق
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#FAF7F2]/70 leading-relaxed font-light max-w-md">
              {t.footer.aboutText}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-5 pt-2 text-[#FAF7F2]/60">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4B483] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4B483] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 stroke-[1.5]" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D4B483] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 stroke-[1.5]" />
              </a>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B483] font-semibold block">
              {t.footer.quickLinks}
            </span>
            <ul className="space-y-3 text-xs text-[#FAF7F2]/75 font-light">
              <li>
                <Link to="/" className="hover:text-[#FAF7F2] transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#FAF7F2] transition-colors">
                  {t.nav.shop}
                </Link>
              </li>
              <li>
                <Link to="/shop?category=majlis" className="hover:text-[#FAF7F2] transition-colors">
                  {t.nav.majlis}
                </Link>
              </li>
              <li>
                <Link to="/custom-order" className="hover:text-[#FAF7F2] transition-colors">
                  {t.nav.customOrders}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#FAF7F2] transition-colors">
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#FAF7F2] transition-colors">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Collections (2 cols) */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B483] font-semibold block">
              {t.footer.categoriesTitle}
            </span>
            <ul className="space-y-3 text-xs text-[#FAF7F2]/75 font-light">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={`/shop?category=${cat.id}`}
                    className="hover:text-[#FAF7F2] transition-colors block truncate"
                  >
                    {language === 'ar' ? cat.nameAr : cat.nameEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Showroom & Hours (3 cols) */}
          <div className="md:col-span-3 space-y-4 text-xs text-[#FAF7F2]/75 font-light">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4B483] font-semibold block">
              {t.footer.contactInfo}
            </span>

            <p className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#D4B483] shrink-0 mt-0.5" />
              <span>{t.contact.addressValue}</span>
            </p>

            <p className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#D4B483] shrink-0" />
              <span dir="ltr">+971 50 000 0000</span>
            </p>

            <p className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#D4B483] shrink-0" />
              <span>info@albaitalateeq.com</span>
            </p>

            <div className="pt-2 border-t border-white/10 space-y-1 text-[11px] text-[#FAF7F2]/60">
              <p>{t.contact.hoursWeekday}</p>
              <p>{t.contact.hoursFriday}</p>
            </div>
          </div>
        </div>

        {/* Hairline Brass Divider */}
        <div className="hairline-brass-divider" />

        {/* Bottom Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FAF7F2]/50 font-light">
          <p>{t.footer.copyright.replace('{year}', new Date().getFullYear().toString())}</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
              {t.footer.privacy}
            </span>
            <span>·</span>
            <span className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
              {t.footer.terms}
            </span>
            <span>·</span>
            <span className="hover:text-[#FAF7F2] transition-colors cursor-pointer">
              {t.footer.deliveryInfo}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
