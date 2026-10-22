import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, MessageSquare, ArrowRight } from 'lucide-react';
import { CartItem, CraftProduct } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, item) => acc + item.product.priceINR * item.quantity, 0);

  const handleWhatsAppBatchOrder = () => {
    const list = items
      .map(
        (it, idx) =>
          `${idx + 1}. ${it.product.title} (x${it.quantity}) - ₹${(it.product.priceINR * it.quantity).toLocaleString('en-IN')}`
      )
      .join('\n');

    const msg = encodeURIComponent(
      `Namaskara KalaSetu!\n\nI want to order these handcrafted crafts from your artisan network:\n\n${list}\n\nTotal: ₹${totalAmount.toLocaleString(
        'en-IN'
      )}\nPlease share bank/UPI details or confirm delivery timeline.`
    );
    window.open(`https://wa.me/919480123456?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col border-l border-[#DECFC0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8DFD4]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#9A3B26]" />
            <h3 className="font-serif-title text-lg font-bold text-[#231C16]">
              Your Heritage Bag
            </h3>
            <span className="text-xs text-stone-500 tabular-nums">
              ({items.length} {items.length === 1 ? 'item' : 'items'})
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close cart drawer"
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-full hover:bg-[#EFE8DD] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 stroke-[1.5]" />
              <div className="text-sm font-semibold text-stone-700">Your bag is empty</div>
              <p className="text-xs text-stone-500 max-w-xs">
                Explore authentic Kasuti embroidery, Beedu reed mats, and Udupi woodcrafts to support local artisans.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 text-xs font-semibold text-[#9A3B26] bg-[#F1EAE0] hover:bg-[#E8DDD0] rounded-xl transition-colors cursor-pointer"
              >
                Discover Crafts
              </button>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="p-3.5 bg-white rounded-2xl border border-[#DECFC0] shadow-xs flex gap-3 items-center"
              >
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-16 h-16 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {product.title}
                  </h4>
                  <div className="text-[11px] text-stone-500">
                    by {product.artisanName}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#231C16] mt-1 tabular-nums">
                    ₹{(product.priceINR * quantity).toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => onRemoveItem(product.id)}
                    aria-label="Remove item"
                    className="text-stone-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2 bg-[#FAF7F2] rounded-lg border border-[#DECFC0] px-2 py-0.5 text-xs">
                    <button
                      onClick={() => onUpdateQuantity(product.id, -1)}
                      className="text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold tabular-nums">{quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, 1)}
                      className="text-stone-600 hover:text-stone-900 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8DFD4] bg-[#FAF7F2] space-y-3">
            <div className="flex justify-between items-baseline text-sm">
              <span className="text-stone-600">Fair Value Subtotal:</span>
              <span className="font-serif-title text-xl font-bold text-[#231C16] tabular-nums">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg text-center font-medium">
              88% (₹{Math.round(totalAmount * 0.88).toLocaleString('en-IN')}) remitted directly to artisans
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold text-white bg-[#9A3B26] hover:bg-[#832E1C] active:bg-[#6D2516] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleWhatsAppBatchOrder}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>Order Bag via WhatsApp</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
