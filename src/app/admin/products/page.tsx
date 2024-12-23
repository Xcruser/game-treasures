'use client';

import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import EditProductModal from '@/components/EditProductModal';

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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Möchten Sie dieses Produkt wirklich löschen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Fehler beim Löschen des Produkts');
      }

      await fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Fehler beim Löschen des Produkts');
    }
  };

  const handleSave = async (product: Product) => {
    try {
      console.log('Saving product:', product);
      
      // Entferne unlimitedStock aus den Daten
      const { unlimitedStock, ...productData } = product;
      
      const isNewProduct = !product.id;
      const url = isNewProduct ? '/api/products' : `/api/products/${product.id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
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
      await fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      alert(err instanceof Error ? err.message : 'Fehler beim Speichern des Produkts');
    }
  };

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
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Produkte verwalten</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-4 py-2 bg-[#0095FF] text-white rounded-lg hover:bg-[#0077CC] transition-colors"
        >
          <FaPlus />
          Neues Produkt
        </button>
      </div>

      <div className="bg-[#1A2642] rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0B1120] text-gray-300 text-left">
                <th className="p-4">Bild</th>
                <th className="p-4">Name</th>
                <th className="p-4">Preis</th>
                <th className="p-4">Lagerbestand</th>
                <th className="p-4">Kategorie</th>
                <th className="p-4">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A3B5E]">
              {products.map((product) => (
                <tr key={product.id} className="text-gray-200 hover:bg-[#2A3B5E]/50">
                  <td className="p-4">
                    <img
                      src={product.imageUrl || '/placeholder.png'}
                      alt={product.name}
                      className="w-16 h-16 object-contain rounded-lg bg-[#0B1120]"
                    />
                  </td>
                  <td className="p-4">{product.name}</td>
                  <td className="p-4">€{product.price.toFixed(2)}</td>
                  <td className="p-4">
                    {product.inStock === -1 ? (
                      <span className="text-green-500">Unbegrenzt</span>
                    ) : product.inStock > 0 ? (
                      <span className="text-green-500">{product.inStock}</span>
                    ) : (
                      <span className="text-red-500">Ausverkauft</span>
                    )}
                  </td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                        title="Bearbeiten"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                        title="Löschen"
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <EditProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
