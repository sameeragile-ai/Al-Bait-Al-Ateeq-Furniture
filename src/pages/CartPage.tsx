import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Truck,
  Tag,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';
import { useStore } from '../store/useStore.ts';
import { formatPrice, calculateCartSummary } from '../utils/formatters.ts';

export const CartPage: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const navigate = useNavigate();

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    couponCode,
    couponDiscountPercentage,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');

  const rawSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.salePrice || item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const {
    discount,
    discountedSubtotal,
    deliveryFee,
    total,
    hasUnlockedFreeDelivery,
    amountNeededForFreeDelivery,
  } = calculateCartSummary(rawSubtotal, couponDiscountPercentage, 'standard');

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon);
      setInputCoupon('');
    }
  };

  const whatsappItemsSummary = cart
    .map(
      (item) =>
        `- ${item.product.nameEn} (${item.quantity}x, Color: ${item.selectedColor.nameEn})`
    )
    .join('\n');

  const whatsappCheckoutMsg =
    language === 'ar'
      ? `مرحباً مفروشات البيت العتيق، أود تأكيد طلبي مباشرة عبر واتساب:\n${whatsappItemsSummary}\nالمجموع: ${formatPrice(total, 'ar')}\nيرجى التواصل معي لتنسيق بيانات التوصيل.`
      : `Hello Al Bait Al Ateeq Furniture, I would like to checkout via WhatsApp:\n${whatsappItemsSummary}\nTotal: ${formatPrice(total, 'en')}\nPlease assist me with scheduling delivery.`;

  const whatsappCheckoutUrl = `https://wa.me/971500000000?text=${encodeURIComponent(whatsappCheckoutMsg)}`;

  if (cart.length === 0) {
    return (
      <div className="pt-36 pb-32 max-w-3xl mx-auto px-6 text-center space-y-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block">
          Al Bait Al Ateeq
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
          {t.cart.emptyTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto font-light">
          {t.cart.emptySubtitle}
        </p>
        <div className="pt-4">
          <Link
            to="/shop"
            className="btn-quiet-luxury inline-flex items-center gap-2 px-8 py-4 text-xs uppercase tracking-widest font-semibold"
          >
            <span>{t.cart.continueShopping}</span>
            <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
      {/* Editorial Title */}
      <div className="border-b border-[#3B2A20]/10 pb-6 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block mb-1">
            {language === 'ar' ? 'سلة المقتنيات' : 'Your Selection'}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
            {t.cart.title}
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-stone-800 transition-colors uppercase tracking-wider"
        >
          {t.cart.clearCart}
        </button>
      </div>

      {/* Free Delivery Bar with thin brass line */}
      <div className="p-4 bg-white/70 border border-[#3B2A20]/8 space-y-2">
        <div className="flex items-center justify-between text-xs text-[#3B2A20]">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#B08D57]" />
            <span>
              {hasUnlockedFreeDelivery
                ? t.cart.freeDeliveryQualified
                : t.cart.freeDeliveryRemaining.replace(
                    '{amount}',
                    formatPrice(amountNeededForFreeDelivery, language)
                  )}
            </span>
          </div>
          <span className="font-mono text-[11px]">
            {Math.min(100, Math.round((discountedSubtotal / 2000) * 100))}%
          </span>
        </div>

        <div className="w-full bg-[#E8DFD3] h-[2px]">
          <div
            className="bg-[#B08D57] h-full transition-all duration-500"
            style={{ width: `${Math.min(100, (discountedSubtotal / 2000) * 100)}%` }}
          />
        </div>
      </div>

      {/* Grid: Cart Items vs Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left 8 cols: Cart Table */}
        <div className="lg:col-span-8 space-y-6">
          <div className="divide-y divide-[#3B2A20]/8">
            {cart.map((item) => {
              const itemPrice = item.product.salePrice || item.product.price;
              const title = language === 'ar' ? item.product.nameAr : item.product.nameEn;
              const colorName =
                language === 'ar' ? item.selectedColor.nameAr : item.selectedColor.nameEn;

              return (
                <div
                  key={`${item.product.id}-${item.selectedColor.hex}`}
                  className="py-6 first:pt-0 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={title}
                      className="w-20 h-24 sm:w-24 sm:h-28 object-cover bg-stone-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/product/${item.product.slug}`}
                        className="font-serif-luxury text-lg sm:text-xl text-[#1C1C1C] hover:text-[#B08D57] transition-colors line-clamp-1 block"
                      >
                        {title}
                      </Link>

                      <span className="text-[11px] uppercase tracking-wider text-stone-500 block mt-1">
                        {colorName}
                      </span>

                      <span className="text-xs font-semibold text-[#1C1C1C] mt-2 block">
                        {formatPrice(itemPrice, language)}
                      </span>
                    </div>
                  </div>

                  {/* Quantity and Line Total */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                    <div className="flex items-center border border-[#1C1C1C]/20 bg-white">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedColor.hex, item.quantity - 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-50"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-[#1C1C1C]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.selectedColor.hex, item.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center text-stone-600 hover:bg-stone-50"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-serif-luxury text-base sm:text-lg font-medium text-[#1C1C1C] min-w-[90px] text-end">
                      {formatPrice(itemPrice * item.quantity, language)}
                    </span>

                    <button
                      onClick={() => removeFromCart(item.product.id, item.selectedColor.hex)}
                      className="text-stone-400 hover:text-stone-800 p-1"
                      aria-label="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <Link
              to="/shop"
              className="text-xs uppercase tracking-widest text-[#1C1C1C] hover:text-[#B08D57] font-semibold flex items-center gap-2"
            >
              <span>← {t.cart.continueShopping}</span>
            </Link>
          </div>
        </div>

        {/* Right 4 cols: Summary Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 grad-sand-ivory border border-[#3B2A20]/8 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block">
              {t.cart.orderSummary}
            </span>

            {/* Promo Code */}
            {couponCode ? (
              <div className="p-3 bg-white/80 border border-[#B08D57]/40 text-xs flex justify-between items-center">
                <span>{t.cart.couponApplied.replace('{code}', couponCode)}</span>
                <button onClick={removeCoupon} className="text-stone-500 hover:text-stone-800 font-bold">
                  ✕
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="ATEEQ10"
                  className="flex-1 bg-white border border-[#3B2A20]/15 px-3 py-2 text-xs text-[#1C1C1C] outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1C1C1C] text-[#FAF7F2] text-xs uppercase tracking-wider font-semibold"
                >
                  {t.cart.applyCoupon}
                </button>
              </form>
            )}

            {/* Totals */}
            <div className="space-y-3 text-xs border-t border-[#3B2A20]/10 pt-4">
              <div className="flex justify-between text-stone-600">
                <span>{t.cart.subtotal}</span>
                <span className="font-medium text-[#1C1C1C]">{formatPrice(rawSubtotal, language)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-[#8C6B3F]">
                  <span>{t.cart.discount} (10%)</span>
                  <span>-{formatPrice(discount, language)}</span>
                </div>
              )}

              <div className="flex justify-between text-stone-600">
                <span>{t.cart.deliveryFee}</span>
                <span className="font-medium text-[#1C1C1C]">
                  {deliveryFee === 0 ? t.cart.freeDelivery : formatPrice(deliveryFee, language)}
                </span>
              </div>

              <div className="border-t border-[#3B2A20]/10 pt-4 flex justify-between items-baseline">
                <span className="font-serif-luxury text-base text-[#1C1C1C]">
                  {t.cart.grandTotal}
                </span>
                <span className="font-serif-luxury text-2xl font-medium text-[#1C1C1C]">
                  {formatPrice(total, language)}
                </span>
              </div>
              <span className="text-[10px] text-stone-400 block">{t.cart.vatIncluded}</span>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="btn-quiet-luxury w-full py-4 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
              >
                <span>{t.cart.proceedCheckout}</span>
                <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
              </button>

              <a
                href={whatsappCheckoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 border border-[#B08D57] text-[#1C1C1C] hover:bg-white text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#8C6B3F]" />
                <span>{t.cart.orderWhatsApp}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
