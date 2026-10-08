import React, { useState, useRef } from 'react';
import {
  Upload,
  CheckCircle2,
  X,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';
import { useStore } from '../store/useStore.ts';
import { CustomOrderRequest } from '../types/index.ts';

export const CustomOrderPage: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const { addToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    emirate: 'Dubai',
    furnitureType: '',
    dimensions: '',
    preferredMaterials: '',
    fabricPreference: '',
    estimatedBudget: 'tier2',
    notes: '',
  });

  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<CustomOrderRequest | null>(null);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setReferenceImage(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const code = `ABA-CUST-${Math.floor(1000 + Math.random() * 9000)}`;
      const request: CustomOrderRequest = {
        id: code,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        emirate: formData.emirate,
        furnitureType: formData.furnitureType,
        dimensions: formData.dimensions,
        preferredMaterials: formData.preferredMaterials,
        fabricPreference: formData.fabricPreference,
        estimatedBudget: formData.estimatedBudget,
        notes: formData.notes,
        referenceImage: referenceImage || undefined,
        referenceImageName: imageName || undefined,
        createdAt: new Date().toISOString(),
      };

      setSubmittedOrder(request);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      addToast({
        type: 'success',
        titleEn: 'Commission Submitted',
        titleAr: 'تم إرسال طلب التفصيل',
        messageEn: `Reference code ${code} recorded.`,
        messageAr: `تم تسجيل طلبك برقم مرجعي ${code}.`,
      });
    }, 1000);
  };

  const whatsappDirectMessage = submittedOrder
    ? language === 'ar'
      ? `مرحباً مفروشات البيت العتيق، أرسلت طلب تفصيل خاص بالرمز (${submittedOrder.id}):\nنوع الأثاث: ${submittedOrder.furnitureType}\nالمقاسات: ${submittedOrder.dimensions}\nالاسم: ${submittedOrder.fullName}\nالهاتف: ${submittedOrder.phone}\nأرجو موافاتي بعرض السعر المبدئي.`
      : `Hello Al Bait Al Ateeq, I have submitted a bespoke order request (${submittedOrder.id}):\nType: ${submittedOrder.furnitureType}\nDimensions: ${submittedOrder.dimensions}\nClient: ${submittedOrder.fullName}\nPhone: ${submittedOrder.phone}\nPlease assist me with 3D design and quotation.`
    : '';

  const whatsappDirectUrl = `https://wa.me/971500000000?text=${encodeURIComponent(
    whatsappDirectMessage
  )}`;

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-20">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block">
          {t.customOrder.badge}
        </span>
        <h1 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[#1C1C1C] leading-tight">
          {t.customOrder.title}
        </h1>
        <p className="text-sm text-[#3B2A20]/80 font-light leading-relaxed">
          {t.customOrder.subtitle}
        </p>
      </div>

      {/* 4 Steps Minimalist Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-t border-[#3B2A20]/10 pt-10">
        <div>
          <span className="font-serif-luxury text-2xl font-light text-[#B08D57] block mb-2">01</span>
          <h3 className="font-serif-luxury text-lg font-medium text-[#1C1C1C] mb-1">{t.customOrder.step1Title}</h3>
          <p className="text-xs text-stone-500 font-light">{t.customOrder.step1Desc}</p>
        </div>
        <div>
          <span className="font-serif-luxury text-2xl font-light text-[#B08D57] block mb-2">02</span>
          <h3 className="font-serif-luxury text-lg font-medium text-[#1C1C1C] mb-1">{t.customOrder.step2Title}</h3>
          <p className="text-xs text-stone-500 font-light">{t.customOrder.step2Desc}</p>
        </div>
        <div>
          <span className="font-serif-luxury text-2xl font-light text-[#B08D57] block mb-2">03</span>
          <h3 className="font-serif-luxury text-lg font-medium text-[#1C1C1C] mb-1">{t.customOrder.step3Title}</h3>
          <p className="text-xs text-stone-500 font-light">{t.customOrder.step3Desc}</p>
        </div>
        <div>
          <span className="font-serif-luxury text-2xl font-light text-[#B08D57] block mb-2">04</span>
          <h3 className="font-serif-luxury text-lg font-medium text-[#1C1C1C] mb-1">{t.customOrder.step4Title}</h3>
          <p className="text-xs text-stone-500 font-light">{t.customOrder.step4Desc}</p>
        </div>
      </div>

      {submittedOrder ? (
        <div className="max-w-2xl mx-auto p-10 grad-sand-ivory border border-[#B08D57]/40 text-center space-y-6">
          <div className="w-12 h-12 rounded-full border border-emerald-500 text-emerald-700 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif-luxury text-2xl font-light text-[#1C1C1C]">
              {t.customOrder.successTitle}
            </h3>
            <p className="text-xs text-stone-600 font-light">
              {t.customOrder.successDesc.replace('{code}', submittedOrder.id)}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a
              href={whatsappDirectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 border border-[#B08D57] text-[#1C1C1C] text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 text-[#8C6B3F]" />
              <span>{t.customOrder.sendWhatsAppDirect}</span>
            </a>

            <button
              onClick={() => {
                setSubmittedOrder(null);
                setReferenceImage(null);
              }}
              className="btn-quiet-luxury px-6 py-3.5 text-xs uppercase tracking-widest font-semibold"
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl border-t border-[#3B2A20]/10 pt-10 space-y-8">
          <span className="text-[11px] uppercase tracking-widest font-semibold text-[#1C1C1C] block">
            {t.customOrder.formTitle}
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                {t.customOrder.fullName} *
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                {t.customOrder.phone} *
              </label>
              <input
                type="tel"
                required
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+971 50 123 4567"
                className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                {t.customOrder.email} *
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
                {t.customOrder.emirate} *
              </label>
              <select
                value={formData.emirate}
                onChange={(e) => setFormData({ ...formData, emirate: e.target.value })}
                className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
              >
                <option value="Dubai">Dubai</option>
                <option value="Abu Dhabi">Abu Dhabi</option>
                <option value="Sharjah">Sharjah</option>
                <option value="Al Ain">Al Ain</option>
                <option value="Ajman">Ajman</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#3B2A20]/10">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                {t.customOrder.furnitureType} *
              </label>
              <input
                type="text"
                required
                value={formData.furnitureType}
                onChange={(e) => setFormData({ ...formData, furnitureType: e.target.value })}
                placeholder="e.g. Royal U-Majlis, 14-Seat Walnut Table"
                className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                {t.customOrder.dimensions}
              </label>
              <input
                type="text"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                placeholder="e.g. 400cm x 300cm"
                className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                {t.customOrder.materials}
              </label>
              <input
                type="text"
                value={formData.preferredMaterials}
                onChange={(e) => setFormData({ ...formData, preferredMaterials: e.target.value })}
                placeholder="e.g. Natural Teak, Antique Brass"
                className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                {t.customOrder.fabric}
              </label>
              <input
                type="text"
                value={formData.fabricPreference}
                onChange={(e) => setFormData({ ...formData, fabricPreference: e.target.value })}
                placeholder="e.g. Emerald Turkish Velvet"
                className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
              {t.customOrder.notes}
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
            />
          </div>

          {/* Reference Image */}
          <div className="pt-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {referenceImage ? (
              <div className="inline-flex items-center gap-3 p-3 bg-white border">
                <img src={referenceImage} alt="" className="w-16 h-16 object-cover" />
                <span className="text-xs text-stone-600 font-mono">{imageName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setReferenceImage(null);
                    setImageName('');
                  }}
                  className="p-1 hover:text-rose-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[#1C1C1C]/30 hover:border-[#B08D57] p-6 text-center w-full text-xs uppercase tracking-widest text-stone-600 flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4 text-[#8C6B3F]" />
                <span>{t.customOrder.uploadButton}</span>
              </button>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-quiet-luxury px-9 py-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
            >
              <span>{isSubmitting ? t.customOrder.submitting : t.customOrder.submitButton}</span>
              <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
