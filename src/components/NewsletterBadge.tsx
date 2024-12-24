'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaEnvelope } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function NewsletterBadge() {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Vielen Dank für Ihre Anmeldung!');
        setIsFormVisible(false);
        localStorage.setItem('newsletterSubscribed', 'true');
      } else {
        toast.error(data.error || 'Ein Fehler ist aufgetreten');
      }
    } catch (error) {
      toast.error('Ein Fehler ist aufgetreten');
      console.error('Newsletter subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Warte bis die Komponente gemounted ist
  if (!mounted) return null;

  // Wenn bereits angemeldet, nicht anzeigen
  if (typeof window !== 'undefined' && localStorage.getItem('newsletterSubscribed')) {
    return null;
  }

  return (
    <>
      {/* Schwebendes Symbol */}
      <button
        onClick={() => setIsFormVisible(true)}
        className={`fixed bottom-24 right-6 w-14 h-14 bg-[#0095FF] text-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#0077CC] transition-all duration-300 cursor-pointer z-50 ${
          isFormVisible ? 'scale-0' : 'scale-100'
        }`}
        style={{ pointerEvents: 'auto' }}
      >
        <FaEnvelope className="w-6 h-6" />
      </button>

      {/* Newsletter Formular */}
      {isFormVisible && (
        <div className="fixed bottom-24 right-6 w-[320px] bg-[#1A2642] rounded-lg shadow-2xl p-6 z-50 border border-gray-700 animate-fade-in">
          <button
            onClick={() => setIsFormVisible(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-white">Newsletter abonnieren</h3>
            <p className="text-sm text-gray-300">
              Melden Sie sich für unseren Newsletter an und erhalten Sie exklusive Angebote 
              und Neuigkeiten aus der Welt der Brettspiele.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ihre E-Mail-Adresse"
              required
              disabled={isLoading}
              className="w-full px-4 py-2 bg-[#243154] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0095FF] focus:border-transparent disabled:opacity-50"
            />
            <div className="text-xs text-gray-400">
              Mit der Anmeldung stimmen Sie dem Erhalt des Newsletters zu.
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0095FF] text-white py-2 px-4 rounded-md hover:bg-[#0077CC] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
