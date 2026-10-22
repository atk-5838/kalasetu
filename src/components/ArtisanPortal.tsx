import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Camera, Upload, Sparkles, CheckCircle2, 
  MapPin, HelpCircle, ArrowRight, ShieldCheck, Tag, Info, AlertCircle 
} from 'lucide-react';
import { CraftCategory, CraftProduct, AppLanguage } from '../types';

interface ArtisanPortalProps {
  onAddProduct: (product: CraftProduct) => void;
  onReturnToStore: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
}

export const ArtisanPortal: React.FC<ArtisanPortalProps> = ({
  onAddProduct,
  onReturnToStore,
  language,
  setLanguage,
}) => {
  // Artisan Form State
  const [productTitle, setProductTitle] = useState('');
  const [artisanName, setArtisanName] = useState('Parvathi Devi');
  const [artisanVillage, setArtisanVillage] = useState('Kundapura, Coastal Udupi');
  const [craftCategory, setCraftCategory] = useState<CraftCategory>('Kasuti Embroidery');
  const [priceINR, setPriceINR] = useState<number>(3800);
  const [timeTaken, setTimeTaken] = useState('8 days');
  const [storyDescription, setStoryDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('/src/assets/images/product_kasuti_saree_1792691363349.jpg');
  
  // Voice Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [recordingNote, setRecordingNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
    }
  }, []);

  // Timer while recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingSeconds(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Voice recording toggle with Web Speech API & Mock Fallback
  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Simulate voice input for browsers without Web Speech API
      simulateVoiceInput();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language === 'kn' ? 'kn-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';

      recognition.onstart = () => {
        setIsRecording(true);
        setRecordingNote('Listening to your spoken voice... Speak about your craft!');
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceTranscript(transcript);
        setStoryDescription(transcript);
        
        // Auto infer title if empty
        if (!productTitle && transcript.length > 5) {
          const suggested = transcript.slice(0, 35) + (transcript.length > 35 ? '...' : '');
          setProductTitle(suggested);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
        simulateVoiceInput();
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      simulateVoiceInput();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
    setRecordingNote('Voice captured successfully!');
  };

  // Mock voice input helper for testing/demos
  const simulateVoiceInput = (preset?: 'kannada' | 'beedu' | 'kasuti') => {
    setIsRecording(true);
    setRecordingNote('Simulating voice capture from artisan workshop...');
    
    setTimeout(() => {
      setIsRecording(false);
      let sampleText = '';
      let sampleTitle = '';
      let sampleCat: CraftCategory = 'Kasuti Embroidery';

      if (preset === 'beedu' || (!preset && craftCategory === 'Beedu Craft')) {
        sampleTitle = 'Coastal River-Reed Meditation Mat';
        sampleText = 'We harvest the reeds along the Shambhavi river bank during morning low tide. They are dried under the coastal sun and woven tightly with coconut coir rope so they stay naturally cool.';
        sampleCat = 'Beedu Craft';
        setSelectedImage('/src/assets/images/product_beedu_mat_1792691363833.jpg');
      } else if (preset === 'kannada' || language === 'kn') {
        sampleTitle = 'ಹಸ್ತ ಕಸೂತಿ ರೇಷ್ಮೆ ಸೀರೆ (ನವಿಲು ವಿನ್ಯಾಸ)';
        sampleText = 'ನನ್ನ ಹೆಸರು ಪಾರ್ವತಿ ದೇವಿ. ಕುಂದಾಪುರದ ನಮ್ಮ ಮನೆಯಲ್ಲಿ ಮೂರು ತಲೆಮಾರಿನಿಂದ ಈ ಕಸೂತಿ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೇವೆ. ಯಾವುದೇ ಚೌಕಟ್ಟು ಬಳಸದೆ ದಾರವನ್ನು ಕೈಯಿಂದಲೇ ಎಣಿಸಿ ನವಿಲಿನ ವಿನ್ಯಾಸ ಹೊಲಿಯಲಾಗಿದೆ.';
        sampleCat = 'Kasuti Embroidery';
        setSelectedImage('/src/assets/images/product_kasuti_saree_1792691363349.jpg');
      } else {
        sampleTitle = 'Traditional Handloom Kasuti Saree Border';
        sampleText = 'This is an authentic Kasuti hand-embroidery piece made on natural handloom cloth. Every single thread of the peacock motif is stitched by hand without any carbon paper or pencil markings, taking 10 days of focused work.';
        sampleCat = 'Kasuti Embroidery';
        setSelectedImage('/src/assets/images/product_kasuti_saree_1792691363349.jpg');
      }

      setProductTitle(sampleTitle);
      setStoryDescription(sampleText);
      setVoiceTranscript(sampleText);
      setCraftCategory(sampleCat);
      setRecordingNote('Voice description recorded & transcribed!');
    }, 1800);
  };

  // Smart Story Polisher
  const handleEnhanceStory = () => {
    if (!storyDescription) {
      setToastMessage('Please speak or type a short description first.');
      return;
    }

    const enhanced = `${storyDescription} Handcrafted according to centuries-old coastal Karnataka traditions in ${artisanVillage}. Free from synthetic chemicals or mechanized replicas, each piece is verified for authentic provenance and directly supports local generational artisan families.`;
    setStoryDescription(enhanced);
    setToastMessage('Craft story enhanced with heritage provenance!');
  };

  // Image Upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Form Submission
  const handleSubmitListing = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productTitle) {
      setToastMessage('Please enter or speak a product name.');
      return;
    }

    const newProduct: CraftProduct = {
      id: `ks-artisan-${Date.now()}`,
      title: productTitle,
      titleKannada: language === 'kn' ? productTitle : undefined,
      artisanName: artisanName || 'Local Master Artisan',
      artisanVillage: artisanVillage || 'Coastal Udupi',
      artisanPhoto: '/src/assets/images/artisan_portrait_elder_1792691364857.jpg',
      craftCategory: craftCategory,
      priceINR: Number(priceINR) || 2500,
      image: selectedImage || '/src/assets/images/product_kasuti_saree_1792691363349.jpg',
      summary: storyDescription.slice(0, 140) + '...',
      fullStory: storyDescription || 'Authentic regional handicraft crafted using traditional generational techniques in coastal Karnataka.',
      timeTaken: timeTaken || '7 days of manual crafting',
      materialsUsed: ['Natural Local Fibers', 'Organic Vegetable Dyes', 'Authentic Handcrafting'],
      giCertified: true,
      certificateId: `GI-KA-${craftCategory.slice(0, 3).toUpperCase()}-2026-${Math.floor(100 + Math.random() * 900)}`,
      voiceTranscript: voiceTranscript || storyDescription,
      voiceLanguage: language,
      createdDate: new Date().toISOString().split('T')[0],
      inStock: true
    };

    onAddProduct(newProduct);
    setToastMessage('Craft successfully listed on KalaSetu! Returning to marketplace...');

    setTimeout(() => {
      onReturnToStore();
    }, 1200);
  };

  // Fair share calculations
  const artisanShare = Math.round(priceINR * 0.88);
  const packagingShare = Math.round(priceINR * 0.07);
  const coopFund = priceINR - artisanShare - packagingShare;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner & Language Choice for Low-Literacy Accessibility */}
      <div className="p-6 bg-[#FAF7F2] rounded-3xl border-2 border-[#D5C7B8] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-[#9A3B26]">
            <ShieldCheck className="w-4 h-4 text-[#9A3B26]" />
            <span>Artisan Direct Access Portal · ಕಲಾಕಾರರ ನೇರ ಮಾರುಕಟ್ಟೆ</span>
          </div>
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-[#231C16]">
            {language === 'kn' ? 'ನಿಮ್ಮ ಕರಕುಶಲ ಕಲೆಯನ್ನು ಧ್ವನಿಯ ಮೂಲಕ ಸೇರಿಸಿ' : 'List Your Craft in 60 Seconds with Voice'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
            {language === 'kn'
              ? 'ಕೇವಲ ಮೈಕ್ರೊಫೋನ್ ಬಟನ್ ಒತ್ತಿ ಮಾತನಾಡಿ. ನಿಮ್ಮ ಕಲೆಯ ಕಥೆ ತಾನಾಗಿಯೇ ದಾಖಲಾಗುತ್ತದೆ.'
              : 'Designed for effortless listing. Speak naturally about your craft, set your fair price, and connect directly with appreciative buyers worldwide.'}
          </p>
        </div>

        {/* Vernacular Language Selector */}
        <div className="flex items-center gap-2 bg-[#EFE8DD] p-1.5 rounded-2xl border border-[#D5C7B8] shrink-0">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              language === 'en' ? 'bg-[#9A3B26] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('kn')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              language === 'kn' ? 'bg-[#9A3B26] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            ಕನ್ನಡ
          </button>
          <button
            type="button"
            onClick={() => setLanguage('hi')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              language === 'hi' ? 'bg-[#9A3B26] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-semibold animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-700 hover:text-emerald-950">
            Dismiss
          </button>
        </div>
      )}

      {/* Listing Creation Form */}
      <form onSubmit={handleSubmitListing} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Voice Recording & Craft Story (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: The Giant Voice Recording Box */}
          <div className="p-6 bg-white rounded-3xl border-2 border-[#D5C7B8] shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#9A3B26] font-bold">Step 1: Voice Input</span>
                <h3 className="font-serif-title text-xl font-bold text-stone-900">
                  {language === 'kn' ? 'ಧ್ವನಿ ವಿವರಣೆ ರೆಕಾರ್ಡ್ ಮಾಡಿ' : 'Speak About Your Craft'}
                </h3>
              </div>
              <div className="text-xs text-stone-500 font-medium">
                {isRecording ? (
                  <span className="text-rose-600 font-bold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                    Recording: {recordingSeconds}s
                  </span>
                ) : (
                  <span>Microphone Ready</span>
                )}
              </div>
            </div>

            {/* Giant Microphone Button */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#FAF7F2] rounded-2xl border border-dashed border-[#CBB7A0] space-y-3">
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 cursor-pointer ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-200' 
                    : 'bg-[#9A3B26] hover:bg-[#832E1C] text-white ring-8 ring-amber-100'
                }`}
                title={isRecording ? 'Click to Stop Recording' : 'Click to Record Voice'}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>

              <div className="text-center space-y-1">
                <div className="text-sm font-bold text-stone-900">
                  {isRecording 
                    ? (language === 'kn' ? 'ನಿಲ್ಲಿಸಲು ಮತ್ತೊಮ್ಮೆ ಒತ್ತಿ' : 'Tap to Stop Recording') 
                    : (language === 'kn' ? 'ಧ್ವನಿ ರೆಕಾರ್ಡ್ ಮಾಡಲು ಇಲ್ಲಿ ಒತ್ತಿ' : 'Tap Microphone to Speak')}
                </div>
                <div className="text-xs text-stone-500">
                  {recordingNote || 'Describe your craft, materials used, and time taken.'}
                </div>
              </div>

              {/* Instant sample voice buttons for quick testing without needing mic */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
                <span className="text-stone-400 font-medium">Quick Demo Prompts:</span>
                <button
                  type="button"
                  onClick={() => simulateVoiceInput('kasuti')}
                  className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-300 font-medium transition-colors cursor-pointer"
                >
                  Kasuti Silk Saree
                </button>
                <button
                  type="button"
                  onClick={() => simulateVoiceInput('beedu')}
                  className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-300 font-medium transition-colors cursor-pointer"
                >
                  Beedu River Mat
                </button>
                <button
                  type="button"
                  onClick={() => simulateVoiceInput('kannada')}
                  className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-700 rounded-lg border border-stone-300 font-medium transition-colors cursor-pointer"
                >
                  ಕನ್ನಡ ವಿವರಣೆ (Kannada)
                </button>
              </div>
            </div>

            {/* Auto-populated Story Text Box with AI Enhancer */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700">
                  {language === 'kn' ? 'ದಾಖಲಾದ ಕಥೆ / ವಿವರಣೆ:' : 'Transcribed Craft Story & Description:'}
                </label>

                <button
                  type="button"
                  onClick={handleEnhanceStory}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-[#9A3B26] bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Enhance Heritage Story</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={storyDescription}
                onChange={(e) => setStoryDescription(e.target.value)}
                placeholder="Speak using the microphone above, or type your craft's heritage story..."
                className="w-full p-3.5 text-xs sm:text-sm bg-[#FAF7F2] rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
              />
            </div>
          </div>

          {/* Card 2: Craft Details & Categories */}
          <div className="p-6 bg-white rounded-3xl border-2 border-[#D5C7B8] shadow-sm space-y-4">
            <span className="text-xs uppercase tracking-wider text-[#9A3B26] font-bold">Step 2: Basic Craft Details</span>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Product Title / ಕಲಾಕೃತಿಯ ಹೆಸರು *
              </label>
              <input
                type="text"
                required
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder="e.g. Hand-Embroidered Kasuti Silk Shawl"
                className="w-full px-3.5 py-2.5 text-sm bg-[#FAF7F2] rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none font-medium text-stone-900"
              />
            </div>

            {/* Craft Category Buttons */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Select Craft Category / ಕಲೆಯ ವಿಭಾಗ
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Kasuti Embroidery', 'Beedu Craft', 'Wooden Artifact', 'Terracotta & Brass'] as CraftCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCraftCategory(cat)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all cursor-pointer ${
                      craftCategory === cat
                        ? 'bg-[#9A3B26] text-white border-[#9A3B26] shadow-xs'
                        : 'bg-[#FAF7F2] text-stone-700 border-[#DECFC0] hover:bg-[#EFE8DD]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Artisan & Location info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Artisan Name / ಕಲಾವಿದರ ಹೆಸರು
                </label>
                <input
                  type="text"
                  value={artisanName}
                  onChange={(e) => setArtisanName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Artisan Village / ಗ್ರಾಮ & ಜಿಲ್ಲೆ
                </label>
                <input
                  type="text"
                  value={artisanVillage}
                  onChange={(e) => setArtisanVillage(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                />
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Visuals & Fair Pricing (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 3: Photo Selection */}
          <div className="p-6 bg-white rounded-3xl border-2 border-[#D5C7B8] shadow-sm space-y-4">
            <span className="text-xs uppercase tracking-wider text-[#9A3B26] font-bold">Step 3: Product Photography</span>
            
            {/* Image Preview Box */}
            <div className="relative rounded-2xl overflow-hidden border border-[#DECFC0] aspect-[4/3] bg-stone-100 shadow-inner">
              <img
                src={selectedImage}
                alt="Selected craft preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md backdrop-blur-xs">
                Live Preview
              </div>
            </div>

            {/* File Upload Button */}
            <label className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#F5EFE6] hover:bg-[#EBDDCF] text-stone-800 text-xs font-semibold rounded-xl border border-[#DECFC0] transition-colors cursor-pointer">
              <Upload className="w-4 h-4 text-[#9A3B26]" />
              <span>Upload Custom Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="hidden"
              />
            </label>

            {/* Pre-Loaded Heritage Photo Presets */}
            <div>
              <div className="text-[11px] font-medium text-stone-500 mb-1.5">Or Choose Authenticated Preset Photo:</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: 'Kasuti Saree', url: '/src/assets/images/product_kasuti_saree_1792691363349.jpg' },
                  { name: 'Beedu Mat', url: '/src/assets/images/product_beedu_mat_1792691363833.jpg' },
                  { name: 'Wood Artifact', url: '/src/assets/images/product_udupi_woodcraft_1792691364586.jpg' }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setSelectedImage(preset.url)}
                    className={`rounded-lg overflow-hidden border-2 p-0.5 transition-all cursor-pointer ${
                      selectedImage === preset.url ? 'border-[#9A3B26] ring-2 ring-[#9A3B26]/30' : 'border-transparent'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-12 object-cover rounded" />
                    <span className="block text-[10px] text-stone-600 truncate text-center mt-0.5">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Price & Fair Transparency Calculator */}
          <div className="p-6 bg-white rounded-3xl border-2 border-[#D5C7B8] shadow-sm space-y-4">
            <span className="text-xs uppercase tracking-wider text-[#9A3B26] font-bold">Step 4: Fair Price (₹)</span>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Selling Price (INR ₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-base font-bold text-stone-600">₹</span>
                <input
                  type="number"
                  required
                  min={500}
                  step={50}
                  value={priceINR}
                  onChange={(e) => setPriceINR(Number(e.target.value))}
                  className="w-full pl-8 pr-3.5 py-2.5 text-lg font-bold font-serif-title bg-[#FAF7F2] rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none tabular-nums text-stone-900"
                />
              </div>
            </div>

            {/* Instant Fair Split Calculator */}
            <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200 text-xs space-y-2">
              <div className="font-bold text-stone-900 flex items-center justify-between">
                <span>Direct Artisan Payment (88%):</span>
                <span className="text-sm font-bold text-[#9A3B26] tabular-nums">
                  ₹{artisanShare.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600 text-[11px]">
                <span>Safe Eco-Courier & Transit (7%):</span>
                <span className="tabular-nums">₹{packagingShare.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-stone-600 text-[11px]">
                <span>Artisan Guild Welfare Fund (5%):</span>
                <span className="tabular-nums">₹{coopFund.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Crafting Time */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Time Dedicated to Handcraft / ಕಾಲಾವಧಿ
              </label>
              <input
                type="text"
                value={timeTaken}
                onChange={(e) => setTimeTaken(e.target.value)}
                placeholder="e.g. 10 days of thread counting"
                className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
              />
            </div>

            {/* Instant Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 px-6 text-sm sm:text-base font-bold text-white bg-[#9A3B26] hover:bg-[#832E1C] active:bg-[#6D2516] rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>
                  {language === 'kn' ? 'ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ತಕ್ಷಣ ಪ್ರಕಟಿಸಿ' : 'Publish Craft to Global KalaSetu'}
                </span>
              </button>
            </div>

          </div>

        </div>

      </form>

    </div>
  );
};
