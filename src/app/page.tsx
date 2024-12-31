import BackgroundIcons from '@/components/BackgroundIcons';
import Image from 'next/image';
import NewsletterBadge from '@/components/NewsletterBadge';
import CookieBanner from '@/components/CookieBanner';

export default function Home() {
  return (
    <main className="min-h-screen relative bg-background overflow-hidden">
      {/* Hintergrund mit Icons */}
      <div className="absolute inset-0 z-0">
        <BackgroundIcons />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Game<span className="text-primary">Treasures</span>
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl">
              Entdecken Sie unsere exklusiven Monopoly-Items – einfach, sicher und diskret. Bei uns können Sie ganz bequem einkaufen, ohne sich registrieren zu müssen. Für den Kauf benötigen Sie weder einen Account noch Ihre Monopoly Go Spieldaten.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a href="/shop" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10 transition-all duration-300">
                  Produkte entdecken
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter und Cookie-Banner */}
      <NewsletterBadge />
      <CookieBanner />
    </main>
  );
}