'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaInfinity } from 'react-icons/fa';
import ImageSelector from './ImageSelector';
import Image from 'next/image';
import toast from 'react-hot-toast'; // Import the toast library

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  game: string;
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
    game: '',
    category: '',
    inStock: 0,
    imageUrl: '',
    unlimitedStock: false
  });
  const [games, setGames] = useState<string[]>([]);
  const [newGame, setNewGame] = useState('');
  const [showNewGameInput, setShowNewGameInput] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState<{[key: string]: string[]}>({});

  useEffect(() => {
    // Lade alle vorhandenen Spiele
    fetch('/api/games')
      .then(response => response.json())
      .then(data => setGames(data))
      .catch(error => console.error('Error loading games:', error));

    // Lade alle Kategorien
    fetch('/api/categories')
      .then(response => response.json())
      .then(data => setCategories(data))
      .catch(error => console.error('Error loading categories:', error));
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        ...product,
        unlimitedStock: product.inStock === -1
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aktualisiere das Produkt in der Datenbank
    try {
      const response = await fetch(`/api/products/${formData.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          inStock: formData.unlimitedStock ? -1 : formData.inStock
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Fehler beim Aktualisieren des Produkts');
      }
      
      // Informiere die übergeordnete Komponente
      onSave(data);
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error instanceof Error ? error.message : 'Fehler beim Aktualisieren des Produkts');
    } finally {
      // Schließe das Modal in jedem Fall
      onClose();
    }
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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setFormData(prev => ({ ...prev, category: newCategory }));
  };

  const handleNewGameSubmit = () => {
    if (newGame.trim()) {
      setGames(prev => [...prev, newGame]);
      setFormData(prev => ({ ...prev, game: newGame }));
      setNewGame('');
      setShowNewGameInput(false);
    }
  };

  const handleNewCategorySubmit = () => {
    if (newCategory.trim() && formData.game) {
      setCategories(prev => ({
        ...prev,
        [formData.game]: [...(prev[formData.game] || []), newCategory]
      }));
      setFormData(prev => ({ ...prev, category: newCategory }));
      setNewCategory('');
      setShowNewCategoryInput(false);

      // Speichere die neue Kategorie auf dem Server
      fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          game: formData.game,
          category: newCategory
        })
      }).catch(error => console.error('Error saving category:', error));
    }
  };

  const getCategories = (game: string) => {
    return categories[game] || [];
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-[#1A1F2E] rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-700">
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
          {/* Bildvorschau und Auswahl */}
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Produktbild</label>
            <div className="relative w-full h-48 mb-4 bg-[#0B1120] rounded-lg overflow-hidden">
              {formData.imageUrl ? (
                <Image
                  src={formData.imageUrl}
                  alt={formData.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <FaTimes className="w-8 h-8" />
                </div>
              )}
            </div>
            <ImageSelector
              value={formData.imageUrl}
              onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
            />
          </div>

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

          <div className="space-y-4">
            {/* Spiel-Auswahl */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Spiel</label>
              {showNewGameInput ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newGame}
                    onChange={(e) => setNewGame(e.target.value)}
                    className="flex-1 bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                    placeholder="Neues Spiel eingeben"
                  />
                  <button
                    type="button"
                    onClick={handleNewGameSubmit}
                    className="px-4 py-2 bg-[#0095FF] text-white rounded-lg hover:bg-[#0077CC]"
                  >
                    Hinzufügen
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewGameInput(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Abbrechen
                  </button>
                </div>
              ) : (
                <select
                  name="game"
                  value={formData.game}
                  onChange={handleChange}
                  className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                  required
                >
                  <option value="">Spiel wählen</option>
                  {games.map(game => (
                    <option key={game} value={game}>{game}</option>
                  ))}
                  <option value="new">+ Neues Spiel hinzufügen</option>
                </select>
              )}
            </div>

            {/* Kategorie-Auswahl */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Kategorie</label>
              {showNewCategoryInput ? (
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                    placeholder="Neue Kategorie eingeben"
                  />
                  <button
                    type="button"
                    onClick={handleNewCategorySubmit}
                    className="px-4 py-2 bg-[#0095FF] text-white rounded-lg hover:bg-[#0077CC]"
                  >
                    Hinzufügen
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowNewCategoryInput(false)}
                    className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                  >
                    Abbrechen
                  </button>
                </div>
              ) : (
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="w-full bg-[#0B1120] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#0095FF]"
                  required
                  disabled={!formData.game}
                >
                  <option value="">Kategorie wählen</option>
                  {formData.game && getCategories(formData.game).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="new">+ Neue Kategorie hinzufügen</option>
                </select>
              )}
            </div>
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
