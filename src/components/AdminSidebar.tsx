'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBox, FaEnvelope, FaNewspaper, FaShoppingBag, FaChartBar } from 'react-icons/fa';
import { useState, useEffect } from 'react';

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? 'bg-[#243154]' : '';
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-[#1A2642] text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaHome className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#1A2642] transform transition-transform duration-200 ease-in-out z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <nav className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <Link href="/" className="text-xl font-bold text-white">
              Game Treasures
            </Link>
          </div>

          <div className="flex-1">
            <Link
              href="/admin"
              className={`flex items-center px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg ${
                pathname === '/admin' ? 'bg-gray-800' : ''
              }`}
            >
              <FaChartBar className="w-5 h-5 mr-3" />
              Dashboard
            </Link>

            <Link
              href="/admin/orders"
              className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#243154] hover:text-white ${isActive(
                '/admin/orders'
              )}`}
              onClick={closeSidebar}
            >
              <FaShoppingBag className="w-5 h-5" />
              <span>Bestellungen</span>
            </Link>

            <Link
              href="/admin/products"
              className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#243154] hover:text-white ${isActive(
                '/admin/products'
              )}`}
              onClick={closeSidebar}
            >
              <FaBox className="w-5 h-5" />
              <span>Produkte</span>
            </Link>

            <Link
              href="/admin/email"
              className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#243154] hover:text-white ${isActive(
                '/admin/email'
              )}`}
              onClick={closeSidebar}
            >
              <FaEnvelope className="w-5 h-5" />
              <span>E-Mail</span>
            </Link>

            <Link
              href="/admin/newsletter"
              className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-[#243154] hover:text-white ${isActive(
                '/admin/newsletter'
              )}`}
              onClick={closeSidebar}
            >
              <FaNewspaper className="w-5 h-5" />
              <span>Newsletter</span>
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}
