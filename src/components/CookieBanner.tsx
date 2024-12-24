'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Prüfe beim Laden, ob die Cookies bereits akzeptiert wurden
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setIsVisible(false);
  };

  const handleReject = () => {
    // Hier könnten Sie nicht-essenzielle Cookies deaktivieren
    localStorage.setItem('cookiesAccepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A2642] text-white p-4 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p>
            Diese Website verwendet Cookies, um Ihre Erfahrung zu verbessern.{' '}
            <Link href="/datenschutz" className="text-[#0095FF] hover:underline">
              Mehr erfahren
            </Link>
          </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleReject}
            className="px-6 py-3 bg-[#243154] text-white rounded-md hover:bg-[#2d3c64] transition-colors border border-gray-600"
          >
            Nur Notwendige
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-3 bg-[#0095FF] text-white rounded-md hover:bg-[#0077CC] transition-colors font-medium"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
