'use client';

import { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaUsers, FaCog } from 'react-icons/fa';
import { IoMdStats } from 'react-icons/io';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lade Produkte
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('Fehler beim Laden der Produkte');
        }
        const products = await productsResponse.json();

        // Berechne Statistiken
        const totalRevenue = products.reduce((sum: number, product: Product) => sum + product.price, 0);
        
        setStats({
          totalProducts: products.length,
          totalOrders: 0, // TODO: Implementiere Bestellungen
          totalRevenue: totalRevenue,
          activeUsers: 0 // TODO: Implementiere Benutzer
        });

        // Sortiere Produkte nach Datum und nimm die neuesten
        const sortedProducts = [...products].sort((a: any, b: any) => 
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        ).slice(0, 3);
        
        setRecentProducts(sortedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-white">Lade Dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-red-500">Fehler: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="bg-[#1A2642]/40 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white">
                <FaCog className="w-6 h-6" />
              </button>
              <div className="text-sm text-gray-300">
                <span>Willkommen, </span>
                <span className="font-medium text-[#0095FF]">Admin</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<FaBox className="w-6 h-6" />}
            title="Produkte"
            value={stats.totalProducts}
            trend={`${stats.totalProducts} Gesamt`}
            trendColor="text-blue-500"
          />
          <StatCard
            icon={<FaShoppingCart className="w-6 h-6" />}
            title="Bestellungen"
            value={stats.totalOrders}
            trend="In Entwicklung"
            trendColor="text-yellow-500"
          />
          <StatCard
            icon={<IoMdStats className="w-6 h-6" />}
            title="Gesamtwert"
            value={`€${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            trend="Warenwert"
            trendColor="text-green-500"
          />
          <StatCard
            icon={<FaUsers className="w-6 h-6" />}
            title="Aktive Nutzer"
            value={stats.activeUsers}
            trend="In Entwicklung"
            trendColor="text-yellow-500"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <QuickAction
            title="Produkt hinzufügen"
            icon={<FaBox className="w-6 h-6" />}
            onClick={() => console.log('Add product')}
          />
          <QuickAction
            title="Bestellungen verwalten"
            icon={<FaShoppingCart className="w-6 h-6" />}
            onClick={() => console.log('Manage orders')}
          />
          <QuickAction
            title="Statistiken anzeigen"
            icon={<IoMdStats className="w-6 h-6" />}
            onClick={() => console.log('View stats')}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Letzte Aktivitäten</h2>
          <div className="space-y-4">
            {recentProducts.map((product) => (
              <ActivityItem
                key={product.id}
                title={`Produkt: ${product.name}`}
                description={`Preis: €${product.price.toFixed(2)}`}
                time={new Date(product.updatedAt).toLocaleString('de-DE')}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

// StatCard Komponente
function StatCard({ icon, title, value, trend, trendColor }: {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  trend: string;
  trendColor: string;
}) {
  return (
    <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="text-[#0095FF]">{icon}</div>
        <div className={`${trendColor} text-sm`}>{trend}</div>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-400 text-sm">{title}</h3>
        <p className="text-2xl font-semibold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

// QuickAction Komponente
function QuickAction({ title, icon, onClick }: {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6 text-left hover:bg-[#1A2642]/60 transition-colors w-full"
    >
      <div className="flex items-center space-x-4">
        <div className="text-[#0095FF]">{icon}</div>
        <h3 className="text-white font-medium">{title}</h3>
      </div>
    </button>
  );
}

// ActivityItem Komponente
function ActivityItem({ title, description, time }: {
  title: string;
  description: string;
  time: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <span className="text-gray-500 text-sm">{time}</span>
    </div>
  );
}
