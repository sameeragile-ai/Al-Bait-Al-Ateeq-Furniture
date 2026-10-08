/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useStore } from './store/useStore.ts';
import { ScrollToTop } from './components/common/ScrollToTop.tsx';
import { ToastContainer } from './components/common/ToastContainer.tsx';
import { SmoothScroll } from './components/common/SmoothScroll.tsx';
import { IntroPreloader } from './components/common/IntroPreloader.tsx';
import { CustomCursor } from './components/common/CustomCursor.tsx';
import { PageTransition } from './components/common/PageTransition.tsx';
import { Navbar } from './components/layout/Navbar.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { MiniCartDrawer } from './components/layout/MiniCartDrawer.tsx';
import { WhatsAppFloating } from './components/layout/WhatsAppFloating.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { ShopPage } from './pages/ShopPage.tsx';
import { ProductDetailPage } from './pages/ProductDetailPage.tsx';
import { CartPage } from './pages/CartPage.tsx';
import { CheckoutPage } from './pages/CheckoutPage.tsx';
import { WishlistPage } from './pages/WishlistPage.tsx';
import { CustomOrderPage } from './pages/CustomOrderPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { NotFoundPage } from './pages/NotFoundPage.tsx';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage />
            </PageTransition>
          }
        />
        <Route
          path="/shop"
          element={
            <PageTransition>
              <ShopPage />
            </PageTransition>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <PageTransition>
              <ProductDetailPage />
            </PageTransition>
          }
        />
        <Route
          path="/cart"
          element={
            <PageTransition>
              <CartPage />
            </PageTransition>
          }
        />
        <Route
          path="/checkout"
          element={
            <PageTransition>
              <CheckoutPage />
            </PageTransition>
          }
        />
        <Route
          path="/wishlist"
          element={
            <PageTransition>
              <WishlistPage />
            </PageTransition>
          }
        />
        <Route
          path="/custom-order"
          element={
            <PageTransition>
              <CustomOrderPage />
            </PageTransition>
          }
        />
        <Route
          path="/about"
          element={
            <PageTransition>
              <AboutPage />
            </PageTransition>
          }
        />
        <Route
          path="/contact"
          element={
            <PageTransition>
              <ContactPage />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const language = useStore((state) => state.language);

  // Sync document language and text direction
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    }
  }, [language]);

  return (
    <SmoothScroll>
      <BrowserRouter>
        {/* Intro Preloader */}
        <IntroPreloader />

        {/* Custom Desktop Cursor */}
        <CustomCursor />

        {/* Scroll restoration on route change */}
        <ScrollToTop />

        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1C1C1C] selection:bg-[#B08D57] selection:text-[#FAF7F2]">
          {/* Header */}
          <Navbar />

          {/* Animated Page Transitions */}
          <main className="flex-1">
            <AnimatedRoutes />
          </main>

          {/* Footer */}
          <Footer />

          {/* Slide-out Cart Drawer */}
          <MiniCartDrawer />

          {/* Floating WhatsApp Concierge */}
          <WhatsAppFloating />

          {/* Toast Notification Container */}
          <ToastContainer />
        </div>
      </BrowserRouter>
    </SmoothScroll>
  );
}
