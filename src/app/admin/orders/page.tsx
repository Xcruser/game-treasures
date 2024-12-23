'use client';

import { useState } from 'react';
import { FaSearch, FaEye, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: number;
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    {
      id: '#ORD-1234',
      customer: 'Max Mustermann',
      date: '23.12.2023',
      total: 59.98,
      status: 'pending',
      items: 2
    },
    // Weitere Bestellungen hier...
  ]);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="flex items-center space-x-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full">
            <FaSpinner className="animate-spin" />
            <span>Ausstehend</span>
          </span>
        );
      case 'completed':
        return (
          <span className="flex items-center space-x-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
            <FaCheckCircle />
            <span>Abgeschlossen</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="flex items-center space-x-1 text-red-500 bg-red-500/10 px-2 py-1 rounded-full">
            <FaTimesCircle />
            <span>Storniert</span>
          </span>
        );
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Bestellungen</h1>
      </div>

      {/* Search and Filter */}
      <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-4 mb-8">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Bestellung suchen..."
              className="w-full bg-[#0B1120] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
            />
          </div>
          <select className="bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]">
            <option value="">Alle Status</option>
            <option value="pending">Ausstehend</option>
            <option value="completed">Abgeschlossen</option>
            <option value="cancelled">Storniert</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0B1120]/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Bestellung</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Kunde</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Datum</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Status</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Artikel</th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Gesamt</th>
              <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#0B1120]/30">
                <td className="px-6 py-4 text-white">{order.id}</td>
                <td className="px-6 py-4 text-gray-300">{order.customer}</td>
                <td className="px-6 py-4 text-gray-300">{order.date}</td>
                <td className="px-6 py-4">{getStatusBadge(order.status)}</td>
                <td className="px-6 py-4 text-gray-300">{order.items} Artikel</td>
                <td className="px-6 py-4 text-gray-300">€{order.total.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end">
                    <button className="text-gray-400 hover:text-[#0095FF] transition-colors">
                      <FaEye size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
