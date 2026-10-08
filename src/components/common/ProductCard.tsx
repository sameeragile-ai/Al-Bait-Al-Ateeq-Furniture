import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types/index.ts';
import { useStore } from '../../store/useStore.ts';
import { formatPrice } from '../../utils/formatters.ts';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { language, toggleWishlist, isInWishlist } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const title = language === 'ar' ? product.nameAr : product.nameEn;
  const material = language === 'ar' ? product.materialAr : product.materialEn;
  const currentPrice = product.salePrice || product.price;
  const hasDiscount = Boolean(product.salePrice && product.salePrice < product.price);

  return (
    <div
      className="group relative flex flex-col cursor-pointer"
      data-cursor="view"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Borderless Image Container */}
      <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-[#E8DFD3]/40">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {/* Primary image */}
          <motion.img
            src={product.images[0]}
            alt={title}
            animate={{
              scale: isHovered ? 1.03 : 1,
              opacity: isHovered && product.images[1] ? 0 : 1,
            }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />

          {/* Secondary image crossfade */}
          {product.images[1] && (
            <motion.img
              src={product.images[1]}
              alt={title}
              animate={{
                scale: isHovered ? 1.03 : 1,
                opacity: isHovered ? 1 : 0,
              }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          )}

          {/* Bottom subtle gradient overlay on hover behind quick view */}
          <motion.div
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1C1C1C]/65 via-[#1C1C1C]/25 to-transparent flex items-end justify-between p-4"
          >
            <span className="text-[11px] uppercase tracking-widest text-[#FAF7F2] font-medium flex items-center gap-1">
              <span>{language === 'ar' ? 'معاينة القطعة' : 'View Piece'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#D4B483]" />
            </span>
            <span className="text-[10px] text-[#FAF7F2]/80 uppercase tracking-wider font-light">
              {product.availableColors.length} {language === 'ar' ? 'ألوان' : 'Finishes'}
            </span>
          </motion.div>
        </Link>

        {/* Top Badges & Wishlist Action */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-start justify-between pointer-events-none">
          <div className="flex flex-col gap-1 items-start">
            {hasDiscount && (
              <span className="text-[10px] tracking-wider uppercase bg-[#1C1C1C] text-[#FAF7F2] px-2 py-0.5 font-medium">
                {language === 'ar' ? 'خصم' : 'Sale'}
              </span>
            )}
            {product.stockStatus === 'made_to_order' && (
              <span className="text-[10px] tracking-wider uppercase bg-[#B08D57] text-[#FAF7F2] px-2 py-0.5 font-medium">
                {language === 'ar' ? 'تفصيل' : 'Bespoke'}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`pointer-events-auto p-2 transition-all duration-300 ${
              isWishlisted
                ? 'text-[#B08D57]'
                : 'text-[#1C1C1C]/60 hover:text-[#1C1C1C] hover:scale-110'
            }`}
            aria-label="Wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isWishlisted ? 'fill-[#B08D57]' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Editorial Typography Content Below Image */}
      <div className="pt-4 pb-2 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#3B2A20]/60 block mb-1">
            {material.split(',')[0]}
          </span>

          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-[#1C1C1C] hover:text-[#B08D57] transition-colors leading-snug line-clamp-1">
              {title}
            </h3>
          </Link>
        </div>

        <div className="mt-2 flex items-baseline gap-2">
          {hasDiscount ? (
            <>
              <span className="text-sm font-semibold text-[#1C1C1C]">
                {formatPrice(product.salePrice!, language)}
              </span>
              <span className="text-xs text-[#1C1C1C]/40 line-through">
                {formatPrice(product.price, language)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-[#1C1C1C]">
              {formatPrice(product.price, language)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
