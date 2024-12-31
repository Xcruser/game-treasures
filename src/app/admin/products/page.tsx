'use client';

import { useState, useEffect } from 'react';
import { Product } from '@prisma/client';
import { FaPlus, FaEdit, FaTrash, FaBox, FaGamepad, FaEuroSign } from 'react-icons/fa';
import Image from 'next/image';
import AdminSidebar from '@/components/AdminSidebar';
import toast from 'react-hot-toast';

interface ApiResponse {
  success: boolean;
  items: Product[];
  message?: string;
  error?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('Fetching products...');
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Fehler beim Laden der Produkte: ${response.status} ${response.statusText}`);
      }

      const data: ApiResponse = await response.json();
      console.log('Received products:', data);

      if (!data.success) {
        throw new Error(data.message || 'Ein Fehler ist aufgetreten');
      }

      if (!data.items || !Array.isArray(data.items)) {
        console.error('Invalid API response:', data);
        throw new Error('Ungültiges Datenformat von der API');
      }

      setProducts(data.items);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten');
      toast.error('Fehler beim Laden der Produkte');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Sind Sie sicher, dass Sie dieses Produkt löschen möchten?')) {
      try {
        const response = await fetch('/api/products', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const data: ApiResponse = await response.json();

        if (data.success) {
          setProducts(products.filter(product => product.id !== id));
          toast.success('Produkt erfolgreich gelöscht');
        } else {
          throw new Error(data.message || 'Fehler beim Löschen des Produkts');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error(error instanceof Error ? error.message : 'Fehler beim Löschen des Produkts');
      }
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Fehler</h2>
          <p className="text-white">{error}</p>
          <button
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Erneut versuchen
          </button>
        </div>
      </div>
    );
  }

  const uniqueGames = [...new Set(products.map(product => product.game))];
  const uniqueCategories = [...new Set(products.map(product => product.category))];

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <AdminSidebar />
      <main>
        <div className="flex justify-between items-center border-b border-gray-800 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">Produkte</h1>
          <button
            onClick={handleAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <FaPlus className="w-4 h-4" /> Produkt hinzufügen
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Produkte</h3>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FaBox className="text-blue-400 w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{products.length}</p>
            <p className="text-gray-400 mt-2">Aktive Produkte</p>
          </div>

          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Spiele</h3>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FaGamepad className="text-green-400 w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{uniqueGames.length}</p>
            <p className="text-gray-400 mt-2">Verfügbare Spiele</p>
          </div>

          <div className="bg-[#1E293B] rounded-xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Kategorien</h3>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <FaBox className="text-purple-400 w-6 h-6" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{uniqueCategories.length}</p>
            <p className="text-gray-400 mt-2">Verfügbare Kategorien</p>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-[#1E293B] rounded-xl border border-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Produktliste</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Name</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Spiel</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Kategorie</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Preis</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-medium">Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-800 last:border-b-0">
                        <td className="py-4 px-4 text-white">{product.name}</td>
                        <td className="py-4 px-4 text-white">{product.game}</td>
                        <td className="py-4 px-4 text-white">{product.category}</td>
                        <td className="py-4 px-4 text-white">€{product.price.toFixed(2)}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                            >
                              <FaTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">
                          Keine Produkte vorhanden
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1E293B] rounded-xl border border-gray-800 w-full max-w-2xl mx-4">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {selectedProduct ? 'Produkt bearbeiten' : 'Neues Produkt erstellen'}
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Name</label>
                    <input
                      type="text"
                      value={selectedProduct?.name || ''}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                      className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Spiel</label>
                    <input
                      type="text"
                      value={selectedProduct?.game || ''}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, game: e.target.value })}
                      className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Kategorie</label>
                    <input
                      type="text"
                      value={selectedProduct?.category || ''}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })}
                      className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Preis</label>
                    <input
                      type="number"
                      value={selectedProduct?.price || 0}
                      onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) })}
                      step="0.01"
                      className="w-full bg-[#0F172A] border border-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setSelectedProduct(null);
                    }}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Abbrechen
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/products', {
                          method: selectedProduct?.id ? 'PUT' : 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify(selectedProduct),
                        });

                        const data: ApiResponse = await response.json();

                        if (!data.success) {
                          throw new Error(data.message || 'Fehler beim Speichern des Produkts');
                        }

                        await fetchProducts();
                        setIsEditModalOpen(false);
                        toast.success(
                          selectedProduct?.id 
                            ? 'Produkt erfolgreich aktualisiert' 
                            : 'Produkt erfolgreich erstellt'
                        );
                      } catch (error) {
                        console.error('Error saving product:', error);
                        toast.error(error instanceof Error ? error.message : 'Fehler beim Speichern des Produkts');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Speichern
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
