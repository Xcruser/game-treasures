'use client';

import { useState, useEffect } from 'react';
import { Order, OrderItem } from '@prisma/client';
import { FaShoppingBag, FaEuroSign, FaUserFriends, FaCheck, FaClock, FaTruck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type OrderWithItems = Order & {
  items: OrderItem[];
};

type TimeRange = '24h' | '7d' | '30d' | '1y' | 'all';

type OrderStats = {
  totalOrders: number;
  totalRevenue: number;
  confirmedOrders: number;
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    totalRevenue: 0,
    confirmedOrders: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      // Prüfe Admin-Rolle
      if (session?.user?.role !== 'ADMIN') {
        toast.error('Keine Administratorrechte');
        router.push('/admin/dashboard');
        return;
      }
      fetchOrders();
    }
  }, [status, session, router]);

  useEffect(() => {
    if (orders) {
      filterOrders();
    }
  }, [orders, timeRange, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Keine Berechtigung');
          router.push('/admin/dashboard');
          return;
        }
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error('Unexpected data format:', data);
        toast.error('Fehler beim Laden der Bestellungen');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Fehler beim Laden der Bestellungen');
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    if (!Array.isArray(orders)) {
      console.error('Orders is not an array:', orders);
      return;
    }

    let filtered = [...orders];

    // Zeitfilter
    const now = new Date();
    const timeFilters = {
      '24h': new Date(now.getTime() - 24 * 60 * 60 * 1000),
      '7d': new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      '30d': new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      '1y': new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      'all': new Date(0)
    };

    filtered = filtered.filter(order => 
      new Date(order.createdAt) > timeFilters[timeRange]
    );

    // Statusfilter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Suchfilter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Berechne Statistiken
    const stats = filtered.reduce((acc, order) => ({
      totalOrders: acc.totalOrders + 1,
      totalRevenue: acc.totalRevenue + order.totalAmount,
      confirmedOrders: acc.confirmedOrders + (order.paymentStatus === 'CONFIRMED' ? 1 : 0)
    }), {
      totalOrders: 0,
      totalRevenue: 0,
      confirmedOrders: 0
    });

    setOrderStats(stats);
    setFilteredOrders(filtered);
  };

  const confirmPayment = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
      
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Fehler beim Bestätigen der Zahlung');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getChartData = () => {
    const data: { date: string; orders: number; revenue: number }[] = [];
    const groupedOrders = new Map();

    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const current = groupedOrders.get(date) || { orders: 0, revenue: 0 };
      groupedOrders.set(date, {
        orders: current.orders + 1,
        revenue: current.revenue + order.totalAmount
      });
    });

    groupedOrders.forEach((value, key) => {
      data.push({
        date: key,
        orders: value.orders,
        revenue: value.revenue
      });
    });

    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="flex justify-between items-center border-b border-gray-800 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">Bestellungen</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Umsatz</h3>
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <FaEuroSign className="text-blue-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{formatCurrency(orderStats.totalRevenue)}</p>
          <p className="text-gray-400 mt-2">Gesamtumsatz</p>
        </div>

        <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Abgeschlossen</h3>
            <div className="p-3 bg-green-500/10 rounded-lg">
              <FaCheck className="text-green-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{orderStats.confirmedOrders}</p>
          <p className="text-gray-400 mt-2">Abgeschlossene Bestellungen</p>
        </div>

        <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Ausstehend</h3>
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <FaClock className="text-purple-400 w-6 h-6" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{filteredOrders.length - orderStats.confirmedOrders}</p>
          <p className="text-gray-400 mt-2">Ausstehende Bestellungen</p>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-[#1E293B] rounded-xl border border-gray-800">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Bestellübersicht</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Bestellnummer</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Kunde</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Datum</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Betrag</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-800 last:border-b-0">
                      <td className="py-4 px-4 text-white">#{order.id}</td>
                      <td className="py-4 px-4 text-white">{order.customerName}</td>
                      <td className="py-4 px-4 text-white">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span 
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'CONFIRMED' 
                              ? 'bg-green-500/10 text-green-400'
                              : order.status === 'PENDING'
                              ? 'bg-yellow-500/10 text-yellow-400'
                              : 'bg-blue-500/10 text-blue-400'
                          }`}
                        >
                          {order.paymentStatus === 'CONFIRMED' ? 'Bezahlt' :
                           order.status === 'PENDING' ? 'Ausstehend' : 'In Bearbeitung'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white">{formatCurrency(order.totalAmount)}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-3">
                          {order.paymentStatus === 'PENDING' && (
                            <button
                              onClick={() => confirmPayment(order.id)}
                              className="p-2 hover:bg-green-500/10 rounded-lg text-green-400 hover:text-green-300 transition-colors"
                            >
                              Zahlung bestätigen
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
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

      {/* Bestelldetails Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] rounded-xl border border-gray-800 w-full max-w-md mx-4">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Bestellung #{selectedOrder.id}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-gray-400 text-sm">Kundeninformationen</h3>
                  <p className="text-white">{selectedOrder.customerName}</p>
                </div>

                <div>
                  <h3 className="text-gray-400 text-sm mb-2">Bestellte Artikel</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-white">
                        <span>{item.quantity}x {item.name}</span>
                        <span>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      <div className="flex justify-between text-white font-bold">
                        <span>Gesamt</span>
                        <span>{formatCurrency(selectedOrder.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-gray-400 text-sm">Bestelldatum</h3>
                    <p className="text-white">
                      {new Date(selectedOrder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-sm">Zahlungsstatus</h3>
                    <p className={selectedOrder.paymentStatus === 'CONFIRMED' ? 'text-green-400' : 'text-yellow-400'}>
                      {selectedOrder.paymentStatus === 'CONFIRMED' ? 'Bezahlt' : 'Ausstehend'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Schließen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
