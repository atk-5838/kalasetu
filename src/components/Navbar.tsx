import React from 'react';
import { ShoppingBag, Mic, Store, Globe } from 'lucide-react';
import { ActiveView, AppLanguage } from '../types';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  cartCount: number;
  openCart: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  cartCount,
  openCart,
  language,
  setLanguage,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant Top Bar Contract: 3 zones separated by gap-8 */}
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Single text element wordmark in display face */}
          <button 
            onClick={() => setActiveView('buyer')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-serif-title text-2xl sm:text-3xl font-bold tracking-tight text-[#2B231D] group-hover:text-[#9A3B26] transition-colors whitespace-nowrap shrink-0">
                KalaSetu
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#9A3B26] font-medium hidden sm:inline whitespace-nowrap">
                ಕಲಾಸೇತು
              </span>
            </div>
          </button>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-700">
            <button 
              onClick={() => { setActiveView('buyer'); const el = document.getElementById('craft-collection'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="hover:text-[#9A3B26] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Craft Catalog
            </button>
            <button 
              onClick={() => { setActiveView('buyer'); const el = document.getElementById('craft-collection'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="hover:text-[#9A3B26] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Master Artisans
            </button>
            <button 
              onClick={() => { setActiveView('buyer'); const el = document.getElementById('heritage-origins'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="hover:text-[#9A3B26] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              GI & Provenance
            </button>
            <button 
              onClick={() => { setActiveView('buyer'); const el = document.getElementById('fair-impact'); el?.scrollIntoView({ behavior: 'smooth' }); }}
              className="hover:text-[#9A3B26] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Fair Value Impact
            </button>
          </nav>

          {/* Zone 3: 1 primary action cluster */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Language Selector */}
            <div className="relative flex items-center bg-[#F1EAE0] rounded-lg p-0.5 border border-[#DECFC0] text-xs font-medium text-stone-700">
              <Globe className="w-3.5 h-3.5 ml-2 text-stone-500 shrink-0" />
              <select
                aria-label="Select Interface Language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as AppLanguage)}
                className="bg-transparent pl-1 pr-2 py-1.5 text-xs text-stone-800 rounded focus:outline-none cursor-pointer"
              >
                <option value="en">EN (English)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            {/* Switch Mode: Artisan Studio vs Buyer Store */}
            {activeView === 'buyer' ? (
              <button
                onClick={() => setActiveView('artisan')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#9A3B26] hover:bg-[#832E1C] active:bg-[#6D2516] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Mic className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Artisan Voice Portal</span>
                <span className="sm:hidden">Artisan</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('buyer')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#2B231D] bg-[#EBE2D5] hover:bg-[#DECFC0] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Store className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">Back to Marketplace</span>
                <span className="sm:hidden">Store</span>
              </button>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={openCart}
              aria-label="Open Shopping Bag"
              className="relative p-2 text-stone-800 hover:text-[#9A3B26] hover:bg-[#F1EAE0] rounded-lg transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#9A3B26] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
