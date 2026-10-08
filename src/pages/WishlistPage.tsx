import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';
import { useStore } from '../store/useStore.ts';
import { PRODUCTS } from '../data/products.ts';
import { formatPrice } from '../utils/formatters.ts';

export const WishlistPage: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const { wishlist, toggleWishlist, clearWishlist, addToCart, addToast } = useStore();

  const wishlistedProducts = PRODUCTS.filter((p) => wishlist.includes(p.id));
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleMoveAllToCart = () => {
    wishlistedProducts.forEach((product) => {
      addToCart(product, 1);
    });
    clearWishlist();
    addToast({
      type: 'success',
      titleEn: 'Moved All to Bag',
      titleAr: 'تم نقل كافة القطع إلى السلة',
      messageEn: 'All wishlisted items have been transferred to your bag.',
      messageAr: 'تمت إضافة جميع عناصر المفضلة إلى سلة مشترياتك.',
    });
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="pt-36 pb-32 max-w-3xl mx-auto px-6 text-center space-y-6">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block">
          Al Bait Al Ateeq
        </span>
        <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
          {t.wishlist.emptyTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto font-light">
          {t.wishlist.emptySubtitle}
        </p>
        <div className="pt-4">
          <Link
            to="/shop"
            className="btn-quiet-luxury inline-flex items-center gap-2 px-8 py-4 text-xs uppercase tracking-widest font-semibold"
          >
            <span>{t.wishlist.startShopping}</span>
            <ArrowIcon className="w-3.5 h-3.5 text-[#D4B483]" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
      <div className="border-b border-[#3B2A20]/10 pb-6 flex items-baseline justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block mb-1">
            {language === 'ar' ? 'قائمة الأمنيات' : 'Saved Curation'}
          </span>
          <h1 className="font-serif-luxury text-3xl sm:text-4xl font-light text-[#1C1C1C]">
            {t.wishlist.title}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={handleMoveAllToCart}
            className="text-xs uppercase tracking-widest text-[#1C1C1C] hover:text-[#B08D57] font-semibold transition-colors"
          >
            {t.wishlist.addAllToCart}
          </button>
          <button
            onClick={clearWishlist}
            className="text-xs uppercase tracking-widest text-stone-400 hover:text-stone-800 transition-colors"
          >
            {t.wishlist.clearWishlist}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {wishlistedProducts.map((product) => {
          const title = language === 'ar' ? product.nameAr : product.nameEn;
          const currentPrice = product.salePrice || product.price;

          return (
            <div key={product.id} className="group flex flex-col justify-between">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                <Link to={`/product/${product.slug}`}>
                  <img
                    src={product.images[0]}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                  />
                </Link>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-stone-600"
                  aria-label="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-4 space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-1">
                    {product.category.replace('-', ' ')}
                  </span>
                  <Link to={`/product/${product.slug}`}>
                    <h3 className="font-serif-luxury text-lg text-[#1C1C1C] hover:text-[#B08D57] transition-colors line-clamp-1">
                      {title}
                    </h3>
                  </Link>
                  <span className="text-xs font-semibold text-[#1C1C1C] mt-1 block">
                    {formatPrice(currentPrice, language)}
                  </span>
                </div>

                <button
                  onClick={() => {
                    addToCart(product, 1);
                    toggleWishlist(product.id);
                  }}
                  className="btn-quiet-luxury w-full py-3 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D4B483]" />
                  <span>{t.wishlist.moveToCart}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
