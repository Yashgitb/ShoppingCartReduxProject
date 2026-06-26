import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { products } from './data/products';
import Navbar from './components/Navbar';
import ProductFilters from './components/ProductFilters';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import CheckoutPage from './components/CheckoutPage';
import AuthModal from './components/AuthModal';
import { Sparkles, ArrowRight, Star, Tag, X, Heart, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation & Modal State
  const [currentPage, setCurrentPage] = useState('store'); // 'store' | 'checkout'
  const productsSectionRef = useRef(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Search & Filter States (useState/useEffect requirement)
  const maxProductPrice = Math.ceil(Math.max(...products.map(p => p.price)));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState(maxProductPrice);
  const [selectedRating, setSelectedRating] = useState(0);
  const [sortBy, setSortBy] = useState('featured');
  const [filteredProducts, setFilteredProducts] = useState(products);

  // Toast Notification State
  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message }]);
  };

  // Autoclose Toast helper
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts(prev => prev.slice(1));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  // Combined Filters Logic (useEffect hook)
  useEffect(() => {
    let result = [...products];

    // 1. Search text filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        p => p.name.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)
      );
    }

    // 2. Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // 3. Price slider filter
    result = result.filter(p => p.price <= priceRange);

    // 4. Star rating filter
    if (selectedRating > 0) {
      result = result.filter(p => p.rating >= selectedRating);
    }

    // 5. Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popularity') {
      result.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else {
      // default / featured sorting
      result = result.filter(p => p.featured).concat(result.filter(p => !p.featured));
      // Deduplicate featured sorting if overlap occurs
      result = Array.from(new Set(result));
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, priceRange, selectedRating, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange(maxProductPrice);
    setSelectedRating(0);
    setSortBy('featured');
    showToast('Filters have been reset.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Navigation Header */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onGoToStore={() => setCurrentPage('store')}
        onShowToast={showToast}
      />

      {/* Main Content Area */}
      {currentPage === 'store' ? (
        <main className="flex-1 pb-16">
          {/* Stunning Premium Hero Section - Updated for Light theme */}
          <section className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 border-b border-gray-200 bg-linear-to-b from-indigo-50/40 via-slate-50/20 to-transparent">
            {/* Absolute Decorative Glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-96 h-96 bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative text-center space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Summer Sale: Free Global Shipping Enabled</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Discover the Next Generation of <br />
                <span className="bg-linear-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
                  Premium Quality Essentials
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                Shop curated lifestyle products, handcrafted gear, and smart devices engineered to perfection with dynamic performance warranties.
              </p>

              <div className="flex justify-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    productsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl active:scale-95 transition-all shadow-lg shadow-indigo-650/20 flex items-center gap-1.5"
                >
                  Explore Collection
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <div className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 bg-white shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Secure 256-bit Checkout
                </div>
              </div>
            </div>
          </section>

          {/* Grid Layout containing Product Listings & Filters */}
          <div ref={productsSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

              {/* Left Column Sidebar (Filters) */}
              <aside className="lg:col-span-1">
                <ProductFilters
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onReset={handleResetFilters}
                  maxPrice={maxProductPrice}
                />
              </aside>

              {/* Right Column (Product list grid) */}
              <section className="lg:col-span-3 space-y-6">
                <div className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-2xl p-4 px-5">
                  <p className="text-xs font-bold text-gray-600">
                    Showing <span className="text-indigo-650 font-extrabold">{filteredProducts.length}</span> products
                  </p>

                  {/* Applied filters feedback badges */}
                  <div className="hidden sm:flex items-center gap-2 text-xs">
                    {selectedCategory !== 'All' && (
                      <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-gray-700 shadow-sm text-[11px] font-semibold">
                        Category: {selectedCategory}
                      </span>
                    )}
                    {priceRange < maxProductPrice && (
                      <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-gray-700 shadow-sm text-[11px] font-semibold">
                        Max: ₹{priceRange}
                      </span>
                    )}
                    {selectedRating > 0 && (
                      <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-lg text-gray-700 shadow-sm text-[11px] font-semibold">
                        Rating: {selectedRating}★+
                      </span>
                    )}
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 glass-panel rounded-2xl border border-gray-200 space-y-4">
                    <p className="text-gray-600 text-sm font-medium">No products found matching your current filter selection.</p>
                    <button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 bg-white border border-gray-200 text-xs font-bold text-gray-800 rounded-xl hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm"
                    >
                      Clear All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onShowToast={showToast}
                      />
                    ))}
                  </div>
                )}
              </section>

            </div>
          </div>
        </main>
      ) : (
        /* Checkout page */
        <main className="grow">
          <CheckoutPage
            onBackToShop={() => setCurrentPage('store')}
            onShowToast={showToast}
          />
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 bg-gray-50 text-center text-xs text-gray-500 space-y-2">
        <p className="font-bold text-gray-700">ApeStore Premium React Client Demo</p>
        <p>© 2026 ApeStore Inc. Powered by Vite, React 19, Redux Toolkit & Tailwind CSS v4.</p>
      </footer>

      {/* Cart Slider Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenAuth={() => {
          setIsCartOpen(false);
          setIsAuthOpen(true);
        }}
        onGoToCheckout={() => setCurrentPage('checkout')}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Toast notifications stack */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto p-4 rounded-xl bg-gray-950/95 border border-indigo-500/30 text-white font-semibold text-xs shadow-2xl flex items-center justify-between gap-4 animate-slide-up shadow-indigo-950/20"
          >
            <span>{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
