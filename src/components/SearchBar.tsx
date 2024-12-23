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
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchItems = async () => {
      if (debouncedQuery.length < 2) {
        setResults([]);
        return;
      }

      // Hier später echte API-Suche implementieren
      const mockResults: SearchResult[] = [
        { id: '1', name: 'Würfel Set', type: 'item', price: 9.99 },
        { id: '2', name: 'Würfelbecher', type: 'item', price: 14.99 },
      ];

      setResults(mockResults);
      setIsOpen(true);
    };

    searchItems();
  }, [debouncedQuery]);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suche..."
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-[#0095FF] focus:ring-1 focus:ring-[#0095FF]"
        />
        <button 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          onClick={() => setQuery('')}
        >
          {query && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Suchergebnisse */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-[#0F1730] border border-white/10 rounded-xl shadow-xl max-h-[60vh] overflow-y-auto">
          <div className="p-2">
            {results.map((result) => (
              <button
                key={result.id}
                className="w-full p-3 flex items-center space-x-3 hover:bg-white/5 rounded-lg transition-colors"
                onClick={() => {
                  setQuery('');
                  setIsOpen(false);
                }}
              >
                <div className="flex-1 text-left">
                  <div className="font-medium text-white">{result.name}</div>
                  <div className="text-sm text-gray-400">€{result.price.toFixed(2)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
