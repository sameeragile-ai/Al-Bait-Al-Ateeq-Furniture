export type Language = 'en' | 'ar';

export type ProductCategory =
  | 'living-room'
  | 'bedroom'
  | 'majlis'
  | 'dining'
  | 'storage'
  | 'tables'
  | 'custom';

export interface CategoryInfo {
  id: ProductCategory;
  slug: string;
  nameEn: string;
  nameAr: string;
  descriptionEn: string;
  descriptionAr: string;
  image: string;
  itemCount: number;
}

export interface ColorOption {
  nameEn: string;
  nameAr: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  author: string;
  authorCity: string;
  rating: number;
  date: string;
  commentEn: string;
  commentAr: string;
}

export type StockStatus = 'in_stock' | 'low_stock' | 'made_to_order';

export interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string;
  category: ProductCategory;
  price: number;
  salePrice?: number;
  descriptionEn: string;
  descriptionAr: string;
  materialEn: string;
  materialAr: string;
  dimensionsEn: string;
  dimensionsAr: string;
  availableColors: ColorOption[];
  stockStatus: StockStatus;
  rating: number;
  reviewCount: number;
  images: string[];
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  featuresEn: string[];
  featuresAr: string[];
  careInstructionsEn: string;
  careInstructionsAr: string;
  reviews: ProductReview[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: ColorOption;
  customNotes?: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  emirate: string;
  cityArea: string;
  streetAddress: string;
  apartmentVilla: string;
  deliveryNotes?: string;
}

export type DeliveryMethod = 'standard' | 'express' | 'pickup';

export type PaymentMethod = 'cod' | 'card_on_delivery' | 'card_online';

export interface OrderItem {
  productId: string;
  nameEn: string;
  nameAr: string;
  price: number;
  quantity: number;
  colorNameEn: string;
  colorNameAr: string;
  image: string;
}

export interface Order {
  orderNumber: string;
  date: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
}

export interface CustomOrderRequest {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  emirate: string;
  furnitureType: string;
  dimensions: string;
  preferredMaterials: string;
  fabricPreference: string;
  estimatedBudget: string;
  notes: string;
  referenceImage?: string;
  referenceImageName?: string;
  createdAt: string;
}

export interface FilterState {
  category: ProductCategory | 'all';
  searchQuery: string;
  minPrice: number;
  maxPrice: number;
  materials: string[];
  colors: string[];
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  titleEn: string;
  titleAr: string;
  messageEn?: string;
  messageAr?: string;
}
