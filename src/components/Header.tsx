import React from 'react';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative overflow-hidden min-h-[60vh] md:min-h-[80vh] flex items-center justify-center">
      {/* Hintergrund mit Gradient und Overlay */}
      <div className="absolute inset-0 bg-[#010314]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      </div>

      {/* Hauptinhalt */}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="text-center">
          {/* Titel */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8">
            <span className="text-[#4C9EEB]">
              GameTreasures
            </span>
          </h1>

          {/* Untertitel */}
          <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 px-4">
            <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed">
              Entdecken Sie unsere exklusiven Monopoly-Items – einfach, sicher und diskret. Bei uns 
              können Sie ganz bequem einkaufen, ohne sich registrieren zu müssen. Für den Kauf 
              benötigen Sie weder einen Account noch Ihre Monopoly Go Spieldaten.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/shop"
              className="w-full sm:w-auto px-8 py-3 bg-[#0095FF] hover:bg-[#0077FF] text-white rounded-full text-lg font-medium transition-colors duration-300"
            >
              Zum Shop
            </Link>
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-8 py-3 bg-white/10 hover:bg-white/15 text-white rounded-full text-lg font-medium transition-colors duration-300"
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
