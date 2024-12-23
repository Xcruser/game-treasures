import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dicePackages = [
  {
    name: '6.000 Würfel Paket',
    description: 'Großpackung mit 6.000 hochwertigen Spielwürfeln',
    price: 19.99,
    imageUrl: '/images/dice-6k.jpg',
    category: 'Würfel',
    inStock: 50,
  },
  {
    name: '10.000 Würfel Paket',
    description: 'Großpackung mit 10.000 hochwertigen Spielwürfeln',
    price: 24.99,
    imageUrl: '/images/dice-10k.jpg',
    category: 'Würfel',
    inStock: 50,
  },
  {
    name: '15.000 Würfel Paket',
    description: 'Großpackung mit 15.000 hochwertigen Spielwürfeln',
    price: 29.99,
    imageUrl: '/images/dice-15k.jpg',
    category: 'Würfel',
    inStock: 50,
  },
  {
    name: '20.000 Würfel Paket',
    description: 'Großpackung mit 20.000 hochwertigen Spielwürfeln',
    price: 39.99,
    imageUrl: '/images/dice-20k.jpg',
    category: 'Würfel',
    inStock: 50,
  },
  {
    name: '30.000 Würfel Paket',
    description: 'Großpackung mit 30.000 hochwertigen Spielwürfeln',
    price: 59.99,
    imageUrl: '/images/dice-30k.jpg',
    category: 'Würfel',
    inStock: 50,
  },
  {
    name: '40.000 Würfel Paket',
    description: 'Großpackung mit 40.000 hochwertigen Spielwürfeln',
    price: 69.99,
    imageUrl: '/images/dice-40k.jpg',
    category: 'Würfel',
    inStock: 50,
  },
  {
    name: '50.000 Würfel Paket',
    description: 'Großpackung mit 50.000 hochwertigen Spielwürfeln',
    price: 85.99,
    imageUrl: '/images/dice-50k.jpg',
    category: 'Würfel',
    inStock: 50,
  },
  {
    name: '60.000 Würfel Paket',
    description: 'Großpackung mit 60.000 hochwertigen Spielwürfeln',
    price: 94.99,
    imageUrl: '/images/dice-60k.jpg',
    category: 'Würfel',
    inStock: 50,
  },
  {
    name: '70.000 Würfel Paket',
    description: 'Großpackung mit 70.000 hochwertigen Spielwürfeln',
    price: 104.99,
    imageUrl: '/images/dice-70k.jpg',
    category: 'Würfel',
    inStock: 50,
  },
];

async function main() {
  console.log('Starte Seeding...');

  for (const dicePackage of dicePackages) {
    const product = await prisma.item.create({
      data: dicePackage,
    });
    console.log(`Erstellt: ${product.name}`);
  }

  console.log('Seeding abgeschlossen.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
