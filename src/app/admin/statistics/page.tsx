'use client';

import { useState, useEffect } from 'react';
import { FaChartLine, FaShoppingCart, FaUsers, FaMoneyBillWave } from 'react-icons/fa';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
}

export default function StatisticsPage() {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/statistics');
      const data = await response.json();
      setStats(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Statistiken</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1A2642] p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#0095FF]/10 rounded-lg flex items-center justify-center">
              <FaMoneyBillWave className="w-6 h-6 text-[#0095FF]" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Gesamtumsatz</p>
              <p className="text-2xl font-bold text-white">€{stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A2642] p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#0095FF]/10 rounded-lg flex items-center justify-center">
              <FaShoppingCart className="w-6 h-6 text-[#0095FF]" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Bestellungen</p>
              <p className="text-2xl font-bold text-white">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A2642] p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#0095FF]/10 rounded-lg flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-[#0095FF]" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Kunden</p>
              <p className="text-2xl font-bold text-white">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1A2642] p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-[#0095FF]/10 rounded-lg flex items-center justify-center">
              <FaChartLine className="w-6 h-6 text-[#0095FF]" />
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Ø Bestellwert</p>
              <p className="text-2xl font-bold text-white">€{stats.averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
