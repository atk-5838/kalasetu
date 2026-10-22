import React, { useState } from 'react';
import { MapPin, Volume2, ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { CraftProduct } from '../types';

interface ProductCardProps {
  product: CraftProduct;
  onSelect: (product: CraftProduct) => void;
  onAddToCart: (product: CraftProduct) => void;
  onQuickBuy: (product: CraftProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  onQuickBuy,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Approximate USD conversion for global buyers (₹83.5 = $1)
  const approxUSD = Math.round(product.priceINR / 83.5);

  return (
    <article className="group bg-white rounded-2xl border border-[#E8DFD4] hover:border-[#CBB7A0] hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
      
      {/* Product Image Section (65-70% visual focus) */}
      <div 
        onClick={() => onSelect(product)}
        className="relative aspect-[4/3] bg-[#F4EFEA] overflow-hidden cursor-pointer"
      >
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#EFE8DE] animate-pulse" />
        )}

        {imageError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-[#F4EFEA] text-stone-500 text-center">
            <span className="font-serif-title font-semibold text-stone-700 text-sm mb-1">{product.title}</span>
            <span className="text-xs text-stone-500">{product.craftCategory}</span>
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Quiet top overlay for verified badge and voice snippet availability */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
          {product.giCertified && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-md text-[11px] font-semibold text-emerald-800 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>GI Verified</span>
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2B231D]/80 backdrop-blur-sm rounded-md text-[11px] font-medium text-amber-200 shadow-xs ml-auto">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Artisan Voice</span>
          </div>
        </div>

        {/* Hover quick overlay CTA */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="px-4 py-2 bg-white/95 text-stone-900 text-xs font-semibold rounded-lg shadow-sm">
            Read Artisan Story
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Metadata line: Category & Location (Clean unboxed text with dot separator) */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-2">
            <span className="font-medium text-[#9A3B26]">{product.craftCategory}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-stone-600 truncate">
              <MapPin className="w-3 h-3 shrink-0" />
              {product.artisanVillage}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(product)}
            className="font-serif-title text-base sm:text-lg font-bold text-[#231C16] group-hover:text-[#9A3B26] transition-colors cursor-pointer line-clamp-1"
          >
            {product.title}
          </h3>

          {/* Artisan Byline */}
          <p className="text-xs text-stone-600 mt-1">
            Crafted by <span className="font-medium text-stone-900">{product.artisanName}</span>
          </p>

          {/* Brief cultural provenance snippet */}
          <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">
            {product.summary}
          </p>
        </div>

        {/* Price & Action Footer */}
        <div className="pt-3 border-t border-[#F1EAE0]">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="text-xs text-stone-500">Fair Value Price</div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif-title text-xl font-bold text-[#231C16] tabular-nums">
                  ₹{product.priceINR.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-stone-500 tabular-nums">
                  (~${approxUSD} USD)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                88% to Artisan
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(product)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#3D312A] bg-[#F5EFE6] hover:bg-[#EBDDCF] rounded-lg transition-colors cursor-pointer"
            >
              <span>View Story</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onQuickBuy(product)}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#9A3B26] hover:bg-[#832E1C] active:bg-[#6D2516] rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>

      </div>

    </article>
  );
};
