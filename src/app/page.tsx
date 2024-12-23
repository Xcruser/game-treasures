import BackgroundIcons from '@/components/BackgroundIcons';

export default function Home() {
  return (
    <main className="min-h-screen relative bg-background overflow-hidden">
      {/* Hintergrund mit Icons */}
      <div className="absolute inset-0 z-0">
        <BackgroundIcons />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-5xl mx-auto">
          <h1 className="text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
            GameTreasures
          </h1>
          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Entdecken Sie unsere exklusiven Monopoly-Items – einfach, sicher und
            diskret. Bei uns können Sie ganz bequem einkaufen, ohne sich registrieren zu
            müssen. Für den Kauf benötigen Sie weder einen Account noch Ihre
            Monopoly Go Spieldaten.
          </p>
          <div className="flex gap-6 justify-center">
            <a
              href="/shop"
              className="px-10 py-4 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg hover:shadow-blue-500/20"
            >
              Zum Shop
            </a>
            <a
              href="/kontakt"
              className="px-10 py-4 bg-gray-800/80 text-white text-lg rounded-lg hover:bg-gray-700 transition-all hover:scale-105 shadow-lg"
            >
              Kontakt
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}