'use client';

import { useState } from 'react';
import { FaSearch, FaEnvelope, FaPhone, FaShoppingBag } from 'react-icons/fa';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

export default function CustomersPage() {
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Max Mustermann',
      email: 'max@example.com',
      phone: '+49 123 456789',
      orders: 5,
      totalSpent: 249.95,
      lastOrder: '22.12.2023'
    },
    // Weitere Kunden hier...
  ]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Kunden</h1>
      </div>

      {/* Search */}
      <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-4 mb-8">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Kunden suchen..."
            className="w-full bg-[#0B1120] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6 hover:bg-[#1A2642]/60 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-white font-medium">{customer.name}</h3>
                <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                  <FaEnvelope />
                  <span>{customer.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-400 text-sm mt-1">
                  <FaPhone />
                  <span>{customer.phone}</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#0095FF]/10 flex items-center justify-center">
                <span className="text-[#0095FF] font-medium">{customer.name.charAt(0)}</span>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-400 text-sm">Bestellungen</div>
                  <div className="flex items-center space-x-2 mt-1">
                    <FaShoppingBag className="text-[#0095FF]" />
                    <span className="text-white font-medium">{customer.orders}</span>
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm">Ausgegeben</div>
                  <div className="text-white font-medium mt-1">
                    €{customer.totalSpent.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-gray-400 text-sm">Letzte Bestellung</div>
                <div className="text-white mt-1">{customer.lastOrder}</div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 text-[#0095FF] hover:text-white hover:bg-[#0095FF] border border-[#0095FF] rounded-lg transition-colors">
              Details anzeigen
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
