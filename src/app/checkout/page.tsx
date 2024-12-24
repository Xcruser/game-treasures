'use client';

import { useCart } from '@/lib/CartContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaTrash, FaPlus, FaMinus, FaPaypal } from 'react-icons/fa';
import Image from 'next/image';
import { generateOrderId } from '@/lib/utils/generateOrderId';

const DEFAULT_NAME = 'Bitte Namen eingeben';
const PAYPAL_ME_LINK = 'IHRE_PAYPAL.ME_ADRESSE'; // z.B. 'paypal.me/IhrName'

export default function CheckoutPage() {
  const { items, totalPrice, clearCart, updateQuantity, removeItem } = useCart();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState(DEFAULT_NAME);
  const [nameError, setNameError] = useState('');
  const [orderId, setOrderId] = useState('');

  const handlePayPalClick = async () => {
    if (!customerName || customerName.trim() === '' || customerName === DEFAULT_NAME) {
      setNameError('Bitte geben Sie Ihren Namen ein');
      return;
    }
    
    setNameError('');
    const newOrderId = generateOrderId();
    setOrderId(newOrderId);

    try {
      // Speichere die Bestellung zuerst in der Datenbank
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          totalAmount: totalPrice,
          customerName,
          orderId: newOrderId
        }),
      });

      if (!response.ok) {
        throw new Error('Checkout failed');
      }

      // Öffne PayPal in neuem Tab
      const paypalUrl = `https://${PAYPAL_ME_LINK}/${totalPrice.toFixed(2)}EUR?description=Bestellung-${newOrderId}`;
      window.open(paypalUrl, '_blank');

      // Weiterleitung zur Bestellbestätigung
      router.push(`/order-confirmation/${newOrderId}`);
      clearCart();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.');
    }
  };

  const handleNameFocus = () => {
    if (customerName === DEFAULT_NAME) {
      setCustomerName('');
    }
  };

  const handleNameBlur = () => {
    if (!customerName.trim()) {
      setCustomerName(DEFAULT_NAME);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Ihr Warenkorb ist leer</h1>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Zurück zum Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Warenkorb</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-700">
              {items.map((item) => (
                <div key={item.id} className="p-4 hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    {/* Produktbild */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={item.imageUrl || '/placeholder.jpg'}
                        alt={item.name}
                        fill
                        className="object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.jpg';
                        }}
                      />
                    </div>

                    {/* Produktdetails */}
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{item.name}</h3>
                      <p className="text-blue-400 font-medium mt-1">
                        €{(item.price * item.quantity).toFixed(2)}
                      </p>

                      {/* Mengensteuerung */}
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-gray-400 hover:text-white p-1 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus className="text-sm" />
                          </button>
                          <span className="text-white px-2 min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white p-1 transition-colors"
                          >
                            <FaPlus className="text-sm" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                          title="Artikel entfernen"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zusammenfassung */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              <div className="flex justify-between items-center font-medium">
                <span className="text-gray-400">Gesamtsumme:</span>
                <span className="text-xl text-white">€{totalPrice.toFixed(2)}</span>
              </div>
              <button
                onClick={clearCart}
                className="w-full mt-4 border border-red-500 text-red-500 py-2 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              >
                Warenkorb leeren
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Bestellinformationen</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="customerName" className="block text-sm font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                onFocus={handleNameFocus}
                onBlur={handleNameBlur}
                className={`w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  customerName === DEFAULT_NAME ? 'text-gray-400' : 'text-white'
                } ${nameError ? 'border-red-500 ring-1 ring-red-500' : ''}`}
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>

            {/* PayPal Button */}
            <button
              onClick={handlePayPalClick}
              className="w-full bg-[#0070BA] hover:bg-[#003087] text-white py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <FaPaypal className="text-xl" />
              <span>Mit PayPal bezahlen</span>
            </button>

            <p className="text-sm text-gray-400 text-center mt-2">
              Nach dem Klick werden Sie zu PayPal weitergeleitet, um die Zahlung abzuschließen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
