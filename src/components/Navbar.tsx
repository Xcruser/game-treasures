'use client';

import Link from 'next/link';
import { useState } from 'react';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0); // TODO: Connect to real cart state

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-glass bg-navbar-glass border-b border-navbar-border shadow-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo und Titel - Links */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                GameTreasures
              </span>
            </Link>
          </div>

          {/* Navigation - Mitte */}
          <div className="hidden md:flex items-center justify-center space-x-8">
            <Link 
              href="/shop" 
              className="text-gray-300 hover:text-white hover:bg-navbar-glass px-3 py-2 rounded-md transition-all duration-200"
            >
              Shop
            </Link>
            <Link 
              href="/contact" 
              className="text-gray-300 hover:text-white hover:bg-navbar-glass px-3 py-2 rounded-md transition-all duration-200"
            >
              Kontakt
            </Link>
          </div>

          {/* Rechte Seite: Suche, Warenkorb, Login */}
          <div className="hidden md:flex items-center space-x-6">
            <SearchBar />
            
            {/* Warenkorb */}
            <Link href="/cart" className="relative group">
              <div className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <svg 
                  className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Login Button */}
            <Link 
              href="/login"
              className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium"
            >
              Anmelden
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-navbar-glass focus:outline-none"
            >
              <span className="sr-only">Menü öffnen</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-navbar-glass backdrop-blur-glass border-t border-navbar-border">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="p-4">
              <SearchBar />
            </div>
            <Link
              href="/shop"
              className="text-gray-300 hover:text-white hover:bg-navbar-glass block px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white hover:bg-navbar-glass block px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Kontakt
            </Link>
            <Link
              href="/cart"
              className="text-gray-300 hover:text-white hover:bg-navbar-glass block px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Warenkorb {cartCount > 0 && `(${cartCount})`}
            </Link>
            <Link
              href="/login"
              className="text-gray-300 hover:text-white hover:bg-navbar-glass block px-3 py-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Anmelden
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
