# Al Bait Al Ateeq Furniture (مفروشات البيت العتيق)

A luxury, production-ready e-commerce web application prototype built for **Al Bait Al Ateeq Furniture**, celebrating timeless Arabian hospitality combined with contemporary craftsmanship in the United Arab Emirates.

---

## 🌟 Features & Highlights

- **Bilingual & RTL-Ready**: English and Arabic with seamless RTL (`dir="rtl"`) layout switching and localized typographic hierarchy (Tajawal for Arabic, Playfair Display & Inter for Latin).
- **Curated 26+ Furniture Portfolio**: High-resolution curated products spanning all 7 categories:
  1. Living Room Sofas & Sectionals
  2. Bedroom Sets & Upholstered Beds
  3. Arabic Majlis Seating (Emirati & Gulf Heritage)
  4. Dining Chairs & Banquet Dining Tables
  5. Wardrobes, Cabinets & Storage Credenzas
  6. Coffee Tables & Side Tables
  7. Custom / Made-to-Order Bespoke Furniture
- **Shop & Catalog Filtering**: Dynamic category tabs, price slider, material filters, color swatches, stock availability, search queries, and sorting.
- **Product Detail Experience**: Multi-image thumbnail gallery with interactive zoom on hover, finish/swatch selector, quantity, specifications tabs, client reviews, related pieces, and a one-click **"Order on WhatsApp"** button with a prefilled message.
- **Cart & Slide-out Mini-Bag Drawer**: Real-time line item updates, quantity controls, promo code support (`ATEEQ10` for 10% off demo coupon), and a live Free Delivery meter (Complimentary White-Glove delivery over AED 2,000 across UAE).
- **Multi-Step Checkout Flow**:
  1. Shipping information & UAE Emirate selector (Dubai, Abu Dhabi, Sharjah, etc.)
  2. Delivery service selection (Standard White-Glove, Express 48h, Showroom Pickup)
  3. Payment method (Cash on Delivery, Card on Delivery POS, Online Card Mock)
  4. Final review and order confirmation with auto-generated reference number (`ABA-2026-XXXX`) and WhatsApp tracking.
- **Bespoke Custom Commission Atelier**: Interactive custom order form for villas and palaces with dimension inputs, timber/fabric choices, target budget, and live reference image upload preview.
- **Global Showroom & Contact**: Showroom story, 4 quality pillars, embedded Google Maps iframe, contact inquiry form, and a persistent floating WhatsApp concierge button (+971 50 000 0000).
- **State Persistence**: Cart, wishlist, and language preferences saved in `localStorage` via Zustand persist middleware.

---

## 🛠️ Tech Stack & Design Architecture

- **Design System**: "Quiet Luxury" Editorial Aesthetic (Ivory, Sand, Walnut, Charcoal, and Muted Brass)
- **Gradients**: Warm Earthy Transitions (Sand-to-Ivory, Walnut-to-Charcoal, Rose-Sand, Brass Shimmer)
- **Typography**: *Cormorant Garamond* & *Playfair Display* (Editorial Serif), *Inter* & *Manrope* (Sans), *Tajawal* (Arabic)
- **Smooth Scrolling**: Lenis Smooth Scroll Engine
- **Motion & Transitions**: Motion (Framer Motion v12) with page transitions, curtain preloader, Ken Burns hero, masked text reveals, and custom desktop view cursor
- **React 19** + **Vite 8** + **TypeScript**
- **Tailwind CSS v4**
- **React Router v6/v7** (`react-router-dom`)
- **Zustand** (persisted state management with localStorage)
- **Lucide React** (icons)

---

## 🚀 Running Locally

1. **Clone or navigate to the project directory**:
   ```bash
   cd al-bait-al-ateeq
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📝 How to Edit or Add Products

The product catalog is structured in `src/data/products.ts` so it can be swapped with a real CMS or backend API at any time.

To modify or add a product:
1. Open `src/data/products.ts`.
2. Locate the `PRODUCTS` array.
3. Add or update a product item matching the `Product` TypeScript interface:

```typescript
{
  id: 'aba-lr-05',
  slug: 'royal-diwan-sofa',
  nameEn: 'Royal Diwan Velvet Sofa',
  nameAr: 'كنب الديوان الملكي المخملي',
  category: 'living-room',
  price: 9800,
  salePrice: 8900, // Optional sale price
  descriptionEn: 'Deep plush seating with solid beech frame...',
  descriptionAr: 'مقاعد وثيرة بهيكل من خشب الزان الصلب...',
  materialEn: 'Solid Beechwood, High-Density Foam, Italian Velvet',
  materialAr: 'خشب زان صلب، إسفنج عالي الكثافة، مخمل إيطالي',
  dimensionsEn: '240 cm (W) x 100 cm (D) x 80 cm (H)',
  dimensionsAr: '240 سم (عرض) × 100 سم (عمق) × 80 سم (ارتفاع)',
  availableColors: [
    { nameEn: 'Warm Cream', nameAr: 'عاجي دافئ', hex: '#F3EFE6' },
    { nameEn: 'Emerald Green', nameAr: 'زمردي أخضر', hex: '#1C3B2B' }
  ],
  stockStatus: 'in_stock', // 'in_stock' | 'low_stock' | 'made_to_order'
  rating: 4.9,
  reviewCount: 15,
  images: [
    'https://images.unsplash.com/...',
    'https://images.unsplash.com/...'
  ],
  isFeatured: true,
  isBestSeller: true,
  featuresEn: ['Handcrafted solid timber frame', 'Stain-resistant velvet'],
  featuresAr: ['هيكل خشبي صلب مصنوع يدوياً', 'مخمل معالج ضد البقع'],
  careInstructionsEn: 'Clean with damp cloth...',
  careInstructionsAr: 'تمسح بقطعة قماش مبللة...',
  reviews: []
}
```

---

## 🌐 Deploying to Vercel

The project includes a `vercel.json` file configured with SPA rewrites:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Steps to Deploy:
1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset will automatically detect **Vite**.
5. Set:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **Deploy**. Vercel will build and host your store with zero configuration changes required.

---

## 📍 Store Information

- **Brand**: Al Bait Al Ateeq Furniture (مفروشات البيت العتيق)
- **Phone / WhatsApp**: +971 50 000 0000
- **Email**: info@albaitalateeq.com
- **Address**: [Store address], UAE
- **Opening Hours**:
  - Saturday – Thursday: 9:00 AM – 10:00 PM
  - Friday: 4:00 PM – 10:00 PM
- **Currency**: AED (United Arab Emirates Dirham)
