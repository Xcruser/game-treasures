'use client';

import { useState, useEffect } from 'react';
import { FaBox, FaShoppingCart, FaUsers, FaPlus } from 'react-icons/fa';
import { IoMdStats } from 'react-icons/io';
import EditProductModal from '@/components/EditProductModal';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: number;
  imageUrl: string;
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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (product: Product) => {
    try {
      console.log('Saving product:', product);
      
      // Entferne unlimitedStock aus den Daten
      const { unlimitedStock, ...productData } = product as any;

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fehler beim Speichern des Produkts');
      }

      setIsModalOpen(false);
      await fetchData(); // Aktualisiere die Daten
    } catch (err) {
      console.error('Error saving product:', err);
      alert(err instanceof Error ? err.message : 'Fehler beim Speichern des Produkts');
    }
  };

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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaBox className="w-8 h-8" />}
          title="Produkte"
          value={stats.totalProducts}
          trend="+5%"
          trendColor="text-green-500"
        />
        <StatCard
          icon={<FaShoppingCart className="w-8 h-8" />}
          title="Bestellungen"
          value={stats.totalOrders}
          trend="+12%"
          trendColor="text-green-500"
        />
        <StatCard
          icon={<IoMdStats className="w-8 h-8" />}
          title="Umsatz"
          value={`€${stats.totalRevenue.toFixed(2)}`}
          trend="+8%"
          trendColor="text-green-500"
        />
        <StatCard
          icon={<FaUsers className="w-8 h-8" />}
          title="Aktive Nutzer"
          value={stats.activeUsers}
          trend="+3%"
          trendColor="text-green-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <QuickAction
          title="Produkt hinzufügen"
          icon={<FaPlus className="w-6 h-6" />}
          onClick={() => setIsModalOpen(true)}
        />
        {/* Weitere Quick Actions hier */}
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Neueste Produkte</h2>
        <div className="space-y-4">
          {recentProducts.map((product) => (
            <ActivityItem
              key={product.id}
              title={product.name}
              description={`Preis: €${product.price.toFixed(2)}`}
              time={new Date(product.updatedAt).toLocaleDateString()}
            />
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <EditProductModal
        product={null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
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
        <div className="text-gray-400">{icon}</div>
        <div className={`text-sm ${trendColor}`}>{trend}</div>
      </div>
      <div className="mt-4">
        <h3 className="text-gray-300 text-sm font-medium">{title}</h3>
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
      className="flex items-center justify-between bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-6 hover:bg-[#2A3B5E]/40 transition-colors"
    >
      <span className="text-white font-medium">{title}</span>
      <span className="text-[#0095FF]">{icon}</span>
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
    <div className="flex items-center justify-between py-3 border-b border-[#2A3B5E] last:border-0">
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
      <span className="text-gray-500 text-sm">{time}</span>
    </div>
  );
}
