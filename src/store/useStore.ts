import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, ColorOption, Language, Order, Product, ToastMessage } from '../types/index.ts';

interface StoreState {
  // Language & Direction
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;

  // Cart State
  cart: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number, selectedColor?: ColorOption, customNotes?: string) => void;
  removeFromCart: (productId: string, colorHex: string) => void;
  updateQuantity: (productId: string, colorHex: string, quantity: number) => void;
  clearCart: () => void;

  // Coupon
  couponCode: string | null;
  couponDiscountPercentage: number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Wishlist State
  wishlist: string[];
  toggleWishlist: (productId: string) => boolean; // returns true if added, false if removed
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;

  // Last Placed Order (for confirmation page)
  lastOrder: Order | null;
  setLastOrder: (order: Order) => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      language: 'en',
      setLanguage: (lang: Language) => {
        set({ language: lang });
        if (typeof document !== 'undefined') {
          document.documentElement.lang = lang;
          document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        }
      },
      toggleLanguage: () => {
        const nextLang = get().language === 'en' ? 'ar' : 'en';
        get().setLanguage(nextLang);
      },

      cart: [],
      isCartOpen: false,
      setCartOpen: (open: boolean) => set({ isCartOpen: open }),

      addToCart: (product, quantity = 1, selectedColor, customNotes) => {
        const color = selectedColor || product.availableColors[0];
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex(
          (item) => item.product.id === product.id && item.selectedColor.hex === color.hex
        );

        let newCart: CartItem[];
        if (existingIndex > -1) {
          newCart = currentCart.map((item, index) => {
            if (index === existingIndex) {
              return { ...item, quantity: item.quantity + quantity };
            }
            return item;
          });
        } else {
          newCart = [...currentCart, { product, quantity, selectedColor: color, customNotes }];
        }

        set({ cart: newCart, isCartOpen: true });
        get().addToast({
          type: 'success',
          titleEn: 'Added to Bag',
          titleAr: 'تمت الإضافة إلى السلة',
          messageEn: `${product.nameEn} (x${quantity}) was added to your bag.`,
          messageAr: `تمت إضافة ${product.nameAr} (${quantity}×) إلى سلة مشترياتك.`,
        });
      },

      removeFromCart: (productId: string, colorHex: string) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.product.id === productId && item.selectedColor.hex === colorHex)
          ),
        }));
      },

      updateQuantity: (productId: string, colorHex: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, colorHex);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) => {
            if (item.product.id === productId && item.selectedColor.hex === colorHex) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ cart: [], couponCode: null, couponDiscountPercentage: 0 }),

      couponCode: null,
      couponDiscountPercentage: 0,
      applyCoupon: (code: string) => {
        const normalized = code.trim().toUpperCase();
        if (normalized === 'ATEEQ10' || normalized === 'RAMADAN' || normalized === 'VIP') {
          set({ couponCode: normalized, couponDiscountPercentage: 0.1 });
          get().addToast({
            type: 'success',
            titleEn: 'Promo Code Applied',
            titleAr: 'تم تفعيل كود الخصم',
            messageEn: `Code ${normalized} applied with 10% discount!`,
            messageAr: `تم تطبيق الكود ${normalized} بخصم 10%!`,
          });
          return true;
        } else {
          get().addToast({
            type: 'error',
            titleEn: 'Invalid Code',
            titleAr: 'كود غير صحيح',
            messageEn: 'Please enter a valid coupon code like ATEEQ10.',
            messageAr: 'يرجى إدخال كود خصم صالح مثل ATEEQ10.',
          });
          return false;
        }
      },
      removeCoupon: () => set({ couponCode: null, couponDiscountPercentage: 0 }),

      wishlist: [],
      toggleWishlist: (productId: string) => {
        const { wishlist, addToast } = get();
        const exists = wishlist.includes(productId);
        if (exists) {
          set({ wishlist: wishlist.filter((id) => id !== productId) });
          addToast({
            type: 'info',
            titleEn: 'Removed from Wishlist',
            titleAr: 'تمت الإزالة من المفضلة',
            messageEn: 'Item removed from your saved list.',
            messageAr: 'تمت إزالة القطعة من قائمة المفضلة.',
          });
          return false;
        } else {
          set({ wishlist: [...wishlist, productId] });
          addToast({
            type: 'success',
            titleEn: 'Saved to Wishlist',
            titleAr: 'تم الحفظ في المفضلة',
            messageEn: 'Item saved to your wishlist.',
            messageAr: 'تم حفظ القطعة في قائمة رغباتك.',
          });
          return true;
        }
      },
      isInWishlist: (productId: string) => {
        return get().wishlist.includes(productId);
      },
      clearWishlist: () => set({ wishlist: [] }),

      lastOrder: null,
      setLastOrder: (order: Order) => set({ lastOrder: order }),

      toasts: [],
      addToast: (toast) => {
        const id = 'toast_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const newToast: ToastMessage = { ...toast, id };
        set((state) => ({ toasts: [...state.toasts, newToast] }));
        setTimeout(() => {
          get().removeToast(id);
        }, 4000);
      },
      removeToast: (id: string) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },
    }),
    {
      name: 'al-bait-al-ateeq-storage',
      partialize: (state) => ({
        language: state.language,
        cart: state.cart,
        wishlist: state.wishlist,
        couponCode: state.couponCode,
        couponDiscountPercentage: state.couponDiscountPercentage,
        lastOrder: state.lastOrder,
      }),
    }
  )
);
