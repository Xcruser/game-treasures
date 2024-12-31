'use client';

import { useState, useEffect } from 'react';
import { FaShoppingBag, FaUsers, FaEuroSign, FaGamepad, FaEnvelope, FaChartLine } from 'react-icons/fa';
import AdminSidebar from '@/components/AdminSidebar';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalGames: 0,
    newsletterSubscribers: 0,
    recentOrders: [],
    salesData: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Fehler beim Laden der Dashboard-Daten');
    }
  };

  const StatCard = ({ title, value, icon: Icon, bgColor, link }) => (
    <Link href={link} className="block">
      <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800 hover:bg-[#1E293B]/80 transition-colors cursor-pointer">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <div className={`p-3 ${bgColor} rounded-lg`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
        <p className="text-3xl font-bold text-white">{value}</p>
        <p className="text-gray-400 mt-2">Zum {title}-Bereich</p>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AdminSidebar />
      <main>
        <div className="flex justify-between items-center border-b border-gray-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <StatCard
            title="Umsatz"
            value={`€${(stats.totalRevenue || 0).toFixed(2)}`}
            icon={FaEuroSign}
            bgColor="bg-green-500/10 text-green-400"
            link="/admin/orders"
          />
          <StatCard
            title="Bestellungen"
            value={stats.totalOrders || 0}
            icon={FaShoppingBag}
            bgColor="bg-blue-500/10 text-blue-400"
            link="/admin/orders"
          />
          <StatCard
            title="Benutzer"
            value={stats.totalCustomers || 0}
            icon={FaUsers}
            bgColor="bg-purple-500/10 text-purple-400"
            link="/admin/users"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-6">
          <StatCard
            title="Produkte"
            value={stats.totalProducts || 0}
            icon={FaGamepad}
            bgColor="bg-yellow-500/10 text-yellow-400"
            link="/admin/products"
          />
          <StatCard
            title="Spiele"
            value={stats.totalGames || 0}
            icon={FaGamepad}
            bgColor="bg-red-500/10 text-red-400"
            link="/admin/products"
          />
          <StatCard
            title="Newsletter"
            value={stats.newsletterSubscribers || 0}
            icon={FaEnvelope}
            bgColor="bg-indigo-500/10 text-indigo-400"
            link="/admin/newsletter"
          />
        </div>

        <div className="p-6">
          <div className="bg-[#1E293B] rounded-xl border border-gray-800 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Umsatzentwicklung</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1E293B',
                      border: '1px solid #374151',
                      borderRadius: '0.5rem'
                    }}
                    labelStyle={{ color: '#9CA3AF' }}
                    itemStyle={{ color: '#9CA3AF' }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    name="Umsatz (€)"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#3B82F6" 
                    name="Bestellungen"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-[#1E293B] rounded-xl border border-gray-800">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Letzte Bestellungen</h2>
                <Link 
                  href="/admin/orders"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Alle Bestellungen
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Bestellnummer</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Kunde</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Datum</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Betrag</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-800 last:border-b-0">
                        <td className="py-4 px-4 text-white">#{order.id}</td>
                        <td className="py-4 px-4 text-white">{order.customerName}</td>
                        <td className="py-4 px-4 text-white">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4">
                          <span 
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' 
                                ? 'bg-green-500/10 text-green-400'
                                : order.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-blue-500/10 text-blue-400'
                            }`}
                          >
                            {order.status === 'completed' ? 'Abgeschlossen' :
                             order.status === 'pending' ? 'Ausstehend' : 'In Bearbeitung'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white">€{order.total.toFixed(2)}</td>
                      </tr>
                    ))}
                    {stats.recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          Keine Bestellungen vorhanden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
