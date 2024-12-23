'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    inStock: number;
    discount: string;
  };
  onAddToCart?: (quantity: number) => void;
}

export default function ItemCard({ item, onAddToCart }: ItemCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const detailsRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = () => {
    onAddToCart?.(quantity);
  };

  // Überprüfe, ob die erweiterten Details außerhalb des sichtbaren Bereichs sind
  useEffect(() => {
    if (isExpanded && detailsRef.current) {
      const rect = detailsRef.current.getBoundingClientRect();
      const isOffscreen = rect.bottom > window.innerHeight;
      if (isOffscreen) {
        setShowModal(true);
        setIsExpanded(false);
      }
    }
  }, [isExpanded]);

  return (
    <>
      <div className="group bg-[#0B1120]/90 backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 hover:bg-[#141F35]/90 border border-[#1A2642] hover:border-[#2A3B5E] shadow-lg before:absolute before:inset-0 before:bg-[#0047AB]/5 before:backdrop-blur-md">
        <div className="cursor-pointer relative" onClick={() => setIsExpanded(!isExpanded)}>
          {/* Bild-Container mit struktureller Trennung */}
          <div className="border-b border-[#1A2642] group-hover:border-[#2A3B5E] bg-[#0F1730]/80">
            <div className="relative w-full aspect-square">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                priority={true}
                className="object-contain p-2 transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Info-Container mit Hover-Effekt */}
          <div className="p-4 bg-gradient-to-b from-[#0047AB]/10 to-transparent backdrop-blur-[2px] transition-all duration-300 group-hover:from-[#0047AB]/15">
            <div className="space-y-3">
              <h3 className="text-white text-lg font-medium group-hover:text-[#4C9EEB] transition-colors duration-300">
                {item.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <span className="text-[#00E5FF] text-xl font-bold group-hover:scale-110 transition-transform duration-300">
                  €{item.price.toFixed(2)}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  className="px-4 py-2 bg-[#0095FF] text-white rounded-full text-sm font-medium hover:bg-[#0077FF] transition-colors duration-300"
                >
                  In den Warenkorb
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Erweiterte Details (In-Card) */}
        {isExpanded && (
          <div 
            ref={detailsRef}
            className="transition-all duration-300 ease-in-out border-t border-[#1A2642] group-hover:border-[#2A3B5E] relative"
          >
            <div className="p-4 bg-gradient-to-b from-[#0047AB]/10 to-[#0B1120]/90 backdrop-blur-[2px] transition-all duration-300">
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.max(1, quantity - 1));
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.min(item.inStock, quantity + 1));
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400 text-sm">
                  {item.inStock} verfügbar
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal für erweiterte Details */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div 
            className="fixed inset-0 bg-[#000]/70 bg-gradient-to-b from-[#0047AB]/20 to-transparent backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-[#0B1120]/95 backdrop-blur-md rounded-2xl border border-[#1A2642] w-full max-w-lg overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#1A2642] bg-gradient-to-r from-[#0047AB]/10 to-transparent backdrop-blur-[2px]">
              <h3 className="text-xl font-medium text-white">{item.name}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 bg-gradient-to-b from-[#0047AB]/5 to-[#0B1120]/95 backdrop-blur-[2px]">
              <div className="relative w-full aspect-square mb-4">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 600px"
                  priority={false}
                  className="object-contain p-4"
                />
              </div>

              <p className="text-gray-300 mb-6">
                {item.description}
              </p>

              <div className="flex items-center justify-between mb-6">
                <span className="text-[#00E5FF] text-2xl font-bold">
                  €{item.price.toFixed(2)}
                </span>
                <span className="text-gray-400">
                  {item.inStock} verfügbar
                </span>
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white text-xl w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(item.inStock, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  handleAddToCart();
                  setShowModal(false);
                }}
                className="w-full py-3 bg-[#0095FF] hover:bg-[#0077FF] text-white rounded-full text-lg font-medium transition-colors duration-300"
              >
                In den Warenkorb
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
