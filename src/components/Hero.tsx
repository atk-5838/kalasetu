import React from 'react';
import { ArrowRight, Mic, ShieldCheck, HeartHandshake } from 'lucide-react';
import { AppLanguage } from '../types';

interface HeroProps {
  onExploreClick: () => void;
  onArtisanVoiceClick: () => void;
  language: AppLanguage;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onArtisanVoiceClick,
  language,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 sm:py-16 bg-[#FAF7F2] border-b border-[#E8DFD4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Split Hero: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Narrative & CTA */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Editorial kicker (clean unboxed text, no pills) */}
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#9A3B26] font-semibold">
              <span>Coastal Karnataka Heritage Crafts</span>
              <span aria-hidden="true">·</span>
              <span>Direct GI Market Access</span>
            </div>

            {/* Headline with text-wrap: balance */}
            <h1 className="font-serif-title text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#231C16] leading-[1.15] text-balance">
              {language === 'kn' ? (
                'ಕರಾವಳಿಯ ಮಣ್ಣಿನ ಕಲಾವಿದರಿಂದ ನೇರವಾಗಿ ಜಾಗತಿಕ ಸಹೃದಯರಿಗೆ'
              ) : language === 'hi' ? (
                'तटीय कर्नाटक के पारंपरिक शिल्पकारों से सीधे वैश्विक कद्रदानों तक'
              ) : (
                'From Coastal Artisan Verandas Directly to Global Connoisseurs'
              )}
            </h1>

            {/* Subtitle / Value Proposition */}
            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl">
              {language === 'kn' ? (
                'ಕಸೂತಿ ಕಸೂತಿ, ಬೀಡು ನದಿಹುಲ್ಲಿನ ಚಾಪೆ ಹಾಗೂ ಉಡುಪಿ ಕೆತ್ತನೆ ಕಲೆ. ಯಾವುದೇ ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ಶೇ. 88ರಷ್ಟು ನೇರ ಆದಾಯ ಕಲಾವಿದರ ಕೈಸೇರುವ ವಿಶಿಷ್ಟ ವೇದಿಕೆ.'
              ) : language === 'hi' ? (
                'कसूती कढ़ाई, बीडू नदी घास बुनाई और उडुपी काष्ठकला। बिना बिचौलियों के 88% प्रत्यक्ष आय सीधे ग्रामीण कारीगरों के बैंक खाते में।'
              ) : (
                'Empowering generational masters of Kasuti needlework, river-reed Beedu weaving, and Udupi woodcraft. Fair compensation, verifiable authenticity, and spoken cultural provenance.'
              )}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#9A3B26] hover:bg-[#832E1C] active:bg-[#6D2516] rounded-xl shadow-sm transition-all whitespace-nowrap cursor-pointer"
              >
                <span>Explore Verified Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onArtisanVoiceClick}
                className="inline-flex items-center gap-2.5 px-5 py-3.5 text-sm font-semibold text-[#3D312A] bg-[#F1EAE0] hover:bg-[#E7DCD0] border border-[#DBCAB7] rounded-xl transition-all whitespace-nowrap cursor-pointer"
              >
                <Mic className="w-4 h-4 text-[#9A3B26]" />
                <span>Artisan Voice Listing</span>
              </button>
            </div>

            {/* Trust markers (unboxed inline text) */}
            <div className="pt-2 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#9A3B26]" />
                <span>Geographical Indication (GI) Verified</span>
              </div>
              <div className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-[#9A3B26]" />
                <span>88% Direct Artisan Proceeds</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-stone-800">100%</span>
                <span>Handcrafted & Traceable</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Showcase Image with Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#DECFC0] shadow-md bg-stone-100 aspect-[4/3] lg:aspect-[5/4]">
              <img
                src="/src/assets/images/hero_coastal_artisan_1792691363396.jpg"
                alt="Coastal Karnataka artisan workshop with handloom reed weaving and Kasuti craft"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {/* Subtle caption scrim */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                <div className="text-xs uppercase tracking-wider text-amber-200 font-medium">Field Documentation</div>
                <div className="text-sm font-semibold">Weavers at Padubidri Riverbanks & Kundapura Veranda Studios</div>
              </div>
            </div>
          </div>

        </div>

        {/* 4-Column KPI Bar below Hero with Tabular Numerals */}
        <div className="mt-12 pt-8 border-t border-[#E8DFD4] grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="font-serif-title text-2xl sm:text-3xl font-bold text-[#231C16] tabular-nums">
              88%
            </div>
            <div className="text-xs text-stone-600">Direct Artisan Share (No Mid-Brokers)</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif-title text-2xl sm:text-3xl font-bold text-[#231C16] tabular-nums">
              120+
            </div>
            <div className="text-xs text-stone-600">Coastal Master Craftsmen Registered</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif-title text-2xl sm:text-3xl font-bold text-[#231C16] tabular-nums">
              3,400+
            </div>
            <div className="text-xs text-stone-600">Hours of Handcrafted Cultural Heritage</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif-title text-2xl sm:text-3xl font-bold text-[#231C16] tabular-nums">
              100%
            </div>
            <div className="text-xs text-stone-600">Voice-Transcribed Provenance Recorded</div>
          </div>
        </div>

      </div>
    </section>
  );
};
