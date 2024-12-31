'use client';

import { useCart } from '@/lib/CartContext';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { HiX } from 'react-icons/hi';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const router = useRouter();
  const { 
    isOpen, 
    setIsOpen, 
    items, 
    totalPrice, 
    removeItem, 
    updateQuantity,
    clearCart 
  } = useCart();

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-[#1A2642]/90 backdrop-blur-md border-l border-[#1A2642] shadow-xl z-50 overflow-y-auto">
        {/* Content */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-[#1A2642]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HiOutlineShoppingBag className="text-[#0095FF] text-xl" />
                <h2 className="text-xl font-bold text-white">Warenkorb</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-2"
              >
                <HiX className="text-xl" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                Ihr Warenkorb ist leer
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-[#2A3B5E]/50 backdrop-blur-[2px] border border-[#2A3B5E] rounded-xl p-4 flex items-start space-x-4 hover:bg-[#2A3B5E]/70 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#2A3B5E]">
                      <Image
                        src={item.imageUrl || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-[#0095FF] font-medium">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-white p-1 transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus className="text-sm" />
                        </button>
                        <span className="text-white px-2 min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-white p-1 transition-colors"
                        >
                          <FaPlus className="text-sm" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-white p-1 transition-colors ml-2"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer with total and checkout button */}
          {items.length > 0 && (
            <div className="border-t border-[#1A2642] p-6 bg-[#1A2642]/50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-300">Gesamtsumme:</span>
                <span className="text-white font-bold text-xl">€{totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-[#0095FF] hover:bg-[#0077CC] text-white font-medium py-3 rounded-lg transition-colors"
              >
                Zur Kasse
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-medium py-2 rounded-lg transition-colors"
              >
                Warenkorb leeren
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
