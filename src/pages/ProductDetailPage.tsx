import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  MessageCircle,
  Truck,
  ShieldCheck,
  Star,
  Check,
  ArrowRight,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';
import { useStore } from '../store/useStore.ts';
import { getProductBySlug, getRelatedProducts } from '../data/products.ts';
import { ProductCard } from '../components/common/ProductCard.tsx';
import { formatPrice } from '../utils/formatters.ts';
import { ColorOption } from '../types/index.ts';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, language, isRtl } = useTranslation();
  const { addToCart, toggleWishlist, isInWishlist, addToast } = useStore();

  const product = getProductBySlug(slug || '');

  // Gallery & Options
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'description' | 'care' | 'reviews'>('specs');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (product) {
      setSelectedColor(product.availableColors[0]);
      setSelectedImageIndex(0);
      setQuantity(1);
      document.title = `${
        language === 'ar' ? product.nameAr : product.nameEn
      } | Al Bait Al Ateeq`;
    }
  }, [product, language]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center space-y-4">
        <h1 className="font-serif-luxury text-3xl font-light text-[#1C1C1C]">
          {t.notFound.title}
        </h1>
        <p className="text-xs text-stone-500">{t.notFound.subtitle}</p>
        <Link
          to="/shop"
          className="btn-quiet-luxury inline-block text-xs uppercase tracking-widest px-6 py-3 font-semibold mt-4"
        >
          {t.notFound.browseShop}
        </Link>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);
  const title = language === 'ar' ? product.nameAr : product.nameEn;
  const description = language === 'ar' ? product.descriptionAr : product.descriptionEn;
  const material = language === 'ar' ? product.materialAr : product.materialEn;
  const dimensions = language === 'ar' ? product.dimensionsAr : product.dimensionsEn;
  const features = language === 'ar' ? product.featuresAr : product.featuresEn;
  const careInstructions = language === 'ar' ? product.careInstructionsAr : product.careInstructionsEn;

  const currentPrice = product.salePrice || product.price;
  const hasDiscount = Boolean(product.salePrice && product.salePrice < product.price);

  const relatedProducts = getRelatedProducts(product.id, product.category, 4);

  const whatsappText =
    language === 'ar'
      ? `مرحباً مفروشات البيت العتيق، أود الاستفسار والطلب للمنتج "${product.nameAr}" (الرمز: ${product.id}، السعر: ${formatPrice(currentPrice, 'ar')}). هل يمكن إفادتي بمدة التوصيل والتفاصيل؟`
      : `Hello Al Bait Al Ateeq Furniture, I am interested in ordering the "${product.nameEn}" (Ref: ${product.id}, Price: ${formatPrice(currentPrice, 'en')}). Can you assist me with availability and delivery?`;

  const whatsappUrl = `https://wa.me/971500000000?text=${encodeURIComponent(whatsappText)}`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title, text: description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast({
        type: 'info',
        titleEn: 'Link Copied',
        titleAr: 'تم نسخ الرابط',
        messageEn: 'Product link copied to clipboard.',
        messageAr: 'تم نسخ رابط المنتج إلى الحافظة.',
      });
    }
  };

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-20">
      {/* Editorial Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#3B2A20]/50 font-light">
        <Link to="/" className="hover:text-[#1C1C1C] transition-colors">
          {t.nav.home}
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#1C1C1C] transition-colors">
          {t.nav.shop}
        </Link>
        <span>/</span>
        <span className="text-[#1C1C1C] font-normal truncate max-w-xs">{title}</span>
      </nav>

      {/* Main Grid: Gallery on left, Details on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Gallery Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            className="relative aspect-[4/5] sm:aspect-[4/3] overflow-hidden bg-[#E8DFD3]/40 cursor-crosshair"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={title}
              className={`w-full h-full object-cover transition-transform duration-200 ${
                isZoomed ? 'scale-150 origin-center' : 'scale-100'
              }`}
              style={
                isZoomed
                  ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                  : undefined
              }
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2 pointer-events-none">
              {hasDiscount && (
                <span className="bg-[#1C1C1C] text-[#FAF7F2] text-[10px] uppercase tracking-widest px-2.5 py-1">
                  {language === 'ar' ? 'عرض خاص' : 'Sale'}
                </span>
              )}
              {product.stockStatus === 'made_to_order' && (
                <span className="bg-[#B08D57] text-[#FAF7F2] text-[10px] uppercase tracking-widest px-2.5 py-1">
                  {language === 'ar' ? 'تفصيل خاص' : 'Bespoke'}
                </span>
              )}
            </div>

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2.5 bg-white/80 hover:bg-white text-[#1C1C1C] transition-colors"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 shrink-0 overflow-hidden border transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#B08D57] opacity-100'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Column (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C6B3F] font-semibold block mb-2">
              {product.category.replace('-', ' ')}
            </span>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-[#1C1C1C] font-light leading-tight">
              {title}
            </h1>

            <p className="text-xs text-[#3B2A20]/70 mt-2 font-light leading-relaxed">
              {material}
            </p>
          </div>

          {/* Price & Stock */}
          <div className="py-4 border-y border-[#3B2A20]/10 flex items-baseline justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 block mb-0.5">
                {t.productDetail.price}
              </span>
              <div className="flex items-baseline gap-3">
                {hasDiscount ? (
                  <>
                    <span className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#1C1C1C]">
                      {formatPrice(product.salePrice!, language)}
                    </span>
                    <span className="text-xs text-stone-400 line-through">
                      {formatPrice(product.price, language)}
                    </span>
                  </>
                ) : (
                  <span className="font-serif-luxury text-2xl sm:text-3xl font-medium text-[#1C1C1C]">
                    {formatPrice(product.price, language)}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 block">
                {t.productDetail.inclusiveTax}
              </span>
            </div>

            <span className="text-[11px] uppercase tracking-widest text-[#8C6B3F] font-medium">
              {product.stockStatus === 'in_stock'
                ? t.productDetail.inStock
                : t.productDetail.madeToOrder}
            </span>
          </div>

          {/* Color Finish Selection */}
          {selectedColor && product.availableColors.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] uppercase tracking-widest text-stone-500">
                  {t.productDetail.selectColor}
                </span>
                <span className="font-medium text-[#1C1C1C]">
                  {language === 'ar' ? selectedColor.nameAr : selectedColor.nameEn}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {product.availableColors.map((color) => {
                  const isSelected = selectedColor.hex === color.hex;
                  return (
                    <button
                      key={color.hex}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-8 h-8 rounded-full border transition-all flex items-center justify-center ${
                        isSelected
                          ? 'border-[#1C1C1C] ring-1 ring-[#B08D57] scale-110'
                          : 'border-white/80 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={language === 'ar' ? color.nameAr : color.nameEn}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Purchase Controls */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3">
              {/* Qty Selector */}
              <div className="flex items-center border border-[#1C1C1C]/20 bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-12 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  -
                </button>
                <span className="w-10 text-center font-semibold text-xs text-[#1C1C1C]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-12 flex items-center justify-center text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={() =>
                  addToCart(product, quantity, selectedColor || product.availableColors[0])
                }
                className="btn-quiet-luxury flex-1 h-12 text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
              >
                <span>{t.productDetail.addToCart}</span>
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 border flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? 'border-[#B08D57] text-[#B08D57]'
                    : 'border-[#1C1C1C]/20 text-[#1C1C1C] hover:border-[#1C1C1C]'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#B08D57]' : ''}`} />
              </button>
            </div>

            {/* Direct Order on WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 border border-[#B08D57] text-[#1C1C1C] hover:bg-[#FAF7F2] text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-[#8C6B3F]" />
              <span>{t.productDetail.orderWhatsApp}</span>
            </a>
          </div>

          {/* Delivery & Warranty Points */}
          <div className="pt-4 border-t border-[#3B2A20]/10 grid grid-cols-2 gap-4 text-xs font-light text-stone-600">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#1C1C1C]">{t.features.freeDeliveryTitle}</p>
                <p className="text-[11px] text-stone-400">Above AED 2,000</p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#B08D57] shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-[#1C1C1C]">5-Year Guarantee</p>
                <p className="text-[11px] text-stone-400">Solid Hardwoods</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Tabs Section */}
      <div className="border-t border-[#3B2A20]/10 pt-12 space-y-8">
        <div className="flex items-center gap-8 border-b border-[#3B2A20]/10 pb-4 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('specs')}
            className={`text-xs uppercase tracking-widest pb-1 transition-colors whitespace-nowrap ${
              activeTab === 'specs'
                ? 'text-[#B08D57] font-semibold border-b-2 border-[#B08D57]'
                : 'text-stone-400 hover:text-[#1C1C1C]'
            }`}
          >
            {t.productDetail.tabs.specifications}
          </button>
          <button
            onClick={() => setActiveTab('description')}
            className={`text-xs uppercase tracking-widest pb-1 transition-colors whitespace-nowrap ${
              activeTab === 'description'
                ? 'text-[#B08D57] font-semibold border-b-2 border-[#B08D57]'
                : 'text-stone-400 hover:text-[#1C1C1C]'
            }`}
          >
            {t.productDetail.tabs.description}
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`text-xs uppercase tracking-widest pb-1 transition-colors whitespace-nowrap ${
              activeTab === 'care'
                ? 'text-[#B08D57] font-semibold border-b-2 border-[#B08D57]'
                : 'text-stone-400 hover:text-[#1C1C1C]'
            }`}
          >
            {t.productDetail.tabs.craftsmanship}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-xs uppercase tracking-widest pb-1 transition-colors whitespace-nowrap ${
              activeTab === 'reviews'
                ? 'text-[#B08D57] font-semibold border-b-2 border-[#B08D57]'
                : 'text-stone-400 hover:text-[#1C1C1C]'
            }`}
          >
            {t.productDetail.tabs.reviews} ({product.reviewCount})
          </button>
        </div>

        <div>
          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-light text-[#3B2A20]">
              <div className="space-y-4">
                <div className="border-b border-stone-200 pb-2">
                  <span className="text-stone-400 uppercase tracking-widest text-[10px] block mb-1">
                    {t.productDetail.specs.dimensions}
                  </span>
                  <span className="text-[#1C1C1C] font-medium">{dimensions}</span>
                </div>
                <div className="border-b border-stone-200 pb-2">
                  <span className="text-stone-400 uppercase tracking-widest text-[10px] block mb-1">
                    {t.productDetail.specs.material}
                  </span>
                  <span className="text-[#1C1C1C] font-medium">{material}</span>
                </div>
                <div className="border-b border-stone-200 pb-2">
                  <span className="text-stone-400 uppercase tracking-widest text-[10px] block mb-1">
                    {t.productDetail.specs.warranty}
                  </span>
                  <span className="text-[#1C1C1C] font-medium">{t.productDetail.specs.warrantyText}</span>
                </div>
              </div>

              <div>
                <span className="text-stone-400 uppercase tracking-widest text-[10px] block mb-3">
                  Key Attributes
                </span>
                <ul className="space-y-2.5">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#B08D57]">—</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'description' && (
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-[#3B2A20]/80 font-light leading-relaxed">
              <p>{description}</p>
            </div>
          )}

          {activeTab === 'care' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl text-xs text-[#3B2A20]/80 font-light leading-relaxed">
              <div className="p-6 bg-white/70 border border-[#3B2A20]/10 space-y-2">
                <h4 className="font-serif-luxury text-base text-[#1C1C1C] font-medium">Fabric & Velvet</h4>
                <p>{t.productDetail.care.fabricCare}</p>
              </div>
              <div className="p-6 bg-white/70 border border-[#3B2A20]/10 space-y-2">
                <h4 className="font-serif-luxury text-base text-[#1C1C1C] font-medium">Timber & Stone</h4>
                <p>{t.productDetail.care.woodCare}</p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 max-w-3xl">
              {product.reviews.map((rev) => (
                <div key={rev.id} className="border-b border-stone-200 pb-4 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-luxury text-sm font-medium text-[#1C1C1C]">{rev.author}</span>
                    <div className="flex gap-0.5 text-[#B08D57]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-stone-600 font-light">{language === 'ar' ? rev.commentAr : rev.commentEn}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-8 pt-12 border-t border-[#3B2A20]/10">
          <div className="flex items-end justify-between">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light text-[#1C1C1C]">
              {t.productDetail.relatedProducts}
            </h2>
            <Link
              to={`/shop?category=${product.category}`}
              className="text-xs uppercase tracking-widest text-[#1C1C1C] hover:text-[#B08D57] flex items-center gap-1.5 transition-colors"
            >
              <span>{t.categories.viewAll}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
