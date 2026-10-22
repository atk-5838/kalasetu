import React, { useState, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, ShieldCheck, HeartHandshake, 
  MapPin, Sparkles, Award, ArrowUpRight, CheckCircle2 
} from 'lucide-react';

import { CraftProduct, CartItem, AppLanguage, ActiveView, CraftCategory } from './types';
import { INITIAL_PRODUCTS, CRAFT_CATEGORIES } from './data/initialProducts';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { StoryModal } from './components/StoryModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ArtisanPortal } from './components/ArtisanPortal';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  // LocalStorage-backed Products State
  const [products, setProducts] = useState<CraftProduct[]>(() => {
    try {
      const saved = localStorage.getItem('kalasetu_products_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return INITIAL_PRODUCTS;
  });

  // LocalStorage-backed Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kalasetu_cart_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [];
  });

  // View state & modals
  const [activeView, setActiveView] = useState<ActiveView>('buyer');
  const [language, setLanguage] = useState<AppLanguage>('en');
  const [selectedProductForStory, setSelectedProductForStory] = useState<CraftProduct | null>(null);
  const [checkoutProducts, setCheckoutProducts] = useState<CraftProduct[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<string>('All Crafts');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Sync products to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kalasetu_products_v1', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  }, [products]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kalasetu_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  // Handle adding new product from Artisan Portal
  const handleAddProduct = (newProduct: CraftProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  // Cart operations
  const handleAddToCart = (product: CraftProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  // Direct quick buy for single product
  const handleQuickBuy = (product: CraftProduct) => {
    setCheckoutProducts([product]);
    setIsCheckoutOpen(true);
  };

  // Proceed checkout for all items in cart
  const handleCartProceedCheckout = () => {
    const allProducts = cart.map((c) => c.product);
    setCheckoutProducts(allProducts);
    setIsCheckoutOpen(true);
  };

  // Filtered & Sorted Products
  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'All Crafts' || p.craftCategory === selectedCategory;

    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.artisanVillage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.craftCategory.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceINR - b.priceINR;
    if (sortBy === 'price-desc') return b.priceINR - a.priceINR;
    return 0; // featured default
  });

  const totalCartCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-900 flex flex-col font-sans">
      
      {/* Universal Top Navigation conforming to Top Bar Contract */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        cartCount={totalCartCount}
        openCart={() => setIsCartOpen(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main View Body */}
      <main className="flex-1">
        {activeView === 'artisan' ? (
          /* Persona 1: Artisan View (Voice-Enabled Low Literacy Portal) */
          <ArtisanPortal
            onAddProduct={handleAddProduct}
            onReturnToStore={() => setActiveView('buyer')}
            language={language}
            setLanguage={setLanguage}
          />
        ) : (
          /* Persona 2: Buyer View (Heritage E-commerce Storefront) */
          <div>
            {/* Hero Section */}
            <Hero
              onExploreClick={() => {
                const el = document.getElementById('craft-collection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onArtisanVoiceClick={() => setActiveView('artisan')}
              language={language}
            />

            {/* Product Collection Section */}
            <section id="craft-collection" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* Section Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8DFD4] pb-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-[#9A3B26] font-semibold mb-1">
                    Authentic Coastal Karnataka Artifacts
                  </div>
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#231C16]">
                    Curated Heritage Collection
                  </h2>
                </div>

                <div className="text-xs text-stone-600">
                  Showing <span className="font-bold text-stone-900 tabular-nums">{sortedProducts.length}</span> verified mastercrafts
                </div>
              </div>

              {/* Functional Interactive Filter Bar */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
                
                {/* Category Segmented Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 text-xs font-semibold scrollbar-none">
                  {CRAFT_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                        selectedCategory === cat
                          ? 'bg-[#9A3B26] text-white shadow-xs'
                          : 'bg-[#F1EAE0] text-stone-700 hover:bg-[#E6DDD0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search artisan or craft..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                    />
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    aria-label="Sort Crafts"
                    className="px-3 py-2 text-xs bg-white rounded-xl border border-[#DECFC0] text-stone-700 focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Sort: Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

              </div>

              {/* Product Grid (3-column on desktop with generous gap) */}
              {sortedProducts.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-[#DECFC0] p-8 space-y-3">
                  <div className="text-base font-semibold text-stone-800">
                    No crafts match your filter criteria
                  </div>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Try choosing 'All Crafts' or clear your search term to see authentic Kasuti, Beedu, and Woodcraft pieces.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('All Crafts');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 text-xs font-semibold text-[#9A3B26] bg-[#F1EAE0] rounded-xl hover:bg-[#E8DDD0] transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProductForStory(p)}
                      onAddToCart={handleAddToCart}
                      onQuickBuy={handleQuickBuy}
                    />
                  ))}
                </div>
              )}

            </section>

            {/* Heritage Origins & GI Provenance Section */}
            <section id="heritage-origins" className="py-16 bg-[#F3ECE1] border-y border-[#DECFC0]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                
                <div className="max-w-2xl">
                  <div className="text-xs uppercase tracking-widest text-[#9A3B26] font-semibold mb-1">
                    Authentic Cultural Provenance
                  </div>
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#231C16]">
                    Preserving Coastal Karnataka's Endangered Living Arts
                  </h2>
                  <p className="text-sm text-stone-700 mt-2 leading-relaxed">
                    Centuries of maritime trade, temple guilds, and indigenous agrarian cycles gave rise to three unique regional craft disciplines. KalaSetu protects their original Geographical Indication (GI) lineages.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  
                  {/* Origin Card 1: Kasuti */}
                  <div className="p-6 bg-white rounded-2xl border border-[#DECFC0] shadow-xs space-y-3">
                    <div className="text-xs font-bold text-[#9A3B26] uppercase tracking-wider">
                      01. Kasuti Needlework
                    </div>
                    <h3 className="font-serif-title text-lg font-bold text-stone-900">
                      Zero-Tracing Warp & Weft Alignment
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Practiced by women artisans across Karnataka since the 8th century. Unlike modern machine stitching, Kasuti is executed by counting each microscopic warp and weft thread. It creates reversible patterns identical on both sides with zero knots.
                    </p>
                  </div>

                  {/* Origin Card 2: Beedu */}
                  <div className="p-6 bg-white rounded-2xl border border-[#DECFC0] shadow-xs space-y-3">
                    <div className="text-xs font-bold text-[#9A3B26] uppercase tracking-wider">
                      02. Beedu Reed Craft
                    </div>
                    <h3 className="font-serif-title text-lg font-bold text-stone-900">
                      Tidal Riverbed Grass Harvesting
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Along the Shambhavi and Netravati estuaries in Padubidri, master weavers gather natural river grass during seasonal low tides. Cured under coastal sun, these fibers naturally repel moisture and provide natural cooling sleep surfaces.
                    </p>
                  </div>

                  {/* Origin Card 3: Teak & Bronze */}
                  <div className="p-6 bg-white rounded-2xl border border-[#DECFC0] shadow-xs space-y-3">
                    <div className="text-xs font-bold text-[#9A3B26] uppercase tracking-wider">
                      03. Udupi Sanctum Carving
                    </div>
                    <h3 className="font-serif-title text-lg font-bold text-stone-900">
                      Lost-Wax Casting & Beeswax Finish
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Hand-carved in seasoned Malnad teakwood and cast in 78:22 bell metal bronze. Sealed exclusively with cold-pressed linseed oils and wild honey beeswax, avoiding harmful synthetic resins to preserve natural acoustic resonance.
                    </p>
                  </div>

                </div>

              </div>
            </section>

            {/* Fair Impact Section */}
            <section id="fair-impact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-8 sm:p-12 bg-white rounded-3xl border border-[#DECFC0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-4">
                  <div className="text-xs uppercase tracking-widest text-[#9A3B26] font-semibold">
                    Problem Statement 4.2: Digital Market Access
                  </div>
                  <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#231C16]">
                    Bridging Low Digital Literacy with Direct Fair Commerce
                  </h2>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    Most rural artisans cannot navigate complex e-commerce portals or type in English. KalaSetu's speech-to-text recording engine empowers artisans to speak naturally in their mother tongue (Kannada, Konkani, Tulu, Hindi), auto-generating authenticated listings with transparent 88% direct payouts.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-stone-800">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Zero Intermediary Commissions</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Verifiable GI Cryptographic Badge</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Direct WhatsApp Peer-to-Peer Link</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#FAF7F2] rounded-2xl border border-[#DECFC0] text-center space-y-3">
                  <div className="font-serif-title text-4xl font-bold text-[#9A3B26] tabular-nums">
                    ₹14,80,000+
                  </div>
                  <div className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Direct Payouts to Coastal Artisan Families
                  </div>
                  <p className="text-xs text-stone-600 max-w-xs">
                    Every order placed directly sustains family heritage and prevents migration of youth from traditional craft clusters.
                  </p>
                  <button
                    onClick={() => setActiveView('artisan')}
                    className="mt-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#9A3B26] hover:bg-[#832E1C] rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    Experience Artisan Voice Onboarding
                  </button>
                </div>

              </div>
            </section>

          </div>
        )}
      </main>

      {/* Editorial Footer (Strict anti-slop: clean copyright & links, no ornamental status bars) */}
      <footer className="bg-[#231C16] text-[#E8DFD4] border-t border-stone-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-stone-800">
            <div className="space-y-3">
              <div className="font-serif-title text-xl font-bold text-white tracking-wide">
                KalaSetu · ಕಲಾಸೇತು
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                A digital bridge connecting Coastal Karnataka's generational artisans directly with global conscious patrons. Problem Statement 4.2 prototype.
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Heritage Clusters
              </div>
              <ul className="text-xs text-stone-400 space-y-1.5">
                <li>Kundapura Kasuti Guild</li>
                <li>Padubidri Beedu Mat Weavers</li>
                <li>Karkala Teakwood Sanctum Sculptors</li>
                <li>Moodabidri Bell-Metal Guild</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Direct Integrity
              </div>
              <ul className="text-xs text-stone-400 space-y-1.5">
                <li>88% Direct Artisan Remittance</li>
                <li>GI Provenance Certification</li>
                <li>Voice Transcribed Origin Stories</li>
                <li>Cooperative Healthcare Fund</li>
              </ul>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-200">
                Artisan Access
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                Are you a local weaver or sculptor in Udupi, Mangaluru, or Karwar?
              </p>
              <button
                onClick={() => setActiveView('artisan')}
                className="inline-block mt-1 text-xs font-semibold text-amber-300 hover:text-amber-100 underline underline-offset-4 cursor-pointer"
              >
                Access Voice Listing Engine →
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <div>
              © 2026 KalaSetu Heritage Foundation. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Karnataka GI Registry Authenticated</span>
              <span aria-hidden="true">·</span>
              <span>Zero Middleman Exploitation</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Storytelling Modal */}
      <StoryModal
        product={selectedProductForStory}
        onClose={() => setSelectedProductForStory(null)}
        onAddToCart={handleAddToCart}
        onCheckout={(p) => handleQuickBuy(p)}
        language={language}
      />

      {/* Checkout Modal (WhatsApp + Simulated Payment) */}
      <CheckoutModal
        products={checkoutProducts}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => {
          setCart([]);
        }}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={handleCartProceedCheckout}
      />

    </div>
  );
}
