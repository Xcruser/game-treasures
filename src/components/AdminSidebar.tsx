'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaBox, FaShoppingCart, FaUsers, FaChartBar, FaCog } from 'react-icons/fa';

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="fixed top-16 left-0 w-64 h-[calc(100vh-4rem)] bg-[#1A2642]/40 backdrop-blur-md">
      <nav className="flex flex-col h-full">
        <div className="flex-1 py-4">
          <ul className="space-y-2 px-4">
            <li>
              <Link
                href="/admin/dashboard"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/admin/dashboard')
                    ? 'bg-[#0095FF] text-white'
                    : 'text-gray-300 hover:bg-[#0095FF]/10 hover:text-white'
                }`}
              >
                <FaHome className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/products"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/admin/products')
                    ? 'bg-[#0095FF] text-white'
                    : 'text-gray-300 hover:bg-[#0095FF]/10 hover:text-white'
                }`}
              >
                <FaBox className="w-5 h-5" />
                <span>Produkte</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/orders"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/admin/orders')
                    ? 'bg-[#0095FF] text-white'
                    : 'text-gray-300 hover:bg-[#0095FF]/10 hover:text-white'
                }`}
              >
                <FaShoppingCart className="w-5 h-5" />
                <span>Bestellungen</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/customers"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/admin/customers')
                    ? 'bg-[#0095FF] text-white'
                    : 'text-gray-300 hover:bg-[#0095FF]/10 hover:text-white'
                }`}
              >
                <FaUsers className="w-5 h-5" />
                <span>Kunden</span>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/statistics"
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/admin/statistics')
                    ? 'bg-[#0095FF] text-white'
                    : 'text-gray-300 hover:bg-[#0095FF]/10 hover:text-white'
                }`}
              >
                <FaChartBar className="w-5 h-5" />
                <span>Statistiken</span>
              </Link>
            </li>
          </ul>
        </div>
        
        {/* Admin Info & Settings */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-[#0095FF] flex items-center justify-center">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Admin</div>
              <div className="text-xs text-gray-400">admin@gametreasures.de</div>
            </div>
            <Link
              href="/admin/settings"
              className={`p-2 rounded-lg transition-colors ${
                isActive('/admin/settings')
                  ? 'text-[#0095FF]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FaCog className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}
