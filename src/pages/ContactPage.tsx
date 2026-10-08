import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';
import { useStore } from '../store/useStore.ts';

export const ContactPage: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const { addToast } = useStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      addToast({
        type: 'success',
        titleEn: 'Message Dispatched',
        titleAr: 'تم إرسال الرسالة',
        messageEn: 'Our concierge will contact you shortly.',
        messageAr: 'سيتواصل معك فريق الاستقبال قريباً.',
      });
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 1000);
  };

  const whatsappMessage =
    language === 'ar'
      ? 'مرحباً مفروشات البيت العتيق، أود الاستفسار عن مواعيد زيارة المعرض وتوفر قطع الأثاث.'
      : 'Hello Al Bait Al Ateeq, I would like to inquire about showroom hours and furniture availability.';
  const whatsappUrl = `https://wa.me/971500000000?text=${encodeURIComponent(whatsappMessage)}`;

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-20">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block">
          {t.contact.badge}
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[#1C1C1C] leading-tight">
          {t.contact.title}
        </h1>
        <p className="text-sm text-[#3B2A20]/80 font-light leading-relaxed">
          {t.contact.subtitle}
        </p>
      </div>

      {/* Grid: Contact Information & Direct Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Info Column (5 cols) */}
        <div className="lg:col-span-5 space-y-8 text-xs font-light text-[#3B2A20]">
          <div className="border-t border-[#3B2A20]/10 pt-4 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">
              {t.contact.phoneLabel}
            </span>
            <a href="tel:+971500000000" dir="ltr" className="font-serif-luxury text-xl text-[#1C1C1C] block hover:text-[#B08D57]">
              +971 50 000 0000
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#B08D57] hover:underline font-medium mt-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t.contact.whatsappLabel}</span>
            </a>
          </div>

          <div className="border-t border-[#3B2A20]/10 pt-4 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">
              {t.contact.emailLabel}
            </span>
            <a href="mailto:info@albaitalateeq.com" className="font-serif-luxury text-lg text-[#1C1C1C] hover:text-[#B08D57]">
              info@albaitalateeq.com
            </a>
          </div>

          <div className="border-t border-[#3B2A20]/10 pt-4 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">
              {t.contact.addressLabel}
            </span>
            <p className="font-serif-luxury text-lg text-[#1C1C1C]">{t.contact.addressValue}</p>
          </div>

          <div className="border-t border-[#3B2A20]/10 pt-4 space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">
              {t.contact.hoursLabel}
            </span>
            <p className="text-[#1C1C1C] font-normal">{t.contact.hoursWeekday}</p>
            <p className="text-stone-500">{t.contact.hoursFriday}</p>
          </div>
        </div>

        {/* Form Column (7 cols) */}
        <div className="lg:col-span-7">
          <div className="border-t border-[#3B2A20]/10 pt-6 space-y-6">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#1C1C1C] block">
              {t.contact.formTitle}
            </span>

            {isSent ? (
              <div className="p-8 grad-sand-ivory border text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#B08D57] mx-auto" />
                <h3 className="font-serif-luxury text-2xl font-light text-[#1C1C1C]">
                  {language === 'ar' ? 'تم استلام استفسارك' : 'Inquiry Received'}
                </h3>
                <p className="text-xs text-stone-500 font-light">{t.contact.sentSuccess}</p>
                <button onClick={() => setIsSent(false)} className="text-xs uppercase tracking-widest text-[#B08D57] hover:underline pt-2">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                      {t.contact.name} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                      {t.contact.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                      {t.contact.email} *
                    </label>
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                      {t.contact.subject}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                    {t.contact.message} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="btn-quiet-luxury px-9 py-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                  >
                    <span>{isSending ? t.contact.sending : t.contact.sendMessage}</span>
                    <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Google Map */}
      <div className="space-y-4 pt-12 border-t border-[#3B2A20]/10">
        <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block">
          {t.contact.mapTitle}
        </span>
        <div className="aspect-[21/9] min-h-[350px] w-full border border-[#3B2A20]/15 overflow-hidden">
          <iframe
            title="Al Bait Al Ateeq Showroom UAE"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115545.92389278278!2d55.204555099999995!3d25.18724775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20Design%20District!5e0!3m2!1sen!2sae!4v1700000000000!5m2!1sen!2sae"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};
