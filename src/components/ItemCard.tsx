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
    category: string;
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

              {/* Lagerbestand-Anzeige */}
              <div className="text-sm">
                {item.inStock === -1 ? (
                  <span className="text-green-500">Auf Lager</span>
                ) : item.inStock > 0 ? (
                  <span className="text-green-500">{item.inStock} auf Lager</span>
                ) : (
                  <span className="text-red-500">Ausverkauft</span>
                )}
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
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A2642] text-white hover:bg-[#2A3B5E] transition-colors"
                  >
                    -
                  </button>
                  <span className="text-white">{quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity(Math.min(item.inStock, quantity + 1));
                    }}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1A2642] text-white hover:bg-[#2A3B5E] transition-colors"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart();
                  }}
                  className="px-6 py-2 bg-[#0095FF] text-white rounded-full text-sm font-medium hover:bg-[#0077FF] transition-colors duration-300"
                >
                  {quantity} {quantity === 1 ? 'Stück' : 'Stücke'} hinzufügen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal für Details (wenn außerhalb des sichtbaren Bereichs) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#0B1120] rounded-2xl p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-white mb-4">{item.name}</h3>
            <p className="text-gray-400 mb-6">{item.description}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-[#0095FF] text-white rounded-lg"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
