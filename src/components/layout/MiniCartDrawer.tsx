import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Plus, Minus, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useStore } from '../../store/useStore.ts';
import { formatPrice, calculateCartSummary } from '../../utils/formatters.ts';

export const MiniCartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    language,
    couponDiscountPercentage,
  } = useStore();
  const navigate = useNavigate();

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.product.salePrice || item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const { discountedSubtotal, hasUnlockedFreeDelivery, amountNeededForFreeDelivery } =
    calculateCartSummary(rawSubtotal, couponDiscountPercentage);

  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Dimmed Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-[#1C1C1C]/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />

          {/* Slide-in Drawer with subtle ivory-to-sand gradient */}
          <motion.div
            initial={{ x: language === 'ar' ? '-100%' : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: language === 'ar' ? '-100%' : '100%' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-y-0 ${
              language === 'ar' ? 'left-0' : 'right-0'
            } max-w-md w-full grad-sand-ivory shadow-2xl flex flex-col border-l border-[#3B2A20]/10`}
          >
            {/* Header */}
            <div className="p-6 border-b border-[#3B2A20]/8 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block">
                  {language === 'ar' ? 'حقيبة التسوق' : 'Shopping Bag'}
                </span>
                <h2 className="font-serif-luxury font-medium text-xl text-[#1C1C1C]">
                  {language === 'ar' ? 'القطع المختارة' : 'Selected Pieces'} ({totalItems})
                </h2>
              </div>

              <button
                onClick={() => setCartOpen(false)}
                className="p-1.5 text-[#1C1C1C]/60 hover:text-[#1C1C1C] transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {/* Delivery Progress Bar */}
            <div className="px-6 py-3 bg-white/40 border-b border-[#3B2A20]/5 text-xs">
              <p className="text-[11px] text-[#3B2A20] font-light mb-1.5">
                {hasUnlockedFreeDelivery
                  ? (language === 'ar' ? 'توصيل وتركيب مجاني ملكي مؤكد' : 'Complimentary White-Glove Delivery unlocked')
                  : (language === 'ar'
                      ? `أضف ${formatPrice(amountNeededForFreeDelivery, language)} للتوصيل المجاني`
                      : `Add ${formatPrice(amountNeededForFreeDelivery, language)} for Complimentary Delivery`)}
              </p>
              <div className="w-full bg-[#E8DFD3] h-[2px]">
                <div
                  className="bg-[#B08D57] h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (discountedSubtotal / 2000) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Cart Line Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#3B2A20]/5">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-4">
                  <ShoppingBag className="w-10 h-10 text-stone-300 stroke-[1]" />
                  <p className="font-serif-luxury text-xl font-light text-[#1C1C1C]">
                    {language === 'ar' ? 'حقيبتك فارغة حالياً' : 'Your Bag is Empty'}
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/shop');
                    }}
                    className="btn-quiet-luxury text-xs uppercase tracking-widest px-6 py-3 font-semibold"
                  >
                    {language === 'ar' ? 'استعراض التشكيلة' : 'Discover Collections'}
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const itemPrice = item.product.salePrice || item.product.price;
                  const title = language === 'ar' ? item.product.nameAr : item.product.nameEn;
                  const colorName =
                    language === 'ar' ? item.selectedColor.nameAr : item.selectedColor.nameEn;

                  return (
                    <div
                      key={`${item.product.id}-${item.selectedColor.hex}`}
                      className="pt-6 first:pt-0 flex gap-4"
                    >
                      <img
                        src={item.product.images[0]}
                        alt={title}
                        className="w-20 h-24 object-cover bg-stone-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              to={`/product/${item.product.slug}`}
                              onClick={() => setCartOpen(false)}
                              className="font-serif-luxury font-medium text-base text-[#1C1C1C] hover:text-[#B08D57] line-clamp-1 transition-colors"
                            >
                              {title}
                            </Link>
                            <button
                              onClick={() => removeFromCart(item.product.id, item.selectedColor.hex)}
                              className="text-stone-400 hover:text-stone-800 p-0.5 transition-colors"
                              aria-label="Remove item"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <span className="text-[10px] uppercase tracking-wider text-stone-500 block mt-0.5">
                            {colorName}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Qty +/- */}
                          <div className="flex items-center border border-[#3B2A20]/20 bg-white/70">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedColor.hex,
                                  item.quantity - 1
                                )
                              }
                              className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-semibold text-[#1C1C1C]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.selectedColor.hex,
                                  item.quantity + 1
                                )
                              }
                              className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-semibold text-[#1C1C1C]">
                            {formatPrice(itemPrice * item.quantity, language)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#3B2A20]/8 bg-white/40 space-y-4">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-stone-500 uppercase tracking-wider">
                    {language === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}
                  </span>
                  <span className="font-serif-luxury font-medium text-lg text-[#1C1C1C]">
                    {formatPrice(discountedSubtotal, language)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/cart');
                    }}
                    className="w-full py-3 px-3 border border-[#1C1C1C] text-[#1C1C1C] text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors"
                  >
                    {language === 'ar' ? 'عرض السلة' : 'View Bag'}
                  </button>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="btn-quiet-luxury w-full py-3 px-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"
                  >
                    <span>{language === 'ar' ? 'إتمام الطلب' : 'Checkout'}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
