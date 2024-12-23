'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaInfinity } from 'react-icons/fa';
import ImageSelector from './ImageSelector';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: number;
  imageUrl: string;
  unlimitedStock?: boolean;
}

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export default function EditProductModal({ product, isOpen, onClose, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    category: '',
    inStock: 0,
    imageUrl: '',
    unlimitedStock: false
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        unlimitedStock: product.inStock === -1
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);
    onSave({
      ...formData,
      price: Number(formData.price),
      inStock: formData.unlimitedStock ? -1 : Number(formData.inStock)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'inStock' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A2642] rounded-xl shadow-lg w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {product ? 'Produkt bearbeiten' : 'Neues Produkt'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Beschreibung</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF] h-24"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Preis (€)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-300">Lagerbestand</label>
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="unlimitedStock"
                    checked={formData.unlimitedStock}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-700 bg-[#0B1120] text-[#0095FF] focus:ring-[#0095FF]"
                  />
                  <label className="text-sm text-gray-300 flex items-center space-x-1">
                    <FaInfinity className="w-4 h-4" />
                    <span>Unbegrenzt verfügbar</span>
                  </label>
                </div>
                {!formData.unlimitedStock && (
                  <input
                    type="number"
                    name="inStock"
                    value={formData.inStock}
                    onChange={handleChange}
                    min="0"
                    className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Kategorie</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
              required
            >
              <option value="">Kategorie wählen</option>
              <option value="Würfel">Würfel</option>
              <option value="Brettspiele">Brettspiele</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Bild</label>
            <ImageSelector
              value={formData.imageUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#0095FF] hover:bg-[#0077CC] text-white transition-colors"
            >
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
