'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: number;
  imageUrl: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Fehler beim Laden der Produkte');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-white">Lade Produkte...</div>
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
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">Produkte verwalten</h1>
            <button className="bg-[#0095FF] hover:bg-[#0077CC] text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors">
              <FaPlus className="w-4 h-4" />
              <span>Neues Produkt</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Search and Filter */}
        <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl p-4 mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Produkt suchen..."
                className="w-full bg-[#0B1120] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
              />
            </div>
            <select className="bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]">
              <option value="">Alle Kategorien</option>
              <option value="Würfel">Würfel</option>
              <option value="Brettspiele">Brettspiele</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0B1120]/50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Produkt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Kategorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Preis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Lagerbestand</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-[#0B1120]/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img className="h-10 w-10 rounded-lg object-cover" src={product.imageUrl} alt={product.name} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{product.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">€{product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{product.inStock}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-[#0095FF] hover:text-[#0077CC] mr-3">
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
