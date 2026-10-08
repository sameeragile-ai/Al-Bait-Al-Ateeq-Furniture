import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  X,
  Search,
  RotateCcw,
} from 'lucide-react';
import { useTranslation } from '../i18n/index.ts';
import { PRODUCTS, CATEGORIES } from '../data/products.ts';
import { ProductCard } from '../components/common/ProductCard.tsx';
import { ProductCategory } from '../types/index.ts';
import { formatPrice } from '../utils/formatters.ts';

export const ShopPage: React.FC = () => {
  const { t, language, isRtl } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category') as ProductCategory | null;
  const queryParam = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState<string>(queryParam);
  const [priceRange, setPriceRange] = useState<number>(50000);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [visibleCount, setVisibleCount] = useState<number>(12);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    } else {
      setSelectedCategory('all');
    }
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [categoryParam, queryParam]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setVisibleCount(12);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const materialsList = [
    { id: 'all', nameEn: 'All Materials', nameAr: 'كافة الخامات' },
    { id: 'walnut', nameEn: 'American Walnut', nameAr: 'خشب جوز أمريكي' },
    { id: 'oak', nameEn: 'European Oak', nameAr: 'خشب بلوط أوروبي' },
    { id: 'teak', nameEn: 'Solid Teak', nameAr: 'خشب تيك طبيعي' },
    { id: 'velvet', nameEn: 'Turkish Silk Velvet', nameAr: 'مخمل تركي حريري' },
    { id: 'boucle', nameEn: 'Italian Bouclé', nameAr: 'قماش بوكليه إيطالي' },
    { id: 'marble', nameEn: 'Marble & Travertine', nameAr: 'رخام وترافرتين طبيعي' },
    { id: 'brass', nameEn: 'Cast Brass', nameAr: 'نحاس مسبوك' },
  ];

  const colorsList = [
    { id: 'all', nameEn: 'All', nameAr: 'الكل', hex: '' },
    { id: 'gold', nameEn: 'Gold & Brass', nameAr: 'ذهبي ونحاسي', hex: '#B08D57' },
    { id: 'beige', nameEn: 'Warm Ivory', nameAr: 'عاجي دافئ', hex: '#E8DFD3' },
    { id: 'brown', nameEn: 'Walnut', nameAr: 'جوز طبيعي', hex: '#3B2A20' },
    { id: 'emerald', nameEn: 'Emerald', nameAr: 'زمردي', hex: '#1C3B2B' },
    { id: 'navy', nameEn: 'Navy', nameAr: 'كحلي', hex: '#1E293B' },
    { id: 'black', nameEn: 'Charcoal', nameAr: 'فحمي', hex: '#1C1C1C' },
  ];

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName =
          product.nameEn.toLowerCase().includes(q) || product.nameAr.toLowerCase().includes(q);
        const matchDesc =
          product.descriptionEn.toLowerCase().includes(q) ||
          product.descriptionAr.toLowerCase().includes(q);
        const matchMat =
          product.materialEn.toLowerCase().includes(q) ||
          product.materialAr.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchMat) return false;
      }

      const priceToCompare = product.salePrice || product.price;
      if (priceToCompare > priceRange) return false;

      if (inStockOnly && product.stockStatus !== 'in_stock') return false;

      if (selectedMaterial !== 'all') {
        const matLower = product.materialEn.toLowerCase();
        if (selectedMaterial === 'walnut' && !matLower.includes('walnut')) return false;
        if (selectedMaterial === 'oak' && !matLower.includes('oak')) return false;
        if (selectedMaterial === 'teak' && !matLower.includes('teak')) return false;
        if (selectedMaterial === 'velvet' && !matLower.includes('velvet')) return false;
        if (selectedMaterial === 'boucle' && !matLower.includes('bouclé') && !matLower.includes('boucle')) return false;
        if (selectedMaterial === 'marble' && !matLower.includes('marble') && !matLower.includes('travertine')) return false;
        if (selectedMaterial === 'brass' && !matLower.includes('brass')) return false;
      }

      if (selectedColor !== 'all') {
        const hasMatchingColor = product.availableColors.some((c) => {
          const colorName = c.nameEn.toLowerCase();
          if (selectedColor === 'gold' && (colorName.includes('gold') || colorName.includes('brass') || colorName.includes('mustard'))) return true;
          if (selectedColor === 'beige' && (colorName.includes('beige') || colorName.includes('cream') || colorName.includes('sand') || colorName.includes('oat') || colorName.includes('alabaster'))) return true;
          if (selectedColor === 'brown' && (colorName.includes('brown') || colorName.includes('walnut') || colorName.includes('cognac') || colorName.includes('mocha') || colorName.includes('caramel') || colorName.includes('teak'))) return true;
          if (selectedColor === 'emerald' && (colorName.includes('emerald') || colorName.includes('sage') || colorName.includes('olive'))) return true;
          if (selectedColor === 'navy' && (colorName.includes('navy') || colorName.includes('sapphire') || colorName.includes('blue'))) return true;
          if (selectedColor === 'black' && (colorName.includes('black') || colorName.includes('charcoal') || colorName.includes('noir') || colorName.includes('ebony'))) return true;
          return false;
        });
        if (!hasMatchingColor) return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return (b.isFeatured ? 2 : b.isBestSeller ? 1 : 0) - (a.isFeatured ? 2 : a.isBestSeller ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, priceRange, inStockOnly, selectedMaterial, selectedColor, sortBy]);

  const displayedProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  const resetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange(50000);
    setSelectedMaterial('all');
    setSelectedColor('all');
    setInStockOnly(false);
    setSortBy('featured');
    setVisibleCount(12);
    setSearchParams({});
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery.trim() !== '' ||
    priceRange < 50000 ||
    selectedMaterial !== 'all' ||
    selectedColor !== 'all' ||
    inStockOnly;

  return (
    <div className="pt-28 sm:pt-32 pb-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-[#3B2A20]/10 pb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C6B3F] font-semibold block mb-2">
              {language === 'ar' ? 'كتالوج المفروشات' : 'The Complete Collection'}
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl font-light text-[#1C1C1C]">
              {t.shop.title}
            </h1>
          </div>

          {/* Clean minimal search bar */}
          <div className="relative max-w-xs w-full border-b border-[#1C1C1C]/20 pb-1.5 focus-within:border-[#B08D57] transition-colors">
            <Search className="w-3.5 h-3.5 absolute top-1.5 left-0 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full bg-transparent pl-6 pr-6 text-xs text-[#1C1C1C] placeholder:text-stone-400 outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute top-1 right-0 text-stone-400 hover:text-stone-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Minimal Underline Category Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto pt-2 scrollbar-none text-xs uppercase tracking-widest font-medium">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`pb-2 whitespace-nowrap transition-colors relative ${
              selectedCategory === 'all'
                ? 'text-[#B08D57] font-semibold'
                : 'text-stone-500 hover:text-[#1C1C1C]'
            }`}
          >
            <span>{t.categories.all}</span>
            {selectedCategory === 'all' && (
              <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#B08D57]" />
            )}
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`pb-2 whitespace-nowrap transition-colors relative ${
                selectedCategory === cat.id
                  ? 'text-[#B08D57] font-semibold'
                  : 'text-stone-500 hover:text-[#1C1C1C]'
              }`}
            >
              <span>{language === 'ar' ? cat.nameAr : cat.nameEn}</span>
              {selectedCategory === cat.id && (
                <span className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#B08D57]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid & Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Sidebar Filters (3 cols) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-8 pr-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#3B2A20]/10">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#1C1C1C]">
              {t.shop.filters}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[10px] uppercase tracking-wider text-[#B08D57] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.shop.clearFilters}</span>
              </button>
            )}
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-stone-500">{t.shop.priceRange}</span>
              <span className="font-semibold text-[#1C1C1C]">{formatPrice(priceRange, language)}</span>
            </div>
            <input
              type="range"
              min="2000"
              max="50000"
              step="1000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#B08D57] cursor-pointer"
            />
          </div>

          {/* Material Filter */}
          <div className="space-y-3 pt-4 border-t border-[#3B2A20]/10">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#1C1C1C] block">
              {t.shop.material}
            </span>
            <div className="space-y-1.5 text-xs text-stone-600 font-light">
              {materialsList.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat.id)}
                  className={`w-full text-start py-1 transition-colors flex items-center justify-between ${
                    selectedMaterial === mat.id
                      ? 'text-[#B08D57] font-semibold'
                      : 'hover:text-[#1C1C1C]'
                  }`}
                >
                  <span>{language === 'ar' ? mat.nameAr : mat.nameEn}</span>
                  {selectedMaterial === mat.id && <span>•</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3 pt-4 border-t border-[#3B2A20]/10">
            <span className="text-[11px] uppercase tracking-widest font-semibold text-[#1C1C1C] block">
              {t.shop.color}
            </span>
            <div className="flex flex-wrap gap-2">
              {colorsList.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setSelectedColor(col.id)}
                  className={`px-2.5 py-1 text-[11px] border transition-colors ${
                    selectedColor === col.id
                      ? 'border-[#B08D57] text-[#B08D57] font-medium'
                      : 'border-stone-200 text-stone-600 hover:border-stone-400'
                  }`}
                >
                  {language === 'ar' ? col.nameAr : col.nameEn}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only */}
          <div className="pt-4 border-t border-[#3B2A20]/10">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#1C1C1C]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#B08D57]"
              />
              <span>{t.shop.inStockOnly}</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area (9 cols) */}
        <main className="lg:col-span-9 space-y-8">
          {/* Top Bar: Count & Sort */}
          <div className="flex items-center justify-between text-xs text-stone-500 pb-3 border-b border-[#3B2A20]/10">
            <span>
              {displayedProducts.length} {t.shop.of} {filteredProducts.length} {t.shop.products}
            </span>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 text-[#1C1C1C]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{t.shop.filters}</span>
              </button>

              <div className="flex items-center gap-2">
                <span>{t.shop.sortBy}:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-[#1C1C1C] font-medium outline-none cursor-pointer"
                >
                  <option value="featured">{t.shop.sortOptions.featured}</option>
                  <option value="price-asc">{t.shop.sortOptions.priceAsc}</option>
                  <option value="price-desc">{t.shop.sortOptions.priceDesc}</option>
                  <option value="rating">{t.shop.sortOptions.rating}</option>
                  <option value="newest">{t.shop.sortOptions.newest}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Borderless Product Cards Grid */}
          {displayedProducts.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <p className="font-serif-luxury text-xl font-light text-[#1C1C1C]">
                {t.shop.noProducts}
              </p>
              <button
                onClick={resetFilters}
                className="text-xs uppercase tracking-widest text-[#B08D57] hover:underline"
              >
                {t.shop.clearFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {displayedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="pt-12 text-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="border border-[#1C1C1C] hover:bg-[#1C1C1C] hover:text-[#FAF7F2] text-[#1C1C1C] px-8 py-3.5 text-xs uppercase tracking-widest font-semibold transition-colors"
              >
                {t.shop.loadMore}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xs bg-[#FAF7F2] h-full p-6 space-y-6 overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <span className="font-serif-luxury text-lg">{t.shop.filters}</span>
              <button onClick={() => setIsMobileFiltersOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="block mb-2 font-medium">{t.shop.priceRange}</span>
                <input
                  type="range"
                  min="2000"
                  max="50000"
                  step="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#B08D57]"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-[#B08D57]"
                  />
                  <span>{t.shop.inStockOnly}</span>
                </label>
              </div>
            </div>

            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="btn-quiet-luxury w-full py-3 text-xs uppercase tracking-widest font-semibold"
            >
              {language === 'ar' ? 'عرض النتائج' : 'View Pieces'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
