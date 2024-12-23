import { prisma } from '@/lib/prisma';
import BackgroundIcons from '@/components/BackgroundIcons';

async function getProducts() {
  try {
    console.log('Fetching products from database...');
    const products = await prisma.item.findMany({
      orderBy: {
        price: 'asc',
      },
    });
    console.log('Products fetched:', products.length);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Home() {
  const products = await getProducts();
  console.log('Rendering products:', products.length);

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
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Entdecken Sie unsere exklusive Sammlung an Monopoly-Schätzen
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <a href="#products" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10">
                  Produkte entdecken
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length === 0 ? (
          <div className="text-center text-white">
            <p>Keine Produkte gefunden. Bitte versuchen Sie es später erneut.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-[#1A2642]/40 backdrop-blur-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-[#0B1120]">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-400 mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">€{product.price.toFixed(2)}</span>
                    <button className="bg-[#0095FF] hover:bg-[#0077CC] text-white px-4 py-2 rounded-lg transition-colors">
                      In den Warenkorb
                    </button>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    {product.inStock > 0 ? (
                      <span className="text-green-500">{product.inStock} auf Lager</span>
                    ) : (
                      <span className="text-red-500">Ausverkauft</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}