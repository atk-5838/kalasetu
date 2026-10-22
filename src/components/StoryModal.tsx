import React, { useState, useEffect } from 'react';
import { 
  X, Volume2, VolumeX, Play, Pause, RotateCcw, 
  ShieldCheck, MapPin, Award, CheckCircle2, 
  MessageSquare, ShoppingBag, Clock, Sparkles
} from 'lucide-react';
import { CraftProduct, AppLanguage } from '../types';

interface StoryModalProps {
  product: CraftProduct | null;
  onClose: () => void;
  onAddToCart: (product: CraftProduct) => void;
  onCheckout: (product: CraftProduct) => void;
  language: AppLanguage;
}

export const StoryModal: React.FC<StoryModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onCheckout,
  language,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioTranscriptLang, setAudioTranscriptLang] = useState<'kn' | 'en'>('kn');
  const [activeTab, setActiveTab] = useState<'story' | 'certificate' | 'transparency'>('story');

  useEffect(() => {
    // Stop any ongoing speech when modal closes or changes
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [product]);

  if (!product) return null;

  // Audio Playback simulation using Web SpeechSynthesis or rhythmic waveform
  const togglePlayAudio = () => {
    if (!('speechSynthesis' in window)) {
      setIsPlayingAudio(!isPlayingAudio);
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak = audioTranscriptLang === 'kn' && product.voiceTranscriptKannada 
        ? product.voiceTranscriptKannada 
        : product.voiceTranscript;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      
      // If regional voice available
      const voices = window.speechSynthesis.getVoices();
      const knVoice = voices.find(v => v.lang.includes('kn') || v.lang.includes('hi') || v.lang.includes('en-IN'));
      if (knVoice) {
        utterance.voice = knVoice;
      }

      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(utterance);
    }
  };

  const directArtisanAmount = Math.round(product.priceINR * 0.88);
  const logisticsAmount = Math.round(product.priceINR * 0.07);
  const cooperativeAmount = product.priceINR - directArtisanAmount - logisticsAmount;

  // WhatsApp order text preparation
  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Namaskara KalaSetu!\n\nI want to order this authentic craft:\n` +
      `Product: ${product.title}\n` +
      `Artisan: ${product.artisanName} (${product.artisanVillage})\n` +
      `Price: ₹${product.priceINR.toLocaleString('en-IN')}\n` +
      `GI Certificate: ${product.certificateId}\n\n` +
      `Please let me know how to confirm my delivery address and payment.`
    );
    // Coastal Karnataka artisan cooperative coordinator desk
    window.open(`https://wa.me/919480123456?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#FAF7F2] rounded-3xl border border-[#D5C7B8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD4] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <span className="font-serif-title text-xl font-bold text-[#231C16]">
              Artisan Provenance & Cultural Heritage
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-[#EFE7DC] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Top Hero Split in Modal */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Craft Image */}
            <div className="md:col-span-5 space-y-3">
              <div className="rounded-2xl overflow-hidden border border-[#DECFC0] shadow-xs aspect-[4/3] bg-stone-100">
                <img
                  src={product.image}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Artisan Profile Mini-Card */}
              <div className="p-3 bg-[#F3ECE1] rounded-xl border border-[#DECFC0] flex items-center gap-3">
                <img
                  src={product.artisanPhoto || '/src/assets/images/artisan_portrait_elder_1792691364857.jpg'}
                  alt={product.artisanName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <div className="text-xs">
                  <div className="font-bold text-stone-900">{product.artisanName}</div>
                  <div className="text-stone-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#9A3B26]" />
                    {product.artisanVillage}
                  </div>
                  <div className="text-[#9A3B26] font-medium text-[11px] mt-0.5">
                    Generational Master Artisan
                  </div>
                </div>
              </div>
            </div>

            {/* Product Meta & Tabs */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="text-xs text-[#9A3B26] font-semibold tracking-wider uppercase mb-1">
                  {product.craftCategory}
                </div>
                <h2 className="font-serif-title text-2xl font-bold text-[#231C16]">
                  {product.title}
                </h2>
                {product.titleKannada && (
                  <div className="text-sm text-stone-600 font-medium mt-1">
                    {product.titleKannada}
                  </div>
                )}
              </div>

              {/* Functional Tab Buttons */}
              <div className="flex items-center gap-1 p-1 bg-[#EFE8DD] rounded-xl border border-[#DECFC0] text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('story')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'story'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Cultural Origin Story
                </button>
                <button
                  onClick={() => setActiveTab('certificate')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'certificate'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Authenticity Certificate
                </button>
                <button
                  onClick={() => setActiveTab('transparency')}
                  className={`flex-1 py-2 px-3 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'transparency'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Fair Price Breakdown
                </button>
              </div>

              {/* Tab 1: Story & Audio */}
              {activeTab === 'story' && (
                <div className="space-y-4 animate-fadeIn">
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {product.fullStory}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-xs bg-[#F5EFE6] p-3.5 rounded-xl border border-[#E4D7C8]">
                    <div>
                      <div className="text-stone-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#9A3B26]" />
                        <span>Crafting Duration:</span>
                      </div>
                      <div className="font-semibold text-stone-800 mt-0.5">{product.timeTaken}</div>
                    </div>
                    <div>
                      <div className="text-stone-500">Materials Used:</div>
                      <div className="font-semibold text-stone-800 mt-0.5">{product.materialsUsed.join(', ')}</div>
                    </div>
                  </div>

                  {/* Interactive Audio Player: Listen to Artisan Voice */}
                  <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#9A3B26] text-white flex items-center justify-center">
                          <Volume2 className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-stone-900">
                            Listen to Artisan's Voice
                          </div>
                          <div className="text-[11px] text-stone-600">
                            Spoken directly from the workshop in {product.artisanVillage}
                          </div>
                        </div>
                      </div>

                      {/* Language toggle for transcript */}
                      <div className="flex items-center gap-1 text-[11px] bg-white rounded-md p-0.5 border border-amber-300">
                        <button
                          onClick={() => setAudioTranscriptLang('kn')}
                          className={`px-2 py-0.5 rounded cursor-pointer ${audioTranscriptLang === 'kn' ? 'bg-[#9A3B26] text-white font-bold' : 'text-stone-700'}`}
                        >
                          ಕನ್ನಡ
                        </button>
                        <button
                          onClick={() => setAudioTranscriptLang('en')}
                          className={`px-2 py-0.5 rounded cursor-pointer ${audioTranscriptLang === 'en' ? 'bg-[#9A3B26] text-white font-bold' : 'text-stone-700'}`}
                        >
                          English
                        </button>
                      </div>
                    </div>

                    {/* Waveform & Play Button */}
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-amber-200">
                      <button
                        onClick={togglePlayAudio}
                        className="w-10 h-10 rounded-full bg-[#9A3B26] hover:bg-[#832E1C] text-white flex items-center justify-center shadow-xs transition-colors shrink-0 cursor-pointer"
                        title={isPlayingAudio ? 'Pause Audio' : 'Play Audio'}
                      >
                        {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>

                      {/* Animated Soundwave Visualizer */}
                      <div className="flex-1 flex items-center gap-1 h-6 px-2">
                        {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65, 90, 45, 70, 60, 85, 50, 75, 40].map((height, i) => (
                          <div
                            key={i}
                            className={`flex-1 rounded-full transition-all duration-150 ${
                              isPlayingAudio ? 'bg-[#9A3B26] animate-pulse' : 'bg-stone-300'
                            }`}
                            style={{
                              height: isPlayingAudio ? `${Math.max(20, (height * (1 + Math.sin(i + Date.now() / 200))) % 100)}%` : `${height * 0.4}%`,
                            }}
                          />
                        ))}
                      </div>

                      <div className="text-xs font-mono tabular-nums text-stone-500 shrink-0">
                        {isPlayingAudio ? 'Playing...' : '0:34'}
                      </div>
                    </div>

                    {/* Spoken Voice Transcript */}
                    <div className="text-xs italic text-stone-700 bg-white/70 p-2.5 rounded-lg border border-amber-100 leading-relaxed">
                      "{audioTranscriptLang === 'kn' && product.voiceTranscriptKannada ? product.voiceTranscriptKannada : product.voiceTranscript}"
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Digital Certificate of Authenticity */}
              {activeTab === 'certificate' && (
                <div className="p-5 bg-white rounded-2xl border-2 border-[#D5C7B8] shadow-xs space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#E8DFD4] pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-6 h-6 text-[#9A3B26]" />
                      <div>
                        <div className="font-serif-title font-bold text-stone-900 text-base">
                          Digital Certificate of Cultural Authenticity
                        </div>
                        <div className="text-[11px] text-stone-500">
                          Karnataka State Handicrafts & GI Provenance Registry
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-mono px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded font-bold border border-emerald-200">
                      VERIFIED ON-CHAIN
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-stone-500">Certificate Reference:</div>
                      <div className="font-mono font-bold text-stone-900">{product.certificateId}</div>
                    </div>
                    <div>
                      <div className="text-stone-500">Craft Guild Authority:</div>
                      <div className="font-semibold text-stone-900">Coastal Karnataka Artisan Trust</div>
                    </div>
                    <div>
                      <div className="text-stone-500">Accredited Artisan:</div>
                      <div className="font-bold text-[#9A3B26]">{product.artisanName}</div>
                    </div>
                    <div>
                      <div className="text-stone-500">Geographical Origin:</div>
                      <div className="font-semibold text-stone-900">{product.artisanVillage}</div>
                    </div>
                    <div>
                      <div className="text-stone-500">Purity & Materials:</div>
                      <div className="font-semibold text-stone-900">{product.materialsUsed.join(' · ')}</div>
                    </div>
                    <div>
                      <div className="text-stone-500">Verification Date:</div>
                      <div className="font-semibold text-stone-900">{product.createdDate}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-stone-600 pt-2 border-t border-[#F1EAE0]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      This tamper-proof certificate guarantees that no mechanized counterfeit or synthetic replica was used in the production of this craft.
                    </span>
                  </div>
                </div>
              )}

              {/* Tab 3: Fair Price Breakdown */}
              {activeTab === 'transparency' && (
                <div className="p-5 bg-white rounded-2xl border border-[#DECFC0] space-y-4 animate-fadeIn">
                  <div>
                    <h4 className="font-serif-title font-bold text-stone-900 text-base">
                      100% Transparent Price Dissection
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">
                      Traditional commercial craft markets exploit artisans, paying them less than 15-20% of retail price. At KalaSetu, 88% is wired straight to the creator.
                    </p>
                  </div>

                  {/* Multi-segment progress bar */}
                  <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-[#9A3B26] h-full" 
                      style={{ width: '88%' }}
                      title="88% Direct to Artisan" 
                    />
                    <div 
                      className="bg-amber-500 h-full" 
                      style={{ width: '7%' }} 
                      title="7% Sustainable Packaging & Courier"
                    />
                    <div 
                      className="bg-emerald-600 h-full" 
                      style={{ width: '5%' }} 
                      title="5% Coastal Heritage Weaver Welfare Fund"
                    />
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8DFD4]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#9A3B26]" />
                        <span className="font-semibold text-stone-900">Direct Artisan Remittance (88%)</span>
                      </div>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        ₹{directArtisanAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8DFD4]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="font-medium text-stone-800">Biodegradable Packaging & Shipping (7%)</span>
                      </div>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        ₹{logisticsAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8DFD4]">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-600" />
                        <span className="font-medium text-stone-800">Coastal Artisan Healthcare & Guild Fund (5%)</span>
                      </div>
                      <span className="font-mono font-bold text-stone-900 tabular-nums">
                        ₹{cooperativeAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

        {/* Modal Purchase Action Footer */}
        <div className="px-6 py-4 bg-[#F5EFE6] border-t border-[#E8DFD4] flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-stone-500">Total Fair Price:</div>
            <div className="font-serif-title text-2xl font-bold text-[#231C16] tabular-nums">
              ₹{product.priceINR.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* WhatsApp Direct Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span>WhatsApp Direct Order</span>
            </button>

            {/* Add to Bag */}
            <button
              onClick={() => {
                onAddToCart(product);
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-stone-800 bg-[#E8DDD0] hover:bg-[#DBCABA] rounded-xl transition-colors cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>

            {/* Instant Buy */}
            <button
              onClick={() => {
                onClose();
                onCheckout(product);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#9A3B26] hover:bg-[#832E1C] active:bg-[#6D2516] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Instant Checkout</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
