'use client';

import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchResult {
  id: string;
  name: string;
  type: string;
  price: number;
  image?: string;
}

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchItems = async () => {
      if (debouncedSearch.trim() === '') {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        // Mock-Daten für die Demo
        const mockResults: SearchResult[] = [
          { id: '1', name: 'Schwert der Macht', type: 'Waffe', price: 1000 },
          { id: '2', name: 'Magischer Ring', type: 'Accessoire', price: 500 },
          { id: '3', name: 'Heilungstrank', type: 'Verbrauchbar', price: 100 },
        ].filter(item => 
          item.name.toLowerCase().includes(debouncedSearch.toLowerCase())
        );

        setResults(mockResults);
        setIsOpen(true);
      } catch (error) {
        console.error('Fehler bei der Suche:', error);
      } finally {
        setIsLoading(false);
      }
    };

    searchItems();
  }, [debouncedSearch]);

  return (
    <div ref={searchRef} className="relative w-full max-w-xs">
      <div className="relative group">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Suche..."
          className={`w-full bg-white/5 backdrop-blur-sm border-0 rounded-full py-1.5 pl-8 pr-4 text-sm text-gray-300 placeholder-gray-500 
            transition-all duration-200 outline-none
            ${isFocused ? 'bg-white/10 shadow-lg shadow-cyan-500/10' : 'hover:bg-white/8'}
            focus:ring-1 focus:ring-cyan-400/30`}
        />
        <div className="absolute inset-y-0 left-2.5 flex items-center pointer-events-none">
          <svg
            className={`h-3.5 w-3.5 transition-colors duration-200 ${
              isFocused ? 'text-cyan-400' : 'text-gray-500'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {isLoading && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 border-t-[1.5px] border-cyan-400"></div>
          </div>
        )}
      </div>

      {/* Suchergebnisse Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute mt-2 w-full bg-navbar-glass backdrop-blur-glass rounded-lg border border-white/5 shadow-xl shadow-black/20 overflow-hidden z-50">
          <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400/20 scrollbar-track-transparent">
            {results.map((item) => (
              <div
                key={item.id}
                className="px-4 py-2 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                onClick={() => {
                  console.log('Navigate to:', item);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white text-sm font-medium">{item.name}</h3>
                    <p className="text-gray-400 text-xs">{item.type}</p>
                  </div>
                  <span className="text-cyan-400 text-xs font-medium">{item.price} G</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
