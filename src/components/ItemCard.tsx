'use client';

import { useCart } from '@/lib/CartContext';
import { FaShoppingCart } from 'react-icons/fa';
import { useState } from 'react';
import Image from 'next/image';

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  game: string;
  category: string;
  imageUrl: string;
}

interface ItemCardProps {
  item: Item;
}

export default function ItemCard({ item }: ItemCardProps) {
  const { id, name, description, price = 0, game, imageUrl } = item;
  const { addItem } = useCart();
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id,
      name,
      price,
      imageUrl,
      quantity
    });
    setIsExpanded(false);
    setQuantity(1);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(Math.max(1, quantity + delta));
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48">
        <Image
          src={imageUrl || '/placeholder.jpg'}
          alt={name}
          fill
          className="object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.jpg';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-gradient-to-t from-gray-900 to-transparent">
          <span className="inline-block bg-gray-900 bg-opacity-70 px-2 py-1 rounded text-blue-400 text-sm font-medium mb-1">{game}</span>
          <h3 className="text-white font-semibold text-lg truncate">{name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-blue-500 text-xl font-bold">€{price.toFixed(2)}</span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? 'Weniger' : 'Mehr'}
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-0'}`}>
          <div className="bg-gray-700 rounded-lg p-4 mb-4">
            <p className="text-gray-300 text-sm mb-4">{description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-300">Menge:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                >
                  -
                </button>
                <span className="text-white w-8 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
        >
          <FaShoppingCart />
          <span>In den Warenkorb</span>
        </button>
      </div>
    </div>
  );
}
