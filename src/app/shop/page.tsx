'use client';

import { Suspense, lazy, useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load the ItemCard component
const ItemCard = lazy(() => import('@/components/ItemCard'));

// Typ für Items aus der Datenbank
interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: number;
  category: string;
}

export default function ShopPage() {
  const [visibleItems, setVisibleItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lade Daten von der API
    fetch('/api/products')
      .then(response => response.json())
      .then(data => {
        setVisibleItems(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error loading products:', error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Initialize Intersection Observer
    const options = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add data-loaded attribute when item becomes visible
          entry.target.setAttribute('data-loaded', 'true');
          // Stop observing this item
          observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all item containers
    document.querySelectorAll('.item-container').forEach((item) => {
      observer.observe(item);
    });

    return () => observer.disconnect();
  }, [visibleItems]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-8">Shop</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {visibleItems.map((item) => (
          <div key={item.id} className="item-container opacity-0 transition-opacity duration-500" data-loaded="false">
            <Suspense fallback={
              <div className="bg-[#0B1120]/90 rounded-2xl p-4 h-[300px] animate-pulse">
                <div className="w-full h-48 bg-[#1A2642]/50 rounded-lg mb-4"></div>
                <div className="h-4 bg-[#1A2642]/50 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-[#1A2642]/50 rounded w-1/2"></div>
              </div>
            }>
              <ItemCard item={item} />
            </Suspense>
          </div>
        ))}
      </div>

      <style jsx>{`
        .item-container[data-loaded="true"] {
          opacity: 1;
        }
      `}</style>
    </main>
  );
}
