'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import { usePathname } from 'next/navigation';
import { HiOutlineShoppingBag } from 'react-icons/hi';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { FaUser, FaSignOutAlt, FaCog } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const cartItemCount = 0; // assuming this is where you get the cart item count from
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Event-Listener für Klicks außerhalb des Dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      setIsDropdownOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Glaseffekt Container */}
      <div className="bg-[#0B1120]/90 backdrop-blur-md border-b border-[#1A2642] shadow-lg relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0047AB]/10 via-transparent to-[#0047AB]/10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo und Navigation Links */}
            <div className="flex items-center">
              <Link href="/" className="text-[#00E5FF] text-xl font-bold hover:text-[#4C9EEB] transition-colors duration-300">
                <span className="text-xl font-bold bg-gradient-to-r from-[#4C9EEB] to-[#00E5FF] text-transparent bg-clip-text">
                  GameTreasures
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <Link
                    href="/shop"
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                      isActivePath('/shop')
                        ? 'bg-[#0095FF] text-white'
                        : 'text-gray-300 hover:text-[#4C9EEB] transition-colors duration-300'
                    }`}
                  >
                    Shop
                  </Link>
                  <Link
                    href="/kontakt"
                    className={`px-4 py-2 rounded-full transition-all duration-200 ${
                      isActivePath('/kontakt')
                        ? 'bg-[#0095FF] text-white'
                        : 'text-gray-300 hover:text-[#4C9EEB] transition-colors duration-300'
                    }`}
                  >
                    Kontakt
                  </Link>
                </div>
              </div>
            </div>

            {/* Rechte Seite - Suche, Warenkorb, Anmelden */}
            <div className="flex items-center space-x-4">
              {/* Suchfeld */}
              <div className="hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    id="desktop-search"
                    name="desktop-search"
                    placeholder="Suche..."
                    autoComplete="off"
                    aria-label="Suche"
                    className="w-64 bg-[#1E2A45]/50 backdrop-blur-[2px] border border-[#2A3B5E] rounded-full py-1 px-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/30 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Warenkorb */}
              <button 
                className="relative p-2 text-gray-300 hover:text-[#0095FF] transition-all duration-300 group"
                aria-label="Warenkorb öffnen"
              >
                <HiOutlineShoppingBag className="h-6 w-6 transform group-hover:scale-110 transition-all duration-300" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#0095FF] to-[#0047AB] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* Anmelden Button */}
              {status === 'authenticated' ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-[#4C9EEB] transition-all duration-300"
                  >
                    <FaUser className="w-5 h-5" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-[#0B1120]/95 backdrop-blur-md border border-[#1A2642] rounded-lg shadow-lg py-1 z-50">
                      <Link
                        href="/admin/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-[#4C9EEB] transition-colors duration-300"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FaCog className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-[#4C9EEB] transition-colors duration-300 w-full"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span>Abmelden</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/admin/login"
                  className="text-gray-500 hover:text-gray-400 transition-all duration-300"
                  aria-label="Admin Login"
                >
                  <FaUser className="w-4 h-4" />
                </Link>
              )}

              {/* Mobile Menü Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              >
                <span className="sr-only">Menü öffnen</span>
                {!isMobileMenuOpen ? (
                  <HiMenuAlt3 className="h-6 w-6" />
                ) : (
                  <HiX className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menü */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden bg-[#0B1120]/95 backdrop-blur-md border-t border-[#1A2642]`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Suchfeld */}
            <div className="px-3 py-2">
              <input
                type="text"
                id="mobile-search"
                name="mobile-search"
                placeholder="Suche..."
                autoComplete="off"
                aria-label="Suche"
                className="w-full bg-[#1E2A45]/50 backdrop-blur-[2px] border border-[#2A3B5E] rounded-full py-1 px-4 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0047AB]/30 focus:border-transparent transition-all duration-300"
              />
            </div>

            {/* Mobile Navigation Links */}
            <Link
              href="/shop"
              className={`block px-3 py-2 rounded-md ${
                isActivePath('/shop')
                  ? 'bg-[#0095FF] text-white'
                  : 'text-gray-300 hover:text-[#4C9EEB] transition-colors duration-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link
              href="/kontakt"
              className={`block px-3 py-2 rounded-md ${
                isActivePath('/kontakt')
                  ? 'bg-[#0095FF] text-white'
                  : 'text-gray-300 hover:text-[#4C9EEB] transition-colors duration-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
