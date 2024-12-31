'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { FaShoppingCart, FaUser, FaChartLine, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '@/lib/CartContext';

export default function Navbar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { totalItems = 0, setIsOpen } = useCart();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
    router.refresh();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-[#0B1120]/95 backdrop-blur-md border-b border-[#1A2642] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-white text-lg font-semibold">Game Treasures</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') ? 'text-[#4C9EEB]' : 'text-gray-300 hover:text-[#4C9EEB]'
              } transition-all duration-300`}
            >
              Home
            </Link>
            <Link
              href="/shop"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/shop') ? 'text-[#4C9EEB]' : 'text-gray-300 hover:text-[#4C9EEB]'
              } transition-all duration-300`}
            >
              Shop
            </Link>
            <Link
              href="/kontakt"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/kontakt') ? 'text-[#4C9EEB]' : 'text-gray-300 hover:text-[#4C9EEB]'
              } transition-all duration-300`}
            >
              Kontakt
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(true)}
              className="relative text-gray-500 hover:text-gray-400 transition-all duration-300"
              aria-label="Shopping Cart"
            >
              <FaShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              {session ? (
                <>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-300 hover:text-[#4C9EEB] transition-all duration-300"
                  >
                    <FaUser className="w-5 h-5" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-[#1A2642] ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {session.user?.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#2A3652] hover:text-white"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <FaChartLine className="mr-2" />
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center px-4 py-2 text-sm text-gray-300 hover:bg-[#2A3652] hover:text-white"
                        >
                          <FaSignOutAlt className="mr-2" />
                          Abmelden
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-2 text-gray-300 hover:text-[#4C9EEB] transition-all duration-300"
                >
                  <FaUser className="w-5 h-5" />
                  <span className="text-sm font-medium">Anmelden</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
