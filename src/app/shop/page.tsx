'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import BackgroundIcons from '@/components/BackgroundIcons';

// Lazy load the ItemCard component
const ItemCard = lazy(() => import('@/components/ItemCard'));

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  game: string;
  category: string;
  imageUrl: string;
  inStock: number;
}

interface GroupedItems {
  [game: string]: {
    [category: string]: Item[];
  };
}

interface ApiResponse {
  success: boolean;
  items: Item[];
  message?: string;
  error?: string;
}

export default function ShopPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [groupedItems, setGroupedItems] = useState<GroupedItems>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasMultipleGames, setHasMultipleGames] = useState(false);

  // Hole alle verfügbaren Kategorien für das ausgewählte Spiel
  const getCategories = (game: string): string[] => {
    if (!groupedItems[game]) return [];
    return Object.keys(groupedItems[game]).sort();
  };

  // Hole alle Items für das ausgewählte Spiel und die ausgewählte Kategorie
  const getItems = (): Item[] => {
    if (!selectedGame || !selectedCategory) return [];
    return groupedItems[selectedGame]?.[selectedCategory] || [];
  };

  // Gruppiere Items nach Spiel und Kategorie
  const groupItems = (items: Item[]): GroupedItems => {
    console.log('Grouping items:', items);
    if (!Array.isArray(items) || items.length === 0) {
      console.log('No items to group');
      return {};
    }

    return items.reduce((acc: GroupedItems, item: Item) => {
      if (!item?.game || !item?.category) {
        console.warn('Invalid item found:', item);
        return acc;
      }

      if (!acc[item.game]) {
        acc[item.game] = {};
      }
      if (!acc[item.game][item.category]) {
        acc[item.game][item.category] = [];
      }
      acc[item.game][item.category].push(item);
      return acc;
    }, {});
  };

  // Lade die initialen Daten
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching products...');
        const response = await fetch('/api/products');
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`Fehler beim Laden der Produkte: ${response.status} ${response.statusText}`);
        }
        
        const data: ApiResponse = await response.json();
        console.log('Raw API response:', data);

        if (!data.success) {
          throw new Error(data.message || 'Ein Fehler ist aufgetreten');
        }

        if (!data.items) {
          console.error('No items in API response');
          throw new Error('Keine Produkte gefunden');
        }

        console.log('Setting items:', data.items);
        setItems(data.items);

        // Gruppiere die Items
        console.log('Starting to group items...');
        const grouped = groupItems(data.items);
        console.log('Grouped items:', grouped);
        setGroupedItems(grouped);

        // Setze initiale Auswahl
        const games = Object.keys(grouped);
        console.log('Available games:', games);
        setHasMultipleGames(games.length > 1);
        
        if (games.length > 0) {
          const firstGame = games[0];
          console.log('Setting initial game:', firstGame);
          setSelectedGame(firstGame);
          
          if (grouped[firstGame]) {
            const categories = Object.keys(grouped[firstGame]);
            console.log('Available categories for', firstGame, ':', categories);
            
            if (categories.length > 0) {
              console.log('Setting initial category:', categories[0]);
              setSelectedCategory(categories[0]);
            }
          }
        }
      } catch (error) {
        console.error('Detailed error information:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });
        setError(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aktualisiere gefilterte Items wenn sich die Auswahl ändert
  useEffect(() => {
    console.log('Filtering items for:', { selectedGame, selectedCategory });
    if (!selectedGame || !selectedCategory) return;

    const filtered = items.filter(item => {
      if (selectedGame === 'Alle' && selectedCategory === 'Alle') return true;
      const gameMatch = selectedGame === 'Alle' || item.game === selectedGame;
      const categoryMatch = selectedCategory === 'Alle' || item.category === selectedCategory;
      return gameMatch && categoryMatch;
    });

    console.log('Filtered items:', filtered);
    setFilteredItems(filtered);
  }, [selectedGame, selectedCategory, items]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Fehler</h2>
          <p className="text-white">{error}</p>
          <p className="text-sm text-gray-400 mt-2">
            Bitte überprüfen Sie die Browser-Konsole für weitere Details.
          </p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Keine Produkte</h2>
          <p className="text-gray-400">
            Aktuell sind keine Produkte verfügbar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hintergrund mit Icons */}
      <div className="fixed inset-0 z-0">
        <BackgroundIcons />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Hauptinhalt */}
        {/* Navigation */}
        {hasMultipleGames && (
          <div className="bg-[#1A1F2E] rounded-lg p-6 mb-8 shadow-lg">
            <div className="space-y-6">
              {/* Spiel-Auswahl */}
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Spiele</h2>
                <div className="flex flex-wrap gap-3">
                  {Object.keys(groupedItems).map((game) => (
                    <button
                      key={game}
                      onClick={() => {
                        console.log('Selected game:', game);
                        setSelectedGame(game);
                      }}
                      className={`px-6 py-3 rounded-lg transition-all duration-200 ${
                        selectedGame === game
                          ? 'bg-blue-500 text-white shadow-lg transform scale-105'
                          : 'bg-[#2A2F3E] text-gray-300 hover:bg-[#3A3F4E] hover:text-white'
                      }`}
                    >
                      {game}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kategorie-Auswahl */}
              {selectedGame && getCategories(selectedGame).length > 1 && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Kategorien</h3>
                  <div className="flex flex-wrap gap-2">
                    {getCategories(selectedGame).map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          console.log('Selected category:', category);
                          setSelectedCategory(category);
                        }}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-blue-500 text-white shadow-md transform scale-105'
                            : 'bg-[#2A2F3E] text-gray-300 hover:bg-[#3A3F4E] hover:text-white'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Produkte */}
        {selectedGame && selectedCategory && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getItems().map((item) => (
              <div key={item.id} className="transform transition-all duration-200 hover:scale-105">
                <Suspense fallback={
                  <div className="bg-[#1A1F2E] rounded-lg p-4 h-[300px] animate-pulse">
                    <div className="w-full h-48 bg-[#2A2F3E] rounded-lg mb-4"></div>
                    <div className="h-4 bg-[#2A2F3E] rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#2A2F3E] rounded w-1/2"></div>
                  </div>
                }>
                  <ItemCard item={item} />
                </Suspense>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
