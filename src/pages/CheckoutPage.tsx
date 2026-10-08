import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Check,
  Truck,
  CreditCard,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  Printer,
} from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';
import { useStore } from '../store/useStore.ts';
import {
  formatPrice,
  calculateCartSummary,
  generateOrderNumber,
} from '../utils/formatters.ts';
import { DeliveryMethod, Order, PaymentMethod, ShippingAddress } from '../types/index.ts';

export const CheckoutPage: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const navigate = useNavigate();

  const {
    cart,
    clearCart,
    couponDiscountPercentage,
    lastOrder,
    setLastOrder,
    addToast,
  } = useStore();

  const [currentStep, setCurrentStep] = useState<number>(lastOrder ? 5 : 1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    phone: '',
    email: '',
    emirate: 'Dubai',
    cityArea: '',
    streetAddress: '',
    apartmentVilla: '',
    deliveryNotes: '',
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const emiratesList = [
    { en: 'Dubai', ar: 'دبي' },
    { en: 'Abu Dhabi', ar: 'أبوظبي' },
    { en: 'Sharjah', ar: 'الشارقة' },
    { en: 'Ajman', ar: 'عجمان' },
    { en: 'Ras Al Khaimah', ar: 'رأس الخيمة' },
    { en: 'Fujairah', ar: 'الفجيرة' },
    { en: 'Umm Al Quwain', ar: 'أم القيوين' },
    { en: 'Al Ain', ar: 'العين' },
  ];

  const rawSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.salePrice || item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const {
    discount,
    discountedSubtotal,
    deliveryFee,
    vat,
    total,
  } = calculateCartSummary(rawSubtotal, couponDiscountPercentage, deliveryMethod);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const validateShipping = () => {
    const errs: { [key: string]: string } = {};
    if (!shippingAddress.fullName.trim()) errs.fullName = 'Required';
    if (!shippingAddress.phone.trim() || shippingAddress.phone.length < 8) errs.phone = 'Valid phone required';
    if (!shippingAddress.email.trim() || !shippingAddress.email.includes('@')) errs.email = 'Valid email required';
    if (!shippingAddress.cityArea.trim()) errs.cityArea = 'District required';
    if (!shippingAddress.streetAddress.trim()) errs.streetAddress = 'Address required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextFromShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShipping()) {
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = generateOrderNumber();
      const order: Order = {
        orderNumber,
        date: new Date().toLocaleDateString(language === 'ar' ? 'ar-AE' : 'en-AE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        items: cart.map((item) => ({
          productId: item.product.id,
          nameEn: item.product.nameEn,
          nameAr: item.product.nameAr,
          price: item.product.salePrice || item.product.price,
          quantity: item.quantity,
          colorNameEn: item.selectedColor.nameEn,
          colorNameAr: item.selectedColor.nameAr,
          image: item.product.images[0],
        })),
        shippingAddress,
        deliveryMethod,
        deliveryFee,
        paymentMethod,
        subtotal: rawSubtotal,
        discount,
        tax: vat,
        total,
        status: 'confirmed',
      };

      setLastOrder(order);
      clearCart();
      setIsSubmitting(false);
      setCurrentStep(5);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      addToast({
        type: 'success',
        titleEn: t.toast.orderPlaced,
        titleAr: t.toast.orderPlaced,
        messageEn: t.toast.orderPlacedMsg.replace('{orderNum}', orderNumber),
        messageAr: t.toast.orderPlacedMsg.replace('{orderNum}', orderNumber),
      });
    }, 1000);
  };

  if (currentStep === 5 && lastOrder) {
    const trackingMsg = t.checkout.confirmation.whatsappMessage
      .replace('{orderNum}', lastOrder.orderNumber)
      .replace('{total}', lastOrder.total.toString());
    const trackingUrl = `https://wa.me/971500000000?text=${encodeURIComponent(trackingMsg)}`;

    return (
      <div className="pt-32 pb-24 max-w-2xl mx-auto px-6 space-y-8 text-center">
        <div className="space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block">
            {t.checkout.confirmation.badge}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-5xl font-light text-[#1C1C1C]">
            {t.checkout.confirmation.title}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md mx-auto leading-relaxed">
            {t.checkout.confirmation.subtitle}
          </p>
        </div>

        {/* Reference details */}
        <div className="p-8 grad-sand-ivory border border-[#3B2A20]/10 text-start space-y-4 text-xs font-light">
          <div className="flex justify-between border-b border-[#3B2A20]/10 pb-3">
            <span className="text-stone-500">{t.checkout.confirmation.orderNumber}:</span>
            <strong className="font-mono text-sm text-[#1C1C1C]">{lastOrder.orderNumber}</strong>
          </div>
          <div className="flex justify-between border-b border-[#3B2A20]/10 pb-3">
            <span className="text-stone-500">{t.checkout.confirmation.orderDate}:</span>
            <span className="text-[#1C1C1C]">{lastOrder.date}</span>
          </div>
          <div className="flex justify-between border-b border-[#3B2A20]/10 pb-3">
            <span className="text-stone-500">{t.checkout.confirmation.estimatedDelivery}:</span>
            <span className="text-[#1C1C1C] font-medium">{t.checkout.confirmation.estimatedDeliveryValue}</span>
          </div>
          <div className="flex justify-between pt-2 items-baseline font-medium">
            <span className="font-serif-luxury text-base text-[#1C1C1C]">{t.cart.grandTotal}:</span>
            <span className="font-serif-luxury text-xl text-[#1C1C1C]">{formatPrice(lastOrder.total, language)}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 border border-[#B08D57] text-[#1C1C1C] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#8C6B3F]" />
            <span>{t.checkout.confirmation.whatsappTracking}</span>
          </a>

          <button
            onClick={() => window.print()}
            className="w-full sm:w-auto px-8 py-3.5 border border-[#1C1C1C]/20 text-[#1C1C1C] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>{t.checkout.confirmation.printInvoice}</span>
          </button>

          <button
            onClick={() => {
              setLastOrder(null as any);
              navigate('/');
            }}
            className="btn-quiet-luxury w-full sm:w-auto px-8 py-3.5 text-xs uppercase tracking-widest font-semibold"
          >
            {t.checkout.confirmation.backToHome}
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0 && currentStep !== 5) {
    return (
      <div className="pt-36 pb-32 max-w-xl mx-auto px-6 text-center space-y-4">
        <h2 className="font-serif-luxury text-2xl font-light text-[#1C1C1C]">{t.cart.emptyTitle}</h2>
        <Link to="/shop" className="btn-quiet-luxury inline-block text-xs uppercase tracking-widest px-6 py-3 font-semibold">
          {t.cart.continueShopping}
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
      <div className="border-b border-[#3B2A20]/10 pb-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block mb-1">
          Al Bait Al Ateeq
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
          {t.checkout.title}
        </h1>

        {/* Minimal Steps Indicator */}
        <div className="flex items-center gap-8 mt-6 overflow-x-auto text-xs uppercase tracking-widest font-medium">
          {[
            { step: 1, label: t.checkout.steps.shipping },
            { step: 2, label: t.checkout.steps.delivery },
            { step: 3, label: t.checkout.steps.payment },
            { step: 4, label: t.checkout.steps.review },
          ].map((item) => (
            <div
              key={item.step}
              className={`pb-2 whitespace-nowrap transition-colors border-b-2 ${
                currentStep === item.step
                  ? 'border-[#B08D57] text-[#1C1C1C] font-semibold'
                  : currentStep > item.step
                  ? 'border-stone-300 text-stone-500'
                  : 'border-transparent text-stone-300'
              }`}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Step Forms (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: Shipping */}
          {currentStep === 1 && (
            <form onSubmit={handleNextFromShipping} className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#1C1C1C] block border-b border-[#3B2A20]/10 pb-3">
                {t.checkout.shipping.title}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                    {t.checkout.shipping.fullName} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                  />
                  {errors.fullName && <span className="text-[10px] text-rose-500 mt-1 block">{errors.fullName}</span>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                    {t.checkout.shipping.phone} *
                  </label>
                  <input
                    type="tel"
                    dir="ltr"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                  />
                  {errors.phone && <span className="text-[10px] text-rose-500 mt-1 block">{errors.phone}</span>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                    {t.checkout.shipping.email} *
                  </label>
                  <input
                    type="email"
                    dir="ltr"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, email: e.target.value })}
                    className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                  />
                  {errors.email && <span className="text-[10px] text-rose-500 mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                    {t.checkout.shipping.emirate} *
                  </label>
                  <select
                    value={shippingAddress.emirate}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, emirate: e.target.value })}
                    className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                  >
                    {emiratesList.map((em) => (
                      <option key={em.en} value={em.en}>
                        {language === 'ar' ? em.ar : em.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                    {t.checkout.shipping.cityArea} *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.cityArea}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, cityArea: e.target.value })}
                    className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                  />
                  {errors.cityArea && <span className="text-[10px] text-rose-500 mt-1 block">{errors.cityArea}</span>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                    {t.checkout.shipping.apartmentVilla}
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.apartmentVilla}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, apartmentVilla: e.target.value })}
                    className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-stone-500 mb-1">
                  {t.checkout.shipping.streetAddress} *
                </label>
                <input
                  type="text"
                  value={shippingAddress.streetAddress}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, streetAddress: e.target.value })}
                  className="w-full bg-white border border-[#3B2A20]/15 px-3.5 py-2.5 text-xs text-[#1C1C1C] outline-none"
                />
                {errors.streetAddress && <span className="text-[10px] text-rose-500 mt-1 block">{errors.streetAddress}</span>}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="btn-quiet-luxury px-8 py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                >
                  <span>{t.checkout.shipping.nextStep}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Delivery Option */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#1C1C1C] block border-b border-[#3B2A20]/10 pb-3">
                {t.checkout.delivery.title}
              </span>

              <div className="space-y-3">
                <label
                  onClick={() => setDeliveryMethod('standard')}
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                    deliveryMethod === 'standard'
                      ? 'border-[#B08D57] bg-white'
                      : 'border-stone-200 bg-white/50'
                  }`}
                >
                  <input type="radio" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="mt-1 accent-[#B08D57]" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{t.checkout.delivery.standardTitle}</span>
                      <span>{discountedSubtotal >= 2000 ? 'Free' : 'AED 150'}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{t.checkout.delivery.standardDesc}</p>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethod('express')}
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                    deliveryMethod === 'express'
                      ? 'border-[#B08D57] bg-white'
                      : 'border-stone-200 bg-white/50'
                  }`}
                >
                  <input type="radio" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="mt-1 accent-[#B08D57]" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{t.checkout.delivery.expressTitle}</span>
                      <span>{t.checkout.delivery.expressPrice}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{t.checkout.delivery.expressDesc}</p>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex items-start gap-4 p-4 border cursor-pointer transition-all ${
                    deliveryMethod === 'pickup'
                      ? 'border-[#B08D57] bg-white'
                      : 'border-stone-200 bg-white/50'
                  }`}
                >
                  <input type="radio" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="mt-1 accent-[#B08D57]" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{t.checkout.delivery.pickupTitle}</span>
                      <span>Free</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">{t.checkout.delivery.pickupDesc}</p>
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between border-t border-[#3B2A20]/10">
                <button onClick={() => setCurrentStep(1)} className="text-xs uppercase tracking-wider text-stone-500">
                  {t.checkout.delivery.prevStep}
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="btn-quiet-luxury px-8 py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                >
                  <span>{t.checkout.delivery.nextStep}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#1C1C1C] block border-b border-[#3B2A20]/10 pb-3">
                {t.checkout.payment.title}
              </span>

              <div className="space-y-3">
                <label
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-start gap-4 p-4 border cursor-pointer ${
                    paymentMethod === 'cod' ? 'border-[#B08D57] bg-white' : 'border-stone-200'
                  }`}
                >
                  <input type="radio" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mt-1 accent-[#B08D57]" />
                  <div>
                    <span className="text-xs font-semibold block">{t.checkout.payment.codTitle}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">{t.checkout.payment.codDesc}</p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('card_on_delivery')}
                  className={`flex items-start gap-4 p-4 border cursor-pointer ${
                    paymentMethod === 'card_on_delivery' ? 'border-[#B08D57] bg-white' : 'border-stone-200'
                  }`}
                >
                  <input type="radio" checked={paymentMethod === 'card_on_delivery'} onChange={() => setPaymentMethod('card_on_delivery')} className="mt-1 accent-[#B08D57]" />
                  <div>
                    <span className="text-xs font-semibold block">{t.checkout.payment.cardOnDeliveryTitle}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">{t.checkout.payment.cardOnDeliveryDesc}</p>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('card_online')}
                  className={`flex items-start gap-4 p-4 border cursor-pointer ${
                    paymentMethod === 'card_online' ? 'border-[#B08D57] bg-white' : 'border-stone-200'
                  }`}
                >
                  <input type="radio" checked={paymentMethod === 'card_online'} onChange={() => setPaymentMethod('card_online')} className="mt-1 accent-[#B08D57]" />
                  <div className="flex-1">
                    <span className="text-xs font-semibold block">{t.checkout.payment.cardOnlineTitle}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">{t.checkout.payment.cardOnlineDesc}</p>

                    {paymentMethod === 'card_online' && (
                      <div className="mt-3 p-3 bg-[#FAF7F2] border space-y-2">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card Number"
                          className="w-full p-2 bg-white text-xs border"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="p-2 bg-white text-xs border"
                          />
                          <input
                            type="text"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            placeholder="CVC"
                            className="p-2 bg-white text-xs border"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              <div className="pt-4 flex justify-between border-t border-[#3B2A20]/10">
                <button onClick={() => setCurrentStep(2)} className="text-xs uppercase tracking-wider text-stone-500">
                  {t.checkout.payment.prevStep}
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="btn-quiet-luxury px-8 py-3.5 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                >
                  <span>{t.checkout.payment.nextStep}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#1C1C1C] block border-b border-[#3B2A20]/10 pb-3">
                {t.checkout.review.title}
              </span>

              <div className="p-4 bg-white/80 border text-xs space-y-2">
                <p>
                  <strong className="text-stone-500">Destination:</strong> {shippingAddress.fullName},{' '}
                  {shippingAddress.streetAddress}, {shippingAddress.cityArea}, {shippingAddress.emirate}
                </p>
                <p>
                  <strong className="text-stone-500">Delivery:</strong> {deliveryMethod}
                </p>
                <p>
                  <strong className="text-stone-500">Payment:</strong> {paymentMethod}
                </p>
              </div>

              <div className="pt-4 flex justify-between border-t border-[#3B2A20]/10">
                <button onClick={() => setCurrentStep(3)} className="text-xs uppercase tracking-wider text-stone-500">
                  {t.checkout.review.prevStep}
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="btn-quiet-luxury px-9 py-4 text-xs uppercase tracking-widest font-semibold flex items-center gap-2"
                >
                  <span>{isSubmitting ? t.checkout.review.submitting : t.checkout.review.placeOrder}</span>
                  <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 5 cols: Order Totals Sidebar */}
        <div className="lg:col-span-5">
          <div className="p-6 grad-sand-ivory border border-[#3B2A20]/10 space-y-4 sticky top-28">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block">
              {t.cart.orderSummary}
            </span>

            <div className="space-y-2.5 text-xs border-b border-[#3B2A20]/10 pb-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex justify-between">
                  <span className="truncate max-w-[200px]">
                    {language === 'ar' ? item.product.nameAr : item.product.nameEn} (x{item.quantity})
                  </span>
                  <span className="font-medium text-[#1C1C1C]">
                    {formatPrice((item.product.salePrice || item.product.price) * item.quantity, language)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>{t.cart.subtotal}</span>
                <span>{formatPrice(rawSubtotal, language)}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>{t.cart.deliveryFee}</span>
                <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee, language)}</span>
              </div>
              <div className="pt-2 border-t flex justify-between items-baseline font-serif-luxury text-xl text-[#1C1C1C]">
                <span>{t.cart.grandTotal}</span>
                <span>{formatPrice(total, language)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
