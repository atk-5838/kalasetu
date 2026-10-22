import React, { useState } from 'react';
import { 
  X, MessageSquare, CreditCard, Smartphone, 
  Truck, CheckCircle, ShieldCheck, ArrowRight, Printer, Sparkles
} from 'lucide-react';
import { CraftProduct } from '../types';

interface CheckoutModalProps {
  products: CraftProduct[];
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  products,
  isOpen,
  onClose,
  onOrderSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'gateway' | 'whatsapp'>('gateway');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');

  if (!isOpen || products.length === 0) return null;

  const totalAmount = products.reduce((acc, p) => acc + p.priceINR, 0);
  const primaryProduct = products[0];

  const handleWhatsAppCheckout = () => {
    const itemsList = products
      .map((p, idx) => `${idx + 1}. ${p.title} (₹${p.priceINR}) - Artisan: ${p.artisanName}`)
      .join('\n');

    const message = encodeURIComponent(
      `*Namaskara KalaSetu Artisan Guild!*\n\n` +
      `I would like to place an order for the following heritage crafts:\n\n` +
      `${itemsList}\n\n` +
      `*Total Order Value:* ₹${totalAmount.toLocaleString('en-IN')}\n` +
      (name ? `*Buyer Name:* ${name}\n` : '') +
      (phone ? `*Contact Phone:* ${phone}\n` : '') +
      (address ? `*Delivery Destination:* ${address}, ${city} - ${pincode}\n` : '') +
      `\nPlease verify availability and provide dispatch confirmation.`
    );

    window.open(`https://wa.me/919480123456?text=${message}`, '_blank');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      onOrderSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-3xl border border-[#D5C7B8] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DFD4] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <span className="font-serif-title text-xl font-bold text-[#231C16]">
              {isCompleted ? 'Artisan Order Confirmed' : 'Direct Artisan Checkout'}
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-[#EFE7DC] rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isCompleted ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div>
              <h3 className="font-serif-title text-2xl font-bold text-[#231C16]">
                Dhanyavadagalu! Your Order is Received
              </h3>
              <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
                ₹{Math.round(totalAmount * 0.88).toLocaleString('en-IN')} has been credited directly to{' '}
                <strong className="text-stone-900">{primaryProduct.artisanName}</strong> and their coastal weaver guild.
              </p>
            </div>

            {/* Simulated Receipt Card */}
            <div className="p-5 bg-white rounded-2xl border border-[#DECFC0] text-left text-xs space-y-3 max-w-md mx-auto">
              <div className="flex justify-between border-b border-stone-200 pb-2">
                <span className="text-stone-500">Order Reference:</span>
                <span className="font-mono font-bold text-stone-900">#KS-ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Craft Piece(s):</span>
                <span className="font-semibold text-stone-900 truncate max-w-[200px]">{primaryProduct.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Settled:</span>
                <span className="font-bold text-[#231C16] text-sm tabular-nums">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment Status:</span>
                <span className="text-emerald-700 font-semibold uppercase">Direct Fair Settlement (Done)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Estimated Dispatch:</span>
                <span className="font-medium text-stone-700">Within 48 hours from {primaryProduct.artisanVillage}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-stone-700 bg-[#EFE8DD] hover:bg-[#E2D8CA] rounded-xl transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate Receipt</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 text-xs font-semibold text-white bg-[#9A3B26] hover:bg-[#832E1C] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Return to Marketplace
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Steps */
          <div className="p-6 space-y-6">
            
            {/* Order Items Preview */}
            <div className="p-4 bg-[#F5EFE6] rounded-2xl border border-[#DECFC0] space-y-2">
              <div className="text-xs text-stone-500 font-medium">Selected Craft(s):</div>
              {products.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={p.image} alt={p.title} className="w-8 h-8 rounded-md object-cover" />
                    <div>
                      <span className="font-semibold text-stone-900">{p.title}</span>
                      <span className="text-stone-500 ml-2">by {p.artisanName}</span>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    ₹{p.priceINR.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
              <div className="pt-2 border-t border-[#E8DFD4] flex items-baseline justify-between text-sm">
                <span className="font-medium text-stone-700">Total Fair Price:</span>
                <span className="font-serif-title text-lg font-bold text-[#231C16] tabular-nums">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Pathways Toggle: Direct WhatsApp vs Payment Gateway */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#EFE8DD] rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('gateway')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'gateway' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
                }`}
              >
                Direct Gateway / UPI
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'whatsapp' ? 'bg-white text-emerald-800 shadow-xs' : 'text-stone-600'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp Order</span>
              </button>
            </div>

            {activeTab === 'whatsapp' ? (
              /* WhatsApp direct order */
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 space-y-2">
                  <div className="font-bold text-sm text-emerald-950">
                    Direct Artisan Guild WhatsApp Line
                  </div>
                  <p className="leading-relaxed">
                    Prefer ordering directly through chat? Clicking the button below opens WhatsApp with all the craft specifications, artisan attribution, and verified price already filled in.
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Hegde"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Delivery City & State</label>
                    <input
                      type="text"
                      placeholder="e.g. Bengaluru, Karnataka"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleWhatsAppCheckout}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Launch Pre-Composed WhatsApp Order</span>
                </button>
              </div>
            ) : (
              /* Online Gateway Form */
              <form onSubmit={handlePaymentSubmit} className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Full Name *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ananya Rao"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Mobile / WhatsApp Number *</label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">Shipping Street Address *</label>
                  <input
                    required
                    type="text"
                    placeholder="House/Apartment, Street, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">City / Town *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Mangaluru"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">PIN Code *</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. 575001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#DECFC0] focus:ring-2 focus:ring-[#9A3B26]/30 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1.5">Select Settlement Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-[#9A3B26] bg-amber-50/60 ring-1 ring-[#9A3B26]'
                          : 'border-[#DECFC0] bg-white hover:bg-stone-50'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-[#9A3B26] mb-1" />
                      <div className="text-xs font-bold text-stone-900">UPI / QR</div>
                      <div className="text-[10px] text-stone-500">GPay, PhonePe, BHIM</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#9A3B26] bg-amber-50/60 ring-1 ring-[#9A3B26]'
                          : 'border-[#DECFC0] bg-white hover:bg-stone-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#9A3B26] mb-1" />
                      <div className="text-xs font-bold text-stone-900">Card / NetBanking</div>
                      <div className="text-[10px] text-stone-500">Visa, RuPay, Master</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#9A3B26] bg-amber-50/60 ring-1 ring-[#9A3B26]'
                          : 'border-[#DECFC0] bg-white hover:bg-stone-50'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-[#9A3B26] mb-1" />
                      <div className="text-xs font-bold text-stone-900">Cash on Delivery</div>
                      <div className="text-[10px] text-stone-500">Pay on Handover</div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 text-sm font-semibold text-white bg-[#9A3B26] hover:bg-[#832E1C] active:bg-[#6D2516] rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Transacting Fair Settlement...</span>
                    </div>
                  ) : (
                    <span>
                      Complete Fair Purchase · ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  )}
                </button>
              </form>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
